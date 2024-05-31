import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CustomerManageService } from 'src/modules/menu/manager/customer-manage/customer-manage.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { Journal } from 'src/model/customer-manage/journal';
import { Location } from 'src/model/customer-manage/location';
import { CreateJournalDto } from 'src/modules/menu/manager/customer-manage/dto/create-journal.dto';
import { ModifyJournalDto } from 'src/modules/menu/manager/customer-manage/dto/modify-journal.dto';

@ApiTags("고객관리")
@UseGuards(AuthGuard)
@Controller('customer-manage')
export class CustomerManageController {
  constructor(private customerManageService: CustomerManageService) {}

  @Get('location')
  async getLocation(@User() user: JwtUser): Promise<Location[]> {
    return this.customerManageService.getLocation(user);
  }

  @Get('customer-information')
  async getCustomerInfo(@User() user: JwtUser, @Query('cus') cus: string) {
    return this.customerManageService.getCustomerInfo(user, cus)
  }

  @Get('journal')
  async getJournal(@User() user: JwtUser): Promise<Journal[]> {
    return this.customerManageService.getJournal(user);
  }

  @Get('journal-already')
  async getAlreadyWroteJournal(@User() user: JwtUser, @Query('cus') cus: string) {
    return this.customerManageService.getAlreadyWroteJournal(user, cus);
  }

  @Post('journal')
  async createJournal(@User() user: JwtUser, @Body() createJournalDto: CreateJournalDto) {
    return this.customerManageService.createJournal(user, createJournalDto);
  }

  @Put('journal')
  async modifyJournal(@User() user: JwtUser, @Body() modifyJournalDto: ModifyJournalDto) {
    return this.customerManageService.modifyJournal(user, modifyJournalDto);
  }
}