import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../prisma/generated/prisma-client';

// Create a new PrismaClient instance
const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing seed users if they exist (by email)
    const emailsToDelete = ['admin@example.com', 'teacher@example.com', 'user@example.com'];
    
    console.log('🧹 Cleaning up existing seed users...');
    for (const email of emailsToDelete) {
      await prisma.user.deleteMany({
        where: { email }
      });
    }

    // Hash for 'password123' - to keep things simple for development
    const passwordHash = await bcrypt.hash('password123', 10);

    console.log('🌱 Creating seed users for all roles...');

    // Create ADMIN user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log(`👤 Created admin user: ${admin.email} (ID: ${admin.id})`);

    // Create TEACHER user with a teacher profile
    const teacher = await prisma.user.create({
      data: {
        name: 'Teacher User',
        email: 'teacher@example.com',
        password: passwordHash,
        role: 'TEACHER',
        emailVerified: new Date(),
        teacherProfile: {
          create: {
            bio: 'مدرس خبير في تعليم القرآن الكريم لكافة المستويات',
            specializations: ['حفظ القرآن', 'التجويد', 'القراءات'],
            languages: ['العربية', 'الإنجليزية'],
            hourlyRate: 50,
            isActive: true
          }
        }
      },
    });
    console.log(`👤 Created teacher user: ${teacher.email} (ID: ${teacher.id})`);

    // Create normal USER
    const user = await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@example.com',
        password: passwordHash,
        role: 'USER',
        emailVerified: new Date(),
      },
    });
    console.log(`👤 Created regular user: ${user.email} (ID: ${user.id})`);

    console.log('✅ Seed completed successfully!');
    console.log('\nLogin details for all users:');
    console.log('Email: admin@example.com, Password: password123, Role: ADMIN');
    console.log('Email: teacher@example.com, Password: password123, Role: TEACHER');
    console.log('Email: user@example.com, Password: password123, Role: USER');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
