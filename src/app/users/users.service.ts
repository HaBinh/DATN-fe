import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { environment } from '../../environments/environment';
import { Angular2TokenService } from 'angular2-token';

import { User } from './index';
import "rxjs/add/operator/publishReplay";
import { ConnectableObservable } from 'rxjs/Rx';


@Injectable()
export class UsersService {
  private baseUrl = `${environment.token_auth_config.apiBase}`;
  private headers: Headers;
  private options: RequestOptions;

  constructor(
    private http: Http,
    private authService: Angular2TokenService) {
      this.headers = this.authService.currentAuthHeaders;
      this.headers.append('Content-Type', 'application/json');
      this.options = new RequestOptions({ headers: this.headers });
    }

    getUsers(): Observable<User[]> {
      const getUrl = `${this.baseUrl}/users.json`;
      const obs$: ConnectableObservable<User[]> =  this.http.get(getUrl, this.options)
                 .map(res => res.json().users as User[])
                 .publishReplay();
      obs$.connect();
      return obs$;
    }

    addUser(value): Observable<User> {
      const params: string = [
      `email=${value.email}`,
      `name=${value.name}`,
      `password=${value.password}`,
      `password_confirmation=${value.password_confirmation}`,
      `role=${value.role}`
    ].join('&');
      const postUrl = `${this.baseUrl}/auth.json?${params}`;
      console.log(value);
      return this.http.post(postUrl, null, this.options)
                 .map(res => res.json().data as User);
    }

    updateUser(value: any): Observable<User> {
      const putUrl = `${this.baseUrl}/users/${value.id}.json`;
      console.log(putUrl);
      return this.http.put(putUrl, JSON.stringify(value), this.options)
                 .map(res => res.json().data as User);
    }

    removeUser(id: string): Observable<Response> {
      const deleteUrl = `${this.baseUrl}/users/${id}.json`;
      return this.http.delete(deleteUrl, this.options);
    }
}
