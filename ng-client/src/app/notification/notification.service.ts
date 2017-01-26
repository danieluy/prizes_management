import { Injectable } from '@angular/core';
import { Notification } from '../notification/notification.class';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotificationService {

  notifications_source = new Subject<Notification>();
  notifications$ = this.notifications_source.asObservable();

  constructor() { }

  ok(title: string, message?: string, timeOut?: number): void {
    // console.log('OK message');
    // console.log(new Notification('ok', title, message));
    this.notifications_source.next(new Notification('ok', title, message, timeOut));
  }

  alert(title: string, message?: string, timeOut?: number): void {
    // console.log('ALERT message');
    // console.log(new Notification('alert', title, message));
    this.notifications_source.next(new Notification('alert', title, message, timeOut));
  }

  error(title: string, message?: string, timeOut?: number): void {
    // console.log('ERROR message');
    // console.error(new Notification('error', title, message));
    this.notifications_source.next(new Notification('error', title, message, timeOut));
  }

}
