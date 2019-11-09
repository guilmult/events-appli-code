import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { DetailEventComponent } from './components/detail-event/detail-event.component';


const routes: Routes = [
  {
    path: 'events',
    component : EventsListComponent
  },
  {
    path: 'events/:id',
    component : DetailEventComponent
  },
  { path: 'welcome',
    component : WelcomeComponent
  },
  { path: 'addEvent',
    component : AddEventComponent
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
