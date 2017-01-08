
import { Headers } from '@angular/http';

export class Const {

  public static APIURL: string = 'http://localhost:1043/';
  public static HEADERS: Headers = new Headers({ 'Content-Type': 'application/json' });
  public static URLENCODED: Headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  constructor() { }

}