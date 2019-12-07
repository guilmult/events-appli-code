import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Groupe } from 'src/app/models/groupe';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-manage-group-members',
  templateUrl: './manage-group-members.component.html',
  styles: []
})
export class ManageGroupMembersComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
    private userService: UsersService) { }

  emailFormGroup: FormGroup;

  subscriptions: Subscription[] = [];

  nonExistingUser: boolean = false;

  @Input()
  emails: string[] = [];
  @Input()
  groupId: string;

  @Input()
  groupCreator: string;

  @Input()
  editable: boolean = false;

  @Output() 
  addMember = new EventEmitter<any>();

  @Output() 
  removeMember = new EventEmitter<any>();

  ngOnInit() {
    this.emailFormGroup = this.fb.group({emailCtrl: ['', Validators.email]})
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  
  }

  get f() { return this.emailFormGroup.controls; }

  addMemberToTable() {
    if (this.emailFormGroup.value.emailCtrl && this.emailFormGroup.value.emailCtrl !== '') {
      
      this.subscriptions.push(
        this.userService.userExist(this.emailFormGroup.value.emailCtrl)
        .subscribe(userExist => {
          if (userExist) {
            this.emails.push(this.emailFormGroup.value.emailCtrl);
            this.addMember.emit({id: this.groupId, member: this.emailFormGroup.value.emailCtrl});
            this.nonExistingUser = false;
            this.emailFormGroup.reset();
            
          } else {
            this.nonExistingUser = true;
          }
        })
      )
      
      
     
    }
  }

  removeMemberFromTable(email: string) {
    this.emails = this.emails.filter(x => x !== email);
    this.removeMember.emit({id: this.groupId, member: email});
  }

}
