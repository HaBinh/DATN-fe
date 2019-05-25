import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';
import {Angular2TokenService} from 'angular2-token';
import { Store } from './store.model';
import { Storage } from '../storage/storage.model';
import { Inventory } from './inventory.model';

@Injectable()
export class StoreService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;
  constructor(
    private http: Http,
    private authService: Angular2TokenService
    ) {
      this.headers = this.authService.currentAuthHeaders;
      this.headers.append('Content-Type', 'application/json');
  }

  getStoreWithPage(page: number, search: string, per_page: number): Observable<any> {
    const getUrl = `${this.baseUrl}/stores.json?page=${page}&search=${search}&per_page=${per_page}`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .map(res => res.json() );
  }

  getProducts(): Promise<Response> {
    const getUrl = `${this.baseUrl}/add_storage.json`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(this.handleError);
  }

  addStorage(newStorage: Storage): Promise<Response> {
    const params: string = [
      `product_id=${newStorage.id}`,
      `quantity=${newStorage.quantity}`,
      `imported_price=${newStorage.imported_price}`
    ].join('&');
    const addUrl = `${this.baseUrl}/stores?${params}`;
    return this.http
               .post(addUrl, {}, { headers: this.headers } )
               .toPromise()
               .then(res => {
                return res;
              })
              .catch(this.handleError);
  }

  get_inventory_statisitc(): Observable<Inventory[]> {
    const uri = `${this.baseUrl}/get_inventory_statistics.json`;
    return this.http.get(uri, { headers: this.headers })
                .map((res: any) => res.json().imports as Inventory[]);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
