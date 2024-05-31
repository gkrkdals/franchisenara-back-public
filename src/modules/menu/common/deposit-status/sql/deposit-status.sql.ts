export class DepositStatusSql {
  static getDepositIn =
    `SELECT cus, ymd, SUM(amt) deposit, 0 seq, 0 mode
       FROM acc033
      WHERE corp = ? 
        AND cus = ?
        AND ymd BETWEEN ? AND ?
        AND io_gbn = '1'
     GROUP BY ymd
     ORDER BY ymd`;

  static getDepositOut =
    `SELECT cus, ymd, qty * IF(rel_seq = '0' AND in_gbn = '1', pri * -1, pri) deposit, 1 seq, 1 mode
       FROM sal031
      WHERE corp = ? 
        AND cus = ?
        AND ymd BETWEEN ? AND ?
     GROUP BY code
     ORDER BY code`;
}