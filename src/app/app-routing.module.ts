import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { DetailEventComponent } from './components/detail-event/detail-event.component';
import { AuthGuard } from './guards/auth.guard';
import { AddGroupComponent } from './components/add-group/add-group.component';


const routes: Routes = [
  {
    path: 'events',
    component : EventsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/:id',
    component : DetailEventComponent,
    canActivate: [AuthGuard]
  },
  { path: 'welcome',
    component : WelcomeComponent
  },
  { path: 'addEvent',
    component : AddEventComponent,
    canActivate: [AuthGuard]
  },
  { path: 'addGroup',
    component : AddGroupComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
