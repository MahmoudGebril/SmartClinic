import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemoBannerComponent } from '../shared/components/demo-banner.component';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'sc-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, DemoBannerComponent],
  template: `
    <sc-demo-banner />

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span class="font-bold text-gray-800 text-lg">SmartClinic</span>
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/auth/login"
            class="text-sm text-gray-600 hover:text-primary-600 font-medium transition-smooth">
            Admin Login
          </a>
          <a routerLink="/book"
            class="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-smooth">
            Book Now
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="bg-gradient-to-br from-primary-600 to-blue-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div class="max-w-2xl">
          <span class="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Trusted by 2,000+ Patients
          </span>
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your Health, Our Priority
          </h1>
          <p class="text-blue-100 text-lg mb-8 leading-relaxed">
            Book appointments with top specialists in seconds.
            No waiting rooms, no hassle — just quality healthcare when you need it.
          </p>
          <div class="flex flex-wrap gap-3">
            <a routerLink="/book"
              class="bg-white text-primary-700 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-smooth shadow-lg">
              Book Appointment
            </a>
            <a href="#doctors"
              class="border-2 border-white/40 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-smooth">
              Meet Our Doctors
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center" *ngFor="let stat of stats">
          <p class="text-2xl font-bold text-primary-600">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-800">Our Services</h2>
          <p class="text-gray-500 mt-2">Comprehensive care for every stage of life</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let service of services"
            class="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-smooth border border-gray-50">
            <div class="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="service.icon"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-800 mb-1">{{ service.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Doctors -->
    <section id="doctors" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-800">Meet Our Specialists</h2>
          <p class="text-gray-500 mt-2">Experienced doctors dedicated to your wellbeing</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let doctor of doctors"
            class="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-smooth">
            <div class="bg-gradient-to-br from-primary-50 to-blue-100 h-32 flex items-center justify-center">
              <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {{ doctor.avatar }}
              </div>
            </div>
            <div class="p-5">
              <h3 class="font-semibold text-gray-800 text-lg">{{ doctor.name }}</h3>
              <p class="text-primary-600 text-sm font-medium mb-2">{{ doctor.specialty }}</p>
              <p class="text-gray-500 text-sm leading-relaxed mb-4">{{ doctor.bio }}</p>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-1 text-amber-500">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="font-semibold text-gray-700">{{ doctor.rating }}</span>
                </div>
                <span class="text-gray-500">{{ doctor.experience }} yrs exp.</span>
                <span class="text-primary-600 font-semibold">{{ '$' + doctor.consultationFee }}</span>
              </div>
              <a routerLink="/book"
                class="mt-4 block text-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-smooth">
                Book with {{ doctor.name.split(' ')[1] }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-primary-600 py-16">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-3">Ready to Book Your Appointment?</h2>
        <p class="text-blue-100 mb-8">Join thousands of patients who trust SmartClinic for their healthcare needs.</p>
        <a routerLink="/book"
          class="inline-block bg-white text-primary-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-smooth shadow-lg text-lg">
          Book Appointment Now
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="flex items-center justify-center gap-2 mb-3">
          <div class="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span class="text-white font-semibold">SmartClinic</span>
        </div>
        <p class="text-sm">© 2026 SmartClinic — Portfolio Demo System. All data is fictional.</p>
      </div>
    </footer>
  `,
})
export class LandingComponent {
  private doctorService = inject(DoctorService);
  doctors = this.doctorService.getAll();

  stats = [
    { value: '+٢٤٠٠', label: 'مريض راضٍ' },
    { value: '٣', label: 'أطباء متخصصون' },
    { value: '٩٨٪', label: 'نسبة الرضا' },
    { value: '٥ دقائق', label: 'متوسط وقت الحجز' },
  ];

  services = [
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      title: 'General Practice',
      desc: 'Comprehensive primary care for all ages. Annual checkups, vaccinations, and preventive screenings.',
    },
    {
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      title: 'Cardiology',
      desc: 'Advanced heart health diagnostics, ECG, stress tests, and personalized cardiac care plans.',
    },
    {
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      title: 'Pediatrics',
      desc: 'Specialized care for children from newborns through adolescence. Growth monitoring and immunizations.',
    },
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Preventive Care',
      desc: 'Proactive health screenings and lifestyle coaching to keep you healthy and prevent future illness.',
    },
    {
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      title: 'Lab Tests',
      desc: 'On-site lab services for blood work, urinalysis, and diagnostic panels with fast turnaround.',
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Telehealth',
      desc: 'Virtual consultations from the comfort of home. Available for follow-ups and minor health concerns.',
    },
  ];
}
