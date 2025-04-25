import type { Teacher } from '../../../types';
import TeacherProfile from '../../../components/TeacherProfile';

// بيانات وهمية لمعلم
const mockTeacher: Teacher = {
  id: '1',
  name: 'أ. محمد علي',
  bio: 'معلم رياضيات بخبرة 10 سنوات في تدريس المرحلة الثانوية.',
  subjects: ['رياضيات'],
  rating: 4.8,
  avatarUrl: '',
  availableSlots: ['2025-04-28 18:00', '2025-04-29 17:00'],
};

export default function TeacherProfilePage() {
  return <TeacherProfile teacher={mockTeacher} />;
}