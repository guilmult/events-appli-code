import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: []
})
export class SignUpComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthenticationService,
    private router: Router,
    private userService: UsersService) { }

  signUpForm: FormGroup;

  wrongConfirmation: boolean = false;

  recaptchaVerifier;

  notArobot: boolean = false;

  ngOnInit() {
    this.signUpForm = this.formBuilder
      .group({
        email:['',  Validators.compose([Validators.required, Validators.email]) ], 
        password:['', Validators.required],
        confirmPassword:['', Validators.required]
     });


     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
      'callback': () => {
        this.notArobot = true;
      },
      'expired-callback': () => {
        this.notArobot = false;
      }
    })
    this.recaptchaVerifier.render()

  }

  get f() { return this.signUpForm.controls; }

  signUp(formValue) {
    this.wrongConfirmation = false;
    if (formValue.password !== formValue.confirmPassword) {
      this.wrongConfirmation = true;
      return;
    }
    
    if (this.notArobot) {
      this.authService.SignUp(formValue.email, formValue.password)
      .then(() => this.userService.addUser({email: formValue.email})
      .then(() => this.router.navigate(['/app/events'])))
    }

  }

 
}
