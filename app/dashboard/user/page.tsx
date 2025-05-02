"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { showSuccess, showWarning } from "@/utils/toast";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  teacherProfile: {
    user: {
      name: string;
      image: string | null;
    };
  };
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const loginSuccess = searchParams?.get("loginSuccess");
  const notification = searchParams?.get("notification");

  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Show welcome notification on login success
    if (loginSuccess === "true" && session?.user?.name) {
      showSuccess(`مرحباً بك ${session.user.name}! تم تسجيل دخولك إلى لوحة تحكم الطالب.`);
    }

    // Show notification if user attempted to access unauthorized area
    if (notification === "unauthorized_access") {
      showWarning("لا يمكنك الوصول إلى الصفحة المطلوبة. تم توجيهك إلى لوحة التحكم الخاصة بك.");
    }
  }, [loginSuccess, notification, session]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/bookings");
        if (!response.ok) {
          throw new Error("فشل في جلب الحجوزات");
        }

        const data = await response.json();

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Split bookings into upcoming and past
        const upcoming: Booking[] = [];
        const past: Booking[] = [];

        data.data.forEach((booking: Booking) => {
          if (
            booking.date > today ||
            (booking.date === today && booking.status !== "COMPLETED" && booking.status !== "CANCELLED")
          ) {
            upcoming.push(booking);
          } else {
            past.push(booking);
          }
        });

        setUpcomingBookings(upcoming);
        setPastBookings(past.slice(0, 5)); // Only show the 5 most recent past bookings
      } catch (err: any) {
        setError(err.message || "حدث خطأ ما");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "NO_SHOW":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md" dir="rtl">
        خطأ: {error}
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div><span className="sr-only">جاري التحميل...</span></div>}>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" dir="rtl">لوحة تحكم الطالب</h1>
        <Link href="/teachers">
          <Button dir="rtl">البحث عن معلم</Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300" dir="rtl">الجلسات القادمة</h3>
          <p className="text-3xl font-bold mt-2">{upcomingBookings.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300" dir="rtl">الجلسات المكتملة</h3>
          <p className="text-3xl font-bold mt-2">
            {pastBookings.filter(b => b.status === "COMPLETED").length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300" dir="rtl">التقييمات المقدمة</h3>
          <p className="text-3xl font-bold mt-2">
            {/* This would need to be fetched separately in a real implementation */}
            {pastBookings.filter(b => b.status === "COMPLETED").length}
          </p>
        </Card>
      </div>

      {/* Upcoming bookings */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4" dir="rtl">الجلسات القادمة</h2>
        {upcomingBookings.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-center" dir="rtl">
              ليس لديك أي جلسات قادمة.
            </p>
            <div className="flex justify-center mt-4">
              <Link href="/teachers">
                <Button dir="rtl">احجز جلسة الآن</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {booking.teacherProfile.user.image ? (
                        <img
                          src={booking.teacherProfile.user.image}
                          alt={booking.teacherProfile.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                          {booking.teacherProfile.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white" dir="rtl">
                        {booking.teacherProfile.user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                        {new Date(booking.date).toLocaleDateString('ar-SA')} • {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status === "SCHEDULED" ? "مجدول" : 
                       booking.status === "CONFIRMED" ? "مؤكد" : 
                       booking.status === "COMPLETED" ? "مكتمل" : 
                       booking.status === "CANCELLED" ? "ملغي" : 
                       booking.status === "NO_SHOW" ? "لم يحضر" : booking.status}
                    </Badge>
                    <Link href={`/dashboard/user/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm" dir="rtl">عرض التفاصيل</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent past bookings */}
      {pastBookings.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white" dir="rtl">الجلسات السابقة</h2>
            <Link href="/dashboard/user/bookings">
              <Button variant="ghost" dir="rtl">عرض الكل</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {booking.teacherProfile.user.image ? (
                        <img
                          src={booking.teacherProfile.user.image}
                          alt={booking.teacherProfile.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                          {booking.teacherProfile.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white" dir="rtl">
                        {booking.teacherProfile.user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                        {new Date(booking.date).toLocaleDateString('ar-SA')} • {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status === "SCHEDULED" ? "مجدول" : 
                       booking.status === "CONFIRMED" ? "مؤكد" : 
                       booking.status === "COMPLETED" ? "مكتمل" : 
                       booking.status === "CANCELLED" ? "ملغي" : 
                       booking.status === "NO_SHOW" ? "لم يحضر" : booking.status}
                    </Badge>
                    {booking.status === "COMPLETED" && (
                      <Link href={`/dashboard/user/bookings/${booking.id}/review`}>
                        <Button variant="outline" size="sm" dir="rtl">إضافة تقييم</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
    </Suspense>
  );
}
