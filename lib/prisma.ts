// Use the explicit import path from the generated prisma client directory
import { PrismaClient, Prisma } from '../prisma/generated/prisma-client';

// Helper function to safely convert objects to SQL
const convertToSQL = (obj: any): string => {
  if (!obj) return '';
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === null) return `"${key}" = NULL`;
      if (typeof value === 'string') return `"${key}" = '${value.replace(/'/g, "''")}'`;
      if (typeof value === 'number' || typeof value === 'boolean') return `"${key}" = ${value}`;
      if (typeof value === 'object') {
        if (value instanceof Date) return `"${key}" = '${value.toISOString()}'`;
        return `"${key}" = '${JSON.stringify(value).replace(/'/g, "''")}'`;
      }
      return `"${key}" = '${String(value).replace(/'/g, "''")}'`;
    })
    .join(', ');
};

// Helper function to convert object to WHERE clause
const convertToWhere = (obj: any): string => {
  if (!obj) return '';
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === null) return `"${key}" IS NULL`;
      if (typeof value === 'string') return `"${key}" = '${value.replace(/'/g, "''")}'`;
      if (typeof value === 'number' || typeof value === 'boolean') return `"${key}" = ${value}`;
      if (typeof value === 'object') {
        if (value instanceof Date) return `"${key}" = '${value.toISOString()}'`;
        return `"${key}" = '${JSON.stringify(value).replace(/'/g, "''")}'`;
      }
      return `"${key}" = '${String(value).replace(/'/g, "''")}'`;
    })
    .join(' AND ');
};

// Extended PrismaClient type with missing models
interface CustomPrismaClient extends PrismaClient {
  notification: any;
  booking: any;
  teacherProfile: any;
  teacherAvailability: any;
  review: any;
}

declare global {
  var prisma: CustomPrismaClient | undefined;
}

// Create the optimized Prisma client for serverless environment
const basePrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Add the missing models as proxy objects
const prismaWithExtensions = basePrisma as CustomPrismaClient;

// Create proxy objects for the models that don't exist yet
prismaWithExtensions.notification = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Notification" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Notification" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "Notification" (${Object.keys(args.data).map(k => `"${k}"`).join(', ')}) VALUES (${Object.values(args.data).map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}) RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "Notification" SET ${convertToSQL(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "Notification" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  count: (args: any) => basePrisma.$queryRaw`SELECT COUNT(*) FROM "Notification" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
};

prismaWithExtensions.booking = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Booking" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Booking" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "Booking" (${Object.keys(args.data).map(k => `"${k}"`).join(', ')}) VALUES (${Object.values(args.data).map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}) RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "Booking" SET ${convertToSQL(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "Booking" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  count: (args: any) => basePrisma.$queryRaw`SELECT COUNT(*) FROM "Booking" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
};

prismaWithExtensions.teacherProfile = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherProfile" WHERE ${args.where.id ? `id = ${args.where.id}` : `userId = ${args.where.userId}`} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherProfile" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "TeacherProfile" (${Object.keys(args.data).map(k => `"${k}"`).join(', ')}) VALUES (${Object.values(args.data).map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}) RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "TeacherProfile" SET ${convertToSQL(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "TeacherProfile" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
};

prismaWithExtensions.teacherAvailability = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherAvailability" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherAvailability" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "TeacherAvailability" (${Object.keys(args.data).map(k => `"${k}"`).join(', ')}) VALUES (${Object.values(args.data).map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}) RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "TeacherAvailability" SET ${convertToSQL(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "TeacherAvailability" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
};

prismaWithExtensions.review = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Review" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Review" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "Review" (${Object.keys(args.data).map(k => `"${k}"`).join(', ')}) VALUES (${Object.values(args.data).map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}) RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "Review" SET ${convertToSQL(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "Review" ${args.where ? `WHERE ${convertToWhere(args.where)}` : ''}`,
};

export const prisma = global.prisma || prismaWithExtensions;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;