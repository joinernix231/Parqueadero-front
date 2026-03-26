import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-spinner-container">
      <div class="loading-spinner"></div>
      <p *ngIf="message()" class="loading-message">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .loading-spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top-color: var(--primary-color, #1976d2);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-message {
      margin-top: 1rem;
      color: var(--text-secondary, #757575);
      font-size: 0.875rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  readonly message = input<string>();
}





