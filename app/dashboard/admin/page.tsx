import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/features/auth/services/auth-options";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Force dynamic rendering for authentication pages
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  pendingTeachers: number;
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
}

export default async function AdminDashboard() {
  // Get session data server-side for security
  const session = await getServerSession(authOptions);
  
  // Secure the admin dashboard - redirect if not an admin
  if (!session?.user || session.user.role?.toUpperCase() !== 'ADMIN') {
    console.error("Unauthorized access attempt to admin dashboard");
    redirect('/dashboard');
  }
  
  // In a real implementation, you would fetch these stats server-side
  // This is just a placeholder for demonstration
  let stats: DashboardStats;
  let error = null;
  
  try {
    // Server-side data fetching for security and performance
        
        // For a real implementation, this would be a dedicated API endpoint
        // that aggregates these stats server-side
        
        // Fetch users count
        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        
        // Fetch teachers count
        const teachersResponse = await fetch("/api/teachers");
        const teachersData = await teachersResponse.json();
        
        // Fetch pending teachers count
        const pendingTeachersResponse = await fetch("/api/teachers?approvalStatus=PENDING");
        const pendingTeachersData = await pendingTeachersResponse.json();
        
        // Fetch bookings stats
        const bookingsResponse = await fetch("/api/bookings");
        const bookingsData = await bookingsResponse.json();
        
        // Count upcoming and completed bookings
        const today = new Date().toISOString().split("T")[0];
        let upcomingCount = 0;
        let completedCount = 0;
        
        bookingsData.data.forEach((booking: any) => {
          if (booking.status === "COMPLETED") {
            completedCount++;
          }
          
          if ((booking.date > today || 
              (booking.date === today && booking.status !== "COMPLETED" && booking.status !== "CANCELLED")) &&
              (booking.status === "SCHEDULED" || booking.status === "CONFIRMED")) {
            upcomingCount++;
          }
        });
        
        // Set all stats
        setStats({
          totalUsers: usersData.metadata.total,
          totalTeachers: teachersData.metadata.total,
          pendingTeachers: pendingTeachersData.metadata.total,
          totalBookings: bookingsData.metadata.total,
          upcomingBookings: upcomingCount,
          completedBookings: completedCount,
        });
      } catch (err: any) {
        setError(err.message || "حدث خطأ ما");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md">
        خطأ: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة تحكم المسؤول</h1>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">إجمالي المستخدمين</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">إجمالي المعلمين</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalTeachers || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">إجمالي الحجوزات</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalBookings || 0}</p>
        </Card>
      </div>

      {/* Action Cards */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">إجراءات سريعة</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Teachers Card */}
        <Card className="p-6">
          <div className="flex flex-col h-full">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  المعلمون المعلقون
                </h3>
                <span className={`h-6 w-6 flex items-center justify-center rounded-full 
                  ${stats?.pendingTeachers ? 'bg-yellow-500' : 'bg-green-500'} text-white text-xs font-bold`}>
                  {stats?.pendingTeachers || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {stats?.pendingTeachers 
                  ? `${stats?.pendingTeachers} معلم في انتظار الموافقة` 
                  : "لا توجد معلمين معلقين"}
              </p>
            </div>
            <div className="mt-auto">
              <Link href="/dashboard/admin/teachers?approvalStatus=PENDING">
                <Button 
                  variant={stats?.pendingTeachers ? "default" : "outline"} 
                  className="w-full"
                >
                  مراجعة المعلمين
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Upcoming Bookings Card */}
        <Card className="p-6">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                الجلسات القادمة
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {stats?.upcomingBookings || 0} جلسات مجدولة
              </p>
            </div>
            <div className="mt-auto">
              <Link href="/dashboard/admin/bookings?status=SCHEDULED">
                <Button variant="outline" className="w-full">
                  عرض الجلسات القادمة
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* User Management Card */}
        <Card className="p-6">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                إدارة المستخدمين
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                إدارة المستخدمين وصلاحياتهم
              </p>
            </div>
            <div className="mt-auto">
              <Link href="/dashboard/admin/users">
                <Button variant="outline" className="w-full">
                  إدارة المستخدمين
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Management Links */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">الإدارة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            إدارة المعلمين
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            مراجعة وإدارة ملفات المعلمين والموافقات وتقييم الأداء.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/admin/teachers">
              <Button variant="outline" size="sm" className="w-full">
                جميع المعلمين
              </Button>
            </Link>
            <Link href="/dashboard/admin/teachers?approvalStatus=PENDING">
              <Button variant="outline" size="sm" className="w-full">
                الموافقات المعلقة
              </Button>
            </Link>
            <Link href="/dashboard/admin/teachers?approvalStatus=APPROVED">
              <Button variant="outline" size="sm" className="w-full">
                المعلمون المعتمدون
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            إدارة الحجوزات
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            متابعة وإدارة حجوزات الطلاب والجلسات.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/admin/bookings">
              <Button variant="outline" size="sm" className="w-full">
                جميع الحجوزات
              </Button>
            </Link>
            <Link href="/dashboard/admin/bookings?status=SCHEDULED,CONFIRMED">
              <Button variant="outline" size="sm" className="w-full">
                الجلسات القادمة
              </Button>
            </Link>
            <Link href="/dashboard/admin/bookings?status=COMPLETED">
              <Button variant="outline" size="sm" className="w-full">
                الجلسات المكتملة
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}