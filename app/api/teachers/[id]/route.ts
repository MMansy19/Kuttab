import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Validation schema for teacher profile updates
const teacherProfileSchema = z.object({
  specialization: z.string().min(3).optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  videoUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

// GET a single teacher profile
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get teacher profile with user data
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            gender: true,
            role: true,
          },
        },
        availabilities: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    // Only return APPROVED profiles to public, unless the user is an admin or the teacher themselves
    const session = await getServerSession(authOptions);
    const isAdminOrOwner = session && (
      session.user.role === "ADMIN" || 
      session.user.id === teacher.userId
    );

    if (teacher.approvalStatus !== "APPROVED" && !isAdminOrOwner) {
      return NextResponse.json({ error: "Teacher profile not available" }, { status: 403 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher profile" },
      { status: 500 }
    );
  }
}

// PATCH to update a teacher profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the teacher profile
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { id: params.id },
      include: { user: true },
    });
    
    if (!teacherProfile) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }
    
    // Only the teacher or an admin can update the profile
    const isTeacherOrAdmin = 
      session.user.id === teacherProfile.userId || 
      session.user.role === "ADMIN";
      
    if (!isTeacherOrAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const body = await req.json();
    
    // Validate update data
    const result = teacherProfileSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Only admins can update approval status
    if (body.approvalStatus && session.user.role !== "ADMIN") {
      delete body.approvalStatus;
    }
    
    // Update teacher profile
    const updatedProfile = await prisma.teacherProfile.update({
      where: { id: params.id },
      data: result.data,
    });
    
    return NextResponse.json({
      message: "Teacher profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to update teacher profile" },
      { status: 500 }
    );
  }
}

// PUT to completely update a teacher profile
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the teacher profile
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { id: params.id },
      include: { user: true },
    });
    
    if (!teacherProfile) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }
    
    // Only the teacher or an admin can update the profile
    const isTeacherOrAdmin = 
      session.user.id === teacherProfile.userId || 
      session.user.role === "ADMIN";
      
    if (!isTeacherOrAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const updatedTeacher = await req.json();
    
    // Prepare data for update - split between user and teacher profile data
    const { 
      name, bio, gender, email, image, avatarUrl, videoUrl, 
      subjects, specialization, experience, education, 
      certifications, teachingApproach, languages, 
      achievements, isPaid, price, contactInfo, ...teacherData 
    } = updatedTeacher;
    
    // Update user data first if it exists
    if (name || bio || gender || email || image) {
      await prisma.user.update({
        where: { id: teacherProfile.userId },
        data: {
          name: name || undefined,
          bio: bio || undefined,
          gender: gender || undefined,
          email: email || undefined,
          image: image || avatarUrl || undefined,
        },
      });
    }
    
    // Now update the teacher profile
    const updatedProfile = await prisma.teacherProfile.update({
      where: { id: params.id },
      data: {
        videoUrl,
        specialization,
        yearsOfExperience: experience,
        subjects: subjects ? { set: subjects } : undefined,
        education,
        certifications: certifications ? { set: certifications } : undefined,
        teachingApproach,
        languages: languages ? { set: languages } : undefined,
        achievements: achievements ? { set: achievements } : undefined,
        isPaid,
        price,
        contactInfo: contactInfo ? JSON.stringify(contactInfo) : undefined,
        // Mark profile for review when updated
        approvalStatus: session.user.role === "ADMIN" ? undefined : "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            gender: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      message: "Teacher profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to update teacher profile" },
      { status: 500 }
    );
  }
}