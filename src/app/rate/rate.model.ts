export class Rate {
  id: number;
  rate: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
