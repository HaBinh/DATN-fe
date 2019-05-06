import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { environment } from '../../environments/environment';
import { Angular2TokenService } from 'angular2-token';
import { Product } from './product.model';
import { Order } from './order.model';
import { Customer } from '../customer/customer.model';
import * as _ from 'lodash';

export interface IOrderPage {
  total: number,
  orders: Order[]
}


@Injectable()
export class OrderService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;
  private options: RequestOptions;

  constructor(private http: Http, private authService: Angular2TokenService) {
    this.headers = this.authService.currentAuthHeaders;
    this.headers.append("Content-Type", "application/json");
    this.options = new RequestOptions({ headers: this.headers });
  }

  getOrders(): Observable<Order[]> {
    const getUrl = `${this.baseUrl}/orders.json`;
    return this.http.get(getUrl, { headers: this.headers }).map(res => {
      return res.json().orders as Order[];
    });
  }

  getOrdersWithPage(page: number, per_page: number, search: string): Observable<IOrderPage> {
    const getUrl = `${this.baseUrl}/orders.json?page=${page}&per_page=${per_page}&search_text=${search}`;
    return this.http.get(getUrl, this.options)
               .map(res => res.json() as IOrderPage);

  }

  getOrder(id: string): Observable<Order> {
    const getUrl = `${this.baseUrl}/orders/${id}.json`;
    console.log(getUrl);
    return this.http.get(getUrl, this.options)
               .map(res => res.json().order as Order);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }

  addOrder(value: any): Observable<Response> {
    const postUrl = `${this.baseUrl}/orders.json`;
    return this.http.post(postUrl, JSON.stringify(value), this.options);
  }

  getProducts(): Observable<Product[]> {
    const getUrl = `${this.baseUrl}/get_products.json`;
    return this.http
      .get(getUrl, this.options)
      .map(res => res.json().stores as Product[]);
  }

  payTotalDebt(customer_id: number, payment: number): Observable<Customer> {
    const postUrl = `${this.baseUrl}/pay_total_debt/${customer_id}.json`;
    console.log(postUrl);
    return this.http
      .put(postUrl, { payment: payment }, this.options)
      .map(res =>
        _.map(res.json().customers, res1 => {
          const newCustomer = res1.customer as Customer;
          const ordersNotFullyPaid = res1.orders as Order[];
          newCustomer.total_debt = res1.total_debt;
          newCustomer.orders_not_fully_paid = ordersNotFullyPaid;
          return newCustomer;
        })
      );
  }

  payDebt(order_id: string, payment: number): Observable<Order> {
    const postUrl = `${this.baseUrl}/orders/${order_id}.json`;
    return this.http
      .put(postUrl, { payment: payment }, this.options)
      .map(res => res.json().order as Order);
  }

  getDiscountRates(id: number): Observable<any> {
    const getUrl = `${this.baseUrl}/product_discoutedrates.json?id=${id}`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .map(res => res.json().discounted_rates as any);
  }

  getSearchOrder(): Observable<any> {
    const getUrl = `${this.baseUrl}/search-orders.json`;
    return this.http.get(getUrl, this.options)
               .map(res => res.json().orders);
  }

  returnOrder(order_id: string, data: any): Observable<any> {
    const putUrl = `${this.baseUrl}/return-order/${order_id}.json`;
    return this.http.put(putUrl, JSON.stringify(data), this.options)
               .map(res => res.json().order);
  }
}
