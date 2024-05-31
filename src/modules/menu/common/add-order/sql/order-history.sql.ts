export class OrderHistorySql {

  static getInGbn = `SELECT EXISTS(SELECT code FROM sal031 WHERE corp=? AND rel_cd=?) AS in_gbn`

  static getOrderHistory =
    `SELECT * FROM (SELECT a.code, a.seq, a.ymd, a.item, b.item_nm, a.qty, a.pri, c.sml_nm unit, '' cus_nm, a.in_gbn
         FROM sal021 a, sys020 b, sys910 c
         WHERE a.corp=? 
           AND a.corp=b.corp
           AND a.corp=c.corp
           AND a.cus LIKE ?
           AND a.ymd >= ? 
           AND a.ymd <= ?
           AND a.item = b.item
           AND c.big='02' 
           AND b.unit=c.sml
         
         UNION ALL

         SELECT a.code, a.seq, a.ymd, a.item, b.item_nm, a.qty, a.pri * -1 as pri, c.sml_nm unit, '' cus_nm, a.in_gbn
         FROM sal031 a, sys020 b, sys910 c
         WHERE a.corp=?
           AND a.corp=b.corp
           AND a.corp=c.corp
           AND a.cus LIKE ?
           AND a.ymd >= ?
           AND a.ymd <= ?
           AND a.in_gbn=1
           AND a.rel_seq=0
           AND a.item = b.item
           AND c.big='02'
           AND b.unit=c.sml) t
         ORDER BY code DESC, seq`

  static getSpvOrderHistory =
    `SELECT * FROM (SELECT a.code, a.seq, a.ymd, a.item, b.item_nm, a.qty, a.pri, c.sml_nm unit, d.cus_nm, a.in_gbn
         FROM sal021 a, sys020 b, sys910 c, sys010 d
         WHERE a.corp=? 
           AND a.corp=b.corp
           AND a.corp=c.corp
           AND a.corp=d.corp
           AND a.cus LIKE ?
           AND a.cus=d.cus
           AND a.ymd >= ? 
           AND a.ymd <= ?
           AND a.item = b.item
           AND c.big='02' 
           AND b.unit=c.sml
           AND d.spv=?
         
         UNION ALL

         SELECT a.code, a.seq, a.ymd, a.item, b.item_nm, a.qty, a.pri * -1 as pri, c.sml_nm unit, d.cus_nm, a.in_gbn
         FROM sal031 a, sys020 b, sys910 c, sys010 d
         WHERE a.corp=?
           AND a.corp=b.corp
           AND a.corp=c.corp
           AND a.corp=d.corp
           AND a.cus LIKE ?
           AND a.cus = d.cus
           AND a.ymd >= ?
           AND a.ymd <= ?
           AND a.in_gbn=1
           AND a.rel_seq=0
           AND a.item = b.item
           AND c.big='02'
           AND b.unit=c.sml
           AND d.spv = ?) t
         
         ORDER BY code DESC, seq`

}