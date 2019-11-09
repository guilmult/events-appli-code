import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


import { Evenement } from '../models/evenement';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';

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

  getEventById(id: string) : Observable<Evenement> {
    return this.events.doc(id).get().pipe(
        map(x => {
          const data = x.data();
          return {id, ...data} as Evenement;
        })
      )

  }

  addOne(evenement: Evenement) {
    this.events.add(evenement);
  }

  update(evenement: Evenement) {
    this.events.doc(evenement.id)
    .set(evenement, {})
  }

  
  
}
