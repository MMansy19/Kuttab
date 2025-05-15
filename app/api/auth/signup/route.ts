import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, name, role, gender } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مسجل بالفعل" },
        { status: 400 }
      );
    }    const hashedPassword = await bcrypt.hash(password, 12);
      // Note: gender field is not included in the database schema, so we don't save it
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role: role || "USER", // Use provided role or default to USER
        // gender is not saved as it's not in the schema
      },
    });
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });  } catch (error) {
    console.error("Signup error:", error);
    // Return more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "حدث خطأ أثناء التسجيل", details: errorMessage },
      { status: 500 }
    );
  }
}