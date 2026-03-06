import { Routes } from '@angular/router';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

export const vehiclesRoutes: Routes = [
  {
    path: '',
    component: VehicleListComponent
  },
  {
    path: 'new',
    component: VehicleFormComponent
  }
];





