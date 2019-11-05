import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { EventsListComponent } from './components/events-list/events-list.component';


const routes: Routes = [
  {
    path: 'events',
    component : EventsListComponent
  },
  { path: 'welcome',
    component : WelcomeComponent
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
