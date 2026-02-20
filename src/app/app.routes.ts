import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  // Default → landing
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Public pages
  {
    path: 'home',
    loadComponent: () =>
      import('./booking/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'book',
    loadComponent: () =>
      import('./booking/booking.component').then(m => m.BookingComponent),
  },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login.component').then(m => m.LoginComponent),
  },

  // Admin (protected)
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./admin/appointments/appointments.component').then(m => m.AppointmentsComponent),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./admin/doctors/doctors.component').then(m => m.DoctorsComponent),
      },
    ],
  },

  // Catch-all
  { path: '**', redirectTo: '/home' },
];
