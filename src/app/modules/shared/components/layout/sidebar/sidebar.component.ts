import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: ('admin' | 'operator' | 'guard')[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = true;

  currentRoute = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Estacionamientos',
      icon: 'local_parking',
      route: '/parking-lots',
      roles: ['admin', 'operator']
    },
    {
      label: 'Espacios',
      icon: 'space_dashboard',
      route: '/parking-spaces',
      roles: ['admin', 'operator']
    },
    {
      label: 'Vehículos',
      icon: 'directions_car',
      route: '/vehicles'
    },
    {
      label: 'Tickets',
      icon: 'receipt',
      route: '/tickets'
    },
    {
      label: 'Reportes',
      icon: 'assessment',
      route: '/reports',
      roles: ['admin', 'operator']
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.authService.getUser();
    return user ? item.roles.includes(user.role) : false;
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
}




