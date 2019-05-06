import { CategoryDiscount } from './../category-discount/categoryDiscount.model';
export class Product {
  constructor(
    public id: number,
    public name: string,
    public unit: string,
    public code: string,
    public default_imported_price: number,
    public default_sale_price: number
  ) {}
    public category_id: number;
    public category: CategoryDiscount;
    public active: boolean;
    public rates: number[]= [];
}
