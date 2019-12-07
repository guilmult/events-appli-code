import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from '../../services/events.service';
import { Subscription, combineLatest, from } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, sequence, state } from '@angular/animations';
import { map, debounceTime, switchMap, filter, tap, mergeMap, toArray, scan, take, takeUntil } from 'rxjs/operators';
import { GroupsService } from 'src/app/services/groups.service';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styles: ['table {width: 100%; margin: 5px;}',
           '.inscrit-highlight {background-color: #ffd740}'],
  animations: [
    trigger('newRow', [
      state('newEvent', style({backgroundColor : 'green'})),
      state('oldEvent', style({})),
      transition('newEvent => oldEvent', [
        animate('1s')
      ])
    ])
  ] 
})
export class EventsListComponent implements OnInit, OnDestroy {
  

  constructor(public dialog: MatDialog, 
    private eventsService: EventsService, 
    private authService: AuthenticationService, 
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupsService) { }
  
  displayedColumns: string[] = [ 'date', 'titre', 'actions'];
  dataSource: MatTableDataSource<Evenement> ;
  
  subscriptions: Subscription[] = [];

  currentUserEmail: string;

  filterInscritActivated: boolean = false;

  groupId: string;
  groupName: string = "";

  @ViewChild(MatSort, {static: true}) sort: MatSort;


  ngOnInit() {
   this.subscriptions.push(
    this.activatedRoute.paramMap.pipe(
     map(param => param.get('groupId')),
     filter(x => x !== null),
     switchMap(x => this.groupService.getGroup(x)),
     map(x => {
       this.groupId = x.id;
       this.groupName = x.name;
     })
    ).subscribe()
   );

   this.populateDatatable(false);
   this.sort.direction = 'asc';  
   this.sort.active = 'date';
   
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 


  populateDatatable(filterInscrit: boolean) {
    this.filterInscritActivated = filterInscrit;
    this.subscriptions.push(
      combineLatest(
        this.activatedRoute.paramMap.pipe(
          switchMap(param => this.eventsService.getAllEvenements(param.get('groupId')), 
          (param, events)=> {events.forEach(x => x.groupId=param.get('groupId')); return events;}),
          switchMap(events => from(events).pipe(
            mergeMap(event => this.eventsService.getAllInscrits(event.id, event.groupId),
            (event, inscrits) => ({...event, inscrits})),
            take(events.length),
            toArray()
          ))
        ),
        this.authService.userData,
        (events, userData) => ({events, userData})
       )
      .pipe(map(x => {
        x.events = x.events.filter(x => (x.date as firebase.firestore.Timestamp).toDate().getTime() >= this.getTodayAtMidnight())
        x.events.forEach(y => {
          y.isInscrit = y.inscrits.lastIndexOf(x.userData.email) > -1; 
          y.date = (y.date as firebase.firestore.Timestamp).toDate();
        });
        
        this.dataSource= new MatTableDataSource(filterInscrit ? x.events.filter(z => z.inscrits.lastIndexOf(x.userData.email) > -1) : x.events);
        this.dataSource.sort = this.sort;
        this.currentUserEmail = x.userData.email;
      }),
      debounceTime(100),
      map(() => {
        let newEvents = this.dataSource.data.filter(x => x.status === 'newEvent' && x.creator === this.currentUserEmail);
        newEvents.forEach(x => {x.status = 'oldEvent'});
        return newEvents;
      }),
      debounceTime(1000),
      map(newEvents => newEvents.forEach(x => this.eventsService.update(x, this.groupId)))
      )
      .subscribe()
    )  

  }

  getTodayAtMidnight() : number {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
  }


  filterInscrit(event: any) {
     this.populateDatatable(event.checked);
  }

  navigateAddEvent() {
    if (this.groupId) {
      this.router.navigate(['/app/groups/'+this.groupId+'/addEvent']);
    } else {
      this.router.navigate(['/app/addEvent']);
    }
    
    
  }

  inscription(evenement: Evenement) {
    evenement.isInscrit = true;
    evenement.inscrits.push(this.currentUserEmail);
    this.eventsService.addInscrit(evenement.id, this.currentUserEmail, this.groupId);
  }

  desinscription(evenement: Evenement) {
    evenement.isInscrit = false;
    evenement.inscrits = evenement.inscrits.filter(x => x !== this.currentUserEmail);
    this.eventsService.removeInscrit(evenement.id, this.currentUserEmail, this.groupId);
  }

  navigateDetail(evenement: Evenement) {
    if (this.groupId) {
      this.router.navigate(['/app/groups/'+this.groupId+'/events/', evenement.id]);
    } else {
      this.router.navigate(['/app/events/', evenement.id]);
    }
    
    
  }


}
