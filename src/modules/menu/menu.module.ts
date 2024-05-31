import { Module } from '@nestjs/common';
import { CommonMenuModule } from 'src/modules/menu/common/common-menu.module';
import { ManagerMenuModule } from 'src/modules/menu/manager/manager-menu.module';

@Module({
  imports: [
    CommonMenuModule,
    ManagerMenuModule,
  ]
})
export class MenuModule {}