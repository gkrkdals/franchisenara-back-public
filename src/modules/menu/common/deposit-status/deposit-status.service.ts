import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { DepositStatusListDTO } from 'src/modules/menu/common/deposit-status/dto/deposit-status-list.dto';
import { Deposit } from 'src/model/deposit-status/deposit';
import { getTenDaysBefore, getYMD } from 'src/common/util/date';
import { MysqlService } from 'src/mysql/mysql.service';
import { DepositStatusSql } from 'src/modules/menu/common/deposit-status/sql/deposit-status.sql';

@Injectable()
export class DepositStatusService {
  constructor(private mysqlService: MysqlService) {}

  /**
   * 입금현황 리스트를 산출합니다.
   *
   * @param user 유저 정보
   * @param depositStatusListDTO DepositStatusListDTO
   * @return Deposit[] 유저 정보에 맞는 입금 현황
   */
  async getDepositStatusList(user: JwtUser, depositStatusListDTO: DepositStatusListDTO): Promise<Deposit[]> {
    const conn = await this.mysqlService.getConnection(user);
    let diff = 0;
    const ymd1 = depositStatusListDTO.radioMode === '1' ? getTenDaysBefore() : depositStatusListDTO.yearMonth + '01';
    const ymd2 = depositStatusListDTO.radioMode === '1' ? getYMD() : depositStatusListDTO.yearMonth + '31';
    const bindings = [ user.corp, depositStatusListDTO.cus, ymd1, ymd2 ];

    const depositIn = await conn.query<Deposit[]>(
      DepositStatusSql.getDepositIn, bindings
    );

    const depositOut = await conn.query<Deposit[]>(
      DepositStatusSql.getDepositOut, bindings
    );

    // depositIn과 depositOut을 모아서 정렬 후 차액 구함
    const depositList =
      depositIn.concat(depositOut)
        .sort((a, b) => {
          if(parseInt(a.ymd) < parseInt(b.ymd)) {
            return -1;
          } else if (parseInt(a.ymd) > parseInt(b.ymd)) {
            return 1;
          } else if(a.mode < b.mode) {
            return -1;
          } else if(a.mode > b.mode) {
            return 1;
          } else if(a.seq < b.seq) {
            return -1;
          } else if(a.seq > b.seq) {
            return 1;
          }

          return 0;
        })
        .map((deposit): Deposit => {
          diff = deposit.mode === 0 ? diff + deposit.deposit : diff - deposit.deposit;
          return {
            ...deposit,
            diff,
          }
        });

    return depositList.reverse();
  }
}