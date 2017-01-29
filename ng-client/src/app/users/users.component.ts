import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.class';
import { NotificationService } from '../notification/notification.service';

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

  constructor(private usersService: UsersService, private notificationService: NotificationService) { }

  private visible_tab: string;
  private users_list: User[];

  ngOnInit() {
    this.visible_tab = 'usersList';
    this.usersService.users$.subscribe(users => { this.users_list = users })
    this.usersService.fetchUsers();
  }

  navigateTo(tab: string) {
    this.usersService.fetchUsers();
    this.visible_tab = tab;
  }

  //  New user Form  //////////////////////////////////////////////////////////
  private user = new User(null, null, null, null, null);
  private submitted = false;
  newUser(event?: any) {
    if(event)
      event.preventDefault();
    this.usersService.newUser(this.user)
      .subscribe(
      res => {
        this.usersService.fetchUsers();
        this.notificationService.ok("Exito", "El usuario se ha creado correctamente", 3000);
      },
      error => this.notificationService.error("Error, el usuario NO ha sido creado", error.json().error)
      );
  }
  onSubmit() { this.submitted = true; }
}
