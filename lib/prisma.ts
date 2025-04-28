import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Initialize PrismaClient with error handling
function getPrismaClient() {
  try {
    const prisma = globalForPrisma.prisma || new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    })
    
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    
    // Test connection
    prisma.$connect().catch((e: Error) => {
      console.error('Failed to connect to database:', e)
    })
    
    return prisma
  } catch (error) {
    console.error('Error initializing Prisma client:', error)
    // throw new Error('Database connection failed')
  }
}

export const prisma = getPrismaClient()
export default prisma