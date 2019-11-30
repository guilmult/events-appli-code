import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { switchMap, map, mergeMap, toArray } from 'rxjs/operators';
import { GroupsService } from 'src/app/services/groups.service';
import { Groupe } from 'src/app/models/groupe';
import { from, Subscription, Observable } from 'rxjs';
import { concat } from 'bytebuffer';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styles: ['']
})
export class ListGroupComponent implements OnDestroy {
 

  constructor(public authenticationService: AuthenticationService,
    private userService: UsersService,
    private groupService: GroupsService) { }

  
  subscriptions: Subscription[] = [];

  groups$ = this.authenticationService.userData.pipe(
    switchMap(userData => this.userService.getUser(userData.email)),
    map(x => x.data().groups as Groupe[]),
    switchMap(x => from(x).pipe(
       mergeMap((y: Groupe)=> this.groupService.getGroup(y.id)),
       toArray()
      )
    )
  );
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  onAddMember($event) {
    
    this.subscriptions.push(this.groupService.getGroup($event.id).pipe(
      map(x => {
        x.members.push($event.member);
        return x;
      }),
      mergeMap(x => {
        this.groupService.update(x);
        return this.userService.addUserGroup($event.member, {id: x.id, name: x.name })
      })
    ).subscribe());

  }
 
  onRemoveMember($event) {
    this.subscriptions.push(this.groupService.getGroup($event.id).pipe(
      map(x => {
        x.members = x.members.filter(x => x !== $event.member);
        return x;
      }),
      mergeMap(x => {
        this.groupService.update(x);
        return this.userService.getUser($event.member)
      }),
      map(x => {
        const user = x.data() as User;
        user.groups = user.groups.filter(x => x.id !== $event.id)
        this.userService.update(user);
      }),

    ).subscribe());
  }
}
