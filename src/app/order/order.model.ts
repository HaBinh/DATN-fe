import { OrderItem }              from './order-item';
import { Customer }         from '../customer/customer.model';

export class Order {
  public fully_paid: boolean;
  public debt: number;
  public customer_paid: number;
  constructor(public id: string,
              public total_amount: number,
              public created_at: string,
              public customer: Customer,
              public order_items: OrderItem[] = []
              ) {}
}
