import { Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { DashboardStats, DashboardChartData } from '../../models';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'sc-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="space-y-6">

      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-0.5">Analytics overview — last 3 months of mock data</p>
      </div>

      <!-- Loading state -->
      <sc-loading-spinner *ngIf="loading" message="Loading analytics..."/>

      <ng-container *ngIf="!loading && stats">

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <sc-stat-card
            label="Total Appointments"
            [value]="stats.totalAppointments"
            iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            iconBgClass="bg-blue-50"
            iconClass="text-primary-600"
            subLabel="All time"
          />
          <sc-stat-card
            label="Today's Appointments"
            [value]="stats.todayAppointments"
            iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            iconBgClass="bg-violet-50"
            iconClass="text-violet-600"
            subLabel="Scheduled for today"
          />
          <sc-stat-card
            label="Monthly Revenue"
            [value]="stats.monthlyRevenue"
            prefix="$"
            iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            iconBgClass="bg-emerald-50"
            iconClass="text-emerald-600"
            subLabel="Current month"
          />
          <sc-stat-card
            label="No-Show Rate"
            [value]="stats.noShowRate"
            suffix="%"
            iconPath="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            iconBgClass="bg-red-50"
            iconClass="text-red-500"
            subLabel="Missed appointments"
          />
        </div>

        <!-- Secondary stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="card text-center">
            <p class="text-3xl font-bold text-emerald-600">{{ stats.completedAppointments }}</p>
            <p class="text-sm text-gray-500 mt-1">Completed</p>
          </div>
          <div class="card text-center">
            <p class="text-3xl font-bold text-amber-500">{{ stats.scheduledAppointments }}</p>
            <p class="text-sm text-gray-500 mt-1">Scheduled</p>
          </div>
          <div class="card text-center">
            <p class="text-3xl font-bold text-red-500">{{ stats.missedAppointments }}</p>
            <p class="text-sm text-gray-500 mt-1">Missed</p>
          </div>
        </div>

        <!-- Charts row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Appointments per day -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-800">Appointments Per Day</h3>
                <p class="text-xs text-gray-400 mt-0.5">Last 7 days</p>
              </div>
              <div class="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <canvas #barChart></canvas>
          </div>

          <!-- Revenue trend -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-800">Revenue Trend</h3>
                <p class="text-xs text-gray-400 mt-0.5">Last 8 weeks</p>
              </div>
              <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
            </div>
            <canvas #lineChart></canvas>
          </div>
        </div>

        <!-- Charts row 2 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Doctor distribution -->
          <div class="card lg:col-span-1">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-800">Doctor Distribution</h3>
                <p class="text-xs text-gray-400 mt-0.5">Appointments per doctor</p>
              </div>
            </div>
            <div class="flex justify-center">
              <canvas #pieChart style="max-height:220px"></canvas>
            </div>
          </div>

          <!-- Appointment status -->
          <div class="card lg:col-span-2">
            <h3 class="font-semibold text-gray-800 mb-4">Appointment Status Breakdown</h3>
            <div class="space-y-4">
              <div *ngFor="let item of statusBreakdown">
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="text-gray-600">{{ item.label }}</span>
                  <span class="font-medium text-gray-800">{{ item.count }} ({{ item.pct }}%)</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all duration-500"
                    [ngClass]="item.barClass"
                    [style.width.%]="item.pct">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </ng-container>
    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private dataService = inject(DataService);

  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  loading = true;
  stats: DashboardStats | null = null;
  chartData: DashboardChartData | null = null;
  statusBreakdown: { label: string; count: number; pct: number; barClass: string }[] = [];

  private charts: Chart[] = [];
  private chartsRendered = false;

  ngOnInit(): void {
    this.dataService.initialize();
    // Brief delay to show loading state
    setTimeout(() => {
      this.stats = this.dataService.computeStats();
      this.chartData = this.dataService.computeChartData();
      this.buildStatusBreakdown();
      this.chartsRendered = false;
      this.loading = false;
    }, 600);
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
    if (!this.loading && !this.chartsRendered && this.barChartRef) {
      this.chartsRendered = true;
      this.renderCharts();
    }
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  private buildStatusBreakdown(): void {
    if (!this.stats) return;
    const total = this.stats.totalAppointments;
    this.statusBreakdown = [
      {
        label: 'Completed',
        count: this.stats.completedAppointments,
        pct: Math.round((this.stats.completedAppointments / total) * 100),
        barClass: 'bg-emerald-500',
      },
      {
        label: 'Scheduled',
        count: this.stats.scheduledAppointments,
        pct: Math.round((this.stats.scheduledAppointments / total) * 100),
        barClass: 'bg-primary-500',
      },
      {
        label: 'Missed',
        count: this.stats.missedAppointments,
        pct: Math.round((this.stats.missedAppointments / total) * 100),
        barClass: 'bg-red-400',
      },
    ];
  }

  /** Called from template after loading state clears via ngAfterViewChecked equivalent */
  renderCharts(): void {
    if (!this.chartData || !this.barChartRef) return;

    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const { appointmentsPerDay, revenueTrend, doctorDistribution } = this.chartData;

    // Bar chart — appointments per day
    this.charts.push(new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: appointmentsPerDay.map(d => d.label),
        datasets: [{
          label: 'Appointments',
          data: appointmentsPerDay.map(d => d.value),
          backgroundColor: '#3b82f640',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { stepSize: 1 } },
          x: { grid: { display: false } },
        },
      },
    }));

    // Line chart — revenue trend
    this.charts.push(new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: revenueTrend.map(d => d.label),
        datasets: [{
          label: 'Revenue ($)',
          data: revenueTrend.map(d => d.value),
          borderColor: '#10b981',
          backgroundColor: '#10b98115',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } },
        },
      },
    }));

    // Pie chart — doctor distribution
    this.charts.push(new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: doctorDistribution.map(d => d.label),
        datasets: [{
          data: doctorDistribution.map(d => d.value),
          backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
        },
      },
    }));
  }
}
