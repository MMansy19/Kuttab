import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/services/auth-options";
import { prisma } from "@/lib/prisma";

// Get current user's profile with additional details
export async function GET() {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    // Fetch user with additional profile data based on role
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },      // Removed include teacherProfile as it's not in the schema
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data without sensitive information
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
