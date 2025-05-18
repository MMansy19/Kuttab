import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isFrontendOnlyMode } from "@/lib/config";

// Validation schema for booking updates
const bookingUpdateSchema = z.object({
  status: z.enum(["PENDING", "SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  teacherNotes: z.string().max(1000).optional(),
  cancelReason: z.string().max(500).optional(),
});

// Type for route params
type RouteParams = {
  id: string;
}

// GET a single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
){
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Mock data for frontend-only mode
    if (isFrontendOnlyMode) {
      return NextResponse.json({
        id: context.params.id,
        userId: "mock-user-1",
        teacherProfileId: "teacher-1",
        startTime: new Date("2025-05-10T10:00:00Z").toISOString(),
        endTime: new Date("2025-05-10T11:00:00Z").toISOString(),
        status: "CONFIRMED",
        notes: "Demo booking in frontend-only mode",
        meetingLink: "https://meet.google.com/demo",
        createdAt: new Date("2025-05-01T12:00:00Z").toISOString(),
        updatedAt: new Date("2025-05-01T12:30:00Z").toISOString(),
        user: {
          id: "mock-user-1",
          name: "طالب نموذجي",
          image: "/images/kid-learns-online.png",
          email: "demo@example.com"
        },
        teacherProfile: {
          id: "teacher-1",
          user: {
            id: "mock-teacher-1",
            name: "أحمد محمد",
            image: "/images/learn-quran.jpg",
            email: "teacher@example.com"
          }
        },
        reviews: []
      });
    }
      // Get the booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        teacherProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        reviews: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Check permission
    const isAuthorized = 
      session.user.id === booking.userId || 
      session.user.id === booking.teacherProfile.userId ||
      session.user.role === "ADMIN";
      
    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH to update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: RouteParams }
){
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Mock response for frontend-only mode
    if (isFrontendOnlyMode) {
      return NextResponse.json({
        message: "Booking updated successfully",
        booking: {
          id: params.id,
          status: "CONFIRMED",
          notes: "Updated in frontend-only mode",
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        teacherProfile: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Validate update data
    const result = bookingUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { status, teacherNotes, cancelReason } = result.data;
    
    // Determine who can perform this action based on the update type
    
    // Only teachers can update to CONFIRMED or COMPLETED
    if ((status === "CONFIRMED" || status === "COMPLETED" || status === "NO_SHOW") && 
        (session.user.role !== "TEACHER" || session.user.id !== booking.teacherProfile.userId) &&
        session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to update status" }, { status: 403 });
    }
    
    // Students can only cancel their own bookings
    if (status === "CANCELLED" && 
        session.user.id !== booking.userId && 
        session.user.id !== booking.teacherProfile.userId &&
        session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to cancel booking" }, { status: 403 });
    }
    
    // Only teachers can add teacher notes
    if (teacherNotes !== undefined && 
        (session.user.role !== "TEACHER" || session.user.id !== booking.teacherProfile.userId) &&
        session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to add teacher notes" }, { status: 403 });
    }
    
    // If cancelling, require a reason
    if (status === "CANCELLED" && !cancelReason) {
      return NextResponse.json(
        { error: "Cancellation reason is required" },
        { status: 400 }
      );
    }
    
    // Update the booking with the correct field names
    const updatedData = {
      ...result.data,
      // If there are notes in the update, add them to the booking
      ...(teacherNotes && { notes: teacherNotes }),
    };
    
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        teacherProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    
    // Create notification for the counterparty
    if (status) {
      const isStudentAction = session.user.id === booking.userId;
      const notificationUserId = isStudentAction 
        ? booking.teacherProfile.userId 
        : booking.userId;
      
      let notificationTitle = "Booking Update";
      let notificationMessage = "";
      
      // Format date and time in a readable format
      const startTime = new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(booking.startTime).toLocaleDateString();
      
      switch (status) {
        case "CONFIRMED":
          notificationTitle = "Booking Confirmed";
          notificationMessage = `Your booking on ${dateStr} at ${startTime} has been confirmed by the teacher.`;
          break;
        case "COMPLETED":
          notificationTitle = "Booking Completed";
          notificationMessage = `Your booking on ${dateStr} at ${startTime} has been marked as completed.`;
          break;
        case "CANCELLED":
          notificationTitle = "Booking Cancelled";
          notificationMessage = `Your booking on ${dateStr} at ${startTime} has been cancelled. Reason: ${cancelReason}`;
          break;
        case "NO_SHOW":
          notificationTitle = "No Show Recorded";
          notificationMessage = `You were marked as a no-show for your booking on ${dateStr} at ${startTime}.`;
          break;
      }
      
      await prisma.notification.create({
        data: {
          receiverId: notificationUserId,
          title: notificationTitle,
          message: notificationMessage,
          type: "BOOKING",
          isRead: false,
          entityId: booking.id,
          entityType: "BOOKING"
        },
      });
    }
    
    return NextResponse.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE to cancel a booking (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
){
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Mock response for frontend-only mode
    if (isFrontendOnlyMode) {
      return NextResponse.json({
        message: "Booking cancelled successfully",
        booking: {
          id: params.id,
          status: "CANCELLED",
          cancelReason: "Cancelled in frontend-only mode",
          canceledBy: session.user.id,
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        teacherProfile: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Check if user is authorized to cancel (student, teacher, or admin)
    const isAuthorized = 
      session.user.id === booking.userId || 
      session.user.id === booking.teacherProfile.userId ||
      session.user.role === "ADMIN";
      
    if (!isAuthorized) {
      return NextResponse.json({ error: "Not authorized to cancel booking" }, { status: 403 });
    }
    
    // Get cancellation reason from query params
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get("reason") || "Cancelled by user";
    
    // Update booking to cancelled status with the correct field name
    const cancelledBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
        cancelReason: reason, // Using the correct field name as per Prisma schema
        canceledBy: session.user.id,
      },
    });
    
    // Notify the counterparty
    const isStudentAction = session.user.id === booking.userId;
    const notificationUserId = isStudentAction 
      ? booking.teacherProfile.userId 
      : booking.userId;
    
    // Format date and time in a readable format
    const startTime = new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date(booking.startTime).toLocaleDateString();
    
    await prisma.notification.create({
      data: {
        receiverId: notificationUserId, // Using receiverId instead of userId
        title: "Booking Cancelled",
        message: `Your booking on ${dateStr} at ${startTime} has been cancelled. Reason: ${reason}`,
        type: "BOOKING",
        isRead: false,
        entityId: booking.id,
        entityType: "BOOKING"
      },
    });
    
    return NextResponse.json({
      message: "Booking cancelled successfully",
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}