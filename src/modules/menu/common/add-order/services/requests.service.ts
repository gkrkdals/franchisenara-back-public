import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { RequestsDto } from 'src/modules/menu/common/add-order/dto/requests.dto';
import { OrderRequest } from 'src/model/add-order/order-request';
import { RequestsResponseDto } from 'src/modules/menu/common/add-order/dto/requests-response.dto';
import { MysqlService } from 'src/mysql/mysql.service';
import { RequestsSql } from 'src/modules/menu/common/add-order/sql/requests.sql';

@Injectable()
export class RequestsService {
  constructor(private mysqlService: MysqlService) {}

  /**
   * 주문 요청사항을 불러옵니다.
   *
   * 사용자가 수퍼바이저인가의 여부에 따라 실행이 바뀝니다.
   * @param user 유저 정보
   * @param query page, cus
   */
  async getRequests(user: JwtUser, query: RequestsDto): Promise<RequestsResponseDto> {
    const conn = await this.mysqlService.getConnection(user);

    const { page } = query;
    let { cus } = query;

    let requestsCount: number;
    let requests: OrderRequest[];

    cus = '%' + cus + '%';
    const offset = page === 0 ? 0 : (page - 1) * 20

    // 유저 구분이 가맹점이냐 아니냐에 따라 분기
    if(user.admin_gbn === '9') {
      requestsCount = await conn.countQuery(
        RequestsSql.getRequestsCount,
        [user.corp, cus]
      );
      requests = await conn.query<OrderRequest[]>(
        RequestsSql.getRequests,
        [user.corp, cus, offset]);
    } else {
      requestsCount = await conn.countQuery(
        RequestsSql.getSpvRequestsCount,
        [user.corp, cus, user.id]
      );
      requests = await conn.query<OrderRequest[]>(
        RequestsSql.getSpvRequests,
        [user.corp, cus, user.id, offset]
      );
    }

    const cnt = requestsCount === undefined ? 0 : requestsCount;

    return {
      totalPage: Math.ceil(cnt / 20.0),
      requests
    }
  }
}