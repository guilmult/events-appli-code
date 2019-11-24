import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Groupe } from '../models/groupe';
import { User } from '../models/user';
import { UsersService } from './users.service';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  
  groups: AngularFirestoreCollection<Groupe>

  

  constructor(private angularFireStore: AngularFirestore, private userService: UsersService) {
    this.groups = angularFireStore.collection<Groupe>('groups');
  }


  addOne(group: Groupe) {
    return this.groups.add(group);
  }

  getGroup(groupId: string) : Observable<Groupe> {
    return this.groups.doc(groupId).get().pipe(
      map(x => {
        const data = x.data();
        return {id:groupId, ...data} as Groupe;
      })
    )
  }

  

  

}
