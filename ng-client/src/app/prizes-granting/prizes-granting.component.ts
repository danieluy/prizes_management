import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Prize } from '../prize.class';

@Component({
  selector: 'grant-prize-tab',
  templateUrl: './prizes-granting.component.html',
  styleUrls: [
    '../app.global-styles.css',
    './prizes-granting.component.css'
  ]
})
export class PrizesGrantingComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() prize: Prize;

  ngOnInit() {
  }

  ngAfterViewInit(){
    
  }

  cancel(){
    this.prize = null;
  }

}
