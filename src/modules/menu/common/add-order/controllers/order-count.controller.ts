import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrderCountService } from 'src/modules/menu/common/add-order/services/order-count.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { ItemCountDto } from 'src/modules/menu/common/add-order/dto/item-count.dto';

@ApiTags('주문 등록')
@UseGuards(AuthGuard)
@Controller('add-order')
export class OrderCountController {
  constructor(private orderCountService: OrderCountService) {}

  @Get('product-count')
  async getItemCount(@User() user: JwtUser, @Query() query: ItemCountDto): Promise<number> {
    return this.orderCountService.getItemCount(user, query);
  }

}