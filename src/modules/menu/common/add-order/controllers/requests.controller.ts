import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { RequestsDto } from 'src/modules/menu/common/add-order/dto/requests.dto';
import { RequestsService } from 'src/modules/menu/common/add-order/services/requests.service';

@ApiTags('주문 등록')
@UseGuards(AuthGuard)
@Controller('add-order')
export class RequestsController {

  constructor(private requestsService: RequestsService) {}

  @Get('requests')
  async getRequestsList(@User() user: JwtUser, @Query() query: RequestsDto) {
    return this.requestsService.getRequests(user, query);
  }
}