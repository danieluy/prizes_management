import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from './const.class';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  private login_source = new Subject<any>();
  public login$ = this.login_source.asObservable();

  login(userName: string, password: string): any {
    return this.http.post(`${Const.APIURL}login`, `userName=${userName}&password=${password}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .subscribe(res => {
        let json_res = JSON.parse(res.text());
        if (json_res.error)
          console.error(json_res.error);
        else
          this.login_source.next(json_res.user)
        window.location.pathname = '/winners';
      }, error => {
        this.login_source.next(null)
      })
  }

  logout() {
    return this.http.post(`${Const.APIURL}logout`, '', { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .subscribe(res => {
        let json_res = JSON.parse(res.text());
        if (json_res.error)
          console.error(json_res.error);
        else
          this.login_source.next(null)
        window.location.pathname = '/';
      }, error => {
          console.error(error);
      })
  }
}
