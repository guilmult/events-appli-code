import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { ConnexionDialogComponent } from '../connexion-dialog/connexion-dialog.component';
import { DeconnexionDialogComponent } from '../deconnexion-dialog/deconnexion-dialog.component';
import { switchMap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(public dialog: MatDialog, public authenticationService: AuthenticationService,
    public userService: UsersService) {}

  openConnexionDialog() {
    this.dialog.open(ConnexionDialogComponent);
  }

  openDeconnexionDialog() {
    this.dialog.open(DeconnexionDialogComponent);
  }

  userGroups$ = this.authenticationService.userData.pipe(
    switchMap(userData => this.userService.getUserGroups(userData !== null ? userData.email : null))
  );

}
