import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from './const.class';
import { User } from './user.class';


@Injectable()
export class UsersService {

  private users_source = new Subject<User[]>();
  public users$ = this.users_source.asObservable();

  constructor(private http: Http) { }

  fetchUsers() {
    this.http.get(`${Const.APIURL}api/users`)
      .map(res => res.json().map(u => new User(u.id, u.userName, u.email, u.set_date, u.role)))
      .subscribe(users => { this.users_source.next(users) });
  }

  newUser(user: User): any {
    this.http.put(`${Const.APIURL}json/users`, JSON.stringify(user), { headers: Const.HEADERS })
      .map(res => res.json()).subscribe(replay => {
        if (replay.error)
          console.error(replay.error, replay.details)
        else
          this.fetchUsers(); // TODO find out why the users list is not updated en user creation
      })
  }

}
