import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrdererService } from 'src/modules/menu/common/add-order/services/orderer.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { OrdererDto } from 'src/modules/menu/common/add-order/dto/orderer.dto';
import { ProductService } from 'src/modules/menu/common/add-order/services/product.service';
import { AddOrderService } from 'src/modules/menu/common/add-order/services/add-order.service';
import { AlreadyOrderedDto } from 'src/modules/menu/common/add-order/dto/already-ordered.dto';
import { ModifyFavoriteDto } from 'src/modules/menu/common/add-order/dto/modify-favorite.dto';
import { CreateOrderDto } from 'src/modules/menu/common/add-order/dto/create-order.dto';
import { ModifyOrderDto } from 'src/modules/menu/common/add-order/dto/modify-order.dto';

@ApiTags('주문 등록')
@UseGuards(AuthGuard)
@Controller('add-order')
export class AddOrderController {
  constructor(
    private addOrderService: AddOrderService,
    private ordererService: OrdererService,
    private productService: ProductService
  ) {}

  @Get('orderer')
  async getOrdererInfo(@User() user: JwtUser, @Query('cus') cus: string): Promise<OrdererDto> {
    const ordererDetail = await this.ordererService.getCreditAndVirtualAccount(user, cus);
    const misu = await this.ordererService.getMisu(user, cus);
    const alreadyOrdered = await this.ordererService.getAlreadyOrdered(user, cus);
    const jugyo = await this.ordererService.getJugyo(user);

    return {
      ...ordererDetail,
      ...misu,
      already_ordered: alreadyOrdered.cnt == 0 ? 0 : 1,
      code: alreadyOrdered.code,
      jugyo: jugyo.jugyo
    };
  }

  @Get('product')
  async getOrderProduct(@User() user: JwtUser, @Query('cus') cus: string) {
    return this.productService.getOrderProduct(user, cus);
  }

  @Get('favorite')
  async getFavoriteProduct(@User() user: JwtUser, @Query('cus') cus: string) {
    return this.productService.getFavoriteProduct(user, cus);
  }

  @Put('favorite')
  async modifyFavoriteProduct(@User() user: JwtUser, @Body() modifyFavoriteDto: ModifyFavoriteDto) {
    return this.productService.modifyFavoriteProduct(user, modifyFavoriteDto);
  }

  @Get('already-ordered')
  async getAlreadyOrdered(@User() user: JwtUser, @Query() query: AlreadyOrderedDto) {
    return this.addOrderService.getAlreadyOrdered(user, query);
  }

  @Post()
  async createOrder(@User() user: JwtUser, @Body() createOrderDto: CreateOrderDto) {
    return this.addOrderService.createOrder(user, createOrderDto);
  }

  @Put()
  async modifyOrder(@User() user: JwtUser, @Body() modifyOrderDto: ModifyOrderDto) {
    return this.addOrderService.modifyOrder(user, modifyOrderDto);
  }

  @Delete()
  async deleteOrder(@User() user: JwtUser, @Query('code') code: string) {
    return this.addOrderService.deleteOrder(user, code);
  }
}