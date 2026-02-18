import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { DoctorService } from '../services/doctor.service';
import { BookingService } from '../services/booking.service';
import { DataService } from '../services/data.service';
import { Doctor } from '../models';
import { DemoBannerComponent } from '../shared/components/demo-banner.component';

@Component({
  selector: 'sc-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FullCalendarModule, DemoBannerComponent],
  template: `
    <sc-demo-banner />

    <!-- Nav -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span class="font-bold text-gray-800">SmartClinic</span>
        </a>
        <a routerLink="/" class="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </a>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Book an Appointment</h1>
        <p class="text-gray-500 mt-1">Select your doctor, choose a date, and pick a time slot.</p>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center gap-2 mb-8">
        <div *ngFor="let step of steps; let i = index" class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-smooth"
              [ngClass]="currentStep > i ? 'bg-emerald-500 text-white' : currentStep === i ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'">
              <svg *ngIf="currentStep > i" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span *ngIf="currentStep <= i">{{ i + 1 }}</span>
            </div>
            <span class="text-sm font-medium hidden sm:block"
              [ngClass]="currentStep === i ? 'text-gray-800' : 'text-gray-400'">
              {{ step }}
            </span>
          </div>
          <div *ngIf="i < steps.length - 1" class="w-8 h-0.5 bg-gray-200 mx-1"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left: Form -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Step 1: Doctor Selection -->
          <div class="card">
            <h2 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Select Doctor
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button *ngFor="let doc of doctors"
                (click)="selectDoctor(doc)"
                class="border-2 rounded-xl p-3 text-left transition-smooth hover:border-primary-300"
                [ngClass]="selectedDoctor?.id === doc.id ? 'border-primary-600 bg-primary-50' : 'border-gray-100'">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ doc.avatar }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800 leading-tight">{{ doc.name }}</p>
                    <p class="text-xs text-primary-600">{{ doc.specialty }}</p>
                  </div>
                </div>
                <p class="text-xs text-gray-500">{{ '$' + doc.consultationFee }} / session</p>
              </button>
            </div>
          </div>

          <!-- Step 2: Calendar -->
          <div class="card" *ngIf="selectedDoctor">
            <h2 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Select Date
            </h2>
            <full-calendar [options]="calendarOptions" class="booking-calendar"></full-calendar>
          </div>

          <!-- Step 3: Time Slots -->
          <div class="card" *ngIf="selectedDate">
            <h2 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Select Time Slot
              <span class="text-xs text-gray-400 font-normal ml-auto">{{ selectedDate | date:'EEE, MMM d' }}</span>
            </h2>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button *ngFor="let slot of availableSlots"
                (click)="selectSlot(slot)"
                [disabled]="isSlotBooked(slot)"
                class="py-2 px-3 rounded-lg text-sm font-medium border-2 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
                [ngClass]="selectedSlot === slot
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : isSlotBooked(slot)
                    ? 'border-gray-100 bg-gray-50 text-gray-300'
                    : 'border-gray-200 hover:border-primary-400 text-gray-700'">
                {{ slot }}
                <span *ngIf="isSlotBooked(slot)" class="block text-xs opacity-70">Booked</span>
              </button>
            </div>
            <p *ngIf="availableSlots.length === 0" class="text-sm text-gray-400 text-center py-4">
              No slots available on this day for the selected doctor.
            </p>
          </div>

          <!-- Step 4: Patient Info -->
          <div class="card" *ngIf="selectedSlot">
            <h2 class="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Your Details
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" [(ngModel)]="patientName" placeholder="Jane Doe"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" [(ngModel)]="patientPhone" placeholder="+1 555-000-0000"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
              </div>
            </div>
            <div *ngIf="formError" class="mt-3 text-sm text-red-600 bg-red-50 rounded-lg p-2.5">
              {{ formError }}
            </div>
            <button (click)="confirmBooking()"
              [disabled]="submitting"
              class="mt-5 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-semibold py-3 rounded-xl transition-smooth flex items-center justify-center gap-2">
              <svg *ngIf="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ submitting ? 'Confirming...' : 'Confirm Appointment' }}
            </button>
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="lg:col-span-1">
          <div class="card sticky top-20">
            <h3 class="text-base font-semibold text-gray-800 mb-4">Booking Summary</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Doctor</span>
                <span class="font-medium text-gray-800 text-right">{{ selectedDoctor?.name ?? '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Specialty</span>
                <span class="font-medium text-gray-800">{{ selectedDoctor?.specialty ?? '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Date</span>
                <span class="font-medium text-gray-800">
                  {{ selectedDate ? (selectedDate | date:'MMM d, y') : '—' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Time</span>
                <span class="font-medium text-gray-800">{{ selectedSlot ?? '—' }}</span>
              </div>
              <hr class="border-gray-100"/>
              <div class="flex justify-between font-semibold text-base">
                <span class="text-gray-700">Consultation Fee</span>
                <span class="text-primary-600">{{ selectedDoctor ? ('$' + selectedDoctor.consultationFee) : '$0' }}</span>
              </div>
            </div>

            <div *ngIf="!selectedDoctor" class="mt-6 text-center text-gray-400 text-sm">
              <svg class="w-10 h-10 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Select a doctor to begin
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div *ngIf="showSuccessModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Appointment Confirmed!</h2>
        <p class="text-gray-500 text-sm mb-1">
          Your appointment with <strong>{{ bookedAppt?.doctorName }}</strong>
        </p>
        <p class="text-gray-500 text-sm mb-6">
          on <strong>{{ bookedAppt?.date | date:'EEEE, MMMM d' }}</strong> at
          <strong>{{ bookedAppt?.timeSlot }}</strong> is confirmed.
        </p>
        <div class="bg-gray-50 rounded-xl p-4 text-sm text-left mb-6 space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-500">Patient</span>
            <span class="font-medium">{{ bookedAppt?.patientName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Ref. ID</span>
            <span class="font-mono text-primary-600 text-xs">{{ bookedAppt?.id }}</span>
          </div>
        </div>
        <div class="flex gap-3">
          <button (click)="resetForm()" class="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-smooth text-sm">
            Book Another
          </button>
          <a routerLink="/" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl transition-smooth text-sm flex items-center justify-center">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  `,
})
export class BookingComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private bookingService = inject(BookingService);
  private dataService = inject(DataService);

  doctors = this.doctorService.getAll();

  selectedDoctor: Doctor | null = null;
  selectedDate: Date | null = null;
  selectedSlot: string | null = null;
  patientName = '';
  patientPhone = '';
  formError = '';
  submitting = false;
  showSuccessModal = false;
  bookedAppt: any = null;

  steps = ['Doctor', 'Date', 'Time', 'Details'];

  get currentStep(): number {
    if (!this.selectedDoctor) return 0;
    if (!this.selectedDate) return 1;
    if (!this.selectedSlot) return 2;
    return 3;
  }

  get availableSlots(): string[] {
    if (!this.selectedDoctor || !this.selectedDate) return [];
    const dayOfWeek = this.selectedDate.getDay();
    if (!this.selectedDoctor.availableDays.includes(dayOfWeek)) return [];
    return this.selectedDoctor.availableSlots;
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    selectable: true,
    dateClick: (arg: DateClickArg) => this.onDateClick(arg),
    dayCellClassNames: (arg) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (arg.date < today) return ['fc-day-past'];
      if (this.selectedDoctor) {
        const day = arg.date.getDay();
        if (!this.selectedDoctor.availableDays.includes(day)) return ['fc-day-unavailable'];
      }
      return [];
    },
    events: [],
  };

  ngOnInit(): void {
    this.dataService.initialize();
  }

  selectDoctor(doc: Doctor): void {
    this.selectedDoctor = doc;
    this.selectedDate = null;
    this.selectedSlot = null;
    this.updateCalendarEvents();
  }

  onDateClick(arg: DateClickArg): void {
    const clicked = new Date(arg.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clicked < today) return;
    if (this.selectedDoctor && !this.selectedDoctor.availableDays.includes(clicked.getDay())) return;

    this.selectedDate = clicked;
    this.selectedSlot = null;
    this.updateCalendarEvents();
  }

  isSlotBooked(slot: string): boolean {
    if (!this.selectedDoctor || !this.selectedDate) return false;
    const booked = this.bookingService.getBookedSlots(this.selectedDoctor.id, this.selectedDate);
    return booked.includes(slot);
  }

  selectSlot(slot: string): void {
    if (this.isSlotBooked(slot)) return;
    this.selectedSlot = slot;
  }

  confirmBooking(): void {
    this.formError = '';
    if (!this.patientName.trim()) { this.formError = 'Please enter your full name.'; return; }
    if (!this.patientPhone.trim()) { this.formError = 'Please enter your phone number.'; return; }
    if (!this.selectedDoctor || !this.selectedDate || !this.selectedSlot) return;

    this.submitting = true;
    setTimeout(() => {
      const appt = this.bookingService.addAppointment({
        patientName: this.patientName,
        patientPhone: this.patientPhone,
        doctorId: this.selectedDoctor!.id,
        doctorName: this.selectedDoctor!.name,
        date: this.selectedDate!,
        timeSlot: this.selectedSlot!,
      });
      this.bookedAppt = appt;
      this.submitting = false;
      this.showSuccessModal = true;
    }, 1000);
  }

  resetForm(): void {
    this.selectedDoctor = null;
    this.selectedDate = null;
    this.selectedSlot = null;
    this.patientName = '';
    this.patientPhone = '';
    this.formError = '';
    this.showSuccessModal = false;
    this.bookedAppt = null;
    this.calendarOptions = { ...this.calendarOptions, events: [] };
  }

  private updateCalendarEvents(): void {
    const events: EventInput[] = [];
    if (this.selectedDate) {
      events.push({
        start: this.selectedDate,
        display: 'background',
        backgroundColor: '#3b82f620',
        borderColor: '#3b82f6',
        classNames: ['selected-date'],
      });
    }
    this.calendarOptions = { ...this.calendarOptions, events };
  }
}
