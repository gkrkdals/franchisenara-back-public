import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { getFullDateTime, getYMD } from 'src/common/util/date';
import { CheckDetail, CheckDetailClassifiedByBig } from 'src/model/add-check/check-detail';
import { CheckListResponseDTO } from 'src/modules/menu/manager/add-check/dto/response/check-list-response.dto';
import * as fs from 'fs';
import { AddCheckDto } from 'src/modules/menu/manager/add-check/dto/add-check.dto';

@Injectable()
export class AddCheckService {
  constructor(private knexService: KnexService) {}

  /**
   * 사용자의 nfc 사용 여부를 가져옵니다.
   *
   * @param user 유저 정보
   * @return { nfc_use: number }
   */
  async getNfcUse(user: JwtUser): Promise<{nfc_use: number}> {
    const knex = await this.knexService.getConnection(user);

    const nfcUse = await knex('acc010')
      .select<{nfc_use: string}>('nfc_card')
      .where('corp', user.corp)
      .first();

    return {
      nfc_use: nfcUse.nfc_use === '1' ? 1 : 0,
    }
  }

  /**
   * 수퍼바이저의 정보에 맞는 점검리스트를 가지고 옵니다.
   * @param user 유저 정보
   * @param cus 거래처 정보
   */
  async getCheckList(user: JwtUser, cus: string): Promise<CheckListResponseDTO> {
    const knex = await this.knexService.getConnection(user);

    const alreadyChecked = await knex('chk020')
      .count<{ cnt: number }>('*').as('cnt')
      .where('corp', user.corp)
      .andWhere('cus', cus)
      .andWhere('ymd', getYMD())
      .first();

    let checkList: any[] = await knex
      .select(knex.raw(
        `a.big, a.big_nm, b.sml, b.sml_nm, IFNULL(b.memo1, '') memo1, IFNULL(b.memo2, '') memo2, IFNULL(b.point, 0) total_point`
      ))
      .from(knex.raw('chk010 a'))
      .innerJoin(knex.raw('chk011 b ON a.corp = b.corp AND a.big = b.big'))
      .whereRaw('a.corp = ?', [user.corp])
      .orderByRaw('a.big, b.sml');

    checkList = checkList.reduce((prev: CheckDetailClassifiedByBig[], current: CheckDetail) => {
      const foundIndex = prev.findIndex(value => value.big === current.big);
      const { big, big_nm, ..._current } = current;

      if(foundIndex === -1) {
        prev.push({
          big,
          big_nm,
          value: [ _current ]
        });
      } else {
        prev[foundIndex].value.push(_current);
      }

      return prev;
    }, []);

    return {
      alreadyChecked: alreadyChecked.cnt,
      checkList
    }
  }

  async addCheck(user: JwtUser, body: AddCheckDto) {
    const knex = await this.knexService.getConnection(user);
    const today = getFullDateTime();
    const ymd = today.slice(0, 8), hms = today.slice(8);

    await knex.transaction(async trx => {
      await trx('chk020').insert({
        corp: user.corp,
        ymd: ymd,
        cus: body.cus,
        big: '00',
        sml: '00',
        spv: user.id,
        pointx: knex.raw('IFNULL((SELECT point FROM chk011 WHERE corp=? AND big=? AND sml=?), 0)', [0, 0, 0]),
        pointy: 0,
        memo: body.issue,
        file_nm: null,
        start_time: hms,
        end_time: hms
      });

      for(const bigCategory of body.data) {
        const { big, value } = bigCategory;

        for(const smlCategory of value) {
          const { sml, point, image } = smlCategory;
          let fileName = null;
          if(image != '') {
            fileName = `Check_${ymd}_${hms}_${user.corp}_${body.cus}_${big}${sml}.jpg`;
            fs.writeFileSync(`C:\\WEB\\upload\\check\\${fileName}`, image, 'base64');
          }

          await trx('chk020').insert({
            corp: user.corp,
            ymd: ymd,
            cus: body.cus,
            big: big,
            sml: sml,
            spv: user.id,
            pointx: knex.raw('IFNULL((SELECT point FROM chk011 WHERE corp=? AND big=? AND sml=?), 0)', [user.corp, big, sml]),
            pointy: parseInt(point),
            memo: body.issue,
            file_nm: fileName,
            start_time: hms,
            end_time: hms
          });
        }
      }
    });
  }
}
