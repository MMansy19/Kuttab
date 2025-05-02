import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { isFrontendOnlyMode } from '@/lib/config';

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
  role: z.enum(["USER", "TEACHER"]),
  gender: z.enum(["MALE", "FEMALE"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    try {
      registerSchema.parse(body);
    } catch (error) {
      return NextResponse.json({ error: "بيانات غير صالحة", details: error }, { status: 400 });
    }

    const { name, email, password, role, gender } = body;
    
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "البريد الإلكتروني مستخدم بالفعل" },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          gender,
        },
      });

      // If registering as TEACHER, create a teacher profile
      if (role === "TEACHER") {
        await prisma.teacherProfile.create({
          data: {
            userId: user.id,
          },
        });
      }

      // Return success response without password
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        message: "تم إنشاء المستخدم بنجاح",
        user: userWithoutPassword,
      }, { status: 201 });
    } catch (error) {
      // If in frontend-only mode and there was a database error,
      // create a mock successful response instead of failing
      if (isFrontendOnlyMode) {
        console.log("[Frontend-Only] Simulating successful registration for:", email);
        
        // Generate a mock user response
        const mockUser = {
          id: `mock-${Date.now()}`,
          name,
          email,
          role,
          gender,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return NextResponse.json({
          message: "تم إنشاء المستخدم بنجاح (وضع المظهرة)",
          user: mockUser,
        }, { status: 201 });
      }
      
      // Re-throw for the main error handler if not in frontend-only mode
      throw error;
    }
    
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Provide more detailed error information for debugging
    const errorMessage = error.message || "حدث خطأ أثناء تسجيل المستخدم";
    const responsePayload: { error: string; details?: object } = { error: errorMessage };

    if (process.env.NODE_ENV !== 'production') {
      responsePayload.details = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      };
    }

    return NextResponse.json(responsePayload, { status: 500 });
  }
}