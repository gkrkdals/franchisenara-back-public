import { Module } from '@nestjs/common';
import { DepositStatusService } from 'src/modules/menu/common/deposit-status/deposit-status.service';
import { DepositStatusController } from 'src/modules/menu/common/deposit-status/deposit-status.controller';
import { JwtService } from '@nestjs/jwt';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  providers: [DepositStatusService, JwtService, MysqlService],
  controllers: [DepositStatusController]
})
export class DepositStatusModule {}