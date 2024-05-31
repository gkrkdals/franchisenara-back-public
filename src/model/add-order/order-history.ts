import { RowDataPacket } from 'mysql2';

export interface InGbn extends RowDataPacket{
  in_gbn: string;
}

export interface OrderHistoryDetail extends RowDataPacket {
  ymd: string;
  item: string;
  qty: string;
  pri: string;
  unit: string;
}

export interface OrderHistory {
  code: string;
  in_gbn: string;
  detail: OrderHistoryDetail[];
}

export interface OrderHistoryRaw extends OrderHistoryDetail {
  code: string;
  in_gbn: string;
}