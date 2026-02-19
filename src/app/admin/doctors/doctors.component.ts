import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { BookingService } from '../../services/booking.service';
import { DataService } from '../../services/data.service';
import { Doctor } from '../../models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

interface DoctorStat extends Doctor {
  totalAppointments: number;
  completed: number;
  missed: number;
  totalRevenue: number;
  completionRate: number;
}

@Component({
  selector: 'sc-doctors',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Doctors</h1>
        <p class="text-gray-500 text-sm mt-0.5">Medical staff and their performance overview</p>
      </div>

      <sc-loading-spinner *ngIf="loading()" message="Loading doctor stats..." />

      <ng-container *ngIf="!loading()">

        <!-- Doctor Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div *ngFor="let doc of doctorStats()" class="card hover:shadow-card-hover transition-smooth">

            <!-- Avatar + Name -->
            <div class="flex items-start justify-between mb-5">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                  {{ doc.avatar }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 text-base leading-tight">{{ doc.name }}</h3>
                  <p class="text-primary-600 text-sm font-medium">{{ doc.specialty }}</p>
                  <div class="flex items-center gap-1 mt-0.5">
                    <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-xs font-semibold text-gray-700">{{ doc.rating }}</span>
                    <span class="text-xs text-gray-400">· {{ doc.experience }} yrs exp</span>
                  </div>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                Active
              </span>
            </div>

            <!-- Bio -->
            <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ doc.bio }}</p>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 gap-3 mb-5">
              <div class="bg-slate-50 rounded-xl p-3 text-center">
                <p class="text-xl font-bold text-gray-800">{{ doc.totalAppointments }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Total Appts</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3 text-center">
                <p class="text-xl font-bold text-emerald-600">{{ '$' + doc.totalRevenue.toLocaleString() }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Total Revenue</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3 text-center">
                <p class="text-xl font-bold text-primary-600">{{ doc.completionRate }}%</p>
                <p class="text-xs text-gray-500 mt-0.5">Completion Rate</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3 text-center">
                <p class="text-xl font-bold text-gray-800">{{ '$' + doc.consultationFee }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Per Session</p>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <p class="text-xs font-medium text-gray-500 mb-2">Available Days</p>
              <div class="flex gap-1.5">
                <span *ngFor="let day of allDays; let i = index"
                  class="w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-smooth"
                  [ngClass]="doc.availableDays.includes(i) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'">
                  {{ day }}
                </span>
              </div>
            </div>

            <!-- Slots preview -->
            <div class="mt-4">
              <p class="text-xs font-medium text-gray-500 mb-2">Available Slots</p>
              <div class="flex flex-wrap gap-1.5">
                <span *ngFor="let slot of doc.availableSlots"
                  class="text-xs px-2 py-0.5 bg-blue-50 text-primary-700 rounded-md font-medium">
                  {{ slot }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary table -->
        <div class="card !p-0 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="font-semibold text-gray-800">Performance Summary</h3>
            <p class="text-xs text-gray-400 mt-0.5">Based on all mock appointments</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left px-6 py-3 font-medium text-gray-500">Doctor</th>
                  <th class="text-left px-6 py-3 font-medium text-gray-500">Specialty</th>
                  <th class="text-right px-6 py-3 font-medium text-gray-500">Appointments</th>
                  <th class="text-right px-6 py-3 font-medium text-gray-500">Completed</th>
                  <th class="text-right px-6 py-3 font-medium text-gray-500">Missed</th>
                  <th class="text-right px-6 py-3 font-medium text-gray-500">Revenue</th>
                  <th class="text-right px-6 py-3 font-medium text-gray-500">Rate</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr *ngFor="let doc of doctorStats()" class="hover:bg-gray-50/50 transition-smooth">
                  <td class="px-6 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {{ doc.avatar }}
                      </div>
                      <span class="font-medium text-gray-800">{{ doc.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-3.5 text-gray-600">{{ doc.specialty }}</td>
                  <td class="px-6 py-3.5 text-right font-medium text-gray-800">{{ doc.totalAppointments }}</td>
                  <td class="px-6 py-3.5 text-right text-emerald-600 font-medium">{{ doc.completed }}</td>
                  <td class="px-6 py-3.5 text-right text-red-500 font-medium">{{ doc.missed }}</td>
                  <td class="px-6 py-3.5 text-right font-semibold text-gray-800">{{ '$' + doc.totalRevenue.toLocaleString() }}</td>
                  <td class="px-6 py-3.5 text-right">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="doc.completionRate >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                      {{ doc.completionRate }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </ng-container>
    </div>
  `,
})
export class DoctorsComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private bookingService = inject(BookingService);
  private dataService = inject(DataService);

  allDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  loading = signal(true);
  doctorStats = signal<DoctorStat[]>([]);

  ngOnInit(): void {
    this.dataService.initialize();
    setTimeout(() => {
      const all = this.bookingService.getAll();
      const stats = this.doctorService.getAll().map(doc => {
        const appts = all.filter(a => a.doctorId === doc.id);
        const completed = appts.filter(a => a.status === 'completed').length;
        const missed = appts.filter(a => a.status === 'missed').length;
        const totalRevenue = appts.reduce((sum, a) => sum + a.revenue, 0);
        const completionRate = appts.length > 0
          ? Math.round((completed / appts.length) * 100) : 0;
        return { ...doc, totalAppointments: appts.length, completed, missed, totalRevenue, completionRate };
      });
      this.doctorStats.set(stats);
      this.loading.set(false);
    }, 400);
  }
}
