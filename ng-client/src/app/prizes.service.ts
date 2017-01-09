import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from './const.class';
import { Prize } from './prize.class';

@Injectable()
export class PrizesService {

  private prizes_source = new Subject<Prize[]>();
  public prizes$ = this.prizes_source.asObservable();

  constructor(private http: Http) { }

  fetchPrizes() {
    this.http.get(`${Const.APIURL}api/prizes`, { withCredentials: true })
      .map(res => res.json().map(p => new Prize(p.id, p.type, p.sponsor, p.description, p.stock, p.note, p.set_date, p.update_date, p.due_date)))
      .subscribe(prizes => {
        this.prizes_source.next(prizes)
      });
  }

  newPrize(prize: Prize): void {
    this.http.post(`${Const.APIURL}api/prizes`, 'lalala=kokoko', { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json()).subscribe(replay => {
        if (replay.error)
          console.error(replay.error, replay.details)
        else
          this.fetchPrizes();
      })
  }

}
