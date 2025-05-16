import prisma from "@/lib/prisma";

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: "BOOKING" | "REVIEW" | "SYSTEM" | string;
  relatedId?: string;
}

/**
 * Creates a new notification for a user
 */
export async function sendNotification(data: NotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        relatedId: data.relatedId,
        isRead: false,
      },
    });

    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

/**
 * Formats a booking status message based on status and teacher name
 */
export function formatBookingStatusMessage(
  status: string,
  teacherName: string,
  date: string,
  time: string
): string {
  switch (status) {
    case "PENDING":
      return `تم إرسال طلب الحجز بنجاح للأستاذ ${teacherName} ليوم ${date} في تمام ${time}. بانتظار موافقة الأستاذ.`;
    case "CONFIRMED":
      return `تم تأكيد الحجز مع الأستاذ ${teacherName} ليوم ${date} في تمام ${time}. لا تنس موعدك!`;
    case "CANCELLED_BY_STUDENT":
      return `تم إلغاء الحجز مع الأستاذ ${teacherName} ليوم ${date} في تمام ${time} من قبلك.`;
    case "CANCELLED_BY_TEACHER":
      return `تم إلغاء الحجز مع الأستاذ ${teacherName} ليوم ${date} في تمام ${time} من قبل المعلم.`;
    case "REJECTED":
      return `تم رفض طلب الحجز من قبل الأستاذ ${teacherName} ليوم ${date} في تمام ${time}.`;
    case "COMPLETED":
      return `تمت الجلسة مع الأستاذ ${teacherName} بنجاح! نتمنى أن تكون قد استفدت.`;
    default:
      return `تم تحديث حالة الحجز مع الأستاذ ${teacherName} ليوم ${date} في تمام ${time}.`;
  }
}

/**
 * Formats a review notification message
 */
export function formatReviewMessage(reviewerName: string, rating: number): string {
  return `قام ${reviewerName} بإضافة تقييم جديد لك (${rating} نجوم). شكراً على جهودك!`;
}

/**
 * Sends a notification to an admin
 */
export async function notifyAdmins(title: string, message: string, type: string, relatedId?: string) {
  try {    // Find all admin users
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
    });

    // Send notification to each admin
    const notificationPromises = admins.map((admin: { id: string }) =>
      sendNotification({
        userId: admin.id,
        title,
        message,
        type,
        relatedId,
      })
    );

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error notifying admins:", error);
    throw error;
  }
}