import { Routes } from '@angular/router';

export const ticketsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../modules/tickets/components/ticket-list/ticket-list.component').then(
        (m) => m.TicketListComponent
      )
  },
  {
    path: 'entry',
    loadComponent: () =>
      import('../../modules/tickets/components/ticket-entry/ticket-entry.component').then(
        (m) => m.TicketEntryComponent
      )
  },
  {
    path: 'exit',
    loadComponent: () =>
      import('../../modules/tickets/components/ticket-exit/ticket-exit.component').then(
        (m) => m.TicketExitComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../../modules/tickets/components/ticket-detail/ticket-detail.component').then(
        (m) => m.TicketDetailComponent
      )
  }
];
