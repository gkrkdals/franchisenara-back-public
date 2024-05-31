import { OrderRequest } from 'src/model/add-order/order-request';

export class RequestsResponseDto {
  totalPage: number;
  requests: OrderRequest[];
}