import { Component, OnInit } from '@angular/core';
import { Prize } from '../prize.class';
import { PrizesService } from '../prizes.service';

@Component({
  selector: 'new-prize-form',
  templateUrl: './new-prize-form.component.html',
  styleUrls: [
    './new-prize-form.component.css',
    '../app.global-styles.css'
  ],
  providers: [
    PrizesService
  ]
})
export class NewPrizeFormComponent implements OnInit {

  constructor(private prizesService: PrizesService) { }

  private prize = new Prize(null, null, null, null, null, null, null, null, null);

  ngOnInit() {
  }

  inputDate(e): void {
    this.prize.StrDueDate = e.target.value;
  }

  newPrize(){
    this.prizesService.newPrize(this.prize);
  }

}
