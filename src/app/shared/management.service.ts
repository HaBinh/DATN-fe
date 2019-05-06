import { Injectable, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Angular2TokenService } from 'angular2-token';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ManagementService {

  public validateToken$: boolean;

  constructor(public authService: Angular2TokenService) {
   }

  isManager(): Observable<boolean> {
    return this.authService.validateToken().map((res) => {
      if (_.get(this.authService.currentUserData, 'role') === 'manager') {
        this.validateToken$ = true;
        return true;
      }
      this.validateToken$ = false;
      return false;
    });
  }
}
