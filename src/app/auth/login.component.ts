import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DemoBannerComponent } from '../shared/components/demo-banner.component';

@Component({
  selector: 'sc-login',
  standalone: true,
  imports: [CommonModule, FormsModule, DemoBannerComponent],
  template: `
    <sc-demo-banner />
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">

        <!-- Logo / Branding -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">SmartClinic</h1>
          <p class="text-gray-500 text-sm mt-1">Clinic Management System</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-1">Admin Login</h2>
          <p class="text-sm text-gray-400 mb-6">Sign in to access the dashboard</p>

          <!-- Demo hint -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex gap-2">
            <svg class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"/>
            </svg>
            <p class="text-xs text-blue-700">
              <strong>Demo:</strong> Enter any email and password to log in.
            </p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  placeholder="admin@smartclinic-sa.com"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-smooth"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div class="relative">
                  <input
                    [type]="showPass ? 'text' : 'password'"
                    name="password"
                    [(ngModel)]="password"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-smooth pr-10"
                  />
                  <button type="button" (click)="showPass = !showPass"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg *ngIf="!showPass" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg *ngIf="showPass" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div *ngIf="error" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {{ error }}
              </div>

              <button
                type="submit"
                [disabled]="loading"
                class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-medium py-2.5 px-4 rounded-lg transition-smooth flex items-center justify-center gap-2">
                <svg *ngIf="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </div>
          </form>
        </div>

        <p class="text-center text-xs text-gray-400 mt-4">
          SmartClinic v1.0 — Portfolio Demo
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  showPass = false;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password.';
      return;
    }
    this.loading = true;
    // Simulate async login
    setTimeout(() => {
      const success = this.auth.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error = 'Invalid credentials. Please try again.';
      }
      this.loading = false;
    }, 800);
  }
}
