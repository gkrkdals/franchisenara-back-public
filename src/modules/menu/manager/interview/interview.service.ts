import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { InterviewHistory } from './model/interview-history';
import { getFullDateTime, getYMD } from 'src/common/util/date';
import { InterviewDto } from './dto/interview.dto';
import { Interview } from './model/interview';
import { knexProcedure, knexRaw } from 'src/common/util/knex-raw';
import { InterviewSql } from 'src/modules/menu/manager/interview/sql/interview.sql';

@Injectable()
export class InterviewService {
  constructor(private knexService: KnexService) {}

  /**
   * 상담 내역을 불러옵니다.
   * 
   * @param user 유저 정보
   * @param stt 전체/처리/미처리
   */
  async getInterviewHistory(user: JwtUser, stt: string): Promise<InterviewHistory[]> {
    const knex = await this.knexService.getConnection(user);
    stt = '%' + stt + '%';

    return knexRaw<InterviewHistory[]>(knex, InterviewSql.getInterview, [user.corp, user.id, stt]);
  }

  /**
   * 이미 금일 상담을 등록한 지 여부를 가져옵니다.
   *
   * 만일 이미 상담을 하였다면 1, 그렇지 않으면 0을 반환합니다.
   *
   * @param user 유저 정보
   * @param cus 상담을 하고자 하는 거래처
   */
  async getAlreadyInterviewed(user: JwtUser, cus: string) {
    const knex = await this.knexService.getConnection(user);
    return (await knex.select<{ already_interviewed: number }>(knex.raw(
      'EXISTS(SELECT ymd FROM cs020 WHERE corp=? AND cus=? AND ymd=? AND spv=?) as already_interviewed',
      [user.corp, cus, getYMD(), user.id]
    )).first()).already_interviewed;
  }

  /**
   * 상담 구분을 구합니다.
   *
   * @param user 유저 정보
   */
  async getInterviewGbn(user: JwtUser) {
    const knex = await this.knexService.getConnection(user);
    return knex('sys910')
      .select('big', 'sml', 'sml_nm')
      .where('corp', user.corp)
      .andWhere('big', '09');
  }

  /**
   * 새 상담을 등록합니다.
   *
   * @param user 유저 정보
   * @param interviewDto 상담 DTO
   */
  async addInterview(user: JwtUser, interviewDto: InterviewDto) {
    const knex = await this.knexService.getConnection(user);
    const { cus, gbn, memo1, memo2 } = interviewDto;
    let { ymd } = interviewDto;
    ymd = ymd.replaceAll('-', '');
    const newSeq: number = (await knexProcedure(
      knex,
      "CALL usp_seq_maker(?, 'CS020', ?, @newSeq); SELECT @newSeq as seq",
      [user.corp, ymd]
    )).seq;


    await knex.transaction(async trx => {
      await trx('cs020').insert<Interview>({
        corp: user.corp,
        ymd,
        cus,
        gbn,
        seq: newSeq,
        spv: user.id,
        memo1,
        memo2,
        filnm1: '',
        filnm2: '',
        mk: user.user_nm,
        mk_time: getFullDateTime()
      });
    });
  }
}
