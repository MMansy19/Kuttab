import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, setHours, setMinutes, format } from 'date-fns'

// Import types from generated prisma schema location
// Using enums directly since they aren't exported from @prisma/client
const prisma = new PrismaClient()

// Define the enums that match the schema
enum Role {
  USER = "USER",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN"
}

enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW"
}

enum NotificationType {
  BOOKING_REQUEST = "BOOKING_REQUEST",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_CANCELED = "BOOKING_CANCELED",
  BOOKING_REMINDER = "BOOKING_REMINDER",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
  ACCOUNT_UPDATE = "ACCOUNT_UPDATE",
  ADMIN_MESSAGE = "ADMIN_MESSAGE"
}

async function main() {
  console.log('Starting database seeding...')

  // Clean existing data
  console.log('Cleaning existing data...')
  await prisma.notification.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.booking.deleteMany({})
  await prisma.teacherAvailability.deleteMany({})
  await prisma.teacherProfile.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.user.deleteMany({})

  // Create admin user
  console.log('Creating admin user...')
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@kottab.com',
      password: adminPassword,
      role: Role.ADMIN,
      image: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    },
  })

  // Create regular users
  console.log('Creating regular users...')
  const userPassword = await bcrypt.hash('User123!', 10)
  
  const user1 = await prisma.user.create({
    data: {
      name: 'محمد أحمد',
      email: 'user1@example.com',
      password: userPassword,
      role: Role.USER,
      gender: 'male',
      image: 'https://ui-avatars.com/api/?name=محمد+أحمد&background=4F46E5&color=fff',
    },
  })
  
  const user2 = await prisma.user.create({
    data: {
      name: 'فاطمة محمد',
      email: 'user2@example.com',
      password: userPassword,
      role: Role.USER,
      gender: 'female',
      image: 'https://ui-avatars.com/api/?name=فاطمة+محمد&background=D946EF&color=fff',
    },
  })

  // Create teachers
  console.log('Creating teachers...')
  const teacherPassword = await bcrypt.hash('Teacher123!', 10)
  
  // Teacher 1 - Approved
  const teacher1 = await prisma.user.create({
    data: {
      name: 'الشيخ عبدالرحمن',
      email: 'teacher1@example.com',
      password: teacherPassword,
      role: Role.TEACHER,
      gender: 'male',
      bio: 'حافظ للقرآن الكريم بالقراءات العشر، متخصص في تعليم القرآن الكريم وتجويده للكبار والصغار. خبرة أكثر من 15 سنة في التدريس.',
      image: 'https://ui-avatars.com/api/?name=عبدالرحمن+الشيخ&background=059669&color=fff',
      teacherProfile: {
        create: {
          specialization: 'القراءات العشر والتجويد',
          yearsOfExperience: 15,
          approvalStatus: ApprovalStatus.APPROVED,
          isAvailable: true,
          averageRating: 4.8,
          reviewCount: 24,
        },
      },
    },
  })

  // Teacher 2 - Approved
  const teacher2 = await prisma.user.create({
    data: {
      name: 'أستاذة نور',
      email: 'teacher2@example.com',
      password: teacherPassword,
      role: Role.TEACHER,
      gender: 'female',
      bio: 'متخصصة في تحفيظ القرآن للأطفال بأساليب تربوية حديثة. أحمل إجازة في رواية حفص عن عاصم وشهادة في التربية الإسلامية.',
      image: 'https://ui-avatars.com/api/?name=نور+احمد&background=DB2777&color=fff',
      teacherProfile: {
        create: {
          specialization: 'تحفيظ الأطفال',
          yearsOfExperience: 8,
          approvalStatus: ApprovalStatus.APPROVED,
          isAvailable: true,
          averageRating: 4.6,
          reviewCount: 15,
        },
      },
    },
  })

  // Teacher 3 - Pending
  const teacher3 = await prisma.user.create({
    data: {
      name: 'أستاذ خالد',
      email: 'teacher3@example.com',
      password: teacherPassword,
      role: Role.TEACHER,
      gender: 'male',
      bio: 'متخصص في تعليم اللغة العربية والعلوم الشرعية. حاصل على ماجستير في الفقه الإسلامي.',
      image: 'https://ui-avatars.com/api/?name=خالد+محمد&background=9333EA&color=fff',
      teacherProfile: {
        create: {
          specialization: 'اللغة العربية والعلوم الشرعية',
          yearsOfExperience: 5,
          approvalStatus: ApprovalStatus.PENDING,
          isAvailable: true,
        },
      },
    },
  })

  // Create teacher availability
  console.log('Creating teacher availability...')
  
  // Helper function to create availability slots
  const createAvailabilitySlots = async (teacherId: string) => {
    // Days 0-6 (Sunday-Saturday)
    for (let day = 0; day < 7; day++) {
      // Skip Friday (day 5) for teacher1
      if (teacherId === teacher1.id && day === 5) continue;
      
      // Different time slots for each teacher
      if (teacherId === teacher1.id) {
        // Morning slots
        await prisma.teacherAvailability.create({
          data: {
            teacherId,
            dayOfWeek: day,
            startTime: new Date(2025, 0, 1, 8, 0), // 8:00 AM 
            endTime: new Date(2025, 0, 1, 10, 0),  // 10:00 AM
            isRecurring: true,
          },
        });
        // Evening slots
        await prisma.teacherAvailability.create({
          data: {
            teacherId,
            dayOfWeek: day,
            startTime: new Date(2025, 0, 1, 18, 0), // 6:00 PM 
            endTime: new Date(2025, 0, 1, 20, 0),   // 8:00 PM
            isRecurring: true,
          },
        });
      } else if (teacherId === teacher2.id) {
        // Afternoon slots for teacher2
        await prisma.teacherAvailability.create({
          data: {
            teacherId,
            dayOfWeek: day,
            startTime: new Date(2025, 0, 1, 15, 0), // 3:00 PM 
            endTime: new Date(2025, 0, 1, 18, 0),   // 6:00 PM
            isRecurring: true,
          },
        });
      }
    }
  };

  await createAvailabilitySlots(teacher1.id);
  await createAvailabilitySlots(teacher2.id);

  // Create bookings
  console.log('Creating bookings...')
  
  const today = new Date();
  
  // Upcoming booking for user1 with teacher1
  const upcomingBooking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      teacherProfileId: (await prisma.teacherProfile.findUnique({ where: { userId: teacher1.id } }))!.id,
      startTime: addDays(setHours(setMinutes(today, 0), 18), 1), // Tomorrow 6:00 PM
      endTime: addDays(setHours(setMinutes(today, 0), 19), 1),   // Tomorrow 7:00 PM
      status: BookingStatus.CONFIRMED,
      notes: 'سورة البقرة من الآية 1 إلى 20',
    },
  });

  // Past completed booking for user1 with teacher1
  const pastBooking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      teacherProfileId: (await prisma.teacherProfile.findUnique({ where: { userId: teacher1.id } }))!.id,
      startTime: addDays(setHours(setMinutes(today, 0), 18), -3), // 3 days ago 6:00 PM
      endTime: addDays(setHours(setMinutes(today, 0), 19), -3),   // 3 days ago 7:00 PM
      status: BookingStatus.COMPLETED,
      notes: 'سورة الفاتحة وآيات من البقرة',
    },
  });

  // Upcoming booking for user2 with teacher2
  const upcomingBooking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      teacherProfileId: (await prisma.teacherProfile.findUnique({ where: { userId: teacher2.id } }))!.id,
      startTime: addDays(setHours(setMinutes(today, 0), 15), 2), // Day after tomorrow 3:00 PM
      endTime: addDays(setHours(setMinutes(today, 0), 16), 2),   // Day after tomorrow 4:00 PM
      status: BookingStatus.CONFIRMED,
      notes: 'حصة مخصصة للأطفال - سورة الناس والفلق والإخلاص',
    },
  });

  // Reviews
  console.log('Creating reviews...')
  
  // Review for completed booking
  const review1 = await prisma.review.create({
    data: {
      bookingId: pastBooking1.id,
      userId: user1.id,
      teacherId: teacher1.id,
      rating: 5,
      comment: 'استفدت كثيراً من الدرس. الشيخ عبدالرحمن معلم ممتاز وصبور جداً.',
    },
  });

  // Notifications
  console.log('Creating notifications...')
  
  // Booking confirmation notification for user1
  await prisma.notification.create({
    data: {
      type: NotificationType.BOOKING_CONFIRMED,
      title: 'تم تأكيد الحجز',
      message: `تم تأكيد حجزك مع ${teacher1.name} يوم ${format(upcomingBooking1.startTime, 'yyyy/MM/dd')} الساعة ${format(upcomingBooking1.startTime, 'HH:mm')}`,
      receiverId: user1.id,
      senderId: teacher1.id,
      entityId: upcomingBooking1.id,
      entityType: 'Booking',
      isRead: false,
    },
  });

  // Booking confirmed notification for teacher1
  await prisma.notification.create({
    data: {
      type: NotificationType.BOOKING_CONFIRMED,
      title: 'لديك حجز جديد',
      message: `قام ${user1.name} بتأكيد حجز معك يوم ${format(upcomingBooking1.startTime, 'yyyy/MM/dd')} الساعة ${format(upcomingBooking1.startTime, 'HH:mm')}`,
      receiverId: teacher1.id,
      senderId: user1.id,
      entityId: upcomingBooking1.id,
      entityType: 'Booking',
      isRead: true,
    },
  });

  // Review notification for teacher1
  await prisma.notification.create({
    data: {
      type: NotificationType.REVIEW_RECEIVED,
      title: 'تقييم جديد',
      message: `قام ${user1.name} بإضافة تقييم للدرس السابق. التقييم: ${review1.rating} نجوم`,
      receiverId: teacher1.id,
      senderId: user1.id,
      entityId: review1.id,
      entityType: 'Review',
      isRead: false,
    },
  });

  // Admin notification about pending teacher
  await prisma.notification.create({
    data: {
      type: NotificationType.ADMIN_MESSAGE,
      title: 'معلم جديد في انتظار الموافقة',
      message: `هناك معلم جديد (${teacher3.name}) في انتظار الموافقة. يرجى مراجعة الطلب.`,
      receiverId: admin.id,
      entityId: teacher3.id,
      entityType: 'TeacherProfile',
      isRead: false,
    },
  });

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })