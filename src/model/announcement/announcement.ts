import { RowDataPacket } from 'mysql2';

export interface Announcement extends RowDataPacket {
  corp: string;
  seq: number;
  ymd: string;
  gbn: string;
  title: string;
  contents: Blob;
  file1: string;
  file1_Idx: string;
  file1_type: string;
  file2: string;
  file2_Idx: string;
  file2_type: string;
  show_start: string;
  show_end: string;
  mk: string;
  mk_time: string;
  upd: string;
  upd_time: string;
}