import { Module } from '@nestjs/common';
import { CustomerManageController } from 'src/modules/menu/manager/customer-manage/customer-manage.controller';
import { KnexService } from 'src/knex/knex.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerManageService } from 'src/modules/menu/manager/customer-manage/customer-manage.service';

@Module({
  controllers: [CustomerManageController],
  providers: [CustomerManageService, KnexService, JwtService]
})
export class CustomerManageModule {}