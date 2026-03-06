import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthPresenter } from '../../presenters/auth.presenter';
import { AuthStateService } from '../../state/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [AuthPresenter],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authPresenter: AuthPresenter,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authState.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get router(): Router {
    return this.authPresenter['router'];
  }

  get isLoading(): boolean {
    return this.authState.isLoading();
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  getEmailError(): string {
    if (this.emailControl?.hasError('required')) {
      return 'El correo electrónico es obligatorio';
    }
    if (this.emailControl?.hasError('email')) {
      return 'El formato del correo electrónico no es válido';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.passwordControl?.hasError('required')) {
      return 'La contraseña es obligatoria';
    }
    if (this.passwordControl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        await this.authPresenter.login(this.loginForm.value);
      } catch (error) {
        // Error ya manejado en el presenter
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}




