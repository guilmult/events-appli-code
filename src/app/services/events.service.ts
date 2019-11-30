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
  
  constructor(private angularFireStore: AngularFirestore) {
  }  

  getAllEvenements(groupId: string) : Observable<Evenement[]> {
      return this.computeCollection(groupId).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Evenement;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        )
      );
  }

  computeCollection(groupId: string) : AngularFirestoreCollection<Evenement> {
    if (groupId) {
      return this.angularFireStore.collection<Evenement>('groups/'+groupId+'/events')
    } else {
      return this.angularFireStore.collection<Evenement>('events')
    }
  }

  computeCommentsCollection(groupId: string, evenementId: string) : AngularFirestoreCollection<Commentaire> {
    if (groupId) {
      return this.angularFireStore.collection<Commentaire>('groups/'+groupId+'/events/'+ evenementId +'/comments')
    } else {
      return this.angularFireStore.collection<Commentaire>('events/'+ evenementId +'/comments')
    }
  }

  getEventById(id: string, groupId: string) : Observable<Evenement> {
    return this.computeCollection(groupId).doc(id).get().pipe(
        map(x => {
          const data = x.data();
          return {id, ...data} as Evenement;
        })
      )
  }

  getCommentsByEventId(evenementId : string, groupId: string) : Observable<Commentaire[]> {
    return this.computeCommentsCollection(groupId, evenementId)
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
      )
    );
    
  }

  addOne(evenement: Evenement, groupId: string) {
    
    evenement.status = 'newEvent';
    this.computeCollection(groupId).add(evenement);
  }

  update(evenement: Evenement, groupId: string) {
    this.computeCollection(groupId).doc(evenement.id)
    .set(evenement, {})
  }

  addComment(comment:string, author: string, evenementId: string, groupId: string) {
    this.computeCommentsCollection(groupId, evenementId)
    .add({comment, author, date:new Date()});
  }

}
