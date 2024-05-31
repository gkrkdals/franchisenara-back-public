import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AddCheckService } from './add-check.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { CheckListResponseDTO } from 'src/modules/menu/manager/add-check/dto/response/check-list-response.dto';
import { AddCheckDto } from 'src/modules/menu/manager/add-check/dto/add-check.dto';

@ApiTags('점검 등록')
@UseGuards(AuthGuard)
@Controller('add-check')
export class AddCheckController {
  constructor(private readonly addCheckService: AddCheckService) {}

  @Get('nfc-use')
  async getNfcUse(@User() user: JwtUser): Promise<{nfc_use: number}> {
    return this.addCheckService.getNfcUse(user);
  }

  @Get('check-list')
  async getCheckList(@User() user: JwtUser, @Query('cus') cus: string): Promise<CheckListResponseDTO> {
    return this.addCheckService.getCheckList(user, cus);
  }

  @Post('check')
  async addCheck(@User() user: JwtUser, @Body() body: AddCheckDto): Promise<void> {
    await this.addCheckService.addCheck(user, body);
  }

}
