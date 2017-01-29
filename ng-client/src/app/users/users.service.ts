import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from '../const.class';
import { User } from './user.class';

import { NotificationService } from '../notification/notification.service';


@Injectable()
export class UsersService {

  private users_source = new Subject<User[]>();
  public users$ = this.users_source.asObservable();

  constructor(private http: Http, private notificationService: NotificationService) { }

  fetchUsers() {
    this.http.get(`${Const.APIURL}api/users`, { withCredentials: true })
      .map(res => res.json().map(u => new User(u.id, u.userName, u.email, u.set_date, u.role)))
      .subscribe(
      users => this.users_source.next(users),
      error => this.notificationService.error("Error descargando los usuarios", "Debes iniciar sesión para ver esta información")
      );
  }

  newUser(user: User): Observable<any> {
    return this.http.post(`${Const.APIURL}api/users`, `name=${user.name}&password=${user.password}&role=${user.role}&email=${user.email}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }

}