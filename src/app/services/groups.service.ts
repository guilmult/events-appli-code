import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Groupe } from '../models/groupe';
import { User } from '../models/user';
import { UsersService } from './users.service';
import { of } from 'rxjs';



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

  applyGroupToUser(groupId: string, users: string[]) {
    console.log('applyGroupToUser');
    users.forEach(x => {
      this.userService.addUserGroup(x, groupId);
    })
    
  }

 

  

}
