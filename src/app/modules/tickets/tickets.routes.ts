import { Routes } from '@angular/router';
import { TicketEntryComponent } from './components/ticket-entry/ticket-entry.component';
import { TicketExitComponent } from './components/ticket-exit/ticket-exit.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';

export const ticketsRoutes: Routes = [
  {
    path: '',
    component: TicketListComponent
  },
  {
    path: 'entry',
    component: TicketEntryComponent
  },
  {
    path: 'exit',
    component: TicketExitComponent
  },
  {
    path: ':id',
    component: TicketDetailComponent
  }
];




