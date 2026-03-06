import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthPresenter } from './modules/auth/presenters/auth.presenter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  providers: [AuthPresenter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(
    private authPresenter: AuthPresenter,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar estado de autenticación al iniciar
    this.authPresenter.checkAuthStatus();
  }
}
