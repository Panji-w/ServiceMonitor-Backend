import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { MonitorsService } from './monitors.service';

@Injectable()
export class MonitorWorker {
  constructor(
    private readonly prisma: PrismaService,
    private readonly monitors: MonitorsService,
  ) {}

  @Cron('*/10 * * * * *')
  async tick() {
    const all = await this.prisma.monitor.findMany();
    const now = Date.now();

    for (const monitor of all) {
      const last = await this.prisma.monitorCheck.findFirst({
        where: { monitorId: monitor.id },
        orderBy: { checkedAt: 'desc' },
      });

      const due = !last || now - last.checkedAt.getTime() >= monitor.intervalSeconds * 1000;
      if (due) {
        await this.monitors.performCheck(monitor);
      }
    }
  }
}
