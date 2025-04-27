"use client";

import React, { useState } from 'react';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCalendarAlt, 
  FaChartLine,
  FaMoneyBillWave,
  FaUserGraduate,
  FaClock,
  FaEllipsisH,
  FaBook,
  FaDownload,
  FaRegClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaStar,
} from 'react-icons/fa';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Mock data for the dashboard
const mockStats = {
  totalUsers: 2453,
  totalTeachers: 148,
  totalBookings: 5639,
  activeTeachers: 127,
  pendingTeachers: 21,
  pendingBookings: 47,
  totalRevenue: 156320,
  activeStudents: 1842,
  bookingsToday: 84,
  totalCompletedSessions: 4892,
  averageSessionDuration: 45,
  averageRating: 4.7,
};

// For revenue chart data
const revenueData = [
  { month: 'Jan', amount: 12500 },
  { month: 'Feb', amount: 14200 },
  { month: 'Mar', amount: 15800 },
  { month: 'Apr', amount: 16500 },
  { month: 'May', amount: 18200 },
  { month: 'Jun', amount: 19800 },
  { month: 'Jul', amount: 21500 },
  { month: 'Aug', amount: 20200 },
  { month: 'Sep', amount: 22800 },
  { month: 'Oct', amount: 24500 },
  { month: 'Nov', amount: 23200 },
  { month: 'Dec', amount: 25800 },
];

// For popular subjects
const popularSubjects = [
  { name: 'القرآن الكريم (تلاوة)', students: 1240, percentage: 65 },
  { name: 'تجويد', students: 980, percentage: 52 },
  { name: 'تفسير القرآن', students: 780, percentage: 41 },
  { name: 'الفقه', students: 680, percentage: 36 },
  { name: 'العقيدة', students: 540, percentage: 28 },
];

// For recent activities
const recentActivities = [
  { type: 'user_register', user: 'أحمد محمود', time: '15 دقيقة', image: '/images/icons/user-add.png' },
  { type: 'booking_new', user: 'سارة أحمد', teacher: 'محمد خالد', time: '45 دقيقة', image: '/images/icons/calendar.png' },
  { type: 'teacher_register', teacher: 'علي عمر', time: '2 ساعة', image: '/images/icons/teacher.png' },
  { type: 'booking_complete', user: 'فاطمة حسن', teacher: 'زينب سعيد', time: '3 ساعة', image: '/images/icons/check.png' },
  { type: 'payment_received', amount: '350', user: 'خالد إبراهيم', time: '5 ساعة', image: '/images/icons/payment.png' },
  { type: 'rating_new', user: 'مريم عادل', teacher: 'أحمد يوسف', rating: 5, time: '6 ساعة', image: '/images/icons/star.png' },
];

// Recent new teachers
const recentTeachers = [
  { id: 1, name: 'مراد علي', avatarUrl: null, specialization: 'القرآن الكريم', experience: 8, status: 'pending', subjects: ['تلاوة', 'تجويد'] },
  { id: 2, name: 'نورة محمد', avatarUrl: null, specialization: 'الفقه المالكي', experience: 12, status: 'pending', subjects: ['فقه', 'تفسير'] },
  { id: 3, name: 'عبدالله أحمد', avatarUrl: null, specialization: 'علوم الحديث', experience: 5, status: 'pending', subjects: ['حديث', 'سيرة'] },
];

