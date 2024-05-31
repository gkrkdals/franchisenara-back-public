import { RowDataPacket } from 'mysql2';

/** jwt에 저장되는 유저 정보입니다. */
export interface JwtUser extends RowDataPacket{
  // 유저명
  user_nm: string;

  // 관리자구분, 1:관리자, 2:일반사용자(컨설턴트), 3:컨설턴트2. 4:수퍼바이저, 9:가맹점
  admin_gbn: string;

  // 거래처
  corp: string;

  // 거래처명
  corp_nm: string;

  // 서버 번호
  serv_seq: string;

  // 주문관리, SCM-거래처코드
  b2b_cus: string;

  // 사용자 ID
  id: string;

  // 사용자고유번호
  usr_no: string;
}