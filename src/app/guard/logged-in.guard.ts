import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    CanLoad,
    ActivatedRouteSnapshot,
    RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class LoggedInGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: Angular2TokenService,
    private loginService: AuthService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.userSignedIn()) {
      return true;
    }
    this.loginService.userSignedIn$.next(false);
    this.router.navigate(["/login"]);
    return false;
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}
