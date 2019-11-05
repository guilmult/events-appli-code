import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NamefrommailPipe } from './pipes/namefrommail.pipe';
import { ConnexionDialogComponent } from './components/connexion-dialog/connexion-dialog.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddEventDialogComponent } from './components/add-event-dialog/add-event-dialog.component';
import { EventsService } from './services/events.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { EventsListComponent } from './components/events-list/events-list.component';
import { DetailDialogComponent } from './components/detail-dialog/detail-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NamefrommailPipe,
    ConnexionDialogComponent,
    WelcomeComponent,
    EventsListComponent, 
    AddEventDialogComponent, DetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatSortModule,
    MatDatepickerModule,
    FormsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatTableModule,
    MatListModule,
    MatDividerModule
  ],
  entryComponents: [
    ConnexionDialogComponent, AddEventDialogComponent, DetailDialogComponent
  ],
  providers: [AuthenticationService, EventsService, MatDatepickerModule, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }