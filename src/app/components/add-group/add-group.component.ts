import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GroupsService } from 'src/app/services/groups.service';
import { Groupe } from 'src/app/models/groupe';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { switchMap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styles: []
})
export class AddGroupComponent implements OnInit, OnDestroy {
  

  constructor(private fb: FormBuilder, private groupService: GroupsService,
    private authService: AuthenticationService, private userService: UsersService) { }

  nameFormGroup: FormGroup;

  emailFormGroup: FormGroup;

  emails: string[] = [];

  nonExistingUser: boolean = false;

  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.nameFormGroup = this.fb.group({nameCtrl: ['', Validators.required]});
    this.emailFormGroup = this.fb.group({emailCtrl: ['', Validators.email]})
  }
  ngOnDestroy(): void {
      this.subscriptions.forEach(x => x.unsubscribe());
    
  }

  get f() { return this.emailFormGroup.controls; }

  addMember() {
    if (this.emailFormGroup.value.emailCtrl && this.emailFormGroup.value.emailCtrl !== '') {
      
      this.subscriptions.push(
        this.userService.userExist(this.emailFormGroup.value.emailCtrl)
        .subscribe(userExist => {
          if (userExist) {
            this.emails.push(this.emailFormGroup.value.emailCtrl);
            this.nonExistingUser = false;
            this.emailFormGroup.reset();
          } else {
            this.nonExistingUser = true;
          }
        })
      )
      
      
     
    }
  }

  removeMember(email: string) {
    this.emails = this.emails.filter(x => x !== email);
  }

  addGroup() {
    this.subscriptions.push(this.authService.userData.pipe(
      switchMap(x => {
        const group : Groupe = {
          creationDate: new Date(),
          creator: x.email,
          name: this.nameFormGroup.value.nameCtrl,
          members : this.emails
        };
        return this.groupService.addOne(group);
      }),
      map(x => {
        this.emails.forEach(y => {
          this.subscriptions.push(this.userService.addUserGroup(y, x.id).subscribe());
        })
         
      }),
      map(() => {
        this.emails = [];
        this.nameFormGroup.reset();
        this.emailFormGroup.reset();
      })
    ).subscribe()
    );
    
   
  }

}
