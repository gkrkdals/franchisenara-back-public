import { Injectable } from '@nestjs/common';
import Customer from 'src/model/supervisor/customer';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { MysqlService } from 'src/mysql/mysql.service';

@Injectable()
export class SupervisorService {

  constructor(private mysqlService: MysqlService) {}

  /**
   * 수퍼바이저에게 할당된 거래처 정보를 불러옵니다.
   *
   * @param user 수퍼바이저 정보
   * @return Customer[]
   */
  async getCusList(user: JwtUser): Promise<Customer[]> {
    const conn = await this.mysqlService.getConnection(user);

    return conn.query<Customer[]>(
      'SELECT cus, cus_usr, cus_nm FROM sys010 WHERE corp=? AND spv=?',
      [user.corp, user.id]
    );
  }

}