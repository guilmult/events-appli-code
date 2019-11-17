import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnexionDialogComponent } from './components/connexion-dialog/connexion-dialog.component';
import { map } from 'rxjs/operators';
import { DeconnexionDialogComponent } from './components/deconnexion-dialog/deconnexion-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trappiste';
  
  constructor(public dialog: MatDialog, public authenticationService: AuthenticationService) {}

  openConnexionDialog() {
    this.dialog.open(ConnexionDialogComponent);
  }

  openDeconnexionDialog() {
    this.dialog.open(DeconnexionDialogComponent);
  }
  
}
