export class OrdererSql {
  static getAlreadyOrdered =
    `SELECT COUNT(*) cnt, code 
       FROM sal021 
      WHERE corp = ?
        AND cus = ?
        AND ymd = ?
        AND in_gbn != 1
      LIMIT 1`;

  static getCreditAndVirtualAccount =
    `SELECT a.credit, a.vir_bank_no, 
            a.mon, a.tue, a.wed, a.thur, a.fri, a.sat, a.sun,
            b.order_time1, b.order_time2, b.credit AS credit_gbn, b.logis_flag
       FROM sys010 a, acc010 b
      WHERE a.corp = ?
        AND a.corp = b.corp
        AND a.cus = ?
      LIMIT 1`;

  static getJugyo =
    `SELECT sml_nm AS jugyo FROM sys910 WHERE corp = ? AND big = '07' LIMIT 1`;

  static getMisu = `CALL usp_app_misu(?, ?, ?, @misu); SELECT @misu AS misu;`;
}