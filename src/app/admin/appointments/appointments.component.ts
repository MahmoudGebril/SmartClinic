import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BookingService } from '../../services/booking.service';
import { Appointment, AppointmentStatus } from '../../models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

type SortField = 'date' | 'patientName' | 'doctorName' | 'status';

@Component({
  selector: 'sc-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Appointments</h1>
          <p class="text-gray-500 text-sm mt-0.5">
            {{ filteredAppointments().length }} of {{ allAppointments().length }} appointments
          </p>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
          <span class="text-gray-500">Live mock data</span>
        </div>
      </div>

      <!-- Loading -->
      <sc-loading-spinner *ngIf="loading()" message="Loading appointments..." />

      <ng-container *ngIf="!loading()">

        <!-- Filters bar -->
        <div class="card !p-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearch($event)"
                placeholder="Search by patient or doctor..."
                class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- Status filter -->
            <select [value]="statusFilter()" (change)="onStatusChange($event)"
              class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 min-w-[140px]">
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <!-- Doctor filter -->
            <select [value]="doctorFilter()" (change)="onDoctorChange($event)"
              class="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-700 min-w-[160px]">
              <option value="">All Doctors</option>
              <option *ngFor="let d of doctorNames()" [value]="d">{{ d }}</option>
            </select>

            <!-- Clear button -->
            <button *ngIf="hasActiveFilters()"
              (click)="clearFilters()"
              class="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-smooth whitespace-nowrap">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="card !p-0 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100 bg-gray-50">
                  <th class="text-left px-5 py-3 font-medium text-gray-500">
                    <button (click)="setSort('date')" class="flex items-center gap-1 hover:text-gray-800 transition-smooth">
                      Date
                      <svg class="w-3.5 h-3.5" [class.text-primary-600]="sortField() === 'date'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="sortField() === 'date' && sortDir() === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                      </svg>
                    </button>
                  </th>
                  <th class="text-left px-5 py-3 font-medium text-gray-500">
                    <button (click)="setSort('patientName')" class="flex items-center gap-1 hover:text-gray-800 transition-smooth">
                      Patient
                      <svg class="w-3.5 h-3.5" [class.text-primary-600]="sortField() === 'patientName'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="sortField() === 'patientName' && sortDir() === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                      </svg>
                    </button>
                  </th>
                  <th class="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">
                    <button (click)="setSort('doctorName')" class="flex items-center gap-1 hover:text-gray-800 transition-smooth">
                      Doctor
                      <svg class="w-3.5 h-3.5" [class.text-primary-600]="sortField() === 'doctorName'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="sortField() === 'doctorName' && sortDir() === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                      </svg>
                    </button>
                  </th>
                  <th class="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Time</th>
                  <th class="text-left px-5 py-3 font-medium text-gray-500">
                    <button (click)="setSort('status')" class="flex items-center gap-1 hover:text-gray-800 transition-smooth">
                      Status
                      <svg class="w-3.5 h-3.5" [class.text-primary-600]="sortField() === 'status'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          [attr.d]="sortField() === 'status' && sortDir() === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"/>
                      </svg>
                    </button>
                  </th>
                  <th class="text-right px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Revenue</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let appt of paginatedAppointments(); trackBy: trackById"
                  class="hover:bg-gray-50/50 transition-smooth">
                  <td class="px-5 py-3.5 text-gray-800 whitespace-nowrap">
                    <p class="font-medium">{{ appt.date | date:'MMM d, y' }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <p class="font-medium text-gray-800">{{ appt.patientName }}</p>
                    <p class="text-xs text-gray-400">{{ appt.patientPhone }}</p>
                  </td>
                  <td class="px-5 py-3.5 text-gray-600 hidden md:table-cell">
                    <p>{{ appt.doctorName }}</p>
                  </td>
                  <td class="px-5 py-3.5 text-gray-600 hidden sm:table-cell">{{ appt.timeSlot }}</td>
                  <td class="px-5 py-3.5">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="statusClasses[appt.status]">
                      {{ appt.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-5 py-3.5 text-right text-gray-800 font-medium hidden lg:table-cell">
                    {{ appt.revenue > 0 ? ('$' + appt.revenue) : '—' }}
                  </td>
                </tr>

                <!-- Empty state -->
                <tr *ngIf="filteredAppointments().length === 0">
                  <td colspan="6" class="px-5 py-16 text-center text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-sm">No appointments match your filters.</p>
                    <button (click)="clearFilters()" class="mt-2 text-primary-600 text-sm hover:underline">Clear filters</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div *ngIf="totalPages() > 1" class="border-t border-gray-100 px-5 py-3 flex items-center justify-between text-sm">
            <span class="text-gray-500">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <div class="flex items-center gap-1">
              <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1"
                class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-smooth">
                Previous
              </button>
              <button *ngFor="let p of pageRange()"
                (click)="goToPage(p)"
                class="w-8 h-8 rounded-lg text-sm font-medium transition-smooth"
                [ngClass]="p === currentPage() ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
                {{ p }}
              </button>
              <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages()"
                class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-smooth">
                Next
              </button>
            </div>
          </div>
        </div>

      </ng-container>
    </div>
  `,
})
export class AppointmentsComponent implements OnInit {
  private dataService = inject(DataService);
  private bookingService = inject(BookingService);

  loading = signal(true);
  allAppointments = signal<Appointment[]>([]);

  searchQuery = signal('');
  statusFilter = signal<AppointmentStatus | ''>('');
  doctorFilter = signal('');
  sortField = signal<SortField>('date');
  sortDir = signal<'asc' | 'desc'>('desc');
  currentPage = signal(1);
  readonly pageSize = 15;

  doctorNames = computed(() =>
    [...new Set(this.allAppointments().map(a => a.doctorName))]
  );

  statusClasses: Record<AppointmentStatus, string> = {
    scheduled: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    missed:    'bg-red-50 text-red-600',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  ngOnInit(): void {
    this.dataService.initialize();
    setTimeout(() => {
      this.allAppointments.set(this.bookingService.getAll());
      this.loading.set(false);
    }, 400);
  }

  filteredAppointments = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const sf = this.sortField();
    const sd = this.sortDir();
    return this.allAppointments()
      .filter(a => {
        const matchSearch = !q ||
          a.patientName.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.patientPhone.includes(q);
        const matchStatus = !this.statusFilter() || a.status === this.statusFilter();
        const matchDoctor = !this.doctorFilter() || a.doctorName === this.doctorFilter();
        return matchSearch && matchStatus && matchDoctor;
      })
      .sort((a, b) => {
        let valA: string | number = sf === 'date' ? new Date(a.date).getTime() : a[sf];
        let valB: string | number = sf === 'date' ? new Date(b.date).getTime() : b[sf];
        const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
        return sd === 'asc' ? cmp : -cmp;
      });
  });

  paginatedAppointments = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredAppointments().slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredAppointments().length / this.pageSize))
  );

  hasActiveFilters = computed(() =>
    !!(this.searchQuery() || this.statusFilter() || this.doctorFilter())
  );

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onStatusChange(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as AppointmentStatus | '');
    this.currentPage.set(1);
  }

  onDoctorChange(event: Event): void {
    this.doctorFilter.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');
    this.doctorFilter.set('');
    this.currentPage.set(1);
  }

  setSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  pageRange = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  });

  trackById(_: number, item: Appointment): string {
    return item.id;
  }
}
