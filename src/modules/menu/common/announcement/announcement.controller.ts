import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { AnnouncementService } from 'src/modules/menu/common/announcement/announcement.service';
import {
  NewAnnouncementResponseDto,
} from 'src/modules/menu/common/announcement/dto/response/new-announcement-response.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AnnouncementResponseDto } from 'src/modules/menu/common/announcement/dto/response/announcement-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('공지사항 API')
@UseGuards(AuthGuard)
@Controller('announcement')
export class AnnouncementController {

  constructor(private announcementService: AnnouncementService) {}

  @Get()
  async getAnnouncement(
    @User() user: JwtUser,
    @Query('title') title: string,
    @Query('page', ParseIntPipe) page: number
  ): Promise<AnnouncementResponseDto> {
    return this.announcementService.getAnnouncement(user, title, page);
  }

  @Get('new')
  async getNewAnnouncement(@User() user: JwtUser): Promise<NewAnnouncementResponseDto> {
    return this.announcementService.getNewAnnouncement(user);
  }

  @Get('new-two')
  async getTwoAnnouncement(@User() user: JwtUser): Promise<NewAnnouncementResponseDto[]> {
    return this.announcementService.getTwoAnnouncement(user);
  }

}