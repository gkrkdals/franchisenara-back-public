import { OrdererDetail } from 'src/model/add-order/orderer-detail';
import { Misu } from 'src/model/misu';
import { RowDataPacket } from 'mysql2';

export interface OrdererDto extends OrdererDetail, Misu, RowDataPacket {
  credit: string;
  credit_gbn: string;
  fri: string;
  logis_flag: string;
  mon: string;
  order_available_date: string[];
  order_time1: string;
  order_time2: string;
  sat: string;
  sun: string;
  thur: string;
  tue: string;
  vir_bank_no: string;
  wed: string;
  misu: number;
  already_ordered: number;
  code: string;
  jugyo: any;
}