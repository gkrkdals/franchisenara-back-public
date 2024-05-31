import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { KnexService } from 'src/knex/knex.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [InterviewController],
  providers: [InterviewService, KnexService, JwtService]
})
export class InterviewModule {}
