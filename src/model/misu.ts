import { RowDataPacket } from 'mysql2';

export interface Misu extends RowDataPacket  {
  misu: number;
}