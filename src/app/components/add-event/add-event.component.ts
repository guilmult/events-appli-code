import { Component, OnInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { EventsService } from '../../services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Moment } from 'moment';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styles: ['.form-container {display: flex; flex-direction: column;}']
})
export class AddEventComponent implements OnInit, OnDestroy {
  

  subscription: Subscription;
  evenement: Evenement = {titre:'', inscrits:[]};
  moment: Moment;
  
  constructor(private eventsService: EventsService, private authService: AuthenticationService, private router: Router) { }

  

  ngOnInit() {
    this.subscription = this.authService.userData.subscribe(x => this.evenement.inscrits.push(x.email));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  add() {
    this.evenement.timestamp = firebase.firestore.Timestamp.fromDate(this.moment.toDate());
    this.eventsService.addOne(this.evenement);
    this.router.navigate(['events']);
  }

  cancel() {
      this.router.navigate(['events']);
  }
}
