/**
 * Mock data for teachers in frontend-only mode
 */
export const mockTeachers = [
  {
    id: "teacher-1",
    userId: "mock-teacher-1",
    specialization: "حفظ القرآن الكريم",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    yearsOfExperience: 8,
    approvalStatus: "APPROVED",
    isAvailable: true,
    averageRating: 4.8,
    reviewCount: 24,
    user: {
      id: "mock-teacher-1",
      name: "أحمد محمد",
      email: "teacher@example.com",
      image: "/images/learn-quran.jpg",
      bio: "مدرس قرآن كريم ذو خبرة 8 سنوات في تعليم الأطفال والكبار، حافظ للقرآن ومجاز بالقراءات العشر",
      gender: "MALE",
      role: "TEACHER"
    },
    availabilities: [
      { id: "avail-1", teacherId: "mock-teacher-1", dayOfWeek: 1, startTime: "2025-05-05T08:00:00Z", endTime: "2025-05-05T12:00:00Z", isRecurring: true },
      { id: "avail-2", teacherId: "mock-teacher-1", dayOfWeek: 3, startTime: "2025-05-07T08:00:00Z", endTime: "2025-05-07T12:00:00Z", isRecurring: true },
      { id: "avail-3", teacherId: "mock-teacher-1", dayOfWeek: 5, startTime: "2025-05-09T15:00:00Z", endTime: "2025-05-09T19:00:00Z", isRecurring: true }
    ],
    reviews: [
      { id: "review-1", rating: 5, comment: "ممتاز في التعليم وصبور جدا", userId: "mock-user-1", teacherId: "mock-teacher-1", bookingId: "booking-1", createdAt: "2025-04-15T10:20:00Z", user: { id: "mock-user-1", name: "طالب نموذجي", image: "/images/kid-learns-online.png" } },
      { id: "review-2", rating: 4, comment: "معلم رائع ويشرح بشكل واضح", userId: "mock-user-2", teacherId: "mock-teacher-1", bookingId: "booking-2", createdAt: "2025-04-10T14:30:00Z", user: { id: "mock-user-2", name: "محمد علي", image: null } }
    ]
  },
  {
    id: "teacher-2",
    userId: "mock-teacher-2",
    specialization: "تجويد وتلاوة القرآن",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    yearsOfExperience: 12,
    approvalStatus: "APPROVED",
    isAvailable: true,
    averageRating: 4.9,
    reviewCount: 31,
    user: {
      id: "mock-teacher-2",
      name: "فاطمة أحمد",
      email: "teacher2@example.com",
      image: "/images/learn-quran2.avif",
      bio: "مدرسة قرآن كريم وتجويد، مجازة بالقراءات السبع. خبرة 12 عام في تعليم النساء والأطفال",
      gender: "FEMALE",
      role: "TEACHER"
    },
    availabilities: [
      { id: "avail-4", teacherId: "mock-teacher-2", dayOfWeek: 2, startTime: "2025-05-06T14:00:00Z", endTime: "2025-05-06T18:00:00Z", isRecurring: true },
      { id: "avail-5", teacherId: "mock-teacher-2", dayOfWeek: 4, startTime: "2025-05-08T14:00:00Z", endTime: "2025-05-08T18:00:00Z", isRecurring: true },
      { id: "avail-6", teacherId: "mock-teacher-2", dayOfWeek: 6, startTime: "2025-05-10T10:00:00Z", endTime: "2025-05-10T14:00:00Z", isRecurring: true }
    ],
    reviews: [
      { id: "review-3", rating: 5, comment: "أفضل معلمة قرآن تعاملت معها، أسلوبها ممتاز", userId: "mock-user-3", teacherId: "mock-teacher-2", bookingId: "booking-3", createdAt: "2025-04-20T11:15:00Z", user: { id: "mock-user-3", name: "سارة محمد", image: null } },
      { id: "review-4", rating: 5, comment: "مدرسة ممتازة وصبورة مع الأطفال", userId: "mock-user-4", teacherId: "mock-teacher-2", bookingId: "booking-4", createdAt: "2025-04-18T16:45:00Z", user: { id: "mock-user-4", name: "نورة عبدالله", image: "/images/islamic-pattern.png" } }
    ]
  },
  {
    id: "teacher-3",
    userId: "mock-teacher-3",
    specialization: "تفسير وعلوم القرآن",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    yearsOfExperience: 15,
    approvalStatus: "APPROVED",
    isAvailable: true,
    averageRating: 4.7,
    reviewCount: 19,
    user: {
      id: "mock-teacher-3",
      name: "عمر عبدالله",
      email: "teacher3@example.com",
      image: "/images/man-reading.avif",
      bio: "دكتور في التفسير وعلوم القرآن، خبرة 15 عام في التدريس، حافظ للقرآن الكريم",
      gender: "MALE",
      role: "TEACHER"
    },
    availabilities: [
      { id: "avail-7", teacherId: "mock-teacher-3", dayOfWeek: 0, startTime: "2025-05-04T19:00:00Z", endTime: "2025-05-04T22:00:00Z", isRecurring: true },
      { id: "avail-8", teacherId: "mock-teacher-3", dayOfWeek: 2, startTime: "2025-05-06T19:00:00Z", endTime: "2025-05-06T22:00:00Z", isRecurring: true },
      { id: "avail-9", teacherId: "mock-teacher-3", dayOfWeek: 4, startTime: "2025-05-08T19:00:00Z", endTime: "2025-05-08T22:00:00Z", isRecurring: true }
    ],
    reviews: [
      { id: "review-5", rating: 5, comment: "معلم متمكن ويشرح التفسير بطريقة سهلة ومبسطة", userId: "mock-user-5", teacherId: "mock-teacher-3", bookingId: "booking-5", createdAt: "2025-04-22T20:10:00Z", user: { id: "mock-user-5", name: "خالد محمد", image: null } },
      { id: "review-6", rating: 4, comment: "دروس مفيدة جدا وعميقة في التفسير", userId: "mock-user-6", teacherId: "mock-teacher-3", bookingId: "booking-6", createdAt: "2025-04-21T19:30:00Z", user: { id: "mock-user-6", name: "عبدالرحمن سعيد", image: null } }
    ]
  }
];