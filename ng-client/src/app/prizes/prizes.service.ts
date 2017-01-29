import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Const } from '../const.class';
import { Prize } from './prize.class';
import { Winner } from '../winners/winner.class';

import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PrizesService {

  prizes_source = new Subject<Prize[]>();
  prizes$ = this.prizes_source.asObservable();

  constructor(private http: Http, private notificationService: NotificationService) { }

  fetchPrizes(): void {
    this.http.get(`${Const.APIURL}api/prizes`, { withCredentials: true })
      .map(res => res.json().map(p => new Prize(p.id, p.type, p.sponsor, p.description, p.stock, p.note, p.set_date, p.update_date, p.due_date)))
      .subscribe(
      prizes => this.prizes_source.next(prizes),
      error => this.notificationService.error("Error descargando los premios", "Debes iniciar sesión para ver esta información")
      );
  }

  newPrize(prize: Prize): Observable<any> {
    return this.http.post(`${Const.APIURL}api/prizes`, `type=${prize.Type}&sponsor=${prize.Sponsor}&description=${prize.Description}&stock=${prize.Stock}&due_date=${prize.StrDueDateToPost}&note=${prize.Note}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }

  editPrize(prize: Prize): Observable<any> {
    return this.http.post(`${Const.APIURL}api/prizes/edit`, `id=${prize.id}&type=${prize.type}&sponsor=${prize.sponsor}&description=${prize.description}&stock=${prize.stock}&due_date=${prize.StrDueDateToPost}&note=${prize.note}`, { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }

  grantPrize(prize: Prize, winner: Winner): Observable<any> {
    return this.http.post(`${Const.APIURL}api/grantprize`, this.grantPrizeFormatParameters(prize, winner), { headers: Const.HEADERS.urlencoded(), withCredentials: true })
      .map(res => res.json())
  }

  grantPrizeFormatParameters(prize: Prize, winner: Winner) {
    let params: string = `prize_id=${prize.Id}&ci=${winner.CiRaw}&name=${winner.name}&lastname=${winner.lastname}`;
    if (winner.facebook) params += `&facebook=${winner.facebook}`;
    if (winner.GenderRaw) params += `&gender=${winner.GenderRaw}`;
    if (winner.phone) params += `&phone=${winner.phone}`;
    if (winner.mail) params += `&mail=${winner.mail}`;
    return params;
  }

}
