import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthPresenter } from './modules/auth/presenters/auth.presenter';
import { HttpLoadingService } from './core/http/http-loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatProgressBarModule],
  providers: [AuthPresenter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(
    private authPresenter: AuthPresenter,
    private httpLoadingService: HttpLoadingService
  ) {}

  get isGlobalLoading(): boolean {
    return this.httpLoadingService.isLoading();
  }

  ngOnInit(): void {
    // Verificar estado de autenticación al iniciar
    this.authPresenter.checkAuthStatus();
  }
}
