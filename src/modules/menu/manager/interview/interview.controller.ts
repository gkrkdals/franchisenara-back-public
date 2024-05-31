import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { InterviewHistory } from 'src/modules/menu/manager/interview/model/interview-history';
import { InterviewDto } from 'src/modules/menu/manager/interview/dto/interview.dto';

@ApiTags('상담 등록')
@UseGuards(AuthGuard)
@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get('history')
  async getInterviewHistory(@User() user: JwtUser, @Query('stt') stt: string): Promise<InterviewHistory[]> {
    return this.interviewService.getInterviewHistory(user, stt);
  }

  @Get('already-gbn')
  async getAlreadyInterviewed(@User() user: JwtUser, @Query('cus') cus: string): Promise<number> {
    return this.interviewService.getAlreadyInterviewed(user, cus);
  }

  @Get('gbn')
  async getInterviewGbn(@User() user: JwtUser) {
    return this.interviewService.getInterviewGbn(user);
  }

  @Post('')
  async addInterview(@User() user: JwtUser, @Body() interviewDto: InterviewDto): Promise<void> {
    return this.interviewService.addInterview(user, interviewDto);
  }
}
