import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import { DbInfo } from 'src/knex/interfaces/knex-db-info.interface';
import { Cron } from '@nestjs/schedule';

/**
 * Knex를 기반으로 DB 커넥션을 저장하고 불러올 수 있습니다.
 */
@Injectable()
export class KnexService {
  private readonly authConnection: Knex<any, any[]>;

  private readonly _connections: { seq: string, knex: Knex<any, any[]> }[] = []

  constructor(private configService: ConfigService) {
    this.authConnection = knex(this.configService.get<Knex.Config>('knexAdminDbConfig'));
  }

  /**
   * 12분마다 배열을 지웁니다.
   */
  @Cron('0 5 * * * *')
  clearConnection() {
    this._connections.splice(0, this._connections.length);
  }

  /**
   * 유저 정보를 통해 데이터베이스를 가져옵니다.
   *
   * 만일 connections에 원하는 db가 없으면 새로 추가합니다.
   *
   * @param userInfo 유저 정보
   * @return Knex
   */
  async getConnection(userInfo: JwtUser): Promise<Knex<any, any[]>> {
    const foundKnex = this._connections.find((k) => {
      return k.seq === userInfo.serv_seq
    });

    if(foundKnex === undefined) {
      const dbInfo =
        await this.authConnection
          .column<DbInfo>(['serv_seq', 'ip', 'db_nm', 'db_port', 'id', 'pwd'])
          .select()
          .where('serv_seq', userInfo.serv_seq)
          .from('svr010')
          .first();

      const index = this._connections.length;
      this._connections.push({
        seq: dbInfo.serv_seq,
        knex: knex({
          client: 'mysql',
          connection: {
            host: dbInfo.ip,
            port: dbInfo.db_port,
            database: dbInfo.db_nm,
            user: dbInfo.id,
            password: dbInfo.pwd,
            multipleStatements: true
          },
          pool: {
            min: 1,
            max: 10,
          },
        })
      });

      return this._connections[index].knex;
    } else {
      return foundKnex.knex;
    }
  }

  /**
   * 인증 db의 정보를 가져옵니다.
   * @return Knex
   */
  getAuthConnection = (): Knex<any, any[]> => this.authConnection;
}