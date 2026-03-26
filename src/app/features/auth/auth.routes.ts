import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../modules/auth/components/login/login.component').then((m) => m.LoginComponent)
  }
];
