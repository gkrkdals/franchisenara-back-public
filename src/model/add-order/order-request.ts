import { RowDataPacket } from 'mysql2';

export interface OrderRequest extends RowDataPacket {
  ymd: string;
  jugyo: string;
  cus_nm: string;
}