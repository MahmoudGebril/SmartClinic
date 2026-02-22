# SmartClinic

[![Angular](https://img.shields.io/badge/Angular-20+-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org)
[![FullCalendar](https://img.shields.io/badge/FullCalendar-6.x-3B82F6)](https://fullcalendar.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A **portfolio-grade** clinic appointment and analytics system built with **Angular 20+** standalone components and Angular Signals. Designed to look and feel like a real private-clinic SaaS product — clean, bilingual (EN/AR), and fully data-driven with a mock data engine. No backend required.

---

## Why I built this

I wanted to push past typical todo-app demos and build something that reflects how I approach real frontend architecture: reactive state management with signals, lazy-loaded feature modules, clean service boundaries, and a UI that can pass for production. SmartClinic is the result.

---

## Live Demo

> Clone the repo, run `npm install && ng serve`, and open `http://localhost:4300`
>
> Admin login: any email + any password (demo mode)

---

## Screenshots

| Landing Page | Booking Wizard | Admin Dashboard |
|---|---|---|
| Hero with doctor cards and bilingual stats | 4-step wizard with FullCalendar | KPI cards + Chart.js analytics |

| Appointments Table | Doctors Directory |
|---|---|
| Searchable, sortable, paginated 200-row table | Doctor cards with real performance stats |

---

## Tech Stack

| Tech | Version | Why |
|---|---|---|
| **Angular** | 20+ | Standalone components, signals, `@if`/`@for`, lazy routes |
| **TypeScript** | 5.9 | Strict typing across all models and services |
| **TailwindCSS** | 3.x | Utility-first with custom medical design tokens |
| **Chart.js** | 4.x | Bar, line, and pie charts on the dashboard |
| **FullCalendar** | 6.x | Interactive date picker in the booking flow |
| **Angular Signals** | built-in | Reactive state without RxJS boilerplate |

---

## Features

### Patient-Facing
- **Landing page** — hero section, 6 services, 3 doctor profiles, Arabic stats bar, CTA footer
- **Booking wizard** — 4 steps: pick doctor → pick date (FullCalendar) → pick time slot → enter details
- Real-time slot availability based on doctor schedule and existing bookings
- Success modal with appointment reference ID

### Admin Portal
- **Auth guard** protecting all `/admin/**` routes (session-persisted)
- **Collapsible sidebar** with smooth toggle via Angular Signals
- **Dashboard** — 4 KPI cards, bar/line/pie charts, status breakdown bars
- **Appointments table** — search, filter by status/doctor, multi-column sort, pagination (15/page)
- **Doctors directory** — individual performance cards with revenue, completion rate, schedule

---

## Architecture

```
src/app/
├── core/
│   └── auth.guard.ts           # CanActivateFn using AuthService signal
├── models/
│   ├── appointment.model.ts    # Appointment + AppointmentStatus types
│   ├── doctor.model.ts
│   └── dashboard-stats.model.ts
├── services/
│   ├── auth.service.ts         # Signal-based auth with sessionStorage
│   ├── doctor.service.ts       # Static doctor catalogue
│   ├── booking.service.ts      # Signal store for appointments
│   └── data.service.ts         # Generates 200 mock appointments on init
├── shared/
│   └── components/             # DemoBanner, StatCard, LoadingSpinner
├── auth/
│   └── login.component.ts
├── booking/
│   ├── landing.component.ts
│   └── booking.component.ts
└── admin/
    ├── admin-layout.component.ts
    ├── dashboard/
    ├── appointments/
    └── doctors/
```

### Key technical decisions

- **Angular Signals over RxJS** — all reactive state (auth, appointments list, filters, pagination) uses `signal()` and `computed()`. No `BehaviorSubject` or `async` pipe needed.
- **Lazy loading** — every route uses `loadComponent()` so the initial bundle is small.
- **Mock data engine** — `DataService.initialize()` generates 200 appointments with weighted statuses (65% completed / 20% missed / 15% scheduled) and calculates all dashboard stats dynamically. One source of truth.
- **Inline templates** — components are single-file for this demo scale. Easy to read, easy to review.

---

## Getting Started

```bash
git clone https://github.com/MahmoudGebril/SmartClinic.git
cd SmartClinic
npm install
ng serve --port 4300
```

Open `http://localhost:4300`

**Admin:** navigate to `/auth/login` and enter any email + password.

---

## Mock Data Details

`DataService` generates appointments on app init:

```typescript
// Weighted status distribution
if (rand < 0.65)       status = 'completed';
else if (rand < 0.85)  status = 'missed';
else                   status = 'scheduled';

// Revenue only for completed appointments
revenue = status === 'completed'
  ? doctor.consultationFee + Math.floor(Math.random() * 50)
  : 0;
```

All dashboard KPIs, charts, and doctor stats are computed directly from this array — no hardcoded numbers anywhere.

---

## Doctors

| Name | Specialty | Fee | Available |
|---|---|---|---|
| Dr. Layla Al-Rashidi | General Practice | $80 | Mon–Fri |
| Dr. Khalid Al-Mansouri | Cardiology | $150 | Mon / Wed / Fri |
| Dr. Nour Al-Hassan | Pediatrics | $100 | Mon–Thu |

---

*Built as a portfolio project to demonstrate Angular 20+ architecture, reactive UI patterns, and product-quality UI design.*
