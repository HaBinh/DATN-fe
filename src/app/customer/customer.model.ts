import { Order } from '../shared/customers-in-debt/order-debt.model';

export class Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  level: number;
  active: boolean;
  total_debt: number;
  orders_not_fully_paid: Order[] = [];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
