import { PrismaService } from '../prisma.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
export declare class MonitorsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    list(): Promise<({
        checks: {
            id: string;
            checkedAt: Date;
            monitorId: string;
            isUp: boolean;
            statusCode: number | null;
            responseTime: number | null;
            errorMessage: string | null;
        }[];
    } & {
        id: string;
        name: string;
        url: string;
        intervalSeconds: number;
        timeoutMs: number;
        status: import(".prisma/client").$Enums.MonitorStatus;
        consecutiveFails: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(dto: CreateMonitorDto): Promise<{
        id: string;
        name: string;
        url: string;
        intervalSeconds: number;
        timeoutMs: number;
        status: import(".prisma/client").$Enums.MonitorStatus;
        consecutiveFails: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    checks(id: string): Promise<{
        id: string;
        checkedAt: Date;
        monitorId: string;
        isUp: boolean;
        statusCode: number | null;
        responseTime: number | null;
        errorMessage: string | null;
    }[]>;
    checkNow(id: string): Promise<{
        id: string;
        checkedAt: Date;
        monitorId: string;
        isUp: boolean;
        statusCode: number | null;
        responseTime: number | null;
        errorMessage: string | null;
    }>;
    monitorScheduler(): Promise<void>;
    performCheck(monitor: {
        id: string;
        url: string;
        timeoutMs: number;
        consecutiveFails: number;
    }): Promise<{
        id: string;
        checkedAt: Date;
        monitorId: string;
        isUp: boolean;
        statusCode: number | null;
        responseTime: number | null;
        errorMessage: string | null;
    }>;
    stats(id: string, period?: string): Promise<{
        period: string;
        uptime: number;
        averageResponseTime: number;
        fastestResponseTime: number;
        slowestResponseTime: number;
        totalChecks: number;
        successfulChecks: number;
        degradedChecks: number;
        failedChecks: number;
        responseHistory?: undefined;
    } | {
        period: string;
        uptime: number;
        averageResponseTime: number;
        fastestResponseTime: number;
        slowestResponseTime: number;
        totalChecks: number;
        successfulChecks: number;
        degradedChecks: number;
        failedChecks: number;
        responseHistory: {
            responseTime: number | null;
            checkedAt: Date;
        }[];
    }>;
    update(id: string, dto: UpdateMonitorDto): Promise<{
        id: string;
        name: string;
        url: string;
        intervalSeconds: number;
        timeoutMs: number;
        status: import(".prisma/client").$Enums.MonitorStatus;
        consecutiveFails: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    pause(id: string): Promise<{
        id: string;
        name: string;
        url: string;
        intervalSeconds: number;
        timeoutMs: number;
        status: import(".prisma/client").$Enums.MonitorStatus;
        consecutiveFails: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resume(id: string): Promise<{
        id: string;
        name: string;
        url: string;
        intervalSeconds: number;
        timeoutMs: number;
        status: import(".prisma/client").$Enums.MonitorStatus;
        consecutiveFails: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
