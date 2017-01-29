import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from '../const.class';
import { Winner } from './winner.class';

import { NotificationService } from '../notification/notification.service';

@Injectable()
export class WinnersService {

  private winners_source = new Subject<Winner[]>();
  public winners$ = this.winners_source.asObservable();

  constructor(private http: Http, private notificationService: NotificationService) { }

  fetchWinners() {
    this.http.get(`${Const.APIURL}api/winners`, { withCredentials: true })
      .map(res => res.json()
        .map(w => new Winner(w.id, w.ci, w.name, w.lastname, w.facebook, w.gender, w.phone, w.mail, w.prizes, w.set_date, w.update_date))
      )
      .subscribe(
      winners => this.winners_source.next(winners),
      error => this.notificationService.error("Error descargando los ganadores", "Debes iniciar sesión para ver esta información")
      );
  }

  handOverPrize(winner_ci: string, prize_id: string): Observable<any> {
    return this.http.post(`${Const.APIURL}api/winners/handprize`, `winner_ci=${winner_ci}&prize_id=${prize_id}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }

  checkWinnerCi(ci: string): any {
    return this.http.post(`${Const.APIURL}api/winners/checkwinner`, `ci=${ci}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }

}
