import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe, registerLocaleData } from "@angular/common";
import * as _ from 'lodash';

@Pipe({
  name: 'vnd'
})
export class VndPipe implements PipeTransform {

  transform(value: any) {
    let price = _.toNumber(value);
    let numberPipe = new DecimalPipe('en');
    return numberPipe.transform(price, "1.0-0") + " ₫";

  }

}
