import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
    './roboto-font.css',
    './material-icons.css'
  ]
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit(){
  }

  title = 'Radiocero Premios';
}