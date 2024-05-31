import { RowDataPacket } from 'mysql2';

export interface ProductCategory extends RowDataPacket{
  big: string;
  cd_nm: string;
}