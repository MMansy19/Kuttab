import { PrismaClient } from "@/prisma/generated/prisma-client";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isFrontendOnlyMode } from "@/lib/config";
import { z } from "zod";

// Initialize Prisma client
const prisma = new PrismaClient();

const bookingUpdateSchema = z.object({
  status: z.enum(["PENDING", "SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  teacherNotes: z.string().max(1000).optional(),
  cancelReason: z.string().max(500).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "معرف الحجز مفقود" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "لم يتم العثور على الحجز" },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Booking fetch error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الحجز", details: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH to update booking status
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
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
          id: context.params.id,
          status: "CONFIRMED",
          notes: "Updated in frontend-only mode",
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: context. params.id },
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
      where: { id: context.params.id },
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
  context: { params: { id: string } }
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
          id: context.params.id,
          status: "CANCELLED",
          cancelReason: "Cancelled in frontend-only mode",
          canceledBy: session.user.id,
          updatedAt: new Date().toISOString()
        }
      });
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
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get("reason") || "Cancelled by user";
    
    // Update booking to cancelled status with the correct field name
    const cancelledBooking = await prisma.booking.update({
      where: { id: context.params.id },
      data: {
        status: "CANCELLED",
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