import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/utils/rate-limiter";
import { validateRequest } from "@/utils/validation";

// Rate limiter for this endpoint
const apiLimiter = rateLimit({
  limit: 20,
  interval: 60 * 5, // 5 minutes
});

// Schema for GET request query params
const getReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Schema for review creation
const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

  return validateRequest(getReviewsQuerySchema, async (req, data) => {
    // Add type assertion to fix "possibly undefined" errors
    const { page, limit } = data as { page: number; limit: number };
    const skip = (page - 1) * limit;

    try {
      // Check if teacher profile exists
      const teacherProfile = await prisma.teacherProfile.findFirst({
        where: { id: teacherId },
      });

      if (!teacherProfile) {
        return NextResponse.json(
          { error: "ملف المعلم غير موجود" },
          { status: 404 }
        );
      }

      // Get reviews for this teacher
      const [reviews, totalReviews] = await Promise.all([
        prisma.review.findMany({
          where: { teacherId: teacherProfile.userId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            booking: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.review.count({
          where: { teacherId: teacherProfile.userId },
        }),
      ]);

      return NextResponse.json({
        data: reviews,
        metadata: {
          total: totalReviews,
          page,
          limit,
          totalPages: Math.ceil(totalReviews / limit),
          averageRating: teacherProfile.averageRating,
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
  { params }: { params: { id: string } }
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

  return validateRequest(createReviewSchema, async (req, data) => {
    try {
      const { bookingId, rating, comment } = data;
      const userId = session.user.id;

      // Check if teacher profile exists
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { id: teacherId },
      });

      if (!teacherProfile) {
        return NextResponse.json(
          { error: "ملف المعلم غير موجود" },
          { status: 404 }
        );
      }

      // Validate booking
      const booking = await prisma.booking.findUnique({
        where: { 
          id: bookingId,
          teacherProfileId: teacherId,
          userId: userId, // Ensure the booking belongs to this user
          status: "COMPLETED", // Only completed bookings can be reviewed
        },
      });

      if (!booking) {
        return NextResponse.json(
          { error: "لا يمكن العثور على الحجز المكتمل لهذا المعلم" },
          { status: 404 }
        );
      }

      // Check if user already reviewed this booking
      const existingReview = await prisma.review.findFirst({
        where: {
          bookingId,
          userId,
        },
      });

      if (existingReview) {
        return NextResponse.json(
          { error: "لقد قمت بالفعل بتقييم هذا الحجز" },
          { status: 400 }
        );
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          bookingId,
          userId,
          teacherId: teacherProfile.userId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          booking: true,
        },
      });

      // Update teacher's average rating
      const teacherReviews = await prisma.review.findMany({
        where: { teacherId: teacherProfile.userId },
        select: { rating: true },
      });      const totalRating = teacherReviews.reduce(
        (sum: number, review: any) => sum + review.rating,
        0
      );
      const averageRating = totalRating / teacherReviews.length;

      await prisma.teacherProfile.update({
        where: { id: teacherId },
        data: {
          averageRating: parseFloat(averageRating.toFixed(1)),
          reviewCount: teacherReviews.length,
        },
      });

      // Create notification for teacher
      await prisma.notification.create({
        data: {
          type: "REVIEW_RECEIVED",
          title: "تقييم جديد",
          message: `قام ${session.user.name} بتقييم درسك بـ ${rating} نجوم.`,
          receiverId: teacherProfile.userId,
          senderId: userId,
          entityType: "REVIEW",
          entityId: review.id,
        },
      });

      return NextResponse.json({
        data: review,
        message: "تم إرسال التقييم بنجاح",
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "خطأ في إرسال التقييم" },
        { status: 400 }
      );
    }
  })(request);
}