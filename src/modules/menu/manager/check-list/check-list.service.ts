import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { CheckSummaryDTO } from 'src/modules/menu/manager/check-list/dto/check-summary.dto';
import { CheckSummary } from 'src/model/check-list/check-summary';
import { CheckDetailDTO } from 'src/modules/menu/manager/check-list/dto/check-detail.dto';
import { CheckDetail, CheckDetailClassifiedByBig } from 'src/model/add-check/check-detail';

@Injectable()
export class CheckListService {
  constructor(private knexService: KnexService) {}

  /**
   * 점검리스트 요약을 가져옵니다.
   *
   * @param user 유저 정보
   * @param checkSummaryDTO cus: 가맹점, ymd1: 시작일, ymd2: 종료일
   * @return CheckSummary[] 점검리스트 요약 리스트
   */
  async getCheckSummary(user: JwtUser, checkSummaryDTO: CheckSummaryDTO): Promise<CheckSummary[]> {
    const knex = await this.knexService.getConnection(user);
    const cus = checkSummaryDTO.cus === '0' ? '%%' : '%' + checkSummaryDTO.cus + '%';
    const ymd1 = checkSummaryDTO.ymd1.replaceAll('-', '');
    const ymd2 = checkSummaryDTO.ymd2.replaceAll('-', '');

    return knex
      .select<CheckSummary[]>(knex.raw('ymd, chk020.cus, cus_usr, cus_nm, SUM(pointx) total_point, SUM(pointy) current_point'))
      .from('chk020')
      .innerJoin('sys010', knex.raw('chk020.cus = sys010.cus AND chk020.spv = sys010.spv'))
      .where('chk020.corp', user.corp)
      .andWhereLike('chk020.cus', cus)
      .andWhereBetween('ymd', [ymd1, ymd2])
      .andWhere('chk020.spv', user.id)
      .groupBy('ymd');
  }

  /**
   * 점검리스트 세부사항을 대분류별로 묶어 보냅니다.
   * 
   * @param user 유저 정보
   * @param checkDetailDTO cus: 거래처 정보, ymd: 날짜
   * @return CheckDetailClassifiedByBig[] : 대분류별로 묶은 점검리스트 세부사항
   */
  async getCheckDetail(user: JwtUser, checkDetailDTO: CheckDetailDTO): Promise<CheckDetailClassifiedByBig[]> {
    const knex = await this.knexService.getConnection(user);

    let checkDetail: any[] = await knex
      .select<CheckDetail[]>(knex.raw(
        `chk020.ymd, sys010.cus, sys010.cus_usr, sys010.cus_nm, chk010.big, chk010.big_nm,
               chk011.sml, chk011.sml_nm, IFNULL(chk011.memo1, '') memo1, IFNULL(chk011.memo2, '') memo2,
               chk020.pointx total_point, chk020.pointy current_point, IFNULL(file_nm, '') file_nm`
      ))
      .from('chk020')
      .innerJoin('chk010', knex.raw('chk020.corp = chk010.corp AND chk020.big = chk010.big'))
      .innerJoin('chk011', knex.raw('chk020.corp = chk011.corp AND chk020.big = chk011.big AND chk020.sml = chk011.sml'))
      .innerJoin('sys010', knex.raw('chk020.corp = sys010.corp AND chk020.cus = sys010.cus AND chk020.spv = sys010.spv'))
      .where('chk020.corp', user.corp)
      .andWhere('chk020.ymd', checkDetailDTO.ymd)
      .andWhere('chk020.cus', checkDetailDTO.cus)
      .andWhere('chk020.spv', user.id);

    // 대분류별로 소분류를 묶습니다.
    checkDetail = checkDetail.reduce((prev: CheckDetailClassifiedByBig[], current: CheckDetail) => {
      const foundIndex = prev.findIndex(value => value.big == current.big);
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
    
    return checkDetail as CheckDetailClassifiedByBig[];
  }
}
