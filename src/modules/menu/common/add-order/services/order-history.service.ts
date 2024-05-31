import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { OrderHistoryDto } from 'src/modules/menu/common/add-order/dto/order-history.dto';
import { InGbn, OrderHistory, OrderHistoryDetail, OrderHistoryRaw } from 'src/model/add-order/order-history';
import { getTenDaysBefore, getYMD } from 'src/common/util/date';
import { OrderHistorySql } from 'src/modules/menu/common/add-order/sql/order-history.sql';
import { MysqlService } from 'src/mysql/mysql.service';
import Mysql from 'src/mysql/mysql';

@Injectable()
export class OrderHistoryService {
  constructor(private mysqlService: MysqlService) {}

  /**
   * 기존 in_gbn에 따라 새 in_gbn을 설정 후, orderHistorySummary에 push합니다.
   *
   * @param conn knex 인스턴스
   * @param orderHistory 주문 내역 배열
   * @param corp 회사코드(corp)
   * @param code 주문번호
   * @param in_gbn 입력구분
   * @param detail OrderHistoryDetail 타입
   */
  private async pushOrderHistory(
    conn: Mysql,
    orderHistory: OrderHistory[],
    corp: string,
    code: string,
    in_gbn: string,
    detail: OrderHistoryDetail
  ): Promise<void> {
    if(in_gbn != '1') {
      const chulgoGbn: InGbn = (await conn.procedure<InGbn>(OrderHistorySql.getInGbn, [corp, code]))[0];
      if(chulgoGbn.in_gbn) {
        in_gbn = '2';
      } else {
        in_gbn = '3';
      }
    }

    orderHistory.push({
      code,
      in_gbn,
      detail: [ detail ]
    });
  }

  /**
   * 주문내역을 조회합니다.
   *
   * 전체 주문내역을 조회 후, 코드별로 묶습니다.
   *
   * @param user 유저 정보
   * @param query 쿼리 파라미터(mode, yearMonth, cus)
   */
  async getOrderHistory(user: JwtUser, query: OrderHistoryDto): Promise<OrderHistory[]> {
    const conn = await this.mysqlService.getConnection(user);

    const { mode, yearMonth, cus } = query;
    const { corp, b2b_cus, admin_gbn, id } = user;
    const yearMonthTrimmed = yearMonth.replaceAll('-', '')
    const cusLike = '%' + (admin_gbn !== '9' ? cus : b2b_cus) + '%';
    const ymd1 = mode === '0' ? getTenDaysBefore() : yearMonthTrimmed + '01';
    const ymd2 = mode === '0' ? getYMD() : yearMonthTrimmed + '31';

    const sql = admin_gbn === '9' ? OrderHistorySql.getOrderHistory : OrderHistorySql.getSpvOrderHistory;
    const bindings = [corp, cusLike, ymd1, ymd2];
    bindings.push(...bindings);

    if(admin_gbn !== '9') {
      bindings.splice(4, 0, id);
      bindings.push(id);
    }
    const _orderHistory: OrderHistoryRaw[] = await conn.query<OrderHistoryRaw[]>(sql, bindings);
    const orderHistory: OrderHistory[] = [];

    // _orderHistory의 1번 인덱스 처리
    if(_orderHistory.length !== 0) {
      const { code, in_gbn, ...detail } = _orderHistory[0];

      await this.pushOrderHistory(conn, orderHistory, corp, code, in_gbn, detail);
    }

    // 코드가 같은 것들끼리 묶음
    let bigIdx = 0;
    for(let i = 1; i < _orderHistory.length; i++) {
      const { code, in_gbn, ...detail } = _orderHistory[i];

      // code별로 정렬을 했기 때문에 따로 찾을 필요 없음
      if(code === orderHistory[bigIdx].code) {
        orderHistory[bigIdx].detail.push(detail);
      } else {
        bigIdx += 1;
        await this.pushOrderHistory(conn, orderHistory, corp, code, in_gbn, detail);
      }
    }

    return orderHistory;
  }
}