import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnexionDialogComponent } from './components/connexion-dialog/connexion-dialog.component';
import { map, switchMap } from 'rxjs/operators';
import { DeconnexionDialogComponent } from './components/deconnexion-dialog/deconnexion-dialog.component';
import { UsersService } from './services/users.service';
import { Groupe } from './models/groupe';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trappiste';
  
  
  
}
