import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';
import { Angular2TokenService } from 'angular2-token';
import { Storage } from './storage.model';

@Injectable()
export class StorageService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;

  // private options: RequestOptions;
  constructor(private http: Http, private authService: Angular2TokenService) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append('Content-Type', 'application/json');
  }

  getStorages(): Promise<Response> {
    const getUrl = `${this.baseUrl}/articles.json`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(this.handleError);
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

  deleteStorage(storage: Storage): Promise<Response> {

    const deleteUrl = `${this.baseUrl}/articles/${storage.id}`;
    return this.http
      .delete(deleteUrl, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  updateStorage(value: any, storage: Storage): Promise<Response> {
    const params: string = [
      `quantity=${value.newQuantity}`,
      `imported_price=${value.newImportedPrice}`
    ].join('&');
    const updateUrl = `${this.baseUrl}/articles/${storage.id}?${params}`;
    return this.http
      .put(updateUrl, {}, { headers: this.headers })
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
    const addUrl = `${this.baseUrl}/articles?${params}`;
    return this.http
      .post(addUrl, {}, { headers: this.headers })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(this.handleError);
  }

  getStorageWithPage(page: number, search: string, per_page: number): Observable<any> {
    const getUrl = `${this.baseUrl}/articles.json?page=${page}&search=${search}&per_page=${per_page}`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .map(res => res.json() );
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
