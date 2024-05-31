import { RowDataPacket } from 'mysql2';

export interface Product extends RowDataPacket {
  item: string;
  item_usr: string;
  item_nm: string;
  spec: string;
  key_word: string;
  vat_gbn: string;
  stk_gbn: string;
  unit: string;
  big: string;
  out_pri: number;
  favorite: boolean;
}