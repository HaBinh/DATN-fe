export class Storage {
  id: number;
  quantity: number;
  status: string;
  imported_price: number;
  product_id: number;
  name: string;
  code: string;
  sold: number;
  unit: string;
  created_at: string;
  default_imported_price: number;
  default_sale_price: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
