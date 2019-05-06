import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import "rxjs/add/operator/toPromise";

import { environment } from "../../environments/environment";
import { Angular2TokenService } from 'angular2-token';
import { Rate } from './rate.model';
import { Product } from "../products/product.model";

@Injectable()
export class RateService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;

  // private options: RequestOptions;
  constructor(private http: Http, private authService: Angular2TokenService) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append("Content-Type", "application/json");
  }

  getRates(): Observable<Rate[]> {
    const getUrl = `${this.baseUrl}/rates.json`;
    return this.http
        .get(getUrl, { headers: this.headers })
        .map(res => {
          return res.json().discounted_rates as any;
        }
        );
  }

  deleteRate(rate: Rate): Promise<Response> {
    const deleteUrl = `${this.baseUrl}/rates/${rate.id}.json`;
    return this.http
      .delete(deleteUrl, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  updateRate(value: any, rate: Rate): Promise<Response> {
    const params: string = [
      `rate_id=${rate.id}`,
      `rate=${value.newRate / 100}`
    ].join("&");
    const updateUrl = `${this.baseUrl}/rates/update?${params}`;
    return this.http
      .put(updateUrl, {}, { headers: this.headers })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(this.handleError);
  }

  addRate(value: any): Promise<Response> {
    const addUrl = `${this.baseUrl}/rates.json?rate=${value.newRateAdd / 100}`;
    return this.http
      .post(addUrl, {}, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
