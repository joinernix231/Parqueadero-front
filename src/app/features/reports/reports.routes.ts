import { Routes } from '@angular/router';
import { roleGuard } from '../../modules/shared/guards/role.guard';

export const reportsRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin', 'operator'])],
    loadComponent: () =>
      import('../../modules/reports/components/reports-home/reports-home.component').then(
        (m) => m.ReportsHomeComponent
      )
  }
];
