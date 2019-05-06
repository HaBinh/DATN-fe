import { Product } from '../products/product.model';

export class StoreOrder {
  constructor(
    public id: number,
    public product: Product,
    public quantity: number
  ) {}
}
