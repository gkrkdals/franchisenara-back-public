export class OrderCountSql {
  static getItemCount =
    `SELECT IFNULL((SELECT SUM(qty) FROM sal021 WHERE corp=? AND cus=? AND item=? AND ymd BETWEEN ? AND ?), 0) qty`
}