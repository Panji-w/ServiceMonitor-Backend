import { PrismaService } from '../prisma.service';
import { MonitorsService } from './monitors.service';
export declare class MonitorWorker {
    private readonly prisma;
    private readonly monitors;
    constructor(prisma: PrismaService, monitors: MonitorsService);
    tick(): Promise<void>;
}
