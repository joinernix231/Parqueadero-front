import { Routes } from '@angular/router';

export const vehiclesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../modules/vehicles/components/vehicle-list/vehicle-list.component').then(
        (m) => m.VehicleListComponent
      )
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../../modules/vehicles/components/vehicle-form/vehicle-form.component').then(
        (m) => m.VehicleFormComponent
      )
  }
];
