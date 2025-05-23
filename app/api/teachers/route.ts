import { NextRequest, NextResponse } from 'next/server';
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/utils/rate-limiter";
import { validateRequest } from "@/utils/validation";
import { mockTeachers } from "@/data/mock-teachers";
import { isFrontendOnlyMode } from "@/lib/config";

// Rate limiter for this endpoint
const apiLimiter = rateLimit({
  limit: 50,
  interval: 60 * 10, // 10 minutes
});

// Schema for GET request query params
const getTeachersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  isAvailable: z.boolean().default(true),
  minRating: z.coerce.number().min(0).max(5).optional(),
});

// Schema for teacher profile create/update
const teacherProfileSchema = z.object({
  specialization: z.string().optional(),
  videoUrl: z.string().url().optional().nullable(),
  yearsOfExperience: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export async function GET(request: NextRequest) {
  // Check rate limiting
  const rateLimitResult = await apiLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  return validateRequest(getTeachersQuerySchema, async (req, data) => {
    // Add type assertion to fix "possibly undefined" errors
    const { page, limit, search, approvalStatus, isAvailable, minRating } = data as {
      page: number;
      limit: number;
      search?: string;
      approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
      isAvailable: boolean;
      minRating?: number;
    };
    const skip = (page - 1) * limit;

    // If in frontend-only mode, use mock data
    if (isFrontendOnlyMode) {
      // Filter mock data based on query parameters
      let filteredTeachers = [...mockTeachers];
      
      if (approvalStatus) {
        filteredTeachers = filteredTeachers.filter(t => t.approvalStatus === approvalStatus);
      }
      
      if (isAvailable !== undefined) {
        filteredTeachers = filteredTeachers.filter(t => t.isAvailable === isAvailable);
      }
      
      if (minRating !== undefined) {
        filteredTeachers = filteredTeachers.filter(t => t.averageRating >= minRating);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredTeachers = filteredTeachers.filter(t => 
          t.user.name.toLowerCase().includes(searchLower) || 
          (t.user.bio && t.user.bio.toLowerCase().includes(searchLower)) ||
          (t.specialization && t.specialization.toLowerCase().includes(searchLower))
        );
      }
      
      // Paginate results
      const paginatedTeachers = filteredTeachers.slice(skip, skip + limit);
      const totalTeachers = filteredTeachers.length;
      
      return NextResponse.json({
        data: paginatedTeachers,
        metadata: {
          total: totalTeachers,
          page,
          limit,
          totalPages: Math.ceil(totalTeachers / limit),
        },
      });
    }

    // Normal database flow when not in frontend-only mode
    // Build search filters
    const filters: any = {};
    if (approvalStatus) filters.approvalStatus = approvalStatus;
    if (isAvailable !== undefined) filters.isAvailable = isAvailable;
    if (minRating) filters.averageRating = { gte: minRating };
    
    // Add search functionality
    let whereCondition: any = { ...filters };
    
    // Get the session to determine permissions
    const session = await getServerSession(authOptions);
    
    // If not admin and requesting PENDING teachers, restrict access
    if (!session || (session.user.role !== "ADMIN" && approvalStatus === "PENDING")) {
      // Non-admins can only see approved teachers
      whereCondition.approvalStatus = "APPROVED";
    }
    
    // Include search functionality
    if (search) {
      whereCondition = {
        ...whereCondition,
        user: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { bio: { contains: search, mode: "insensitive" } },
          ],
        },
      };
    }

    // Execute query
    const [teachers, totalTeachers] = await Promise.all([
      prisma.teacherProfile.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              id: true,              name: true,
              email: true,
              image: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { averageRating: "desc" },
      }),
      prisma.teacherProfile.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      data: teachers,
      metadata: {
        total: totalTeachers,
        page,
        limit,
        totalPages: Math.ceil(totalTeachers / limit),
      },
    });
  })(request);
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

  try {
    // If in frontend-only mode, return mock response
    if (isFrontendOnlyMode) {
      return NextResponse.json({
        data: {
          id: "mock-teacher-new",
          userId: session.user.id,
          specialization: "حفظ القرآن الكريم",
          approvalStatus: "PENDING",
          isAvailable: true,
          averageRating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            bio: "بيانات نموذجية في وضع العرض",
          },
        },
        message: "تم إنشاء ملف المعلم بنجاح وهو قيد المراجعة (وضع العرض)"
      });
    }

    const body = await request.json();
    const validatedData = teacherProfileSchema.parse(body);

    // Check if user already has a teacher profile
    const existingProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "لديك بالفعل ملف تعريفي للمعلم" },
        { status: 400 }
      );
    }

    // Create teacher profile for the current user
    const teacherProfile = await prisma.teacherProfile.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
      },
    });

    // Update user role to TEACHER if they aren't already
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "TEACHER" },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: "ADMIN_MESSAGE",
        title: "طلب معلم جديد",
        message: `تم إنشاء ملف تعريفي جديد للمعلم بواسطة ${session.user.name}. يرجى مراجعته.`,
        // Send to all admins
        receiverId: session.user.id, // Temp - we'd normally find admin IDs here
        senderId: session.user.id,
        entityType: "TEACHER_PROFILE",
        entityId: teacherProfile.id,
      },
    });

    return NextResponse.json({
      data: teacherProfile,
      message: "تم إنشاء ملف المعلم بنجاح وهو قيد المراجعة"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطأ في إنشاء ملف المعلم" },
      { status: 400 }
    );
  }
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

  try {
    // If in frontend-only mode, return mock response
    if (isFrontendOnlyMode) {
      return NextResponse.json({
        data: {
          id: "mock-teacher-updated",
          userId: session.user.id,
          specialization: "حفظ القرآن الكريم - تم التحديث",
          approvalStatus: "APPROVED",
          isAvailable: true,
          averageRating: 5,
          reviewCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            bio: "بيانات نموذجية محدثة في وضع العرض",
          },
        },
        message: "تم تحديث ملف المعلم بنجاح (وضع العرض)"
      });
    }

    const body = await request.json();
    const { id, approvalStatus, ...updateData } = body;

    // Validate the profile data
    const validatedData = teacherProfileSchema.parse(updateData);

    let teacherProfile;

    if (id) {
      // Admin or profile owner can update
      const existingProfile = await prisma.teacherProfile.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!existingProfile) {
        return NextResponse.json(
          { error: "الملف الشخصي غير موجود" },
          { status: 404 }
        );
      }

      // Check permissions
      const isOwner = existingProfile.userId === session.user.id;
      const isAdmin = session.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { error: "غير مصرح بتعديل هذا الملف" },
          { status: 403 }
        );
      }

      // If admin is updating approval status
      if (approvalStatus && isAdmin) {
        validatedData.approvalStatus = approvalStatus;

        // Create notification for the teacher
        await prisma.notification.create({
          data: {
            type: "ADMIN_MESSAGE",
            title: "تحديث حالة الملف التعريفي",
            message: approvalStatus === "APPROVED" 
              ? "تهانينا! تم الموافقة على ملفك التعريفي كمعلم."
              : "للأسف، تم رفض طلبك للتسجيل كمعلم. يرجى التواصل للمزيد من المعلومات.",
            receiverId: existingProfile.userId,
            senderId: session.user.id,
          },
        });
      }

      // Update profile
      teacherProfile = await prisma.teacherProfile.update({
        where: { id },
        data: validatedData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true,
            },
          },
        },
      });
    } else {
      // User is updating their own profile
      teacherProfile = await prisma.teacherProfile.update({
        where: { userId: session.user.id },
        data: validatedData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      data: teacherProfile,
      message: "تم تحديث الملف الشخصي بنجاح"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطأ في تحديث ملف المعلم" },
      { status: 400 }
    );
  }
}