import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../app.global-styles.css',
    './login.component.css'
  ]
})
export class LoginComponent {

  constructor(private loginService: LoginService) { }

  private userName: string = '';
  private password: string = '';
  private submitted = false;

  login(): void {
    this.loginService.login(this.userName, this.password);
  }

  onSubmit() { this.submitted = true; }

}