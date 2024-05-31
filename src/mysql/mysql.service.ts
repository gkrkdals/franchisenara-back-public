import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { RowDataPacket } from 'mysql2';
import { Connection, ConnectionConfig } from 'mysql2/promise';
import { MysqlSql } from 'src/mysql/mysql.sql';
import { DbInfo } from 'src/knex/interfaces/knex-db-info.interface';
import Mysql from 'src/mysql/mysql';

@Injectable()
export class MysqlService {
  readonly adminConnection: Mysql;

  constructor(private configService: ConfigService) {
    this.adminConnection = new Mysql(configService.get<ConnectionConfig>('adminDbConfig'));
  }

  /**
   * 유저 정보를 토대로 맞는 커넥션을 구합니다.
   *
   * @param user 유저 정보
   * @return 유저 정보에 맞는 DB 커넥션
   */
  async getConnection(user: JwtUser): Promise<Mysql> {
    const dbInfo = await this.adminConnection.queryLimitOne<DbInfo>(MysqlSql.getDbInfo, [user.serv_seq]);

    return new Mysql({
      host: dbInfo.ip,
      port: dbInfo.db_port,
      database: dbInfo.db_nm,
      user: dbInfo.id,
      password: dbInfo.pwd,
      multipleStatements: true,
    })
  }

  /**
   * 커넥션 정보, SQL, 바인딩을 토대로 쿼리를 실행합니다.
   *
   * @param conn 커넥션
   * @param sql 실행하고자 하는 SQL
   * @param bindings SQL의 바인딩
   * @returns 실행 결과
   */
  async runQuery<T extends RowDataPacket[]>(conn: Connection, sql: string, bindings?: any[]): Promise<T> {
    return (await conn.query<T>(sql, bindings))[0];
  }

  /**
   * 커넥션 정보, SQL, 바인딩을 토대로 쿼리를 실행합니다.
   *
   * 실행 결과의 첫 행만을 반환합니다.
   *
   * @param conn 커넥션
   * @param sql 실행하고자 하는 SQL
   * @param bindings SQL의 바인딩
   * @returns 실행 결과의 첫 행
   */
  async runLimitOneQuery<T extends RowDataPacket>(conn: Connection, sql: string, bindings?: any[]): Promise<T> {
    return (await this.runQuery<T[]>(conn, sql, bindings))[0];
  }

  async runCountQuery(conn: Connection, sql: string, bindings?: any[]): Promise<number> {
    return Object.values((await this.runLimitOneQuery<any>(conn, sql, bindings))).at(0) as number;
  }

  /**
   * 커넥션 정보, SQL, 바인딩을 토대로 트랜잭션을 수행합니다.
   *
   * @param conn 커넥션
   * @param callback 콜백 함수
   */
  async runTransaction(conn: Connection, callback: (conn: Connection) => Promise<void>): Promise<void> {
    try {
      await conn.beginTransaction();
      await callback(conn);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw new InternalServerErrorException();
    }
  }
}