import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deconnexion-dialog',
  templateUrl: './deconnexion-dialog.component.html',
  styles: []
})
export class DeconnexionDialogComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService, 
    private router: Router) { }

  ngOnInit() {
  }

  signOut() {
    this.authenticationService.SignOut().then(() => this.router.navigate(['/app/welcome']));
  }

  
}
