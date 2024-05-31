import { RowDataPacket } from 'mysql2';

export interface Favorite extends RowDataPacket {
  item: string;
}