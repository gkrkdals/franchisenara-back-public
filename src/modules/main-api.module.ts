import { Module } from '@nestjs/common';
import { SupervisorModule } from 'src/modules/supervisor/supervisor.module';
import { MenuModule } from 'src/modules/menu/menu.module';
import { ProductModule } from 'src/modules/product/product.module';

/**
 * 다른 메인 모듈을 모으는 메인 모듈입니다.
 */
@Module({
  imports: [
    SupervisorModule,
    ProductModule,
    MenuModule
  ],
})
export class MainApiModule {}