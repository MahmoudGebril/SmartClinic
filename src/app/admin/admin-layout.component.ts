import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DemoBannerComponent } from '../shared/components/demo-banner.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'sc-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, DemoBannerComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50">
      <sc-demo-banner />

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside
          class="flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300"
          [class.w-64]="!collapsed()"
          [class.w-16]="collapsed()">

          <!-- Brand -->
          <div class="h-16 flex items-center px-4 border-b border-gray-100 gap-3 overflow-hidden">
            <div class="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span *ngIf="!collapsed()" class="font-bold text-gray-800 text-base truncate">SmartClinic</span>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 py-4 overflow-y-auto">
            <a *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 text-primary-700 border-r-2 border-primary-600"
              [routerLinkActiveOptions]="{exact: false}"
              class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-smooth overflow-hidden mx-2 rounded-lg my-0.5"
              [class.justify-center]="collapsed()">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"/>
              </svg>
              <span *ngIf="!collapsed()" class="truncate">{{ item.label }}</span>
            </a>
          </nav>

          <!-- User / Logout -->
          <div class="border-t border-gray-100 p-3">
            <div *ngIf="!collapsed()" class="flex items-center gap-3 px-2 py-2 mb-2">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
                م
              </div>
              <div class="overflow-hidden">
                <p class="text-sm font-medium text-gray-800 truncate">د. محمد العامري</p>
                <p class="text-xs text-gray-400 truncate">admin&#64;smartclinic.com</p>
              </div>
            </div>
            <button (click)="logout()"
              class="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
              [class.justify-center]="collapsed()">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span *ngIf="!collapsed()">Logout</span>
            </button>
          </div>
        </aside>

        <!-- Main content area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Top header -->
          <header class="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
            <button (click)="toggleSidebar()"
              class="text-gray-400 hover:text-gray-600 transition-smooth p-1 rounded-lg hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div class="flex-1"></div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Demo Mode Active
            </div>
          </header>

          <!-- Page content -->
          <main class="flex-1 overflow-y-auto p-6">
            <router-outlet />
          </main>
        </div>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  collapsed = signal(false);

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route: '/admin/dashboard',
    },
    {
      label: 'Appointments',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      route: '/admin/appointments',
    },
    {
      label: 'Doctors',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      route: '/admin/doctors',
    },
  ];

  toggleSidebar(): void {
    this.collapsed.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}
