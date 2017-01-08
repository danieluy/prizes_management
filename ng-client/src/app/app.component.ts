import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    './roboto-font.css',
    './material-icons.css'
  ],
  providers:[
    LoginService,
    NotificationService
  ]
})
export class AppComponent implements OnInit {

  constructor(private loginService: LoginService, private notif: NotificationService) { }

  ngOnInit() {
    this.loginService.login$.subscribe(user => {
      if(user)
        this.notif.error('Ha ocurrido un error cerrando la sesión');
      else
        this.notif.alert('La sesión se ha cerrado correctamente');
    })
  }

  logout(): void {
    this.loginService.logout();
  }

  title = 'Radiocero Premios';
}
