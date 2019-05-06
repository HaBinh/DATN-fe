import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SidebarService {

  clickOutSide = new BehaviorSubject(false);

  constructor() { }

  emitClickOutSide() {
    this.clickOutSide.next(true);
  }

}
