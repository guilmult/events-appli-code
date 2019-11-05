import { Component, OnInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { EventsService } from '../../services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.scss']
})
export class AddEventDialogComponent implements OnInit, OnDestroy {
  

  subscription: Subscription;
  evenement: Evenement = {titre:'', description:'', inscrits:[]};
  
  constructor(private eventsService: EventsService, private authService: AuthenticationService) { }

  

  ngOnInit() {
    this.subscription = this.authService.userData.subscribe(x => this.evenement.inscrits.push(x.email));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  add() {
      this.eventsService.addOne(this.evenement)
  }
}
