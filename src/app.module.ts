import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitorsModule } from './monitors/monitors.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ScheduleModule.forRoot(), MonitorsModule],
  providers: [PrismaService],
})
export class AppModule {}
