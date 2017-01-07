import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WinnersComponent } from './winners/winners.component';
import { PrizesComponent } from './prizes/prizes.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { PrizesGrantingComponent } from './prizes-granting/prizes-granting.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WinnersComponent,
    PrizesComponent,
    UsersComponent,
    UserFormComponent,
    PrizesGrantingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'winners', component: WinnersComponent },
      { path: 'prizes', component: PrizesComponent },
      { path: 'users', component: UsersComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
