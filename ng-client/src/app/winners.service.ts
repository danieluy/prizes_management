import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from './const.class';
import { Winner } from './winner.class';

@Injectable()
export class WinnersService {

  private winners_source = new Subject<Winner[]>();
  public winners$ = this.winners_source.asObservable();

  constructor(private http: Http) { }

  fetchWinners() {
    this.http.get(`${Const.APIURL}api/winners`)
      .map(res => res.json()
        .map(w => new Winner(w.id, w.ci, w.name, w.lastname, w.facebook, w.gender, w.phone, w.mail, w.prizes, w.set_date, w.update_date))
      )
      .subscribe(winners => { this.winners_source.next(winners) });
  }

  handOverPrize(winner_ci: string, prize_id: string) {
    this.http.post(`${Const.APIURL}json/winners/handprize`, { winner_ci: winner_ci, prize_id: prize_id })
      .subscribe(response => {
        let json_res = response.json();
        if(json_res.error)
          console.error(json_res.error, json_res.details);
        else
          console.log(json_res.message);
      })
  }

}
