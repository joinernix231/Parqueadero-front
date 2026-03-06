import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  private _loading = signal<boolean>(false);
  loading = this._loading.asReadonly();

  private _loadingCount = 0;

  setLoading(isLoading: boolean): void {
    if (isLoading) {
      this._loadingCount++;
    } else {
      this._loadingCount = Math.max(0, this._loadingCount - 1);
    }
    this._loading.set(this._loadingCount > 0);
  }

  reset(): void {
    this._loadingCount = 0;
    this._loading.set(false);
  }
}





