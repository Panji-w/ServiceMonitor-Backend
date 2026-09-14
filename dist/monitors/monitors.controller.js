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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorsController = void 0;
const common_1 = require("@nestjs/common");
const create_monitor_dto_1 = require("./dto/create-monitor.dto");
const monitors_service_1 = require("./monitors.service");
const update_monitor_dto_1 = require("./dto/update-monitor.dto");
let MonitorsController = class MonitorsController {
    constructor(monitors) {
        this.monitors = monitors;
    }
    list() {
        return this.monitors.list();
    }
    create(dto) {
        return this.monitors.create(dto);
    }
    stats(id) {
        return this.monitors.stats(id);
    }
    checks(id) {
        return this.monitors.checks(id);
    }
    checkNow(id) {
        return this.monitors.checkNow(id);
    }
    update(id, dto) {
        return this.monitors.update(id, dto);
    }
    remove(id) {
        return this.monitors.remove(id);
    }
    pause(id) {
        return this.monitors.pause(id);
    }
    resume(id) {
        return this.monitors.resume(id);
    }
};
exports.MonitorsController = MonitorsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_monitor_dto_1.CreateMonitorDto]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)(':id/checks'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "checks", null);
__decorate([
    (0, common_1.Post)(':id/check'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "checkNow", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_monitor_dto_1.UpdateMonitorDto]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/pause'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "pause", null);
__decorate([
    (0, common_1.Patch)(':id/resume'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonitorsController.prototype, "resume", null);
exports.MonitorsController = MonitorsController = __decorate([
    (0, common_1.Controller)('monitors'),
    __metadata("design:paramtypes", [monitors_service_1.MonitorsService])
], MonitorsController);
//# sourceMappingURL=monitors.controller.js.map