import { Pipe, PipeTransform } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';
import * as _ from 'lodash';

@Pipe({
  name: 'pipeSearch'
})
export class PipeSearchPipe implements PipeTransform {

  constructor(
    private ng2search: Ng2SearchPipe
  ) {

  }

  transform(value: any, args?: any): any {
    return _.take(this.ng2search.transform(value, args), 20);
  }

}
