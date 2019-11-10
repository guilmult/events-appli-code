import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Evenement } from 'src/app/models/evenement';
import { switchMap, map } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styles: []
})
export class DetailEventComponent implements OnInit, OnDestroy {
 

  constructor(private router:Router, private activatedRoute: ActivatedRoute, 
    private eventService: EventsService, private authService: AuthenticationService) { }

  data$: Observable<Evenement>;

  subscription: Subscription;

  event: Evenement;

  currentUserEmail : string;

  ngOnInit() {
    this.data$ = this.activatedRoute.paramMap.pipe(
      switchMap(param => this.eventService.getEventById(param.get('id')))
    )

    this.subscription = combineLatest(this.data$, this.authService.userData,
      (event, userData) => ({event, userData}))
      .subscribe(x => {
          this.event = x.event;
          this.event.isInscrit = x.event.inscrits.lastIndexOf(x.userData.email) > -1;
          this.currentUserEmail = x.userData.email;
      } 
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  back() {
    this.router.navigate(['/events']);
  }

  goToSite() {
    
    window.open(this.event.lienSiteWeb);
    
  }

  inscription() {
    this.event.inscrits.push(this.currentUserEmail);
    this.eventService.update(this.event);
    this.event.isInscrit = true;
  }

  desinscription() {
    this.event.inscrits = this.event.inscrits.filter(x => x !== this.currentUserEmail);
    this.eventService.update(this.event);
    this.event.isInscrit = false;
  }
}
