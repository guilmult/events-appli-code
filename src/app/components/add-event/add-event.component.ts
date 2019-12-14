import { Component, OnInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { EventsService } from '../../services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { Moment } from 'moment';
import * as firebase from 'firebase/app';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styles: []
})
export class AddEventComponent implements OnInit, OnDestroy {
  

  subscriptions: Subscription[] = [];
  
  currentUserEmail: string;

  groupId: string;
  
  constructor(private eventsService: EventsService, 
    private authService: AuthenticationService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) {
    }
  
    
  
 
  ngOnInit() {
    this.subscriptions.push(this.authService.userData.subscribe(x => this.currentUserEmail = x.email));
    this.subscriptions.push(
      this.activatedRoute.paramMap.pipe(
        map(param => param.get('groupId')))
        .subscribe(x => this.groupId = x)
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  add($event) {
 
    let event = {
      creator: this.currentUserEmail,
      creationDate: new Date(),
      ...$event
    }
   
    this.eventsService.addOne(event, this.groupId)
    .then(x => this.eventsService.addInscrit(x.id, this.currentUserEmail, this.groupId)
    .then(() => this.navigateToListEvents()));
  }
  
    

  navigateToListEvents() {
    if(this.groupId) {
      this.router.navigate(['/app/groups/' + this.groupId + '/events']);
    } else {
      this.router.navigate(['/app/events']);
    }
  }
}
