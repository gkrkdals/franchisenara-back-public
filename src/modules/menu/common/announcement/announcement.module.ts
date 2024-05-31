import { Module } from '@nestjs/common';
import { AnnouncementService } from 'src/modules/menu/common/announcement/announcement.service';
import { JwtService } from '@nestjs/jwt';
import { AnnouncementController } from 'src/modules/menu/common/announcement/announcement.controller';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  providers: [AnnouncementService, MysqlService, JwtService],
  controllers: [AnnouncementController]
})
export class AnnouncementModule {}