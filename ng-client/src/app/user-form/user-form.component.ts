import { Component } from '@angular/core';
import { User } from '../user.class';
import { UsersService } from '../users.service';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: [
    './user-form.component.css',
    '../app.global-styles.css'
  ],
  providers: [
    UsersService
  ]
})
export class UserFormComponent {

  constructor(private usersService: UsersService) { }

  user = new User(null, null, null, null, null);
  submitted = false;
  
  newUser(){
    this.usersService.newUser(this.user)
  }
  
  onSubmit() { this.submitted = true; }

  // TODO: Remove this when we're done
  // get diagnostic() { return JSON.stringify(this.user, null, 2) }

}
