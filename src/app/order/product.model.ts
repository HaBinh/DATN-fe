export class Product {
  public sale_price: number;
  public quantity_sell: number;
  constructor(
    public id: number,
    public name: string,
    public unit: string,
    public code: string,
    public default_sale_price: number,
    public quantity: number,
    public discounted_rate: number = 0
  ) {}
}
