export class CustomerManageSql {
  static getCustomerInfo = `SELECT cus_nm, tel, tel tel2, addr, ymd21 start, ymd22 end, ' ' recent_visit, ' ' recent_purpose FROM sys010 WHERE corp=? AND cus=?`;

  static getMisu = `CALL usp_app_misu(?, ?, ?, @misu); SELECT @misu AS misu;`;

  static getJournal = `SELECT ymd, cus, gbn, IF(emp_nm=' ', '공란', emp_nm) emp_nm, bigo FROM sys012 WHERE corp=? AND spv=? ORDER BY ymd DESC, seq`;

  static getSeq = `CALL usp_seq_maker(?, 'SYS012', ?, @seq); SELECT @seq as seq`;
}