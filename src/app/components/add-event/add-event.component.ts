import { Component, OnInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { EventsService } from '../../services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Moment } from 'moment';
import * as firebase from 'firebase/app';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styles: ['.form-container {display: flex; flex-direction: column;}']
})
export class AddEventComponent implements OnInit, OnDestroy {
  

  subscription: Subscription;
  
  checkoutForm: FormGroup;

  currentUserEmail: string;
  
  constructor(private eventsService: EventsService, private authService: AuthenticationService, 
    private router: Router, private formBuilder: FormBuilder) {
      this.checkoutForm = this.formBuilder
      .group({
        titre:[null, Validators.required], 
        description:'', 
        date:['', Validators.required], 
        lienSiteWeb:['', Validators.pattern('(https?://){1}([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
     })
    }
  
    
    get f() { return this.checkoutForm.controls; }
 
  ngOnInit() {
    this.subscription = this.authService.userData.subscribe(x => this.currentUserEmail = x.email);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  
  add(formValue) {
    
    if (this.checkoutForm.invalid) {
      return;
    }

    formValue.date = formValue.date.toDate();

    let event: Evenement = {
      creator: this.currentUserEmail,
      creationDate: new Date(),
      inscrits:[this.currentUserEmail],
      ...formValue
    }
    this.eventsService.addOne(event);
    this.router.navigate(['events']);
   
  }

  cancel() {
      this.router.navigate(['events']);
  }
}
