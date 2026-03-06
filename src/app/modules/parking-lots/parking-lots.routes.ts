import { Routes } from '@angular/router';
import { ParkingLotListComponent } from './components/parking-lot-list/parking-lot-list.component';
import { ParkingLotFormComponent } from './components/parking-lot-form/parking-lot-form.component';
import { ParkingLotDetailComponent } from './components/parking-lot-detail/parking-lot-detail.component';

export const parkingLotsRoutes: Routes = [
  {
    path: '',
    component: ParkingLotListComponent
  },
  {
    path: 'new',
    component: ParkingLotFormComponent
  },
  {
    path: ':id',
    component: ParkingLotDetailComponent
  },
  {
    path: ':id/edit',
    component: ParkingLotFormComponent
  }
];





