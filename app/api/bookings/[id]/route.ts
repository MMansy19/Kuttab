import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Validation schema for booking updates
const bookingUpdateSchema = z.object({
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  teacherNotes: z.string().max(1000).optional(),
  cancellationReason: z.string().max(500).optional(),
});

// GET a single booking by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: context.params.id },
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
        review: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Check permission - user should be either the student, the teacher, or an admin
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
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: context.params.id },
      include: {
        teacherProfile: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    const body = await req.json();
    
    // Validate update data
    const result = bookingUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { status, teacherNotes, cancellationReason } = result.data;
    
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
    if (status === "CANCELLED" && !cancellationReason) {
      return NextResponse.json(
        { error: "Cancellation reason is required" },
        { status: 400 }
      );
    }
    
    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: context.params.id },
      data: result.data,
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
      
      switch (status) {
        case "CONFIRMED":
          notificationTitle = "Booking Confirmed";
          notificationMessage = `Your booking on ${booking.date} at ${booking.startTime} has been confirmed by the teacher.`;
          break;
        case "COMPLETED":
          notificationTitle = "Booking Completed";
          notificationMessage = `Your booking on ${booking.date} at ${booking.startTime} has been marked as completed.`;
          break;
        case "CANCELLED":
          notificationTitle = "Booking Cancelled";
          notificationMessage = `Your booking on ${booking.date} at ${booking.startTime} has been cancelled. Reason: ${cancellationReason}`;
          break;
        case "NO_SHOW":
          notificationTitle = "No Show Recorded";
          notificationMessage = `You were marked as a no-show for your booking on ${booking.date} at ${booking.startTime}.`;
          break;
      }
      
      await prisma.notification.create({
        data: {
          userId: notificationUserId,
          title: notificationTitle,
          message: notificationMessage,
          type: "BOOKING",
          isRead: false,
          relatedId: booking.id,
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
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: context.params.id },
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
    const { searchParams } = new URL(req.url);
    const reason = searchParams.get("reason") || "Cancelled by user";
    
    // Update booking to cancelled status
    const cancelledBooking = await prisma.booking.update({
      where: { id: context.params.id },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
      },
    });
    
    // Notify the counterparty
    const isStudentAction = session.user.id === booking.userId;
    const notificationUserId = isStudentAction 
      ? booking.teacherProfile.userId 
      : booking.userId;
    
    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        title: "Booking Cancelled",
        message: `Your booking on ${booking.date} at ${booking.startTime} has been cancelled. Reason: ${reason}`,
        type: "BOOKING",
        isRead: false,
        relatedId: booking.id,
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