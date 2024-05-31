export class InterviewSql {
  static getInterview =
    `SELECT a.ymd, a.seq, a.cus, b.cus_usr, b.cus_nm, a.stt, a.gbn, c.sml_nm gbn_nm, a.memo1 content, a.memo2 process
       FROM cs020 a, sys010 b, sys910 c
      WHERE a.corp=?
        AND a.corp=b.corp
        AND a.corp=c.corp
        AND a.spv=?
        AND a.cus=b.cus
        AND c.big='09'
        AND a.gbn=c.sml
        AND a.stt LIKE ?`
}