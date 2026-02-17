import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Simple boolean flag — no real backend
  private _isAuthenticated = signal(false);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(private router: Router) {
    // Persist auth across page reloads (demo only)
    const stored = sessionStorage.getItem('sc_auth');
    if (stored === 'true') {
      this._isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): boolean {
    // Accept any non-empty credentials — demo mode
    if (email.trim() && password.trim()) {
      this._isAuthenticated.set(true);
      sessionStorage.setItem('sc_auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated.set(false);
    sessionStorage.removeItem('sc_auth');
    this.router.navigate(['/auth/login']);
  }
}
