import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from '../../services/events.service';
import { Subscription, combineLatest, fromEvent } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, sequence, state } from '@angular/animations';
import { map, debounceTime } from 'rxjs/operators';


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
  

  constructor(public dialog: MatDialog, private eventsService: EventsService, private authService: AuthenticationService, private router:Router) { }
  displayedColumns: string[] = [ 'date', 'titre', 'actions'];
  dataSource: MatTableDataSource<Evenement> ;
  
  subscriptions: Subscription[] = [];

  currentUserEmail: string;

  @ViewChild(MatSort, {static: true}) sort: MatSort;


  ngOnInit() {
   
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
    this.subscriptions.push(
      combineLatest(this.eventsService.getAllEvenements(), this.authService.userData,
      (events, userData) => ({events, userData}))
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
        let newEvents = this.dataSource.data.filter(x => x.status === 'newEvent');
        newEvents.forEach(x => {x.status = 'oldEvent'});
        return newEvents;
      }),
      debounceTime(1000),
      map(newEvents => newEvents.forEach(x => this.eventsService.update(x)))
      ).subscribe()
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
    this.router.navigate(['addEvent']);
  }

  inscription(evenement: Evenement) {
    evenement.inscrits.push(this.currentUserEmail);
    this.eventsService.update(evenement);
  }

  desinscription(evenement: Evenement) {
    evenement.inscrits = evenement.inscrits.filter(x => x !== this.currentUserEmail);
    this.eventsService.update(evenement);
  }

  navigateDetail(evenement: Evenement) {
    this.router.navigate(['events/', evenement.id]);
  }


}
