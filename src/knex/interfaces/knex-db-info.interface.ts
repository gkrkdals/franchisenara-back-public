import { RowDataPacket } from 'mysql2';

/**
 * 일반 데이터베이스 정보입니다.
 */
export interface DbInfo extends RowDataPacket{
  serv_seq: string;
  ip: string;
  db_nm: string;
  db_port: number;
  id: string;
  pwd: string;
}