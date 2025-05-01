// Use CommonJS require syntax to avoid module issues
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Initialize Prisma Client
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data (with error handling)
    console.log('🧹 Clearing existing data...')
    await prisma.user.deleteMany().catch((e: Error) => 
      console.log('No users to delete or tables don\'t exist yet')
    )

    // Create admin user
    console.log('👨‍💼 Creating admin user...')
    const adminPassword = await bcrypt.hash('Admin123!', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@kottab.com',
        password: adminPassword,
        role: 'ADMIN',
        image: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
      }
    })
    console.log('✅ Admin created:', admin.email)

    console.log('🎉 Database seeding completed!')
  } catch (e) {
    console.error('❌ Seeding error:', e)
    throw e
  }
}

main()
  .catch((e) => {
    console.error('Fatal seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })