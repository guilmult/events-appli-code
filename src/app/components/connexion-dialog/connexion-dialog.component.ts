import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion-dialog',
  templateUrl: './connexion-dialog.component.html',
  styles: ['.connexion-form-container {display: flex;flex-direction: column;}']
})
export class ConnexionDialogComponent {

  constructor(public authenticationService: AuthenticationService, private router: Router,
    public dialogRef: MatDialogRef<ConnexionDialogComponent>) { }

  email: string
  password: string
  error: boolean = false;

  signIn() {
    this.authenticationService.SignIn(this.email, this.password)
    .then(res => {
      this.router.navigate(['/events']);
      this.dialogRef.close();
    })
    .catch(x=> this.error = true);
  }
}
