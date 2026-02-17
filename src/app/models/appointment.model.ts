export type AppointmentStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  timeSlot: string;
  status: AppointmentStatus;
  revenue: number;
  notes?: string;
}
