import { Routes } from '@angular/router';
import { roleGuard } from '../../modules/shared/guards/role.guard';

export const parkingSpacesRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['admin', 'operator'])],
    loadComponent: () =>
      import('../../modules/parking-spaces/components/parking-space-list/parking-space-list.component').then(
        (m) => m.ParkingSpaceListComponent
      )
  }
];
