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

  groupId: string;

  editionMode: boolean = false;

  canEdit: boolean = false;

  @ViewChildren(CdkScrollable) cdkScrollable;

  ngOnInit() {
    
    this.subscription.push(this.activatedRoute.paramMap.subscribe(param => this.groupId = param.get('groupId')));
    
    
    this.data$ = this.activatedRoute.paramMap.pipe(
      switchMap(param => this.eventService.getEventById(param.get('id'), param.get('groupId')), 
      (param, event) => {event.groupId = param.get('groupId'); event.date = event.date.toDate(); return event}),
      switchMap(event => this.eventService.getAllInscrits(event.id, event.groupId),
      (event, inscrits) => ({...event, inscrits}))
    )

    this.comments$ = this.activatedRoute.paramMap.pipe(
      switchMap(param => this.eventService.getCommentsByEventId(param.get('id'), param.get('groupId'))),
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
          this.canEdit = x.event.creator === x.userData.email;
      } 
    ));

  }

  ngOnDestroy(): void {
    this.subscription.forEach(x=> x.unsubscribe());
  }

  back() {
    if (this.groupId) {
      this.router.navigate(['/app/groups/' + this.groupId + '/events' ]);
    } else {
      this.router.navigate(['/app/events']);
    }
    
  }

  goToSite() {
    
    window.open(this.event.lienSiteWeb);
    
  }

  inscription() {
    this.eventService.addInscrit(this.event.id, this.currentUserEmail, this.groupId);
  }

  desinscription() {
    this.eventService.removeInscrit(this.event.id, this.currentUserEmail, this.groupId)
  }

  addComment() {
    this.eventService.addComment(this.commentaire, this.currentUserEmail, this.event.id, this.groupId);
    this.commentaire = '';
    setTimeout( () => { this.cdkScrollable.first.scrollTo({bottom: 0}) }, 200);
  }

  openComments() {
    this.subscription.push(this.comments$.subscribe({next: () => setTimeout( () => { this.cdkScrollable.first.scrollTo({bottom: 0}) }, 200) }));
    this.cdkScrollable.first.scrollTo({bottom: 0})
  }

  switchEditMode() {
    this.editionMode = true;
  }

  updateEvent($event) {
    
    this.event = {...this.event, ...$event};
    this.eventService.update(this.event, this.groupId);
    this.editionMode = false;
  }

  cancelUpdate() {
    this.editionMode = false;
  }
}
