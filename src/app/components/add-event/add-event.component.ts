import { Component, OnInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { EventsService } from '../../services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Moment } from 'moment';
import * as firebase from 'firebase/app';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styles: ['.form-container {display: flex; flex-direction: column;}']
})
export class AddEventComponent implements OnInit, OnDestroy {
  

  subscription: Subscription;
  evenement: Evenement = {inscrits:[]};
  moment: Moment;
  
  constructor(private eventsService: EventsService, private authService: AuthenticationService, private router: Router) { }

  dateRequiredControl = new FormControl('', [
    Validators.required
  ]);

  titreRequiredControl = new FormControl('', [
    Validators.required
  ]);

  urlControl = new FormControl('', [
   Validators.pattern('(https?://){1}([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
  ]);

  ngOnInit() {
    this.subscription = this.authService.userData.subscribe(x => this.evenement.inscrits.push(x.email));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isFormValid() {
    this.titreRequiredControl.markAsTouched();
    this.dateRequiredControl.markAsTouched();
    
    const valid = !this.titreRequiredControl.invalid && !this.dateRequiredControl.invalid 
    && !this.urlControl.invalid;
    return valid;
  }

  add() {
    if (this.isFormValid()) {
      this.evenement.timestamp = firebase.firestore.Timestamp.fromDate(this.moment.toDate());
      this.eventsService.addOne(this.evenement);
      this.router.navigate(['events']);
    }
   
  }

  cancel() {
      this.router.navigate(['events']);
  }
}
