import { RowDataPacket } from 'mysql2';

export interface Deposit extends RowDataPacket{
  cus: string;
  ymd: string;
  deposit: number;
  seq: number;
  mode: number;
  diff: number;
}