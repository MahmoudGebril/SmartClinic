import { Injectable } from '@angular/core';
import { Doctor } from '../models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private doctors: Doctor[] = [
    {
      id: 'doc-1',
      name: 'Dr. Layla Al-Rashidi',
      specialty: 'General Practice',
      avatar: 'LA',
      availableDays: [1, 2, 3, 4, 5], // Mon–Fri
      availableSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
      bio: 'طبيبة عامة ذات خبرة 12 عاماً في تقديم الرعاية الصحية الشاملة للمرضى.',
      experience: 12,
      rating: 4.9,
      consultationFee: 80,
    },
    {
      id: 'doc-2',
      name: 'Dr. Khalid Al-Mansouri',
      specialty: 'Cardiology',
      avatar: 'KM',
      availableDays: [1, 3, 5], // Mon, Wed, Fri
      availableSlots: ['10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00', '16:30'],
      bio: 'استشاري أمراض القلب متخصص في الوقاية والتشخيص المبكر لأمراض القلب.',
      experience: 18,
      rating: 4.8,
      consultationFee: 150,
    },
    {
      id: 'doc-3',
      name: 'Dr. Nour Al-Hassan',
      specialty: 'Pediatrics',
      avatar: 'NH',
      availableDays: [1, 2, 3, 4], // Mon–Thu
      availableSlots: ['08:30', '09:00', '09:30', '10:00', '13:00', '13:30', '14:00', '14:30'],
      bio: 'طبيبة أطفال متفانية في رعاية صحة الأطفال من حديثي الولادة حتى سن المراهقة.',
      experience: 10,
      rating: 4.9,
      consultationFee: 100,
    },
  ];

  getAll(): Doctor[] {
    return this.doctors;
  }

  getById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }
}
