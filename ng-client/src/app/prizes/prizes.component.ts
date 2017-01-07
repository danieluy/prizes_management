import { Component, OnInit } from '@angular/core';
import { PrizesService } from '../prizes.service';
import { Prize } from '../prize.class';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: [
    '../app.global-styles.css',
    './prizes.component.css'
  ],
  providers: [
    PrizesService
  ]
})
export class PrizesComponent implements OnInit {

  constructor(private prizesService: PrizesService) { }

  private visible_tab: string;
  private prizes_list: Prize[];
  private prize_to_grant: Prize;

  ngOnInit() {
    this.visible_tab = 'prizesList';
    this.prizesService.prizes$.subscribe(prizes => { this.prizes_list = prizes });
    this.prizesService.fetchPrizes();
  }

  navigateTo(tab: string) {
    this.prizesService.fetchPrizes();
    this.visible_tab = tab;
  }

  displayGrantPrizeTab(prize: Prize, displayGrantPrizeTab: number) {
    this.prize_to_grant = prize;
  }

}
