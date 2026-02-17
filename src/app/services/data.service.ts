import { Injectable } from '@angular/core';
import { Appointment, DashboardStats, DashboardChartData, ChartDataPoint } from '../models';
import { environment } from '../../environments/environment';
import { DoctorService } from './doctor.service';
import { BookingService } from './booking.service';

const PATIENT_NAMES = [
  'Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Omar Ibn Khaldun', 'Layla Hassan',
  'Khalid Al-Farsi', 'Nour El-Sayed', 'Yousef Al-Mansouri', 'Mariam Qasim',
  'Tariq Al-Amin', 'Hana Al-Khalidi', 'Bilal Nasser', 'Rania Al-Jabri',
  'Samir Al-Hourani', 'Dina Mostafa', 'Faisal Al-Otaibi', 'Amira Karim',
  'Ziad Al-Kurdi', 'Salma Bint Hamad', 'Walid Barakat', 'Lina Al-Shami',
  'Kareem Abdallah', 'Huda Al-Tamimi', 'Nabil Rida', 'Sara Al-Qasim',
  'Ibrahim Al-Bakr', 'Mona Zaki', 'Anas Al-Harbi', 'Reem Al-Sulaiti',
  'Hassan Al-Douri', 'Aisha Bint Yusuf',
];

@Injectable({ providedIn: 'root' })
export class DataService {
  private initialized = false;

  constructor(
    private doctorService: DoctorService,
    private bookingService: BookingService,
  ) {}

  /** Call once at app boot — generates 200 fake appointments */
  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    const appointments = this.generateAppointments();
    this.bookingService.seedAppointments(appointments);
  }

  private generateAppointments(): Appointment[] {
    const doctors = this.doctorService.getAll();
    const { totalAppointments, monthsBack } = environment.mockDataConfig;
    const now = new Date();
    const result: Appointment[] = [];

    for (let i = 0; i < totalAppointments; i++) {
      const doctor = doctors[i % doctors.length];
      const daysAgo = Math.floor(Math.random() * (monthsBack * 30));
      const apptDate = new Date(now);
      apptDate.setDate(now.getDate() - daysAgo);
      apptDate.setHours(0, 0, 0, 0);

      const slot = doctor.availableSlots[Math.floor(Math.random() * doctor.availableSlots.length)];
      const name = PATIENT_NAMES[i % PATIENT_NAMES.length];

      // Weighted statuses: 65% completed, 20% missed, 15% scheduled
      const rand = Math.random();
      let status: Appointment['status'];
      if (rand < 0.65) status = 'completed';
      else if (rand < 0.85) status = 'missed';
      else status = 'scheduled';

      // Only completed ones generate revenue
      const revenue = status === 'completed'
        ? doctor.consultationFee + Math.floor(Math.random() * 50)
        : 0;

      result.push({
        id: `mock-${i + 1}`,
        patientName: name,
        patientPhone: `+966 5${String(10000000 + i * 7).slice(0, 8)}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: apptDate,
        timeSlot: slot,
        status,
        revenue,
      });
    }

    return result;
  }

  computeStats(): DashboardStats {
    const all = this.bookingService.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppts = all.filter(a => new Date(a.date).toDateString() === today.toDateString());

    // Monthly revenue — current month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = all
      .filter(a => new Date(a.date) >= monthStart && a.status === 'completed')
      .reduce((sum, a) => sum + a.revenue, 0);

    const missed = all.filter(a => a.status === 'missed').length;
    const noShowRate = all.length > 0 ? Math.round((missed / all.length) * 100) : 0;

    return {
      totalAppointments: all.length,
      todayAppointments: todayAppts.length,
      monthlyRevenue,
      noShowRate,
      completedAppointments: all.filter(a => a.status === 'completed').length,
      missedAppointments: missed,
      scheduledAppointments: all.filter(a => a.status === 'scheduled').length,
    };
  }

  computeChartData(): DashboardChartData {
    const all = this.bookingService.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Appointments per day (last 7 days) ---
    const appointmentsPerDay: ChartDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const count = all.filter(a => new Date(a.date).toDateString() === d.toDateString()).length;
      appointmentsPerDay.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        value: count,
      });
    }

    // --- Revenue trend (last 8 weeks) ---
    const revenueTrend: ChartDataPoint[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      const revenue = all
        .filter(a => {
          const d = new Date(a.date);
          return d >= weekStart && d <= weekEnd && a.status === 'completed';
        })
        .reduce((sum, a) => sum + a.revenue, 0);
      revenueTrend.push({
        label: `Wk ${8 - i}`,
        value: revenue,
      });
    }

    // --- Doctor distribution ---
    const doctorMap = new Map<string, number>();
    all.forEach(a => {
      doctorMap.set(a.doctorName, (doctorMap.get(a.doctorName) ?? 0) + 1);
    });
    const doctorDistribution: ChartDataPoint[] = Array.from(doctorMap.entries()).map(
      ([label, value]) => ({ label, value })
    );

    return { appointmentsPerDay, revenueTrend, doctorDistribution };
  }
}
