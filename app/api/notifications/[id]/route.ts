import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type NotificationParams = { id: string };

// GET a single notification
export async function GET(
  req: NextRequest,
  { params }: { params: NotificationParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const notification = await prisma.notification.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Check if the notification belongs to the current user
    if (notification.receiverId?.toString() !== session.user.id?.toString() && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json({ data: notification });
  } catch (error) {
    console.error("Error fetching notification:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification" },
      { status: 500 }
    );
  }
}

// PATCH to update notification (mark as read/unread)
export async function PATCH(
  req: NextRequest,
  { params }: { params: NotificationParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const notification = await prisma.notification.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Check if the notification belongs to the current user
    if (notification.receiverId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Update notification (only isRead status can be modified)
    const updatedNotification = await prisma.notification.update({
      where: {
        id: params.id,
      },
      data: {
        isRead: body.isRead !== undefined ? body.isRead : notification.isRead,
      },
    });
    
    return NextResponse.json({ 
      message: "Notification updated", 
      notification: updatedNotification 
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE a notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: IdParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const notification = await prisma.notification.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    
    // Check if the notification belongs to the current user
    if (notification.receiverId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Delete notification
    await prisma.notification.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json({ 
      message: "Notification deleted" 
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}