import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { MonitorsService } from './monitors.service';
import { UpdateMonitorDto } from './dto/update-monitor.dto';  

@Controller('monitors')
export class MonitorsController {
  constructor(private readonly monitors: MonitorsService) {}

  @Get()
  list() {
    return this.monitors.list();
  }

  @Post()
  create(@Body() dto: CreateMonitorDto) {
    return this.monitors.create(dto);
  }

  @Get(':id/stats')
  stats(@Param('id') id: string) {
    return this.monitors.stats(id);
  }

  @Get(':id/checks')
  checks(@Param('id') id: string) {
    return this.monitors.checks(id);
  }

  @Post(':id/check')
  checkNow(@Param('id') id: string) {
    return this.monitors.checkNow(id);
  }

  @Patch(':id')
  
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMonitorDto,
  ) {
    return this.monitors.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitors.remove(id);
  }

  @Patch(':id/pause')
  pause(@Param('id') id: string) {
    return this.monitors.pause(id);
  }

  @Patch(':id/resume')
  resume(@Param('id') id: string) {
    return this.monitors.resume(id);
  }
}
