import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: Observable<firebase.User>;
  constructor(private angularFireAuth: AngularFireAuth) { 
    this.userData = angularFireAuth.authState;
  }

   /* Sign in */
   SignIn(email: string, password: string): Promise<firebase.auth.UserCredential> {

    return this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)
 
  }
}
