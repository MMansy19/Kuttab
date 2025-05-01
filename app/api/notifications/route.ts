import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/utils/rate-limiter";
import { validateRequest } from "@/utils/validation";

// Rate limiter for this endpoint
const apiLimiter = rateLimit({
  limit: 100,
  interval: 60 * 5, // 5 minutes
});

// Schema for GET request query params
const getNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  isRead: z.enum(["true", "false", "all"]).optional().default("all"),
});

// Schema for marking notifications as read
const markAsReadSchema = z.object({
  ids: z.array(z.string()).optional(), // Optional, if not provided, mark all as read
});

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

  return validateRequest(getNotificationsQuerySchema, async (req, data) => {
    try {
      const { page, limit, isRead } = data;
      const skip = (page - 1) * limit;

      // Build query filters
      const filters: any = {
        receiverId: session.user.id,
      };
      
      // Filter by read status if specified
      if (isRead !== "all") {
        filters.isRead = isRead === "true";
      }

      // Execute query
      const [notifications, totalCount, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: filters,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        prisma.notification.count({ where: filters }),
        prisma.notification.count({
          where: {
            receiverId: session.user.id,
            isRead: false,
          },
        }),
      ]);

      return NextResponse.json({
        data: notifications,
        metadata: {
          total: totalCount,
          unreadCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
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

  return validateRequest(markAsReadSchema, async (req, data) => {
    try {
      const { ids } = data;
      const userId = session.user.id;

      let updateCondition: any = {
        receiverId: userId,
      };

      // If specific IDs are provided, only mark those as read
      if (ids && ids.length > 0) {
        updateCondition.id = { in: ids };
      }

      // Update notifications
      await prisma.notification.updateMany({
        where: updateCondition,
        data: { isRead: true },
      });

      // Get current unread count
      const unreadCount = await prisma.notification.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });

      return NextResponse.json({
        message: "تم تحديث الإشعارات بنجاح",
        unreadCount,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "خطأ في تحديث الإشعارات" },
        { status: 400 }
      );
    }
  })(request);
}