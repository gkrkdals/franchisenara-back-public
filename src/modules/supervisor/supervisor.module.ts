import { Module } from '@nestjs/common';
import { SupervisorService } from 'src/modules/supervisor/supervisor.service';
import { SupervisorController } from 'src/modules/supervisor/supervisor.controller';
import { JwtService } from '@nestjs/jwt';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  providers: [SupervisorService, JwtService, MysqlService],
  controllers: [SupervisorController]
})
export class SupervisorModule {}