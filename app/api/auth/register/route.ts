import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// User registration validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "TEACHER"]).default("USER"),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  bio: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password, role, gender, bio } = result.data;
    
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists with this email" },
          { status: 409 }
        );
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          gender,
          bio,
        },
      });
      
      // If user is a teacher, create a teacher profile
      if (role === "TEACHER") {
        await prisma.teacherProfile.create({
          data: {
            userId: user.id,
          },
        });
      }
      
      // Return the created user (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json(
        { message: "User registered successfully", user: userWithoutPassword },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      
      // Handle specific Prisma errors
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: "A user with this email already exists" },
            { status: 409 }
          );
        }
      }
      
      if (dbError instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: "Database operation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: "Invalid JSON in the request body" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}