import { PrismaClient } from '@prisma/client';
import { isFrontendOnlyMode } from './config';

// Create a mock PrismaClient that returns empty data for frontend-only mode
class MockPrismaClient {
  // Add mock methods for the models your frontend might use
  user = this._createMockModel();
  teacherProfile = this._createMockModel();
  booking = this._createMockModel();
  notification = this._createMockModel();
  review = this._createMockModel();
  teacherAvailability = this._createMockModel();
  
  // Generic mock methods for all models
  _createMockModel() {
    return {
      findUnique: async () => null,
      findMany: async () => [],
      findFirst: async () => null,
      create: async (data: any) => data.data,
      createMany: async () => ({ count: 0 }),
      update: async (data: any) => data.data,
      updateMany: async () => ({ count: 0 }),
      delete: async () => ({}),
      deleteMany: async () => ({ count: 0 }),
      count: async () => 0,
      aggregate: async () => ({}),
    };
  }
}

// Force frontend-only mode for development until database is properly configured
const forceFrontendOnly = true;
const shouldUseMockClient = forceFrontendOnly || isFrontendOnlyMode;

// PrismaClient initialization with better error handling
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | MockPrismaClient 
};

// Use mock client in frontend-only mode
export const prisma = globalForPrisma.prisma || 
  (shouldUseMockClient 
    ? new MockPrismaClient() as unknown as PrismaClient
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      }));

// Log which client is being used for debugging
if (process.env.NODE_ENV === 'development') {
  console.log(`[Prisma] Using ${shouldUseMockClient ? 'MOCK' : 'REAL'} database client`);
}

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;