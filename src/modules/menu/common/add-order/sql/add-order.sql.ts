export class AddOrderSql {
  static getAlreadyOrdered =
    `SELECT a.item, b.item_usr, b.item_nm, b.spec, c.sml_nm AS unit, a.pri, qty
       FROM sal021 a, sys020 b, sys910 c
      WHERE a.corp = ? 
        AND a.corp = b.corp
        AND a.corp = c.corp
        AND a.cus = ?
        AND a.in_gbn = '2'
        AND a.code = ?
        AND a.item = b.item
        AND c.big = '02'
        AND b.unit = c.sml`;

  static updateExistingOrder =
    `UPDATE sal021 
        SET qty=?, 
            pri=?, 
            amt=IF(vat_gbn = '13', ?, ? * (10/11)), vat=IF(vat_gbn = '13', 0, ? * (1/11)) , 
            upd=?, 
            upd_time=?, 
            jugyo=? 
     WHERE corp=? AND code=? AND item=?`;

  static insertAddedOrder =
    `INSERT INTO sal021 (corp, site, code, seq, ymd, cus, item, qty, pri, amt, vat, item_nm, vat_gbn, in_gbn, jugyo, mk, mk_time, upd, upd_time)
     VALUES (?, '0001', ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, '2', ?, ?, ?, ?, ?)`;
}