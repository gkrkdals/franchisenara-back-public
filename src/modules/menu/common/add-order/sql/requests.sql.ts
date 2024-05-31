export class RequestsSql {
  static getRequestsCount =
    `SELECT COUNT(*) cnt FROM sal021 WHERE corp = ? AND cus LIKE ?`;

  static getSpvRequestsCount =
    `SELECT COUNT(*)
       FROM sal021 a, sys010 b
      WHERE a.corp = ?
        AND a.cus LIKE ?
        AND a.corp = b.corp
        AND a.cus = b.cus
        AND a.jugyo != ''
        AND b.spv = ?
      GROUP BY code`;

  static getRequests =
    `SELECT ymd, jugyo, '' cus_nm
       FROM sal021
      WHERE corp = ?
        AND cus LIKE ?
        AND jugyo != ''
      GROUP BY code
      LIMIT ?, 20`;

  static getSpvRequests =
    `SELECT a.ymd, a.jugyo, a.cus_nm
       FROM sal021 a, sys010 b
      WHERE a.corp = ?
        AND a.cus LIKE ?
        AND a.corp = b.corp
        AND a.cus = b.cus
        AND jugyo != ''
        AND b.spv = ?
      GROUP BY code
      ORDER BY code desc
      LIMIT ?, 20`
}