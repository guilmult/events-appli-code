import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


import { Evenement } from '../models/evenement';
import { Observable, throwError} from 'rxjs';
import { map, catchError, switchMap, tap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Commentaire } from '../models/commentaire';
import { User } from '../models/user';

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

  computeInscritsCollection(groupId: string, evenementId: string) : AngularFirestoreCollection<User> {
    if (groupId) {
      return this.angularFireStore.collection<User>('groups/'+groupId+'/events/'+ evenementId +'/inscrits')
    } else {
      return this.angularFireStore.collection<User>('events/'+ evenementId +'/inscrits')
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
    return this.computeCollection(groupId).add(evenement);
  }

  update(evenement: Evenement, groupId: string) {
    this.computeCollection(groupId).doc(evenement.id)
    .set(evenement, {})
  }

  getAllInscrits(evenementId: string, groupId: string): Observable<string[]> {
    return this.computeInscritsCollection(groupId, evenementId)
    .snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.id))
    );
  }

  isInscrit(evenementId: string, groupId: string, email: string): Observable<boolean> {
    return this.computeInscritsCollection(groupId, evenementId).doc(email).get().pipe(
      map(x => x.exists)
    );
  }

  
  addInscrit(evenementId: string, email: string, groupId: string) {
    return this.computeInscritsCollection(groupId, evenementId).doc(email).set({email}, {});
  }

  removeInscrit(evenementId: string, email: string, groupId: string) {
     return this.computeInscritsCollection(groupId, evenementId).doc(email).delete();
  }

  addComment(comment:string, author: string, evenementId: string, groupId: string) {
    this.computeCommentsCollection(groupId, evenementId)
    .add({comment, author, date:new Date()});
  }

}
