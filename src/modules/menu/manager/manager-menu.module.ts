import { Module } from '@nestjs/common';
import { NfcModule } from 'src/modules/menu/manager/nfc/nfc.module';
import { CheckListModule } from './check-list/check-list.module';
import { AddCheckModule } from './add-check/add-check.module';
import { InterviewModule } from './interview/interview.module';
import { CustomerManageModule } from 'src/modules/menu/manager/customer-manage/customer-manage.module';

@Module({
  imports: [NfcModule, CheckListModule, AddCheckModule, InterviewModule, CustomerManageModule]
})
export class ManagerMenuModule {}