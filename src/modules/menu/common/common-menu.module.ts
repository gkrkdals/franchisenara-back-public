import { Module } from '@nestjs/common';
import { AnnouncementModule } from 'src/modules/menu/common/announcement/announcement.module';
import { DepositStatusModule } from 'src/modules/menu/common/deposit-status/deposit-status.module';
import { AddOrderModule } from 'src/modules/menu/common/add-order/add-order.module';

@Module({
  imports: [AddOrderModule, AnnouncementModule, DepositStatusModule]
})
export class CommonMenuModule {}