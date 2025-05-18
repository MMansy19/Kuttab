// Folder Structure for Kottab App

// ─────────────────────────────
// 📁 app/
// ─────────────────────────────
app/
├── layout.tsx               // Main layout wrapper
├── page.tsx                 // Home page
├── about/page.tsx           // About page
├── donate/page.tsx           // Donate page
├── contact/page.tsx         // Contact or Help page
├── auth/
│   ├── login/page.tsx       // User/Teacher login
│   └── signup/page.tsx      // User/Teacher signup
├── dashboard/
│   ├── user/
│   │   ├── profile/page.tsx     // User profile
│   │   └── bookings/page.tsx    // User bookings
│   └── teacher/
│       ├── profile/page.tsx     // Teacher profile edit
│       ├── availability/page.tsx// Teacher availability slots
│       └── appointments/page.tsx// View booked appointments
├── teachers/
│   ├── page.tsx             // All teachers list
│   └── [id]/page.tsx        // Single teacher profile
└── book/
    └── [id]/page.tsx        // Booking a teacher's slot


// ─────────────────────────────
// 📁 components/
// ─────────────────────────────
components/
├── TeacherCard.tsx
├── TeacherProfile.tsx
├── AvailabilityCalendar.tsx
├── BookingForm.tsx
├── AuthForm.tsx
├── Navbar.tsx
├── Footer.tsx
└── Sidebar.tsx


// ─────────────────────────────
// 📁 lib/
// ─────────────────────────────
lib/
├── auth.ts                  // Auth helper (JWT/Session)
├── db.ts                    // DB connection setup
├── api.ts                   // Reusable fetch API functions
└── utils.ts                 // Utility functions


// ─────────────────────────────
// 📁 prisma/
// ─────────────────────────────
prisma/
└── schema.prisma            // DB schema definition


// ─────────────────────────────
// 📁 types/
// ─────────────────────────────
types/
├── user.d.ts
├── teacher.d.ts
└── booking.d.ts


// ─────────────────────────────
// 📁 app/api/ (App Router API routes)
// ─────────────────────────────
app/api/
├── auth/
│   ├── login/route.ts
│   └── signup/route.ts
├── teacher/
│   ├── availability/route.ts
│   ├── [id]/route.ts        // Get teacher info
│   └── update/route.ts
├── user/[id]/route.ts       // Get user info
└── book/route.ts            // Booking endpoint


// ─────────────────────────────
// Database Models (prisma/schema.prisma)
// ─────────────────────────────
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     // USER or TEACHER
  bookings  Booking[]
  createdAt DateTime @default(now())
}

model Teacher {
  id            String         @id @default(uuid())
  user          User           @relation(fields: [userId], references: [id])
  userId        String
  bio           String?
  experience    Int

  availability  Availability[]
  appointments  Booking[]
  isPaid        Boolean
}

model Availability {
  id        String   @id @default(uuid())
  teacher   Teacher  @relation(fields: [teacherId], references: [id])
  teacherId String
  dayOfWeek Int      // 0 (Sunday) - 6 (Saturday)
  startTime String
  endTime   String
  maxNum    Int
}

model Booking {
  id         String   @id @default(uuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  teacher    Teacher  @relation(fields: [teacherId], references: [id])
  teacherId  String
  date       DateTime
  timeSlot   String
  status     BookingStatus @default(PENDING)
}

enum Role {
  USER
  TEACHER
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

enum TeacherStatus {
  PENDING
  ACCEPTED
  REJECTED
}