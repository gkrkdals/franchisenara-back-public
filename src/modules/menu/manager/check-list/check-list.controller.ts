import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CheckListService } from './check-list.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { CheckSummaryDTO } from 'src/modules/menu/manager/check-list/dto/check-summary.dto';
import { CheckDetailDTO } from 'src/modules/menu/manager/check-list/dto/check-detail.dto';
import { CheckDetailClassifiedByBig } from 'src/model/add-check/check-detail';
import { CheckSummary } from 'src/model/check-list/check-summary';

@ApiTags("점검리스트")
@UseGuards(AuthGuard)
@Controller('check-list')
export class CheckListController {

  constructor(private readonly checkListService: CheckListService) {}

  @Get('check-summary')
  async getCheckSummary(@User() user: JwtUser, @Query() checkSummaryDTO: CheckSummaryDTO): Promise<CheckSummary[]> {
    return this.checkListService.getCheckSummary(user, checkSummaryDTO);
  }

  @Get('check-detail')
  async getCheckDetail(@User() user: JwtUser, @Query() checkDetailDTO: CheckDetailDTO): Promise<CheckDetailClassifiedByBig[]> {
    return this.checkListService.getCheckDetail(user, checkDetailDTO);
  }

}
