import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import * as firebase from 'firebase';
import { Evenement } from '../models/evenement';
import { Observable, Subscription, concat } from 'rxjs';
import { map, concatMap, concatAll, combineLatest } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  
  events: AngularFirestoreCollection<Evenement>

  constructor(private angularFireStore: AngularFirestore) {
    this.events = angularFireStore.collection<Evenement>('events')
  }

  getAllEvenements() : Observable<Evenement[]> {
    return this.events.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Evenement;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    
  }

  addOne(evenement: Evenement) {
    this.events.add(evenement);
  }

  update(evenement: Evenement) {
    this.events.doc(evenement.id)
    .set(evenement, {})
  }

  
  
}
