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
}

export interface Booking {
  id: string;
  userId: string;
  teacherId: string;
  date: string; // ISO date
  time: string; // e.g. '18:00'
  status: 'pending' | 'confirmed' | 'cancelled';
}