import { Product } from './product.model';
export class OrderItem {
  amount: number;
  product: Product;
  old_quantity: number;
  constructor(
    public product_id: number,
    public quantity: number,
    public price_sale: number,
    public discounted_rate: number
  ) {

  }
}
