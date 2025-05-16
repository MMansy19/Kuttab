import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/utils/rate-limiter";
import { validateRequest } from "@/utils/validation";

// Rate limiter for this endpoint
const apiLimiter = rateLimit({
  limit: 50,
  interval: 60 * 10, // 10 minutes
});

// Schema for GET request query params
const getAvailabilityQuerySchema = z.object({
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
});

// Schema for creating/updating availability
const availabilitySchema = z.object({
  availability: z.array(z.object({
    id: z.string().optional(), // Optional for new records
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(), // Format: "HH:MM" in 24h
    endTime: z.string(), // Format: "HH:MM" in 24h
    isRecurring: z.boolean().default(true),
  })),
});

// Type for route params - explicitly defined to avoid Promise wrapping issues
type RouteParams = {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  // Check rate limiting
  const rateLimitResult = await apiLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  const teacherId = params.id;

  if (!teacherId) {
    return NextResponse.json(
      { error: "معرف المعلم مطلوب" },
      { status: 400 }
    );
  }

  return validateRequest(getAvailabilityQuerySchema, async (req, data) => {
    try {
      // Find teacher profile
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { id: teacherId },
      });

      if (!teacherProfile) {
        return NextResponse.json(
          { error: "ملف المعلم غير موجود" },
          { status: 404 }
        );
      }

      // Get teacher availability
      const availability = await prisma.teacherAvailability.findMany({
        where: {
          teacherId: teacherProfile.userId,
        },
        orderBy: [
          { dayOfWeek: "asc" },
          { startTime: "asc" },
        ],
      });

      // Get booked slots for the date range if provided
      let bookedSlots: {
        id: string;
        startTime: Date;
        endTime: Date;
        status: string;
      }[] = [];
      
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        bookedSlots = await prisma.booking.findMany({
          where: {
            teacherProfileId: teacherId,
            status: { in: ["PENDING", "CONFIRMED"] },
            startTime: { gte: startDate },
            endTime: { lte: endDate },
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
          },
        });
      }

      return NextResponse.json({
        data: {
          availability,
          bookedSlots,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "حدث خطأ ما" },
        { status: 500 }
      );
    }
  })(request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  // Check rate limiting
  const rateLimitResult = await apiLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Verify auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "يجب تسجيل الدخول" },
      { status: 401 }
    );
  }

  const teacherId = params.id;

  if (!teacherId) {
    return NextResponse.json(
      { error: "معرف المعلم مطلوب" },
      { status: 400 }
    );
  }

  return validateRequest(availabilitySchema, async (req, data) => {
    try {
      // Find teacher profile
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { id: teacherId },
        select: { userId: true },
      });

      if (!teacherProfile) {
        return NextResponse.json(
          { error: "ملف المعلم غير موجود" },
          { status: 404 }
        );
      }

      // Check if user is authorized (either the teacher or an admin)
      if (
        session.user.id !== teacherProfile.userId &&
        session.user.role !== "ADMIN"
      ) {
        return NextResponse.json(
          { error: "غير مصرح لك بتعديل هذا الجدول" },
          { status: 403 }
        );
      }

      // Process each availability slot
      const { availability } = data;
      
      // Convert time strings to Date objects
      const processedAvailability = availability.map(slot => {
        const startTimeParts = slot.startTime.split(':');
        const endTimeParts = slot.endTime.split(':');
        
        // Use a fixed reference date (e.g., January 1, 1970)
        const referenceDate = new Date(1970, 0, 1);
        
        const startTimeDate = new Date(referenceDate);
        startTimeDate.setHours(parseInt(startTimeParts[0], 10));
        startTimeDate.setMinutes(parseInt(startTimeParts[1], 10));
        startTimeDate.setSeconds(0);
        startTimeDate.setMilliseconds(0);
        
        const endTimeDate = new Date(referenceDate);
        endTimeDate.setHours(parseInt(endTimeParts[0], 10));
        endTimeDate.setMinutes(parseInt(endTimeParts[1], 10));
        endTimeDate.setSeconds(0);
        endTimeDate.setMilliseconds(0);
        
        return {
          ...slot,
          startTime: startTimeDate,
          endTime: endTimeDate,
          teacherId: teacherProfile.userId,
        };
      });

      // Get existing availability records
      const existingAvailability = await prisma.teacherAvailability.findMany({
        where: {
          teacherId: teacherProfile.userId,
        },
      });

      // Determine which records to create, update, or delete
      const existingIds = new Set(existingAvailability.map((slot: any) => slot.id));
      const newIds = new Set(processedAvailability
        .filter((slot: any) => slot.id)
        .map((slot: any) => slot.id));

      // Records to delete (exist in DB but not in the new data)
      // Converting Set to Array to avoid iteration issues
      const idsToDelete = Array.from(existingIds).filter((id: any) => !newIds.has(id));

      // Batch operations
      const operations = [];

      // Add delete operations
      if (idsToDelete.length > 0) {
        operations.push(
          prisma.teacherAvailability.deleteMany({
            where: {
              id: { in: idsToDelete },
            },
          })
        );
      }

      // Add create/update operations for each slot
      for (const slot of processedAvailability) {
        if (slot.id) {
          // Update existing slot
          operations.push(
            prisma.teacherAvailability.update({
              where: { id: slot.id },
              data: {
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isRecurring: slot.isRecurring,
              },
            })
          );
        } else {
          // Create new slot
          operations.push(
            prisma.teacherAvailability.create({
              data: {
                teacherId: teacherProfile.userId,
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isRecurring: slot.isRecurring,
              },
            })
          );
        }
      }

      // Execute all operations in a transaction
      if ('$transaction' in prisma) {
        // Use transaction for Prisma Client
        await (prisma.$transaction as any)(operations);
      } else {
        // Fall back to sequential execution for mock client
        for (const operation of operations) {
          await operation;
        }
      }

      // Get updated availability
      const updatedAvailability = await prisma.teacherAvailability.findMany({
        where: {
          teacherId: teacherProfile.userId,
        },
        orderBy: [
          { dayOfWeek: "asc" },
          { startTime: "asc" },
        ],
      });

      return NextResponse.json({
        data: updatedAvailability,
        message: "تم تحديث جدول التوفر بنجاح",
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "خطأ في تحديث جدول التوفر" },
        { status: 400 }
      );
    }
  })(request);
}