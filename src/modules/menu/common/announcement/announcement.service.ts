import { Injectable } from '@nestjs/common';
import { getYMD } from 'src/common/util/date';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { Announcement } from 'src/model/announcement/announcement';
import {
  NewAnnouncementResponseDto,
} from 'src/modules/menu/common/announcement/dto/response/new-announcement-response.dto';
import { AnnouncementResponseDto } from 'src/modules/menu/common/announcement/dto/response/announcement-response.dto';
import {
  TwoAnnouncementResponseDto,
} from 'src/modules/menu/common/announcement/dto/response/two-announcement-response.dto';
import { MysqlService } from 'src/mysql/mysql.service';
import { AnnouncementSql } from 'src/modules/menu/common/announcement/sql/announcement.sql';

@Injectable()
export class AnnouncementService {

  constructor(private mysqlService: MysqlService) {}

  /**
   * user, title, page 정보를 받아 공지사항 목록을 얻습니다.
   *
   * @param user 유저 정보
   * @param title 공지사항 제목
   * @param page 현재 페이지
   * @return AnnouncementResponseDto
   */
  async getAnnouncement(user: JwtUser, title: string, page: number): Promise<AnnouncementResponseDto> {
    title = '%' + title + '%';
    const conn = await this.mysqlService.getConnection(user);

    const count = await conn.countQuery(
      AnnouncementSql.getAnnouncementCount,
      [user.corp, title]
    );

    const announcements = await conn.query<Announcement[]>(
      AnnouncementSql.getAnnouncement,
      [user.corp, title, (page - 1) * 20]
    );

    console.log(announcements);
    return {
      totalPage: Math.ceil(count / 20.0),
      announcements,
    }
  }

  /**
   * 새로운 공지사항이 있는지 체크하고, 그 결과를 반환합니다.
   *
   * @param user 유저 정보
   * @return NewAnnouncementResponseDto
   */
  async getNewAnnouncement(user: JwtUser): Promise<NewAnnouncementResponseDto> {
    const today = getYMD();
    const conn = await this.mysqlService.getConnection(user);

    const isThereNewAnnouncement = await conn.queryLimitOne<Announcement>(
      AnnouncementSql.getIsThereNewAnnouncement,
      [user.corp, today, today]
    );

    return {
      admin_gbn: 9,
      corp: user.corp,
      mode: 2,
      seq: isThereNewAnnouncement === undefined ? 0 : isThereNewAnnouncement.seq,
      serv_seq: user.serv_seq,
      user_nm: user.user_nm
    };
  }

  /**
   * 최근 2개의 공지사항을 불러옵니다.
   *
   * @param user 유저 정보
   * @return NewAnnouncementResponseDto[]
   */
  async getTwoAnnouncement(user: JwtUser): Promise<TwoAnnouncementResponseDto[]> {
    const conn = await this.mysqlService.getConnection(user);
    const twoAnnouncements = await conn.query<Announcement[]>(
      AnnouncementSql.getTwoAnnouncements, [user.corp]
    );
    return twoAnnouncements.map((announcement) => ({
      admin_gbn: 9,
      corp: user.corp,
      mode: 2,
      seq: announcement.seq,
      title: announcement.title,
      serv_seq: user.serv_seq,
      user_nm: user.user_nm,
      ymd: announcement.ymd
    }));
  }

}