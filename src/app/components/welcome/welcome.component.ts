import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { Evenement } from 'src/app/models/evenement';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
}
