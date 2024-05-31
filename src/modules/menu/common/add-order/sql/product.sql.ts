export class ProductSql {
  static getProduct =
    `SELECT a.item, a.item_usr, a.item_nm, a.spec, a.key_word, a.vat_gbn, a.stk_gbn, b.sml_nm unit, a.big,
            IFNULL((SELECT out_pri FROM sys060 WHERE corp = a.corp AND item = a.item AND ymd <= ? ORDER BY ymd DESC LIMIT 1 ), 0.0) out_pri,
            IFNULL((SELECT true FROM sys023 WHERE corp = a.corp AND cus = ? AND item = a.item), false) favorite
      FROM sys020 a, sys910 b, sys021 c
     WHERE a.corp=?
       AND b.corp=?
       AND c.corp=?
       AND b.big='02'
       AND b.use_gbn='1'
       AND c.use_gbn='1'
       AND a.unit=b.sml
       AND a.big=c.big
       AND a.mobile = 1`;

  static getFavoriteProducts =
    `SELECT a.item, a.item_usr, a.item_nm,
            a.spec, a.vat_gbn, a.stk_gbn, c.sml_nm unit,
            IFNULL(
                (SELECT out_pri FROM sys060 WHERE corp = a.corp AND item = a.item AND ymd <= ? ORDER BY ymd DESC LIMIT 1 ), 
                '0.0'
            ) out_pri
       FROM sys020 a, sys023 b, sys910 c
      WHERE a.corp = ?
        AND a.corp = b.corp
        AND a.item = b.item
        AND b.cus = ?
        AND a.corp = c.corp
        AND a.unit = c.sml
        AND c.big = '02'`;

  static getCurrentFavorites = `SELECT item FROM sys023 WHERE corp = ? AND cus = ?`;

  static addFavorite = `INSERT INTO sys023 (corp, cus, item)VALUES (?, ?, ?)`;

  static deleteFavorite = `DELETE FROM sys023 WHERE corp = ? AND cus = ? AND item = ?`
}