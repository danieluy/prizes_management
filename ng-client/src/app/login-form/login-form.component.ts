import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: [
    './login-form.component.css',
    '../app.global-styles.css'
  ],
  providers: [
    LoginService
  ]
})
export class LoginFormComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  private userName: string = '';
  private password: string = '';
  private submitted = false;

  ngOnInit() {
  }

  login(): void {
    this.loginService.login(this.userName, this.password)
      .then(res => { console.log(res) })
  }

  onSubmit() { this.submitted = true; }

}
