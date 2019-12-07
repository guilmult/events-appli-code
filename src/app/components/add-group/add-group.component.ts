import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups.service';
import { Groupe } from 'src/app/models/groupe';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { switchMap, map, mergeMap, tap } from 'rxjs/operators';
import { Subscription, from } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styles: []
})
export class AddGroupComponent implements OnInit, OnDestroy {
  

  constructor(private fb: FormBuilder, private groupService: GroupsService,
    private authService: AuthenticationService, private userService: UsersService,
    private router: Router ) { }

  nameFormGroup: FormGroup;

  emails: string[] = [];

  subscriptions: Subscription[] = [];


  

  ngOnInit() {
    this.nameFormGroup = this.fb.group({nameCtrl: ['', Validators.required]});
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.subscriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    }));


  }
  ngOnDestroy(): void {
      this.subscriptions.forEach(x => x.unsubscribe());
    
  }

  onAddMember($event) {
    this.emails.push($event.member);
  }

  onRemoveMember($event) {
    this.emails = this.emails.filter(x => x !== $event.member);
  }

  addGroup() {
    this.subscriptions.push(this.authService.userData.pipe(
      switchMap(x => {
        if (this.emails.indexOf(x.email) < 0) {
          this.emails.push(x.email);
        }
        const group : Groupe = {
          creationDate: new Date(),
          creator: x.email,
          name: this.nameFormGroup.value.nameCtrl,
          members : this.emails
        };
        return this.groupService.addOne(group);
      },
      (a,b) => ({id: b.id, creator:a.email})),
      switchMap(x => from(this.emails).pipe(
        mergeMap(y => this.userService.addUserGroup(y, {id: x.id, creator: x.creator, name:this.nameFormGroup.value.nameCtrl}))
      )),
      map(() => this.router.navigate(['/app/groups']))
    ).subscribe()
    );
    
   
  }

}
