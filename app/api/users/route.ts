import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/utils/rate-limiter";
import { validateRequest } from "@/utils/validation";

// Rate limiter for this endpoint
const apiLimiter = rateLimit({
  limit: 50,
  interval: 60 * 10, // 10 minutes
});

// Schema for GET request query params
const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  role: z.enum(["USER", "TEACHER", "ADMIN"]).optional(),
  isActive: z.enum(["true", "false"]).optional().default("true").transform((val) => val === "true"),
});

// Schema for user updates
const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["USER", "TEACHER", "ADMIN"]).optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional(),
  gender: z.string().optional(),
});

export async function GET(request: NextRequest) {
  // Check rate limiting
  const rateLimitResult = await apiLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Verify auth
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "غير مصرح بالوصول" },
      { status: 403 }
    );
  }

  return validateRequest(getUsersQuerySchema, async (req, data) => {
    const { page, limit, search, role, isActive } = data;
    const skip = (page - 1) * limit;

    // Build search filters
    const filters: any = {};
    if (role) filters.role = role;
    if (isActive !== undefined) filters.isActive = isActive;
    
    // Add search functionality
    let whereCondition: any = { ...filters };
    if (search) {
      whereCondition = {
        ...whereCondition,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Execute query
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          gender: true,
          bio: true,
          // Don't include password
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      data: users,
      metadata: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  })(request);
}

export async function POST(request: NextRequest) {
  // This is handled by the register route
  return NextResponse.json(
    { error: "استخدم نقطة نهاية التسجيل لإنشاء مستخدم جديد" },
    { status: 405 }
  );
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

  const body = await request.json();
  const { id, ...updateData } = body;

  // Validate permissions
  if (!id) {
    return NextResponse.json(
      { error: "معرف المستخدم مطلوب" },
      { status: 400 }
    );
  }

  // Only admins can update other users, or user can update themselves
  if (session.user.role !== "ADMIN" && session.user.id !== id) {
    return NextResponse.json(
      { error: "غير مصرح بتعديل هذا المستخدم" },
      { status: 403 }
    );
  }

  try {
    // Validate update data
    const validatedData = updateUserSchema.parse(updateData);

    // Special role verification - only admins can change roles
    if (validatedData.role && session.user.role !== "ADMIN") {
      delete validatedData.role;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        image: true,
        bio: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "خطأ في تحديث المستخدم" },
      { status: 400 }
    );
  }
}