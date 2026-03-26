import { Routes } from '@angular/router';
import { roleGuard } from '../../modules/shared/guards/role.guard';

export const parkingLotsRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin', 'operator'])],
    loadComponent: () =>
      import('../../modules/parking-lots/components/parking-lot-list/parking-lot-list.component').then(
        (m) => m.ParkingLotListComponent
      )
  },
  {
    path: 'new',
    canActivate: [roleGuard(['admin', 'operator'])],
    loadComponent: () =>
      import('../../modules/parking-lots/components/parking-lot-form/parking-lot-form.component').then(
        (m) => m.ParkingLotFormComponent
      )
  },
  {
    path: ':id',
    canActivate: [roleGuard(['admin', 'operator'])],
    loadComponent: () =>
      import('../../modules/parking-lots/components/parking-lot-detail/parking-lot-detail.component').then(
        (m) => m.ParkingLotDetailComponent
      )
  },
  {
    path: ':id/edit',
    canActivate: [roleGuard(['admin', 'operator'])],
    loadComponent: () =>
      import('../../modules/parking-lots/components/parking-lot-form/parking-lot-form.component').then(
        (m) => m.ParkingLotFormComponent
      )
  }
];
