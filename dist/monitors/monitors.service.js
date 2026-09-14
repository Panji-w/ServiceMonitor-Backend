"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MonitorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const prisma_service_1 = require("../prisma.service");
const schedule_1 = require("@nestjs/schedule");
let MonitorsService = MonitorsService_1 = class MonitorsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MonitorsService_1.name);
    }
    async list() {
        return this.prisma.monitor.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                checks: { orderBy: { checkedAt: 'desc' }, take: 1 },
            },
        });
    }
    async create(dto) {
        try {
            new URL(dto.url);
        }
        catch {
            throw new common_1.BadRequestException('Invalid URL');
        }
        return this.prisma.monitor.create({
            data: {
                name: dto.name,
                url: dto.url,
                intervalSeconds: dto.intervalSeconds ?? 60,
                timeoutMs: dto.timeoutMs ?? 10000,
            },
        });
    }
    async checks(id) {
        const monitor = await this.prisma.monitor.findUnique({ where: { id } });
        if (!monitor)
            throw new common_1.NotFoundException('Monitor not found');
        return this.prisma.monitorCheck.findMany({
            where: { monitorId: id },
            orderBy: { checkedAt: 'desc' },
            take: 100,
        });
    }
    async checkNow(id) {
        const monitor = await this.prisma.monitor.findUnique({
            where: { id },
        });
        if (!monitor) {
            throw new common_1.NotFoundException('Monitor not found');
        }
        if (monitor.status === 'PAUSED') {
            throw new common_1.BadRequestException('Monitor is paused');
        }
        return this.performCheck(monitor);
    }
    async monitorScheduler() {
        const monitors = await this.prisma.monitor.findMany({
            where: {
                status: {
                    not: 'PAUSED',
                },
            },
        });
        const now = Date.now();
        for (const monitor of monitors) {
            const latestCheck = await this.prisma.monitorCheck.findFirst({
                where: {
                    monitorId: monitor.id,
                },
                orderBy: {
                    checkedAt: 'desc',
                },
            });
            const lastCheckedAt = latestCheck?.checkedAt?.getTime() ?? 0;
            const intervalMs = monitor.intervalSeconds * 1000;
            if (now - lastCheckedAt >= intervalMs) {
                this.logger.log(`Checking monitor: ${monitor.name}`);
                try {
                    await this.performCheck(monitor);
                }
                catch (error) {
                    this.logger.error(`Failed to check ${monitor.name}`, error instanceof Error ? error.stack : String(error));
                }
            }
        }
    }
    async performCheck(monitor) {
        const started = Date.now();
        let isUp = false;
        let statusCode;
        let errorMessage;
        try {
            const response = await axios_1.default.get(monitor.url, {
                timeout: monitor.timeoutMs,
                maxRedirects: 5,
                validateStatus: () => true,
            });
            statusCode = response.status;
            isUp = response.status >= 200 && response.status < 400;
            if (!isUp)
                errorMessage = `HTTP ${response.status}`;
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Request failed';
        }
        const responseTime = Date.now() - started;
        const nextFails = isUp ? 0 : monitor.consecutiveFails + 1;
        const status = isUp
            ? responseTime > 2000 ? 'DEGRADED' : 'UP'
            : nextFails >= 3 ? 'DOWN' : 'DEGRADED';
        const check = await this.prisma.monitorCheck.create({
            data: {
                monitorId: monitor.id,
                isUp,
                statusCode,
                responseTime,
                errorMessage,
            },
        });
        await this.prisma.monitor.update({
            where: { id: monitor.id },
            data: { status, consecutiveFails: nextFails },
        });
        return check;
    }
    async stats(id, period = '24h') {
        const monitor = await this.prisma.monitor.findUnique({
            where: { id },
        });
        if (!monitor) {
            throw new common_1.NotFoundException('Monitor not found');
        }
        const periodMap = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
        };
        const duration = periodMap[period] ?? periodMap['24h'];
        const since = new Date(Date.now() - duration);
        const checks = await this.prisma.monitorCheck.findMany({
            where: {
                monitorId: id,
                checkedAt: {
                    gte: since,
                },
            },
            orderBy: {
                checkedAt: 'asc',
            },
        });
        const totalChecks = checks.length;
        if (totalChecks === 0) {
            return {
                period,
                uptime: 0,
                averageResponseTime: 0,
                fastestResponseTime: 0,
                slowestResponseTime: 0,
                totalChecks: 0,
                successfulChecks: 0,
                degradedChecks: 0,
                failedChecks: 0,
            };
        }
        const successfulChecks = checks.filter((check) => check.isUp &&
            check.responseTime !== null &&
            check.responseTime <= 2000).length;
        const degradedChecks = checks.filter((check) => check.isUp &&
            check.responseTime !== null &&
            check.responseTime > 2000).length;
        const failedChecks = checks.filter((check) => !check.isUp).length;
        const responseTimes = checks
            .map((check) => check.responseTime)
            .filter((time) => time !== null);
        const averageResponseTime = responseTimes.length > 0
            ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) /
                responseTimes.length)
            : 0;
        const fastestResponseTime = responseTimes.length > 0
            ? Math.min(...responseTimes)
            : 0;
        const slowestResponseTime = responseTimes.length > 0
            ? Math.max(...responseTimes)
            : 0;
        const uptime = totalChecks > 0
            ? Number(((successfulChecks / totalChecks) * 100).toFixed(2))
            : 0;
        return {
            period,
            uptime,
            averageResponseTime,
            fastestResponseTime,
            slowestResponseTime,
            totalChecks,
            successfulChecks,
            degradedChecks,
            failedChecks,
            responseHistory: checks
                .filter((check) => check.responseTime !== null)
                .map((check) => ({
                responseTime: check.responseTime,
                checkedAt: check.checkedAt,
            })),
        };
    }
    async update(id, dto) {
        const monitor = await this.prisma.monitor.findUnique({
            where: { id },
        });
        if (!monitor) {
            throw new common_1.NotFoundException('Monitor not found');
        }
        if (dto.url !== undefined) {
            try {
                new URL(dto.url);
            }
            catch {
                throw new common_1.BadRequestException('Invalid URL');
            }
        }
        return this.prisma.monitor.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && {
                    name: dto.name.trim(),
                }),
                ...(dto.url !== undefined && {
                    url: dto.url.trim(),
                }),
                ...(dto.intervalSeconds !== undefined && {
                    intervalSeconds: dto.intervalSeconds,
                }),
                ...(dto.timeoutMs !== undefined && {
                    timeoutMs: dto.timeoutMs,
                }),
            },
        });
    }
    async remove(id) {
        const monitor = await this.prisma.monitor.findUnique({
            where: { id },
        });
        if (!monitor) {
            throw new common_1.NotFoundException('Monitor not found');
        }
        await this.prisma.monitor.delete({
            where: { id },
        });
        return {
            success: true,
        };
    }
    async pause(id) {
        const monitor = await this.prisma.monitor.findUnique({
            where: { id },
        });
        if (!monitor) {
            throw new common_1.NotFoundException('Monitor not found');
        }
        return this.prisma.monitor.update({
            where: { id },
            data: {
                status: 'PAUSED',
                consecutiveFails: 0,
            },
        });
    }
    async resume(id) {
        const monitor = await this.prisma.monitor.findUnique({
            where: { id },
        });
        if (!monitor) {
            throw new common_1.NotFoundException('Monitor not found');
        }
        return this.prisma.monitor.update({
            where: { id },
            data: {
                status: 'DEGRADED',
                consecutiveFails: 0,
            },
        });
    }
};
exports.MonitorsService = MonitorsService;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonitorsService.prototype, "monitorScheduler", null);
exports.MonitorsService = MonitorsService = MonitorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MonitorsService);
//# sourceMappingURL=monitors.service.js.map