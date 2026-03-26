import { Component, EventEmitter, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthPresenter } from '../../../../auth/presenters/auth.presenter';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  providers: [AuthPresenter],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser = computed(() => this.authService.getUser());
  isSearchFocused = signal(false);

  constructor(
    private authService: AuthService,
    private authPresenter: AuthPresenter,
    private router: Router
  ) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  async onLogout(): Promise<void> {
    await this.authPresenter.logout();
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    const names = user.name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleLabel(role: string | undefined): string {
    const roleLabels: { [key: string]: string } = {
      'admin': 'Administrador',
      'operator': 'Operador',
      'guard': 'Guardia'
    };
    return roleLabels[role || ''] || role || '';
  }

  onSearchFocus(): void {
    this.isSearchFocused.set(true);
  }

  onSearchBlur(): void {
    this.isSearchFocused.set(false);
  }
}

