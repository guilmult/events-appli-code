import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Evenement } from '../../models/evenement';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from '../../services/events.service';
import { Subscription, combineLatest, fromEvent } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styles: ['table {width: 100%; margin: 5px;}',
           '.inscrit-highlight {background-color: #ffd740}']
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
      .subscribe(x => {
        x.events.forEach(y => {
          y.isInscrit = y.inscrits.lastIndexOf(x.userData.email) > -1; 
          y.date = y.timestamp.toDate();
        });
        this.dataSource= new MatTableDataSource(filterInscrit ? x.events.filter(z => z.isInscrit) : x.events);
        this.dataSource.sort = this.sort;
        this.currentUserEmail = x.userData.email;
      })
    )
  }


  filterInscrit(event: any) {
     console.log(event) 
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