// For booking status stats
const bookingStatusStats = {
  confirmed: 65,
  pending: 20,
  cancelled: 15
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `${formatNumber(amount)} ريال`;
  };
  
  // Calculate max value for chart scaling
  const maxRevenueValue = Math.max(...revenueData.map(item => item.amount));
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FaDownload size={14} />
            <span>تقرير شامل</span>
          </Button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/30 border-blue-200 dark:border-blue-800 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">إجمالي المستخدمين</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatNumber(mockStats.totalUsers)}</h3>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                +12% من الشهر الماضي
              </p>
            </div>
            <div className="bg-blue-500/10 dark:bg-blue-500/30 rounded-full p-3">
              <FaUsers className="text-blue-600 dark:text-blue-300 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/admin/users" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              عرض التفاصيل
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">إجمالي المعلمين</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatNumber(mockStats.totalTeachers)}</h3>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                +8% من الشهر الماضي
              </p>
            </div>
            <div className="bg-emerald-500/10 dark:bg-emerald-500/30 rounded-full p-3">
              <FaChalkboardTeacher className="text-emerald-600 dark:text-emerald-300 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/admin/teachers" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline">
              عرض التفاصيل
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/30 border-purple-200 dark:border-purple-800 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 font-medium">إجمالي الحجوزات</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatNumber(mockStats.totalBookings)}</h3>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                +15% من الشهر الماضي
              </p>
            </div>
            <div className="bg-purple-500/10 dark:bg-purple-500/30 rounded-full p-3">
              <FaCalendarAlt className="text-purple-600 dark:text-purple-300 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/admin/bookings" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
              عرض التفاصيل
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/50 dark:to-amber-800/30 border-amber-200 dark:border-amber-800 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-amber-600 dark:text-amber-400 font-medium">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(mockStats.totalRevenue)}</h3>
              <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                +10% من الشهر الماضي
              </p>
            </div>
            <div className="bg-amber-500/10 dark:bg-amber-500/30 rounded-full p-3">
              <FaMoneyBillWave className="text-amber-600 dark:text-amber-300 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="#" className="text-amber-600 dark:text-amber-400 text-sm font-medium hover:underline">
              عرض التقارير المالية
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Secondary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active vs Pending Teachers */}
        <Card className="shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">حالة المعلمين</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FaEllipsisH />
            </button>
          </div>
          <div className="flex items-center justify-around mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{mockStats.activeTeachers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">نشط</div>
            </div>
            <div className="h-12 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{mockStats.pendingTeachers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">قيد الانتظار</div>
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                نسبة التفعيل: {Math.round((mockStats.activeTeachers / mockStats.totalTeachers) * 100)}%
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${Math.round((mockStats.activeTeachers / mockStats.totalTeachers) * 100)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
              ></div>
            </div>
          </div>
        </Card>

        {/* Booking Status Chart */}
        <Card className="shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">حالة الحجوزات</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FaEllipsisH />
            </button>
          </div>
          <div className="flex items-center justify-center mb-3">
            <div className="relative w-40 h-40">
              {/* Simple pie chart representation */}
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-r-yellow-500 border-b-red-500"
                style={{transform: `rotate(${bookingStatusStats.confirmed * 3.6}deg)`}}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{bookingStatusStats.confirmed}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">مؤكدة</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-1">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">مؤكدة</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{bookingStatusStats.confirmed}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-1">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">معلقة</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{bookingStatusStats.pending}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-1">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">ملغاة</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{bookingStatusStats.cancelled}%</span>
            </div>
          </div>
        </Card>

        {/* Today's Bookings */}
        <Card className="shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">حجوزات اليوم</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FaEllipsisH />
            </button>
          </div>
          <div className="flex items-center justify-around mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{mockStats.bookingsToday}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">إجمالي الحجوزات</div>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                  <FaCheckCircle className="text-green-600 dark:text-green-400" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800 dark:text-gray-200">مكتملة</div>
                </div>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                32
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <FaRegClock className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800 dark:text-gray-200">قادمة</div>
                </div>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                45
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                  <FaTimesCircle className="text-red-600 dark:text-red-400" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800 dark:text-gray-200">ملغاة</div>
                </div>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                7
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">تقرير الإيرادات</h3>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setTimeRange('day')}
                className={`px-3 py-1 text-xs ${
                  timeRange === 'day'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                يوم
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 text-xs ${
                  timeRange === 'week'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                أسبوع
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 text-xs ${
                  timeRange === 'month'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                شهر
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-3 py-1 text-xs ${
                  timeRange === 'year'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                سنة
              </button>
            </div>
          </div>
          
          {/* Revenue chart */}
          <div className="h-64 relative">
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex h-full items-end justify-between">
              {revenueData.map((month, index) => {
                const height = (month.amount / maxRevenueValue) * 100 + '%';
                return (
                  <div key={index} className="flex flex-col items-center w-full">
                    <div
                      style={{ height }}
                      className={`w-5/6 rounded-t bg-emerald-500 ${
                        month.amount === Math.max(...revenueData.map(item => item.amount))
                          ? 'bg-emerald-600'
                          : 'bg-emerald-500'
                      }`}
                    ></div>
                    <div className="text-xs mt-2 text-gray-600 dark:text-gray-400">{month.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              إجمالي الإيرادات للعام: <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(mockStats.totalRevenue)}</span>
            </div>
            <Link href="#" className="text-emerald-600 hover:underline">
              عرض التقرير الكامل
            </Link>
          </div>
        </Card>
        
        {/* Popular Subjects */}
        <Card className="shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">المواد الأكثر شعبية</h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FaEllipsisH />
            </button>
          </div>
          
          <div className="space-y-4">
            {popularSubjects.map((subject, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{subject.students} طالب</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                  {subject.percentage}% من إجمالي الطلاب
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              عرض جميع المواد
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">أحدث الأنشطة</h3>
            <Link href="#" className="text-emerald-600 text-sm hover:underline">
              عرض الكل
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  {activity.type === 'user_register' && <FaUsers className="text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'booking_new' && <FaCalendarAlt className="text-purple-600 dark:text-purple-400" />}
                  {activity.type === 'teacher_register' && <FaChalkboardTeacher className="text-emerald-600 dark:text-emerald-400" />}
                  {activity.type === 'booking_complete' && <FaCheckCircle className="text-green-600 dark:text-green-400" />}
                  {activity.type === 'payment_received' && <FaMoneyBillWave className="text-amber-600 dark:text-amber-400" />}
                  {activity.type === 'rating_new' && <FaStar className="text-yellow-600 dark:text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    {activity.type === 'user_register' && (
                      <>انضم <span className="font-semibold">{activity.user}</span> إلى المنصة.</>
                    )}
                    {activity.type === 'booking_new' && (
                      <>قام <span className="font-semibold">{activity.user}</span> بحجز جلسة مع المعلم <span className="font-semibold">{activity.teacher}</span>.</>
                    )}
                    {activity.type === 'teacher_register' && (
                      <>انضم المعلم <span className="font-semibold">{activity.teacher}</span> إلى المنصة.</>
                    )}
                    {activity.type === 'booking_complete' && (
                      <>اكتملت جلسة <span className="font-semibold">{activity.user}</span> مع المعلم <span className="font-semibold">{activity.teacher}</span>.</>
                    )}
                    {activity.type === 'payment_received' && (
                      <>تم استلام مبلغ <span className="font-semibold">{activity.amount} ريال</span> من <span className="font-semibold">{activity.user}</span>.</>
                    )}
                    {activity.type === 'rating_new' && (
                      <>قام <span className="font-semibold">{activity.user}</span> بتقييم المعلم <span className="font-semibold">{activity.teacher}</span> بـ {activity.rating} نجوم.</>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">منذ {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Teachers */}
        <Card className="shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">معلمين قيد الانتظار</h3>
            <Link href="/dashboard/admin/teachers" className="text-emerald-600 text-sm hover:underline">
              عرض الكل
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTeachers.map((teacher, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{teacher.name.charAt(0)}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 dark:text-white font-medium">{teacher.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.specialization}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-1">
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full px-2 py-0.5">
                      قيد الانتظار
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {teacher.experience} سنوات خبرة
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full" size="sm">
              مراجعة طلبات المعلمين
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}