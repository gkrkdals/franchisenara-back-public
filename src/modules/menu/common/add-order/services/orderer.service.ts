import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { getYMD } from 'src/common/util/date';
import { Misu } from 'src/model/misu';
import { OrdererDetail } from 'src/model/add-order/orderer-detail';
import { OrdererSql } from 'src/modules/menu/common/add-order/sql/orderer.sql';
import { MysqlService } from 'src/mysql/mysql.service';

@Injectable()
export class OrdererService {
  constructor(private mysqlService: MysqlService) {}

  async getAlreadyOrdered(user: JwtUser, cus: string): Promise<{cnt: number; code: string;}> {
    const conn = await this.mysqlService.getConnection(user);
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;

    return conn.queryLimitOne<any>(
      OrdererSql.getAlreadyOrdered,
      [user.corp, cus, getYMD()]
    );
  }

  async getCreditAndVirtualAccount(user: JwtUser, cus: string): Promise<OrdererDetail> {
    const conn = await this.mysqlService.getConnection(user);
    const availableDate = [ '0', '0', '0', '0', '0', '0', '0' ];
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;

    const ordererDetail = await conn.queryLimitOne<OrdererDetail>(
      OrdererSql.getCreditAndVirtualAccount,
      [user.corp, cus]
    )


    // 날짜에 공백 제거
    ordererDetail.order_time1 = ordererDetail.order_time1.replace(' ', '');
    ordererDetail.order_time2 = ordererDetail.order_time2.replace(' ', '');

    availableDate[0] = ordererDetail.tue
    availableDate[1] = ordererDetail.wed
    availableDate[2] = ordererDetail.thur
    availableDate[3] = ordererDetail.fri
    availableDate[4] = ordererDetail.sat
    availableDate[5] = ordererDetail.sun
    availableDate[6] = ordererDetail.mon

    ordererDetail.order_available_date = availableDate;

    return ordererDetail;
  }

  async getJugyo(user: JwtUser) {
    const conn = await this.mysqlService.getConnection(user);

    return conn.queryLimitOne<any>(OrdererSql.getJugyo, [user.corp]);
  }

  async getMisu(user: JwtUser, cus: string): Promise<Misu> {
    const conn = await this.mysqlService.getConnection(user);
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;
    return conn.procedure<Misu>(OrdererSql.getMisu, [user.corp, getYMD(), cus])
  }

}