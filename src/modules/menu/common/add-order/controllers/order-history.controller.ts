import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrderHistoryService } from 'src/modules/menu/common/add-order/services/order-history.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { OrderHistoryDto } from 'src/modules/menu/common/add-order/dto/order-history.dto';
import { OrderHistory } from 'src/model/add-order/order-history';

@ApiTags('주문 등록')
@UseGuards(AuthGuard)
@Controller('add-order')
export class OrderHistoryController {
  constructor(private orderHistoryService: OrderHistoryService) {}

  @Get('history')
  async getOrderHistory(
    @User() user: JwtUser,
    @Query() query: OrderHistoryDto
  ): Promise<OrderHistory[]> {
    return this.orderHistoryService.getOrderHistory(user, query);
  }
}