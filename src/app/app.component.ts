import { Component, OnInit }     from '@angular/core';
import { Angular2TokenService }  from 'angular2-token';
import { environment }           from '../environments/environment';
import { AuthService }           from './auth/auth.service';
import '../assets/js/jquery.dataTables.js';
import '../assets/js/jquery.dataTables.bootstrap.js';
import { Router }               from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { TranslateService }     from '@ngx-translate/core';
import { SidebarService } from './layout/sidebar.service';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

import * as _ from 'lodash';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "raan";
  outSidebar = false;
  public userSignedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  constructor(
    private authToken: Angular2TokenService,
    private authSvc: AuthService,
    private translate: TranslateService,
    private sidebarSvc: SidebarService
  ) {
    this.authSvc.userSignedIn$.subscribe(data => this.userSignedIn$.next(data));
    const lang = localStorage.getItem("lang");
    translate.setDefaultLang(lang ? lang : "vi");
  }

  ngOnInit() {}

  private onClickOutSideBar(e) {
    this.sidebarSvc.emitClickOutSide();
  }

  isLoggedIn(): boolean {
    return this.authToken.userSignedIn();
  }
}

