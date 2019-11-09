import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Evenement } from 'src/app/models/evenement';
import { switchMap, map } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';


@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styleUrls: ['./detail-event.component.scss']
})
export class DetailEventComponent implements OnInit, OnDestroy {
 

  constructor(private router:Router, private activatedRoute: ActivatedRoute, private eventService: EventsService) { }

  data$: Observable<Evenement>;

  subscription: Subscription;

  event: Evenement;

  ngOnInit() {
    this.data$ = this.activatedRoute.paramMap.pipe(
      switchMap(param => this.eventService.getEventById(param.get('id')))
    )

    this.subscription = this.data$.subscribe(x => this.event = x);
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
}
