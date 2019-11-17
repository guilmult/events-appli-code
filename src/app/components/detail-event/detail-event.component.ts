import { Component, OnInit, OnDestroy, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Evenement } from 'src/app/models/evenement';
import { switchMap, map } from 'rxjs/operators';
import { EventsService } from 'src/app/services/events.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Commentaire } from 'src/app/models/commentaire';
import { CdkScrollable} from '@angular/cdk/scrolling';


@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.component.html',
  styleUrls: ['./detail-event.component.scss']
})
export class DetailEventComponent implements OnInit, OnDestroy {
 
 

  constructor(private router:Router, private activatedRoute: ActivatedRoute, 
    private eventService: EventsService, private authService: AuthenticationService
    ) { }

  data$: Observable<Evenement>;

  subscription: Subscription[] = [];

  event: Evenement;

  currentUserEmail : string;

  commentaire: string = '';

  comments$: Observable<Commentaire[]>;

  @ViewChildren(CdkScrollable) cdkScrollable;

  ngOnInit() {
    this.data$ = this.activatedRoute.paramMap.pipe(
      switchMap(param => this.eventService.getEventById(param.get('id')))
    )

    this.comments$ = this.activatedRoute.paramMap.pipe(
      switchMap(param => this.eventService.getCommentsByEventId(param.get('id'))),
      map(x => {
        x.forEach(y=> y.date = (y.date as firebase.firestore.Timestamp).toDate());
        return x;
      }),
      map(x => x.sort((a, b) => a.date.getTime() - b.date.getTime()))
    )

    this.subscription.push(combineLatest(this.data$, this.authService.userData,
      (event, userData) => ({event, userData}))
      .subscribe(x => {
          this.event = x.event;
          this.event.isInscrit = x.event.inscrits.lastIndexOf(x.userData.email) > -1;
          this.currentUserEmail = x.userData.email;
      } 
    ));

  }

  ngOnDestroy(): void {
    this.subscription.forEach(x=> x.unsubscribe());
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

  addComment() {
    this.eventService.addComment(this.commentaire, this.currentUserEmail, this.event.id);
    this.commentaire = '';
    setTimeout( () => { this.cdkScrollable.first.scrollTo({bottom: 0}) }, 200);
  }

  openComments() {
    this.subscription.push(this.comments$.subscribe({next: () => setTimeout( () => { this.cdkScrollable.first.scrollTo({bottom: 0}) }, 200) }));
    this.cdkScrollable.first.scrollTo({bottom: 0})
  }
}
