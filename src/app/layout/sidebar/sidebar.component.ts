import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ManagementService } from '../../shared/management.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sidebar]',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public isManager: boolean;
  menu_min = false;
  constructor(
    private management: ManagementService,
  ) {}

  ngOnInit() {
    this.management.isManager()
    .subscribe(res => {
      this.isManager = this.management.validateToken$;
    });
  }

  ToggleSidebar() {
    this.menu_min = !this.menu_min;
  }
}
