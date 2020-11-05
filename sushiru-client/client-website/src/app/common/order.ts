import { Address } from './address';
import { OrderItem } from './order-item';

export class Order {
  constructor() { }

  id: number;
  dateCreated: Date;
  lastUpdated: Date;
  orderStatusName: string;
  totalQuantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatusName: string;
  addressDto: Address;
  orderItemDtos: OrderItem[];
}
