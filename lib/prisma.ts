import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

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
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Notification" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "Notification" ${Prisma.sql(args.data)} RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "Notification" SET ${Prisma.sql(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "Notification" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  count: (args: any) => basePrisma.$queryRaw`SELECT COUNT(*) FROM "Notification" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
};

prismaWithExtensions.booking = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Booking" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Booking" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "Booking" ${Prisma.sql(args.data)} RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "Booking" SET ${Prisma.sql(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "Booking" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  count: (args: any) => basePrisma.$queryRaw`SELECT COUNT(*) FROM "Booking" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
};

prismaWithExtensions.teacherProfile = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherProfile" WHERE ${args.where.id ? `id = ${args.where.id}` : `userId = ${args.where.userId}`} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherProfile" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "TeacherProfile" ${Prisma.sql(args.data)} RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "TeacherProfile" SET ${Prisma.sql(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "TeacherProfile" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
};

prismaWithExtensions.teacherAvailability = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherAvailability" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "TeacherAvailability" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "TeacherAvailability" ${Prisma.sql(args.data)} RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "TeacherAvailability" SET ${Prisma.sql(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "TeacherAvailability" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
};

prismaWithExtensions.review = {
  findUnique: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Review" WHERE id = ${args.where.id} LIMIT 1`,
  findMany: (args: any) => basePrisma.$queryRaw`SELECT * FROM "Review" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
  create: (args: any) => basePrisma.$queryRaw`INSERT INTO "Review" ${Prisma.sql(args.data)} RETURNING *`,
  update: (args: any) => basePrisma.$queryRaw`UPDATE "Review" SET ${Prisma.sql(args.data)} WHERE id = ${args.where.id} RETURNING *`,
  deleteMany: (args: any) => basePrisma.$queryRaw`DELETE FROM "Review" ${args.where ? `WHERE ${Prisma.sql(args.where)}` : ''}`,
};

export const prisma = global.prisma || prismaWithExtensions;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;