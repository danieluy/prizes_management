import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.class';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: [
    '../app.global-styles.css',
    './users.component.css'
  ],
  providers: [
    UsersService
  ]
})
export class UsersComponent implements OnInit {

  constructor(private usersService: UsersService) { }

  private visible_tab: string;
  private users_list: User[];

  ngOnInit() {
    this.visible_tab = 'usersList';
    this.usersService.users$.subscribe(users => { this.users_list = users })
    this.usersService.fetchUsers();
  }

  navigateTo(tab: string) {
    this.usersService.fetchUsers(); // TODO find out why the users list is not updated en user creation
    this.visible_tab = tab;
  }

  //  New user Form  //////////////////////////////////////////////////////////
  private user = new User(null, null, null, null, null);
  private submitted = false;
  newUser() { this.usersService.newUser(this.user) }
  onSubmit() { this.submitted = true; }
  // TODO: Remove this when we're done
  get inputValues() { return JSON.stringify(this.user, null, 2) }
}
