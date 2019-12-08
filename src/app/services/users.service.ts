import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../models/user';
import { switchMap, map } from 'rxjs/operators';
import { Groupe } from '../models/groupe';
import { Observable, from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  users: AngularFirestoreCollection<User>

  

  constructor(private angularFireStore: AngularFirestore) {
    this.users = angularFireStore.collection<User>('users');

  }


  addUser(user: User): Promise<void> {
    return this.users.doc(user.email)
    .set(user, {})
  }

  userExist(email: string) {
    return this.users.doc(email).get().pipe(
      map(x => x.exists)
    )
  }

  addUserGroup(email: string, group: Groupe ) {
    console.log(group);
    return this.users.doc(email).collection('groups').doc(group.id).set(group, {});
  }

  removeUserGroup(email: string, group: Groupe) {
    return this.users.doc(email).collection('groups').doc(group.id).delete();
  }

  getUser(email: string) {
    return this.users.doc(email).get();
  }
 
  getUserGroups(email: string): Observable<Groupe[]> {
   if (email !== null) {
    return this.users.doc(email).collection('groups')
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
      )
    );
   } else {
     return from([]);
   }
     
  }

  update(user: User) {
    this.users.doc(user.email)
    .set(user, {})
  }
  

}
