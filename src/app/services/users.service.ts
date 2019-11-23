import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../models/user';
import { switchMap, map } from 'rxjs/operators';



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

  addUserGroup(email: string, groupId: string ) {
    return this.users.doc(email).get().pipe(
      switchMap(x => {
        const user = x.data();
        user.groups.push(groupId);
        return this.users.doc(email).set(user,{});
      })
    );
    
  }
 

  

}
