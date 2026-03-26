import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../modules/dashboard/components/dashboard-home/dashboard-home.component').then(
        (m) => m.DashboardHomeComponent
      )
  }
];
