"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { showSuccess, showWarning } from "@/utils/toast";

// Force dynamic rendering for authentication pages
export const dynamic = 'force-dynamic';

interface TeacherProfile {
  id: string;
  specializations: string[];
  hourlyRate: number | null;
  isActive: boolean;
  // Using a normal property instead of a getter for compatibility
  isAvailable?: boolean;
  // These fields might be derived or calculated
  approvalStatus?: string;
  averageRating?: number | null;
  reviewCount?: number;
}

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  user: {
    name: string;
    image: string | null;
  };
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Secure the teacher dashboard - redirect if not a teacher
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/teacher');
    } else if (status === 'authenticated' && session?.user?.role?.toUpperCase() !== 'TEACHER') {
      console.error("Unauthorized access attempt to teacher dashboard");
      router.push('/dashboard');
    }
  }, [status, session, router]);
    // Client component with state and hooks
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Check URL parameters for success/notification flags
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const loginSuccessParam = urlParams.get('loginSuccess');
      const notificationParam = urlParams.get('notification');
      
      setLoginSuccess(loginSuccessParam);
      setNotification(notificationParam);
    }
  }, []);

  // Show notifications
  useEffect(() => {
    // Show welcome notification on login success
    if (loginSuccess === "true" && session?.user?.name) {
      showSuccess(`مرحباً بك ${session.user.name}! تم تسجيل دخولك إلى لوحة تحكم المعلم.`);
    }

    // Show notification if user attempted to access unauthorized area
    if (notification === "unauthorized_access") {
      showWarning("لا يمكنك الوصول إلى الصفحة المطلوبة. تم توجيهك إلى لوحة التحكم الخاصة بك.");
    }
  }, [loginSuccess, notification, session]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Don't fetch if user isn't authenticated yet
      if (status !== 'authenticated' || !session?.user?.id) {
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);        // Fetch the teacher profile data with credentials
        const profileResponse = await fetch(`/api/users/${session.user.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          throw new Error(`فشل في جلب ملف المعلم (${profileResponse.status}): ${errorText}`);
        }        const profileData = await profileResponse.json();
        console.log("Profile data:", profileData);
        
        // Add isAvailable property for backward compatibility
        if (profileData.teacherProfile) {
          profileData.teacherProfile.isAvailable = profileData.teacherProfile.isActive;
          setTeacherProfile(profileData.teacherProfile);
        } else if (profileData.user && profileData.user.teacherProfile) {
          profileData.user.teacherProfile.isAvailable = profileData.user.teacherProfile.isActive;
          setTeacherProfile(profileData.user.teacherProfile);
        } else {
          console.error("No teacher profile found in the response");
          setError("لم يتم العثور على ملف المعلم");
          return; // Exit early if no teacher profile found to prevent further API calls
        }
        
        // Fetch bookings with credentials
        const bookingsResponse = await fetch("/api/bookings", {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!bookingsResponse.ok) {
          throw new Error("فشل في جلب الحجوزات");
        }

        const bookingsData = await bookingsResponse.json();
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Filter upcoming bookings
        const upcoming = bookingsData.data ? bookingsData.data.filter((booking: Booking) =>
          (booking.date > today ||
            (booking.date === today && booking.status !== "COMPLETED" && booking.status !== "CANCELLED")) &&
          (booking.status === "SCHEDULED" || booking.status === "CONFIRMED")
        ) : [];

        setUpcomingBookings(upcoming);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "حدث خطأ ما");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status]);

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

  const getApprovalStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };  const handleToggleAvailability = async () => {
    try {
      if (!teacherProfile || !session) return;

      const response = await fetch(`/api/teachers/${teacherProfile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({              isActive: !teacherProfile.isActive,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update availability: ${errorText}`);
      }      const updatedProfile = await response.json();
      const profile = updatedProfile.profile || updatedProfile.data;
      
      // Ensure isAvailable is set for backward compatibility
      if (profile) {
        profile.isAvailable = profile.isActive;
      }
      
      setTeacherProfile(profile);
    } catch (err: any) {
      console.error("Error updating availability:", err);
      setError(err.message || "An error occurred");
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

  if (!teacherProfile) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-4 rounded-md" dir="rtl">
        لم يتم العثور على ملف المعلم. يرجى التواصل مع الدعم.
      </div>
    );
  }

  return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div><span className="sr-only">جاري التحميل...</span></div>}>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" dir="rtl">لوحة تحكم المعلم</h1>
        <Link href="/dashboard/teacher/profile">
          <Button variant="outline">تعديل الملف الشخصي</Button>
        </Link>
      </div>

      {/* Profile Status Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white" dir="rtl">حالة الملف الشخصي</h2>
            <div className="mt-2 flex items-center">              <Badge className={getApprovalStatusBadgeColor(teacherProfile.approvalStatus || '')}>
                {teacherProfile.approvalStatus === "PENDING" ? "قيد المراجعة" : 
                 teacherProfile.approvalStatus === "APPROVED" ? "تمت الموافقة" : 
                 teacherProfile.approvalStatus === "REJECTED" ? "مرفوض" : teacherProfile.approvalStatus || 'غير معروف'}
              </Badge>
              {teacherProfile.approvalStatus === "PENDING" && (
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-400" dir="rtl">
                  يتم مراجعة ملفك الشخصي من قبل فريقنا.
                </p>
              )}
              {teacherProfile.approvalStatus === "REJECTED" && (
                <p className="ml-3 text-sm text-red-600 dark:text-red-400" dir="rtl">
                  تم رفض ملفك الشخصي. يرجى تحديث معلوماتك وإعادة التقديم.
                </p>
              )}
            </div>            <div className="mt-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300" dir="rtl">التخصصات</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400" dir="rtl">
                {teacherProfile.specializations && teacherProfile.specializations.length > 0 
                  ? teacherProfile.specializations.join(', ')
                  : "غير محدد"}
              </p>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-700 dark:text-gray-300" dir="rtl">سعر الساعة</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400" dir="rtl">
                {teacherProfile.hourlyRate
                  ? `${teacherProfile.hourlyRate} ريال / ساعة`
                  : "غير محدد"}
              </p>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-700 dark:text-gray-300" dir="rtl">التقييم</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400" dir="rtl">
                {teacherProfile.averageRating
                  ? `${teacherProfile.averageRating.toFixed(1)} نجوم (${teacherProfile.reviewCount} تقييم)`
                  : "لا توجد تقييمات حتى الآن"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-start">            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ml-2 ${teacherProfile.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium" dir="rtl">
                {teacherProfile.isActive ? 'متاح للحجز' : 'غير متاح للحجز'}
              </span>
            </div>
            <Button
              onClick={handleToggleAvailability}
              variant={teacherProfile.isActive ? "danger" : "default"}
              dir="rtl"
            >
              {teacherProfile.isActive
                ? "إيقاف الحجوزات"
                : "قبول الحجوزات"}
            </Button>

            <Link href="/dashboard/teacher/availability">
              <Button className="w-full" variant="outline" dir="rtl">
                إدارة الجدول
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Upcoming Sessions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white" dir="rtl">الجلسات القادمة</h2>
          <Link href="/dashboard/teacher/bookings">
            <Button variant="ghost" dir="rtl">عرض كل الحجوزات</Button>
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-center" dir="rtl">
              ليس لديك أي جلسات تعليمية قادمة.
            </p>
            {teacherProfile.approvalStatus !== "APPROVED" && (
              <p className="text-yellow-600 dark:text-yellow-400 text-center mt-2" dir="rtl">
                يجب الموافقة على ملفك الشخصي قبل أن تتمكن من استقبال الحجوزات.
              </p>
            )}            {!teacherProfile.isActive && teacherProfile.approvalStatus === "APPROVED" && (
              <p className="text-yellow-600 dark:text-yellow-400 text-center mt-2" dir="rtl">
                أنت حالياً غير متاح لاستقبال الحجوزات. قم بتغيير حالة التوفر للبدء في استقبال الحجوزات.
              </p>
            )}
          </Card>
        ) : (
          <div className="flex flex-col gap-4 items-start">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {booking.user.image ? (
                        <img
                          src={booking.user.image}
                          alt={booking.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                          {booking.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white" dir="rtl">
                        {booking.user.name}
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
                    <Link href={`/dashboard/teacher/bookings/${booking.id}`}>
                      <Button
                        variant={booking.status === "SCHEDULED" ? "default" : "outline"}
                        size="sm"
                        dir="rtl"
                      >
                        {booking.status === "SCHEDULED" ? "تأكيد" : "عرض"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4" dir="rtl">روابط سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2" dir="rtl">عرض الملف الشخصي</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3" dir="rtl">
              شاهد كيف يظهر ملفك الشخصي للطلاب.
            </p>
            <Link href={`/teachers/${teacherProfile.id}`}>
              <Button variant="outline" size="sm" className="w-full" dir="rtl">عرض الملف العام</Button>
            </Link>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2" dir="rtl">تقييماتي</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3" dir="rtl">
              اطلع على آراء طلابك.
            </p>
            <Link href={`/dashboard/teacher/reviews`}>
              <Button variant="outline" size="sm" className="w-full" dir="rtl">عرض التقييمات</Button>
            </Link>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2" dir="rtl">سجل التدريس</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3" dir="rtl">
              عرض جلسات التدريس السابقة.
            </p>
            <Link href="/dashboard/teacher/bookings?status=COMPLETED">
              <Button variant="outline" size="sm" className="w-full" dir="rtl">عرض السجل</Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
      </Suspense>
  );
}
