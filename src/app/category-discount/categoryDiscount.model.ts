export class CategoryDiscount {
  id: number;
  category: string;
  rates: number[];
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
