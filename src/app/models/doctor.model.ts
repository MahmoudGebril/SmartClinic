export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  availableDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  availableSlots: string[];
  bio: string;
  experience: number; // years
  rating: number;
  consultationFee: number;
}
