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

  login(userName: string, password: string): Promise<any> {
    return this.http.post(`${Const.APIURL}login`, `userName=${userName}&password=${password}`, { headers: Const.URLENCODED })
      .toPromise()
  }

}
