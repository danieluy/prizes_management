import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { NotificationService } from '../notification.service';

import { User } from '../user.class';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: [
    './login-form.component.css',
    '../app.global-styles.css'
  ],
  providers: [
    LoginService,
    NotificationService
  ]
})
export class LoginFormComponent implements OnInit {

  constructor(private loginService: LoginService, private notif: NotificationService) { }

  private userName: string = '';
  private password: string = '';
  private submitted = false;

  ngOnInit() {
    this.loginService.login$.subscribe(user => {
      if(user)
        this.notif.alert(`${user.userName} ha iniciado sesión con privilegios de ${user.role}`);
      else
        this.notif.error('Usuario o contraseña incorrectos');
    })
  }

  login(): void {
    this.loginService.login(this.userName, this.password);
  }

  onSubmit() { this.submitted = true; }

}
