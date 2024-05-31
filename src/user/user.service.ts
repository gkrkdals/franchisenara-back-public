import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { KnexService } from 'src/knex/knex.service';
import { Knex } from 'knex';
import UserDetail from 'src/model/user';

@Injectable()
export class UserService {
  private readonly adminKnex: Knex<any, any[]>;

  constructor(
    private knexConnection: KnexService
  ) {
    this.adminKnex = this.knexConnection.getAuthConnection();
  }

  /**
   * 사용자로부터 바꾸고자 하는 비밀번호를 받아 비밀번호를 변경합니다.
   *
   * @param userInfo 유저 정보
   * @param pwd 새 비밀번호
   */
  async changePassword(userInfo: JwtUser, pwd: string): Promise<void> {
    const { usr_no } = userInfo;
    const userCount = await this.adminKnex('usr030')
      .count({ count: '*' }).first();

    if(userCount.count === 0) {
      throw new InternalServerErrorException();
    }

    await this.adminKnex<UserDetail>('usr030')
      .where({ usr_no })
      .update({ pwd })
  }
}