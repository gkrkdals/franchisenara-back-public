import { Module } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';
import { JwtService } from '@nestjs/jwt';
import { RequestsController } from 'src/modules/menu/common/add-order/controllers/requests.controller';
import { RequestsService } from 'src/modules/menu/common/add-order/services/requests.service';
import { OrderHistoryController } from 'src/modules/menu/common/add-order/controllers/order-history.controller';
import { OrderHistoryService } from 'src/modules/menu/common/add-order/services/order-history.service';
import { OrderCountService } from 'src/modules/menu/common/add-order/services/order-count.service';
import { OrderCountController } from 'src/modules/menu/common/add-order/controllers/order-count.controller';
import { AddOrderController } from 'src/modules/menu/common/add-order/controllers/add-order.controller';
import { OrdererService } from 'src/modules/menu/common/add-order/services/orderer.service';
import { AddOrderService } from 'src/modules/menu/common/add-order/services/add-order.service';
import { ProductService } from 'src/modules/menu/common/add-order/services/product.service';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  controllers: [
    AddOrderController,
    OrderCountController,
    OrderHistoryController,
    RequestsController
  ],
  providers: [
    OrdererService,
    OrderCountService,
    AddOrderService,
    ProductService,
    OrderHistoryService,
    RequestsService,
    KnexService, JwtService, MysqlService
  ]
})
export class AddOrderModule {}