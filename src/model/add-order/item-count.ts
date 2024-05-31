import { RowDataPacket } from 'mysql2';

export interface ItemCount extends RowDataPacket {
  qty: number;
}