import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WinnersComponent } from './winners/winners.component';
import { PrizesComponent } from './prizes/prizes.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';
import { EqualValidatorDirective } from './equal-validator.directive';
import { CookieService } from 'angular2-cookie/services/cookies.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WinnersComponent,
    PrizesComponent,
    UsersComponent,
    LoginComponent,
    NotificationComponent,
    EqualValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'winners', component: WinnersComponent },
      { path: 'prizes', component: PrizesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'login', component: LoginComponent }
    ])
  ],
  providers: [
    CookieService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
