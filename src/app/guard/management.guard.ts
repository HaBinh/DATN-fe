import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Angular2TokenService } from 'angular2-token';
import * as _ from 'lodash';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ManagementGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private authTokenService: Angular2TokenService,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authTokenService.validateToken().map( () => {
      if (_.get(this.authTokenService.currentUserData, 'role') === 'manager') {
        return true;
      }
      this.router.navigate(['/new-order']);
      return false;
    });
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean  {
    return this.canActivate();
  }
}
