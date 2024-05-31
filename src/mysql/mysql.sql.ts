export class MysqlSql {
  static getDbInfo =
    `SELECT serv_seq, ip, db_nm, db_port, id, pwd
       FROM svr010
      WHERE serv_seq = ?
      LIMIT 1`
}