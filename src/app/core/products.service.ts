import { Injectable }     from '@angular/core';
import {
  Headers,
  Http,
  Response,
  RequestOptions }        from '@angular/http';
import { environment }    from '../../environments/environment';
import {
  Angular2TokenService
}                         from 'angular2-token';
import { Product }        from '../products/product.model';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/toPromise';
import { Rate } from "../rate/rate.model";
import {BestSellerModel} from "../products-best-seller/best-seller.model";
@Injectable()
export class ProductsService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;

  constructor(private http: Http, private authService: Angular2TokenService) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append("Content-Type", "application/json");
  }

  getProductsWithPage(page: number, search: string, per_page: number): Observable<any> {
    const getUrl = `${this.baseUrl}/products.json?page=${page}&search=${search}&per_page=${per_page}`;
     return this.http
       .get(getUrl, { headers: this.headers })
       .map(res => res.json());
  }

  getProducts(): Observable<any> {
    const getUrl = `${this.baseUrl}/products.json`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .map(res => res.json());
  }

  getDiscountRates(id: number): Observable<any> {
    const getUrl = `${this.baseUrl}/product_discoutedrates.json?id=${id}`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .map(res => res.json().discounted_rates as any);
  }

  getRates(): Observable<Rate[]> {
    const getUrl = `${this.baseUrl}/rates.json`;
    return this.http.get(getUrl, { headers: this.headers }).map(res => {
      return res.json().discounted_rates as any;
    });
  }

  updateRate(value: any, rate: any): Observable<any> {
    const updateUrl = `${this.baseUrl}/product_discoutedrates/${
      rate.id
    }?rate=${value.newRate / 100}`;
    return this.http
      .put(updateUrl, {}, { headers: this.headers })
      .map(res => res.json().discoutedRates as any);
  }

  addProduct(value: any): Observable<Product> {
    const updateUrl = `${this.baseUrl}/products.json`;
    return this.http
      .post(updateUrl, JSON.stringify(value), { headers: this.headers })
      .map(res => res.json().product as Product);
  }

  updateProduct(id: number, value: any): Observable<Product> {
    const updateUrl = `${this.baseUrl}/products/${id}.json`;
    return this.http
      .put(updateUrl, JSON.stringify(value), { headers: this.headers })
      .map(res => res.json().product as Product);
  }

  deleteProduct(id: number): Observable<any> {
    const deleteUrl = `${this.baseUrl}/products/${id}.json`;
    return this.http
      .delete(deleteUrl, { headers: this.headers })
      .map(res => res.json().message as any);
  }


  get_products_best_seller(): Observable<BestSellerModel[]> {
    const uri = `${this.baseUrl}/products_best_seller.json`;
    return this.http.get(uri, { headers: this.headers })
      .map(res => res.json())
      .map( res => res.products as BestSellerModel[]);

  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
