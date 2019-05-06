import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class DashboardService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;

  // private options: RequestOptions;
  constructor(private http: Http, private authService: Angular2TokenService) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append("Content-Type", "application/json");
  }

  getResults(): Observable<any> {
    const getUrl = `${this.baseUrl}/dashboards.json`;
    return this.http.get(getUrl, { headers: this.headers }).map(res => {
      return res.json().result as any;
    });
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
