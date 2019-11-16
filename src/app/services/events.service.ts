import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


import { Evenement } from '../models/evenement';
import { Observable, throwError} from 'rxjs';
import { map, catchError, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Commentaire } from '../models/commentaire';

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
      })
      )
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

  getCommentsByEventId(evenementId : string) : Observable<Commentaire[]> {
    return this.angularFireStore.collection<Commentaire>('events/'+ evenementId +'/comments')
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
      )
    );
    
  }

  addOne(evenement: Evenement) {
    
    evenement.status = 'newEvent';
    this.events.add(evenement);
  }

  update(evenement: Evenement) {
    this.events.doc(evenement.id)
    .set(evenement, {})
  }

  addComment(comment:string, author: string, evenementId: string) {
    this.angularFireStore.collection('events/'+ evenementId +'/comments')
    .add({comment, author, timestamp:firebase.firestore.Timestamp.fromDate(new Date())});
  }

}
