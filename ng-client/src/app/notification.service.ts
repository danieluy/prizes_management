import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor() { }

  alert(message: string): void {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }

}
