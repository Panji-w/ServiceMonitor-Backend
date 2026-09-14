import { Module } from '@nestjs/common';
import { MonitorsController } from './monitors.controller';
import { MonitorsService } from './monitors.service';
import { MonitorWorker } from './monitor.worker';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MonitorsController],
  providers: [MonitorsService, MonitorWorker, PrismaService],
})
export class MonitorsModule {}
