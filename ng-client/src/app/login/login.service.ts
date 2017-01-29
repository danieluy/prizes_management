import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { NotificationService } from '../notification/notification.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Const } from '../const.class';

@Injectable()
export class LoginService {

  constructor(private http: Http, private notificationService: NotificationService, private cookieService: CookieService) { }

  private login_source = new Subject<any>();
  public login$ = this.login_source.asObservable();

  login(userName: string, password: string): any {
    return this.http.post(`${Const.APIURL}login`, `userName=${userName}&password=${password}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
      .subscribe(
      res => {
        if (res.error)
          this.notificationService.alert("Error", "Usuario y/o contraseña incorrectos", 6000);
        else {
          this.notificationService.ok("Bienvenido", `Haz iniciado sesión como ${res.user.userName} con privilegios de ${res.user.role}`, 3000)
          this.login_source.next({ userName: res.user.userName, role: res.user.role });
          let expirationDate = new Date(Date.now() + (4 * 60 * 60 * 1000)); // four hours
          this.cookieService.putObject('user', { userName: res.user.userName, role: res.user.role }, { expires: expirationDate });
        }
      },
      error => this.notificationService.error("Ocurrió un error", error.json().details)
      );
  }

  logout() {
    return this.http.post(`${Const.APIURL}logout`, '', { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .subscribe(res => {
        let json_res = JSON.parse(res.text());
        if (json_res.error)
          console.error(json_res.error);
        else {
          this.login_source.next(null);
          this.cookieService.removeAll();
        }
        window.location.pathname = '/';
      }, error => {
        console.error(error);
      })
  }
}
