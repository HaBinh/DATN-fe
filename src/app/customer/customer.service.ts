import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

import { environment } from '../../environments/environment';
import { Angular2TokenService } from 'angular2-token';
import { Customer } from './customer.model';
import { Order } from '../shared/customers-in-debt/order-debt.model';
import * as _ from 'lodash';

export interface ICustomersTotal {
  customers: Customer[];
  total: number;
}

@Injectable()
export class CustomerService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private url = `${environment.token_auth_config.apiBase}/customers`;

  private headers = this.authService.currentAuthHeaders;

  constructor(private http: Http, private authService: Angular2TokenService) {
    // this.options.headers = this.authService.currentAuthHeaders;
  }

  getCustomers(): Promise<Response> {
    const getUrl = `${this.url}.json`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(this.handleError);
  }

  getCustomersWithPage(page: number, per_page: number, search_text: string): Observable<ICustomersTotal> {
    const url = `${this.url}.json?page=${page}&search_text=${search_text}&per_page=${per_page}`;
    return this.http.get(url, { headers: this.headers })
               .map(res => res.json() as ICustomersTotal);
  }

  getCustomersWithObservable(): Observable<Customer[]> {
    const getUrl = `${this.url}.json`;
    return this.http
      .get(getUrl, { headers: this.headers })
      .map(res => res.json().customers as Customer[]);
  }

  deleteCustomer(customer: Customer): Promise<any> {
    const deleteUrl = `${this.url}/${customer.id}.json`;
    return this.http
      .delete(deleteUrl, { headers: this.headers })
      .map(res => res.json())
      .toPromise()
      .catch(this.handleError);
  }

  updateCustomer(customer: Customer, id: number): Observable<any> {
    const params: string = [
      `name=${customer.name}`,
      `email=${customer.email}`,
      `phone=${customer.phone}`,
      `address=${customer.address}`,
      `level=${customer.level}`
    ].join("&");
    const updateUrl = `${this.url}/${id}.json?${params}`;
    return this.http
      .put(updateUrl, {}, { headers: this.headers })
      .map(res => res.json().customer as any);
  }

  addCustomer(value: any, selectedValue: number): Observable<Customer> {
    const params: string = [
      `name=${value.name}`,
      `email=${value.email}`,
      `phone=${value.phone}`,
      `address=${value.address}`,
      `level=${selectedValue}`
    ].join("&");
    const addUrl = `${this.url}.json?${params}`;
     return this.http
       .post(addUrl, JSON.stringify(value), { headers: this.headers })
       .map(res => res.json().customer as Customer);
  }

  getCustomersInDebt(): Observable<Customer[]> {
    const url = `${this.baseUrl}/customers_in_debt.json`;
    return this.http.get(url, { headers: this.headers }).map(res =>
      _.map(res.json().customers, res => {
        const newCustomer = res.customer as Customer;
        const ordersNotFullyPaid = res.orders as Order[];
        newCustomer.total_debt = res.total_debt;
        newCustomer.orders_not_fully_paid = ordersNotFullyPaid;
        return newCustomer;
      })
    );
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
