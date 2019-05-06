import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundVnd'
})
export class RoundVndPipe implements PipeTransform {

  transform(value: any): any {
    return Math.ceil(value / 100) * 100;
  }

}
