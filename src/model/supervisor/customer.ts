import { RowDataPacket } from 'mysql2';

export default interface Customer extends RowDataPacket {
  cus: string;
  cus_usr: string;
  cus_nm: string;
}