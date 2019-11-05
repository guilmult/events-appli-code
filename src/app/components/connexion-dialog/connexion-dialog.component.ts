import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion-dialog',
  templateUrl: './connexion-dialog.component.html',
  styleUrls: ['./connexion-dialog.component.scss']
})
export class ConnexionDialogComponent {

  constructor(public authenticationService: AuthenticationService, private router: Router) { }

  email: string
  password: string

  signIn() {
    this.authenticationService.SignIn(this.email, this.password)
    .then(res => this.router.navigate(['/events']));
  }
}
