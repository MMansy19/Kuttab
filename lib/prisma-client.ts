/**
 * prisma-client.ts
 * 
 * This file provides an optimized Prisma client for serverless environments
 * such as Vercel with Neon PostgreSQL.
 */
import { PrismaClient } from '../prisma/node_modules/.prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloads.
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

// Utility function to create a properly configured Prisma client
const createPrismaClient = () => {
  return new PrismaClient({
    // Log only errors in production, more in development
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    // Set longer timeouts for serverless functions
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Use existing client instance if available to limit connections
export const prisma = global.prismaGlobal || createPrismaClient();

// Save the client in development for connection reuse
if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

// Function to handle graceful shutdown
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to disconnect Prisma client', error);
    process.exit(1);
  }
}
