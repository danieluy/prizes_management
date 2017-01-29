import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { NotificationService } from './notification/notification.service';
import { User } from './users/user.class';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { enableProdMode } from '@angular/core';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    './roboto-font.css',
    './material-icons.css'
  ],
  providers: [
    LoginService
  ]
})
export class AppComponent implements OnInit {

  constructor(private loginService: LoginService, private notificationService: NotificationService, private cookieService: CookieService) { }

  user: Object;

  ngOnInit() {
    this.loginService.login$.subscribe(user => { this.user = user });
    let user = this.cookieService.getObject('user');
    this.user = user ? user : undefined;
  }

  logout(): void {
    this.loginService.logout();
    this.user = undefined;
  }

  title = 'Radiocero Premios';
}
