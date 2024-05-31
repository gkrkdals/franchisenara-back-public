export default class ProductSQL {
  static getProduct =
    `SELECT 
        a.item, a.item_usr, a.item_nm, a.spec, a.key_word, 
        a.vat_gbn, a.stk_gbn, b.sml_nm AS unit, a.big 
     FROM sys020 a
     INNER JOIN sys910 b ON a.unit = b.sml
     INNER JOIN sys021 c ON a.big = c.big
     WHERE a.corp=? AND b.corp=? AND c.corp=?
       AND b.big = '02'
       AND b.use_gbn='1'
       AND c.use_gbn='1'
       AND a.mobile='1'`
}