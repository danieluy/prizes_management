
import { Component, OnInit } from '@angular/core';
import { Notification } from '../notification/notification.class';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private notificationService: NotificationService) {
    if (!this.notif_stack)
      this.notif_stack = [];
    if (!this.time_out_stack)
      this.time_out_stack = {};
  }

  notif_stack: Array<Notification>;
  time_out_stack: Object;

  ngOnInit() {
    this.notificationService.notifications$
      .subscribe(
      notif => {
        this.addNotification(notif)
      },
      error => console.error(error)
      )
    // this.notif_stack = [
    //   new Notification('ok', 'Todo bien :)', 'Contenido del mensaje, por ahora no importa lo que diga...'),
    //   new Notification('alert', 'Todo mas o menos :\\', 'Contenido del mensaje, por ahora no importa lo que diga...'),
    //   new Notification('error', 'Todo mal :(', 'Contenido del mensaje, por ahora no importa lo que diga...')
    // ]
  }

  addNotification(notif: Notification) {
    this.notif_stack.push(notif)
    if (notif.timeOut) {
      let interval = this.setNotifInterval(notif);
      setTimeout((interval) => {
        clearInterval(interval);
        this.dismissNotif(this.notif_stack.indexOf(notif));
      }, notif.timeOut);
    }
  }

  setNotifInterval(notif: Notification){
    return setInterval(() => notif.timer--, 1000);
  }

  dismissNotif(i: number) {
    this.notif_stack.splice(i, 1);
  }

}