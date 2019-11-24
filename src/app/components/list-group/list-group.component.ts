import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { switchMap, map, mergeMap, toArray } from 'rxjs/operators';
import { GroupsService } from 'src/app/services/groups.service';
import { Groupe } from 'src/app/models/groupe';
import { from, Subscription, Observable } from 'rxjs';
import { concat } from 'bytebuffer';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent {
  

  constructor(private authenticationService: AuthenticationService,
    private userService: UsersService,
    private groupService: GroupsService) { }

  groups$ = this.authenticationService.userData.pipe(
    switchMap(userData => this.userService.getUser(userData.email)),
    map(x => x.data().groups as Groupe[]),
    mergeMap(x => from(x).pipe(
       mergeMap((y: Groupe)=> this.groupService.getGroup(y.id)),
       toArray()
      )
    )
  );

  
 
}
