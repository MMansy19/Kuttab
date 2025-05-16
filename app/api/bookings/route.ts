import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
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

// Type definition for booking status
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED" | "NO_SHOW";

// Schema for booking creation
const createBookingSchema = z.object({
  teacherProfileId: z.string(),
  startTime: z.string().transform(val => new Date(val)),
  endTime: z.string().transform(val => new Date(val)),
  notes: z.string().optional(),
});

// Schema for booking updates
const updateBookingSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED", "COMPLETED", "NO_SHOW"]).optional(),
  notes: z.string().optional(),
  meetingLink: z.string().url().optional().nullable(),
  cancelReason: z.string().optional().nullable(),
});

// Schema for GET request query params
const getBookingsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.string().optional().transform(val => 
    val ? val.split(',') as BookingStatus[] : undefined
  ),
  userId: z.string().optional(),
  teacherProfileId: z.string().optional(),
  fromDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  toDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

// Define types for the validated data
type BookingsQueryData = z.infer<typeof getBookingsQuerySchema>;
type CreateBookingData = z.infer<typeof createBookingSchema>;
type UpdateBookingData = z.infer<typeof updateBookingSchema>;

export async function GET(request: NextRequest) {
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

  return validateRequest(getBookingsQuerySchema as any, async (req, data) => {
    const { page, limit, status, userId, teacherProfileId, fromDate, toDate } = data as BookingsQueryData;
    const skip = (page - 1) * limit;

    // Build query filters
    const filters: any = {};
    
    if (status) filters.status = { in: status };
    if (fromDate) filters.startTime = { gte: fromDate };
    if (toDate) filters.endTime = { lte: toDate };
    
    // Apply permissions based on user role
    const userRole = session.user.role;
    
    if (userRole === "ADMIN") {
      // Admins can see all bookings or filter by specific user/teacher
      if (userId) filters.userId = userId;
      if (teacherProfileId) filters.teacherProfileId = teacherProfileId;
    } else if (userRole === "TEACHER") {
      // Teachers can see bookings for their profile
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      
      if (!teacherProfile) {
        return NextResponse.json(
          { error: "ملف المعلم غير موجود" },
          { status: 404 }
        );
      }
      
      filters.teacherProfileId = teacherProfile.id;
    } else {
      // Regular users can only see their own bookings
      filters.userId = session.user.id;
    }

    // Execute query
    const [bookings, totalBookings] = await Promise.all([
      prisma.booking.findMany({
        where: filters,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          reviews: true,
        },
        skip,
        take: limit,
        orderBy: { startTime: "desc" },
      }),
      prisma.booking.count({ where: filters }),
    ]);

    return NextResponse.json({
      data: bookings,
      metadata: {
        total: totalBookings,
        page,
        limit,
        totalPages: Math.ceil(totalBookings / limit),
      },
    });
  })(request);
}

async function checkOverlappingBooking(teacherProfileId: string, startTime: Date, endTime: Date) {
  return prisma.booking.findFirst({
    where: {
      teacherProfileId,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        {
          startTime: { lte: startTime },
          endTime: { gt: startTime },
        },
        {
          startTime: { lt: endTime },
          endTime: { gte: endTime },
        },
        {
          startTime: { gte: startTime },
          endTime: { lte: endTime },
        },
      ],
    },
  });
}

export async function POST(request: NextRequest) {
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
  
  // Verify that the user has the "USER" role
  if (session.user.role !== "USER" && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "يجب أن يكون لديك صلاحيات المستخدم العادي لحجز موعد" },
      { status: 403 }
    );
  }

  return validateRequest(createBookingSchema as any, async (req, data) => {
    try {
      const { teacherProfileId, startTime, endTime, notes } = data as CreateBookingData;

      // Validate teacher profile exists and is approved
      const teacherProfile = await prisma.teacherProfile.findFirst({
        where: {
          id: teacherProfileId,
          approvalStatus: "APPROVED",
        },
        include: {
          user: true,
        },
      });

      if (!teacherProfile) {
        return NextResponse.json(
          { error: "المعلم غير موجود أو غير معتمد" },
          { status: 404 }
        );
      }

      // Check if time slot is available (no overlapping bookings)
      const overlappingBooking = await checkOverlappingBooking(teacherProfileId, startTime, endTime);

      if (overlappingBooking) {
        return NextResponse.json(
          { error: "الوقت المحدد غير متاح، يرجى اختيار وقت آخر" },
          { status: 400 }
        );
      }

      // Check if start time is in the future
      if (new Date(startTime) <= new Date()) {
        return NextResponse.json(
          { error: "يجب أن يكون وقت البدء في المستقبل" },
          { status: 400 }
        );
      }

      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          userId: session.user.id,
          teacherProfileId,
          startTime,
          endTime,
          notes,
          status: "PENDING",
        },
        include: {
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create notification for teacher
      await prisma.notification.create({
        data: {
          type: "BOOKING_REQUEST",
          title: "طلب حجز جديد",
          message: `لديك طلب حجز جديد من ${session.user.name} في ${new Date(startTime).toLocaleString('ar')}`,
          receiverId: teacherProfile.userId,
          senderId: session.user.id,
          entityType: "BOOKING",
          entityId: booking.id,
        },
      });

      return NextResponse.json({
        data: booking,
        message: "تم إنشاء الحجز بنجاح وهو بانتظار موافقة المعلم"
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "خطأ في إنشاء الحجز" },
        { status: 400 }
      );
    }
  })(request);
}

