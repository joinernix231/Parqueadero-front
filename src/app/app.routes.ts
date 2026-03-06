import { Routes } from '@angular/router';
import { authGuard } from './modules/shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    loadComponent: () => import('./modules/shared/components/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'parking-lots',
        loadChildren: () => import('./modules/parking-lots/parking-lots.routes').then(m => m.parkingLotsRoutes)
      },
      {
        path: 'parking-spaces',
        loadChildren: () => import('./modules/parking-spaces/parking-spaces.routes').then(m => m.parkingSpacesRoutes)
      },
      {
        path: 'vehicles',
        loadChildren: () => import('./modules/vehicles/vehicles.routes').then(m => m.vehiclesRoutes)
      },
      {
        path: 'tickets',
        loadChildren: () => import('./modules/tickets/tickets.routes').then(m => m.ticketsRoutes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.routes').then(m => m.reportsRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
