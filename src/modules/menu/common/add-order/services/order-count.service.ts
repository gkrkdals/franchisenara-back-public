import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { OrderCountSql } from 'src/modules/menu/common/add-order/sql/order-count.sql';
import { ItemCount } from 'src/model/add-order/item-count';
import { ItemCountDto } from 'src/modules/menu/common/add-order/dto/item-count.dto';
import { MysqlService } from 'src/mysql/mysql.service';

@Injectable()
export class OrderCountService {
  constructor(private mysqlService: MysqlService) {}

  /**
   * 시작 날짜와 종료 날짜를 받아 제품의 수를 구합니다.
   *
   * @param user 유저 정보
   * @param query (start, end, item, cus)
   */
  async getItemCount(user: JwtUser, query: ItemCountDto): Promise<number> {
    const conn = await this.mysqlService.getConnection(user);
    const { start, end, item, cus: _cus } = query;

    const startAt = start.replaceAll('-', '');
    const endAt = end.replaceAll('-', '');
    const cus = user.admin_gbn === '9' ? user.b2b_cus : _cus;

    return (await conn.query<ItemCount[]>(
      OrderCountSql.getItemCount,
      [user.corp, cus, item, startAt, endAt]))[0].qty;
  }
}