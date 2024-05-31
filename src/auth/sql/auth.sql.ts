export class AuthSql {
  static getUserInfo =
    `SELECT a.user_nm, a.admin_gbn, b.corp, b.corp_nm, b.serv_seq, a.b2b_cus, a.id, a.usr_no
       FROM vusr030 a, vusr020 b, vsvr010 c  
      WHERE a.id=?
        AND a.pwd=?
        AND b.cus_no=a.cus_no
        AND c.serv_seq=b.serv_seq`
}