import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DepositStatusService } from 'src/modules/menu/common/deposit-status/deposit-status.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { DepositStatusListDTO } from 'src/modules/menu/common/deposit-status/dto/deposit-status-list.dto';

@ApiTags('입금현황')
@UseGuards(AuthGuard)
@Controller('deposit-status')
export class DepositStatusController {
  constructor(private depositStatusService: DepositStatusService) {
  }

  @Get()
  async getDepositStatus(@User() user: JwtUser, @Query() depositStatusListDTO: DepositStatusListDTO) {
    return this.depositStatusService.getDepositStatusList(user, depositStatusListDTO);
  }

}