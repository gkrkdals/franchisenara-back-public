import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { Location } from 'src/model/customer-manage/location';
import { knexProcedure, knexRaw } from 'src/common/util/knex-raw';
import { getFullDateTime, getYMD } from 'src/common/util/date';
import { Misu } from 'src/model/misu';
import { CustomerManageSql } from 'src/modules/menu/manager/customer-manage/sql/customer-manage.sql';
import { Journal, JournalRaw } from 'src/model/customer-manage/journal';
import { CreateJournalDto } from 'src/modules/menu/manager/customer-manage/dto/create-journal.dto';
import { ModifyJournalDto } from 'src/modules/menu/manager/customer-manage/dto/modify-journal.dto';
import { SqlCnt } from 'src/common/cnt';

@Injectable()
export class CustomerManageService {
  constructor(private knexService: KnexService) {}

  /**
   * 슈퍼바이저에 할당된 가맹점들의 위치 정보를 구합니다.
   *
   * @param user
   */
  async getLocation(user: JwtUser): Promise<Location[]> {
    const knex = await this.knexService.getConnection(user);

    return knex('sys010')
      .select<Location[]>('cus', 'addr')
      .where('corp', user.corp)
      .andWhere('spv', user.id);
  }

  /**
   * 가맹점 세부정보와 미수금액을 구합니다.
   *
   * @param user 유저 정보
   * @param cus 가맹점
   */
  async getCustomerInfo(user: JwtUser, cus: string) {
    const knex = await this.knexService.getConnection(user);

    const info = (await knexRaw(knex, CustomerManageSql.getCustomerInfo, [user.corp, cus]))[0];
    const misu = (await knexProcedure<Misu>(knex, CustomerManageSql.getMisu, [user.corp, getYMD(), cus])).misu;

    return {
      ...info,
      misu: misu === undefined ? 0 : parseFloat(String(misu))
    }
  }

  async getJournal(user: JwtUser): Promise<Journal[]> {
    const knex = await this.knexService.getConnection(user);

    const journalList = await knexRaw<JournalRaw[]>(knex, CustomerManageSql.getJournal, [user.corp, user.id]);

    return journalList.reduce((prev, cur) => {
      const { ymd, ..._cur } = cur;
      const index = prev.findIndex((element) => element.ymd === ymd);
      if (index == -1) {
        prev.push({
          ymd,
          detail: [_cur],
        });
      } else {
        prev[index].detail.push(_cur);
      }

      return prev;
    }, [] as Journal[]);
  }

  async getAlreadyWroteJournal(user: JwtUser, cus: string) {
    const knex = await this.knexService.getConnection(user);

    const res = await knex('sys012')
      .count<SqlCnt[]>('* AS cnt')
      .where('corp', user.corp)
      .andWhere('ymd', getYMD())
      .andWhere('cus', cus).first();

    return res.cnt != 0 ? 1 : 0;
  }

  async createJournal(user: JwtUser, createJournalDto: CreateJournalDto) {
    const knex = await this.knexService.getConnection(user);
    const { corp, id: spv, user_nm } = user;
    const { cus, cusNm, gbn, content } = createJournalDto;
    let { ymd } = createJournalDto;
    ymd = ymd.replaceAll('-', '');

    await knex.transaction(async (trx) => {
      const seq = (await knexProcedure(trx, CustomerManageSql.getSeq, [corp, ymd])).seq;
      await trx('sys012')
        .insert({
          corp, ymd, seq, cus, gbn, spv, emp_nm: cusNm, bigo: content, mk:  user_nm, mk_time: getFullDateTime()
        });
    });
  }

  async modifyJournal(user: JwtUser, modifyJournalDto: ModifyJournalDto) {
    const knex = await this.knexService.getConnection(user);
    const { corp } = user;
    const { cus, gbn, content } = modifyJournalDto;
    let { ymd } = modifyJournalDto;
    ymd = ymd.replaceAll('-', '');

    await knex.transaction(async (trx) => {
      await trx
        .where({ corp, cus, ymd, spv: user.id })
        .update({
          gbn,
          bigo: content
        });
    })
  }
}