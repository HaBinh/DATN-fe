export class Order {
  public fully_paid = false;
  constructor(
    public id: string,
    public total_amount: number,
    public debt: number,
    public created_at: string,
  ) {}
}
