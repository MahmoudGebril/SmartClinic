export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  monthlyRevenue: number;
  noShowRate: number; // percentage 0-100
  completedAppointments: number;
  missedAppointments: number;
  scheduledAppointments: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardChartData {
  appointmentsPerDay: ChartDataPoint[];  // last 7 days
  revenueTrend: ChartDataPoint[];        // last 8 weeks
  doctorDistribution: ChartDataPoint[];  // per doctor
}
