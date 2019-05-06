import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Response,
  RequestOptions
} from '@angular/http';
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment';
import {
  Angular2TokenService
} from 'angular2-token';

@Injectable()
export class QuotService {

  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;

  constructor(
    private http: Http,
    private authService: Angular2TokenService
  ) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append('Content-Type', 'application/json');
  }

  sendQuot(value: any): Observable<Response> {
    const sendEmail = `${this.baseUrl}/quote-price`;
    return this.http.post(sendEmail, JSON.stringify(value), { headers: this.headers });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