export async function PATCH(request: NextRequest) {
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

  return validateRequest(updateBookingSchema, async (req, data: UpdateBookingData) => {
    try {
      const { id, status, notes, meetingLink, cancelReason } = data;
      const userId = session.user.id;

      // Get the existing booking
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          teacherProfile: {
            include: {
              user: true
            }
          },
          user: true,
        },
      });

      if (!booking) {
        return NextResponse.json(
          { error: "الحجز غير موجود" },
          { status: 404 }
        );
      }

      // Check permissions based on role and action
      const userRole = session.user.role;
      const isTeacher = booking.teacherProfile.userId === userId;
      const isStudent = booking.userId === userId;
      const isAdmin = userRole === "ADMIN";

      if (!isTeacher && !isStudent && !isAdmin) {
        return NextResponse.json(
          { error: "غير مصرح بتعديل هذا الحجز" },
          { status: 403 }
        );
      }

      // Prepare update data
      const updateData: any = {};
      
      if (notes) updateData.notes = notes;
      
      // Handle status updates with appropriate permissions
      if (status) {
        if (status === "CONFIRMED" && !isTeacher && !isAdmin) {
          return NextResponse.json(
            { error: "فقط المعلم أو المسؤول يمكنه تأكيد الحجز" },
            { status: 403 }
          );
        }
        
        if (status === "COMPLETED" && !isTeacher && !isAdmin) {
          return NextResponse.json(
            { error: "فقط المعلم أو المسؤول يمكنه إكمال الحجز" },
            { status: 403 }
          );
        }
        
        if (status === "CANCELED") {
          updateData.canceledBy = userId;
          updateData.cancelReason = cancelReason || "تم الإلغاء بدون سبب محدد";
        }
        
        updateData.status = status;
      }
      
      // Teachers can add meeting links
      if (meetingLink && (isTeacher || isAdmin)) {
        updateData.meetingLink = meetingLink;
      }

      // Update the booking
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
        include: {
          teacherProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create notification based on the update
      let notificationType: string, notificationTitle: string, notificationMessage: string;
      let receiverId: string;
      
      if (status === "CONFIRMED") {
        notificationType = "BOOKING_CONFIRMED";
        notificationTitle = "تم تأكيد الحجز";
        notificationMessage = `تم تأكيد حجزك مع ${booking.teacherProfile.user.name} في ${new Date(booking.startTime).toLocaleString('ar')}`;
        receiverId = booking.userId;
      } else if (status === "CANCELED") {
        notificationType = "BOOKING_CANCELED";
        notificationTitle = "تم إلغاء الحجز";
        
        const canceledBy = isTeacher ? "المعلم" : (isStudent ? "الطالب" : "المسؤول");
        notificationMessage = `تم إلغاء الحجز في ${new Date(booking.startTime).toLocaleString('ar')} بواسطة ${canceledBy}`;
        
        // Notify the other party
        receiverId = isTeacher ? booking.userId : booking.teacherProfile.userId;
      } else if (status === "COMPLETED") {
        notificationType = "BOOKING_COMPLETED";
        notificationTitle = "اكتملت الجلسة";
        notificationMessage = `تم إكمال جلستك بتاريخ ${new Date(booking.startTime).toLocaleString('ar')}. شكرًا لك!`;
        receiverId = booking.userId;
      } else {
        // For other updates
        notificationType = "BOOKING_REQUEST";
        notificationTitle = "تم تحديث الحجز";
        notificationMessage = `تم تحديث تفاصيل الحجز بتاريخ ${new Date(booking.startTime).toLocaleString('ar')}`;
        receiverId = isTeacher ? booking.userId : booking.teacherProfile.userId;
      }
      
      // Create the notification
      if (status) { // Only send notification if status was updated
        await prisma.notification.create({
          data: {
            type: notificationType as any,
            title: notificationTitle,
            message: notificationMessage,
            receiverId,
            senderId: userId,
            entityType: "BOOKING",
            entityId: id,
          },
        });
      }

      return NextResponse.json({
        data: updatedBooking,
        message: "تم تحديث الحجز بنجاح"
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "خطأ في تحديث الحجز" },
        { status: 400 }
      );
    }
  })(request);
}