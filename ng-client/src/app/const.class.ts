
import { Headers, RequestOptions } from '@angular/http';

export class Const {

  constructor() { }

  // public static APIURL: string = 'http://localhost:1043/';
  public static APIURL: string = `http://${window.location.hostname}:1043/`;



  public static HEADERS: any = {
    json: () => {
      let header: Headers = new Headers({ 'Content-Type': 'application/json' });
      // header.append('withCredentials', 'true')
      return header;
    },
    urlencoded: () => {
      let header: Headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      // header.append('withCredentials', 'true')
      return header;
    }
  }

  public static WINNING_MIN_PERIOD = 6;

}