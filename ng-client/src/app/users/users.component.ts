import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user.class';

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

}
