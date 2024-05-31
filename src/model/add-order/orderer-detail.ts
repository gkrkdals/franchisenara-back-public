import { RowDataPacket } from 'mysql2';

export interface OrdererDetail extends RowDataPacket {
  credit: string;
  vir_bank_no: string;
  mon: string;
  tue: string;
  wed: string;
  thur: string;
  fri: string;
  sat: string;
  sun: string;
  order_available_date: string[];
  order_time1: string;
  order_time2: string;
  credit_gbn: string;
  logis_flag: string;
}