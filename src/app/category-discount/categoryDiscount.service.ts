import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { map } from 'rxjs/operators';

import { environment } from "../../environments/environment";
import { Angular2TokenService } from 'angular2-token';
import { CategoryDiscount } from './categoryDiscount.model';
import { Product } from "../products/product.model";
import { Rate } from "../rate/rate.model";
import * as _ from "lodash";

export interface ICategoryDiscount {
  category_discounts: CategoryDiscount[];
  total: number;
}

@Injectable()
export class CategoryDiscountService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;

  // tslint:disable-next-line:no-shadowed-variable
  convString = map((res: any) => {
      return {
        total: res.total,
        categories: res.categories.map(each => {
          return {
            id: each.id,
            category: each.category,
            rates: JSON.parse(each.rates)
          };
        })
      };
    });

  constructor(private http: Http, private authService: Angular2TokenService) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append("Content-Type", "application/json");
  }

  getCategories(): Observable<CategoryDiscount[]> {
    const getUrl = `${this.baseUrl}/categories.json`;
    return this.http.get(getUrl, { headers: this.headers })
      .pipe(
        map(res => res.json()),
        map(res => res.categories)
      );
  }

  getCategoryDiscountsWithPage(page: number, per_page: number, search_text: string): Observable<any> {
    const getUrl = `${this.baseUrl}/categories.json`;
    const url = `${getUrl}?page=${page}&search_text=${search_text}&per_page=${per_page}`;
    return this.http.get(url, { headers: this.headers })
                    .pipe(
                      map(res => res.json())
                    );
  }
  deleteCategory(id: number): Observable<any> {
    const deleteUrl = `${this.baseUrl}/categories/${id}.json`;
    return this.http
      .delete(deleteUrl, { headers: this.headers })
      .map(res => res.json().message as any);
  }
  updateCategory(id: number, value: any): Observable<CategoryDiscount> {
    const updateUrl = `${this.baseUrl}/categories/${id}.json`;
    return this.http
      .put(updateUrl, JSON.stringify(value), { headers: this.headers })
      .map(res => res.json().category as CategoryDiscount);
  }

  getCategoryWithId(category_id): Observable<CategoryDiscount> {
    const getUrl = `${this.baseUrl}/categories/${category_id}.json`;
    return this.http.get(getUrl, { headers: this.headers })
      .pipe(
        map(res => res.json().category as CategoryDiscount),
      );

  }
  ChangeDiscount(id: number): Observable<any>{
    const updateUrl = `${this.baseUrl}/change.json`;
    return this.http
      .put(updateUrl, JSON.stringify(id), { headers: this.headers })
      .map(res => res.json() as any);
  }
  getRates(): Observable<Rate[]> {
    const getUrl = `${this.baseUrl}/rates.json`;
    return this.http.get(getUrl, { headers: this.headers }).map(res => {
      return res.json().discounted_rates as any;
    });
  }

  addCategory(value: any): Observable<CategoryDiscount> {
    const updateUrl = `${this.baseUrl}/categories.json`;
    return this.http
      .post(updateUrl, JSON.stringify(value), { headers: this.headers })
      .map(res => res.json().category as CategoryDiscount);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
