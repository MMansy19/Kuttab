export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'teacher';
  avatarUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  bio: string;
  subjects: string[];
  rating: number; 
  avatarUrl?: string;
  availableSlots: string[]; // ISO date strings
  experience: number; // in years
  tags?: string[]; // e.g. ['islamic studies', 'quran', 'tajweed'],
  isPaid: boolean; // true if the teacher charges for lessons
  price?: number | null; // price per lesson in currency units, can be null for free teachers
  videoUrl?: string; // URL to a video introduction  gender: 'ذكر' | 'أنثى';
  specialization?: string[];
  joinedDate?: string;
  education?: string;
  certifications?: string[];
  teachingApproach?: string;
  sessionsCompleted?: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    telegram?: string;
  };
  languages?: string[];
  achievements?: string[];
  gender: string;
}


export interface Booking {
  id: string;
  userId: string;
  teacherId: string;
  date: string; // ISO date
  time: string; // e.g. '18:00'
  status: 'pending' | 'confirmed' | 'cancelled';
}