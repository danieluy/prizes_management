import { Component, OnInit } from '@angular/core';
import { PrizesService } from '../prizes/prizes.service';
import { WinnersService } from '../winners/winners.service';
import { NotificationService } from '../notification/notification.service';
import { Prize } from '../prizes/prize.class';
import { Winner } from '../winners/winner.class';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: [
    '../app.global-styles.css',
    './prizes.component.css'
  ],
  providers: [
    PrizesService,
    WinnersService
  ]
})
export class PrizesComponent implements OnInit {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  General  ////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(private prizesService: PrizesService, private winnersService: WinnersService, private notificationService: NotificationService) { }
  visible_tab: string;
  prizes_list: Prize[];
  prizes_type_list: String[];
  prizes_sponsor_list: String[];
  ngOnInit() {
    this.visible_tab = 'prizesList';
    this.prizesService.prizes$.subscribe(prizes => {
      this.prizes_list = prizes;
      this.prizes_type_list = this.removeDuplicatedString(prizes.map(prize => prize.type).sort())
      this.prizes_sponsor_list = this.removeDuplicatedString(prizes.map(prize => prize.sponsor).sort())
    });
    this.prizesService.fetchPrizes();
    this.winner = new Winner(null, null, null, null, null, null, null, null, null, null, null);
    this.new_prize = new Prize(null, null, null, null, null, null, null, null, null);
  }
  navigateTo(tab: string) {
    this.prizesService.fetchPrizes();
    this.visible_tab = tab;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  New Prize Form  /////////////////////////////////////////////////////////////////////////////////////////
  new_prize: Prize;
  inputDate(event): void { this.new_prize.StrDueDate = event.target.value }
  newPrize() { this.prizesService.newPrize(this.new_prize) }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Prize Grant Form  ///////////////////////////////////////////////////////////////////////////////////////
  winner: Winner;
  prize: Prize;
  displayGrantPrizeForm(prize: Prize, displayGrantPrizeTab: number) { this.prize = prize }
  destroyGrantPrizeForm(event: any) {
    event.preventDefault();
    this.prize = null
  }
  grantPrize() { this.prizesService.grantPrize(this.prize, this.winner) }
  checkWinnerCi(ci: string): void {
    if (this.validateCi(ci)) {
      this.winnersService.checkWinnerCi(ci)
        .subscribe(
        ok => {
          if (ok.allowed && ok.message === 'This person is allowed to participate but has already won')
            this.notificationService.alert('Persona habilitada pero que ya ha ganado');
          else if (ok.allowed)
            this.notificationService.ok('Persona habilitada', "No hay registro de que esta persona haya participado anteriormente");
          else {
            this.prize = null;
            this.notificationService.error('Persona NO hablitada (ganó hace menos de 3 meses)')
          }
        },
        err => this.notificationService.error(err)
        )
    }
  }
  // TODO: Remove this when we're done
  // get inputValues(): any { return JSON.stringify(this.winner, null, 2) };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //  Edit Prize  /////////////////////////////////////////////////////////////////////////////////////////////
  prize_to_edit: Prize;
  displayEditPrizeForm(prize: Prize) { this.prize_to_edit = prize }
  destroyEditPrizeForm(event: any) {
    event.preventDefault();
    this.prize_to_edit = null
  }
  inputNewDate(date): void { this.prize_to_edit.StrDueDate = date }
  editPrize() { this.prizesService.editPrize(this.prize_to_edit) }
  // TODO: Remove this when we're done
  // get editPrizeInputValues(): any { return JSON.stringify(this.prize_to_edit, null, 2) };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  //  Auxiliar  ///////////////////////////////////////////////////////////////////////////////////////////////
  validateCi(ci: string): boolean {
    if (ci.match(/^\d+$/) && ci.length >= 7 && ci.length <= 8) {
      let fixed_ci = ci;
      if (ci.length === 7)
        fixed_ci = '0' + ci;
      let coeffs = [2, 9, 8, 7, 6, 3, 4];
      let sum = 0;
      for (let i = 0; i < coeffs.length; i++) {
        let digit = parseInt(fixed_ci.slice(i, i + 1));
        let coeff = coeffs[i];
        let multiply = ((digit * coeff).toString());
        let toAdd = multiply.slice(multiply.length - 1);
        sum += parseInt(toAdd);
      }
      let verifDig = 10 - (sum % 10);
      if (verifDig === 10)
        verifDig = 0;
      if (verifDig.toString() == fixed_ci.slice(fixed_ci.length - 1))
        return true;
    }
    return false;
  }
  removeDuplicatedString(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      let exists = false;
      let j = 0;
      let regExp = new RegExp(array[i], 'i');
      while (!exists && j < result.length) {
        if (result[j].match(regExp))
          exists = true;
        j++;
      }
      if (!exists)
        result.push(array[i])
    }
    return result;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
