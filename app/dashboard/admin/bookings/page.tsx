"use client";

import React, { useState } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEdit, 
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaListUl,
  FaDownload,
  FaExclamationCircle,
  FaClock,
  FaUser,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import teachersData from '@/data/teachers';

// Generate mock booking data
interface Booking {
  id: string;
  userId: string;
  userName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  type: 'private' | 'group';
  participants: number;
  amount: number | null;
  isPaid: boolean;
  createdAt: string;
}

const statusColors = {
  confirmed: 'green',
  pending: 'yellow',
  cancelled: 'red',
  completed: 'blue'
};

// Generate random dates around current date
const getRandomDate = () => {
  const now = new Date();
  const offset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  return date.toISOString().split('T')[0];
};

const getRandomTimeSlot = () => {
  const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
  const minutes = [0, 30][Math.floor(Math.random() * 2)]; // 0 or 30 minutes
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generate mock bookings
const generateMockBookings = (count: number): Booking[] => {
  return Array(count).fill(null).map((_, i) => {
    const teacher = teachersData[Math.floor(Math.random() * teachersData.length)];
    const isPaid = Math.random() > 0.3;
    const date = getRandomDate();
    
    return {
      id: `booking-${i+1}`,
      userId: `user-${Math.floor(Math.random() * 50) + 1}`,
      userName: [
        "أحمد محمد", "سارة أحمد", "محمد علي", "فاطمة حسن", "علي محمود", 
        "مريم خالد", "عمر يوسف", "لمياء سعيد", "خالد إبراهيم", "نورا عادل"
      ][Math.floor(Math.random() * 10)],
      teacherId: teacher.id,
      teacherName: teacher.name,
      date,
      timeSlot: getRandomTimeSlot(),
      status: (['confirmed', 'pending', 'cancelled', 'completed'][Math.floor(Math.random() * 3.3)] || 'pending') as 'confirmed' | 'pending' | 'cancelled' | 'completed', // More confirmed/pending than others
      type: Math.random() > 0.7 ? 'group' : 'private',
      participants: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 2 : 1,
      amount: isPaid ? Math.floor(Math.random() * 150) + 50 : null,
      isPaid,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    };
  });
};

const mockBookings = generateMockBookings(100);

// Group bookings by date for the calendar view
const groupBookingsByDate = (bookings: Booking[]) => {
  return bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);
};

type SortField = 'id' | 'userName' | 'teacherName' | 'date' | 'status' | 'amount' | 'createdAt';

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isPaidFilter, setIsPaidFilter] = useState<string>('all');
  
  // Filter bookings based on search and filters
  const filteredBookings = mockBookings.filter(booking => {
    // Search term
    const searchMatch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatch = selectedStatus === 'all' || booking.status === selectedStatus;
    
    // Type filter
    const typeMatch = selectedType === 'all' || booking.type === selectedType;
    
    // Paid filter
    const paidMatch = isPaidFilter === 'all' || 
                     (isPaidFilter === 'paid' && booking.isPaid) || 
                     (isPaidFilter === 'free' && !booking.isPaid);
    
    // Date filter (for calendar view)
    let dateMatch = true;
    if (selectedDate) {
      dateMatch = booking.date === selectedDate;
    } else if (currentView === 'calendar') {
      // Show only bookings for the selected month
      dateMatch = booking.date.startsWith(selectedMonth);
    }
    
    return searchMatch && statusMatch && typeMatch && paidMatch && dateMatch;
  });
  
  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    // Special handling for date fields
    if (sortField === 'date' || sortField === 'createdAt') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Special handling for amount (might be null)
    if (sortField === 'amount') {
      const amountA = a[sortField] || 0;
      const amountB = b[sortField] || 0;
      return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
    }
    
    // Regular string fields
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage);
  
  // Calendar data
  const bookingsByDate = groupBookingsByDate(filteredBookings);
  
  // Get days in the selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar data
  const generateCalendarData = () => {
    const [year, month] = selectedMonth.split('-').map(n => parseInt(n));
    const daysInMonth = getDaysInMonth(year, month - 1);
    const firstDay = getFirstDayOfMonth(year, month - 1);
    
    // Adjust for week starting from Sunday (0)
    let firstDayIndex = firstDay;
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, bookings: [] });
    }
    
    // Add days of the month with their bookings
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      days.push({
        day,
        date,
        bookings: bookingsByDate[date] || []
      });
    }
    
    return days;
  };
  
  const calendarData = generateCalendarData();
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for new sort fields
    }
  };
  
  // Update booking status
  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    // In a real app, this would call an API to update the booking status
    console.log(`Updating booking ${bookingId} status to ${newStatus}`);
  };
  
  // Format a date object to a readable string
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('ar-SA', options);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
    setIsPaidFilter('all');
    setSelectedDate(null);
  };
  
  // Handle month change
  const changeMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(n => parseInt(n));
    const newDate = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(`${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}`);
    setSelectedDate(null); // Reset selected date when changing month
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الحجوزات</h1>
        <div className="flex gap-2">
          <Button 
            variant={currentView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('list')}
            className="flex items-center gap-2"
          >
            <FaListUl />
            <span>قائمة</span>
          </Button>
          <Button 
            variant={currentView === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('calendar')}
            className="flex items-center gap-2"
          >
            <FaCalendarAlt />
            <span>تقويم</span>
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search box */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="بحث عن الحجوزات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="confirmed">مؤكد</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغي</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
          
          {/* Type filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">جميع الأنواع</option>
              <option value="private">فردي</option>
              <option value="group">جماعي</option>
            </select>
          </div>
          
          {/* Paid filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={isPaidFilter}
              onChange={(e) => setIsPaidFilter(e.target.value)}
            >
              <option value="all">الكل</option>
              <option value="paid">مدفوع</option>
              <option value="free">مجاني</option>
            </select>
          </div>
        </div>
        
        {/* Results count and export/reset */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              عرض {filteredBookings.length} حجز من إجمالي {mockBookings.length}
            </p>
            
            {/* Reset filters button */}
            <Button 
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={
                searchTerm === '' && 
                selectedStatus === 'all' && 
                selectedType === 'all' && 
                isPaidFilter === 'all' &&
                selectedDate === null
              }
            >
              إعادة ضبط الفلاتر
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FaDownload size={14} />
            <span>تصدير CSV</span>
          </Button>
        </div>
        
        {/* Show selected date filter if any */}
        {selectedDate && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 ml-2" />
              <span className="text-blue-700 dark:text-blue-300">
                تصفية حسب التاريخ: {formatDate(selectedDate)}
              </span>
            </div>
            <button 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              onClick={() => setSelectedDate(null)}
            >
              <FaTimesCircle />
            </button>
          </div>
        )}
      </Card>
      
      {currentView === 'list' ? (
        /* List View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center justify-end">
                      <span>رقم الحجز</span>
                      {sortField === 'id' && (
                        sortDirection === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('userName')}
                  >
                    <div className="flex items-center justify-end">
                      <span>المستخدم</span>
                      {sortField === 'userName' && (
                        sortDirection === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('teacherName')}
                  >
                    <div className="flex items-center justify-end">
                      <span>المعلم</span>
                      {sortField === 'teacherName' && (
                        sortDirection === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center justify-end">
                      <span>التاريخ والوقت</span>
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center justify-end">
                      <span>الحالة</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end">
                      <span>المبلغ</span>
                      {sortField === 'amount' && (
                        sortDirection === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span>نوع الجلسة</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span>الإجراءات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <FaUser className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-3">
                          {booking.userName}
                          <div className="text-xs text-gray-500 dark:text-gray-400">{booking.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                          <FaChalkboardTeacher className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="ml-3">
                          {booking.teacherName}
                          <div className="text-xs text-gray-500 dark:text-gray-400">{booking.teacherId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <div className="font-medium">{formatDate(booking.date)}</div>
                        <div className="text-xs flex items-center">
                          <FaClock className="text-gray-400 ml-1" />
                          {booking.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusColors[booking.status]}-100 dark:bg-${statusColors[booking.status]}-900/20 text-${statusColors[booking.status]}-800 dark:text-${statusColors[booking.status]}-300`}>
                        {booking.status === 'confirmed' && 'مؤكد'}
                        {booking.status === 'pending' && 'قيد الانتظار'}
                        {booking.status === 'cancelled' && 'ملغي'}
                        {booking.status === 'completed' && 'مكتمل'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {booking.amount ? `${booking.amount} ريال` : 'مجاني'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.type === 'private' 
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                        : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300'
                      }`}>
                        {booking.type === 'private' 
                          ? 'فردي' 
                          : `جماعي (${booking.participants})`
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        {booking.status === 'pending' && (
                          <button 
                            className="ml-2 text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            title="تأكيد"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button 
                            className="ml-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="إلغاء"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            <FaTimesCircle />
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="اكتمال"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                السابق
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                التالي
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  عرض <span className="font-medium">{indexOfFirstBooking + 1}</span> إلى <span className="font-medium">{Math.min(indexOfLastBooking, filteredBookings.length)}</span> من <span className="font-medium">{filteredBookings.length}</span> حجز
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === 1
                      ? 'text-gray-300 dark:text-gray-600'
                      : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">السابق</span>
                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show correct page buttons (current, +/-1, first, last)
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageToShow)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                          currentPage === pageToShow
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                      currentPage === totalPages
                      ? 'text-gray-300 dark:text-gray-600'
                      : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">التالي</span>
                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Calendar View */
        <Card className="overflow-hidden p-6">
          {/* Month navigator */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaChevronRight className="text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {new Date(`${selectedMonth}-01`).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaChevronLeft className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day, i) => (
              <div key={i} className="text-center py-2 font-medium text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
            
            {/* Calendar cells */}
            {calendarData.map((day, i) => (
              <div 
                key={i} 
                className={`min-h-28 border border-gray-200 dark:border-gray-700 rounded-lg p-2 ${
                  day.date === selectedDate
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                    : day.bookings?.length > 0
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                    : day.day ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'
                }`}
                onClick={() => day.day && day.bookings?.length > 0 && setSelectedDate(day.date === selectedDate ? null : day.date)}
              >
                {day.day && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-semibold ${
                        day.date === new Date().toISOString().split('T')[0]
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {day.day}
                      </span>
                      
                      {day.bookings?.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-xs">
                          {day.bookings.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Show booking summary */}
                    <div className="space-y-1">
                      {day.bookings?.slice(0, 3).map((booking, idx) => (
                        <div 
                          key={idx}
                          className={`text-xs rounded px-2 py-1 truncate bg-${statusColors[booking.status]}-50 dark:bg-${statusColors[booking.status]}-900/10 text-${statusColors[booking.status]}-700 dark:text-${statusColors[booking.status]}-300 border-r-2 border-${statusColors[booking.status]}-500`}
                        >
                          {booking.timeSlot} - {booking.teacherName}
                        </div>
                      ))}
                      
                      {day.bookings?.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{day.bookings.length - 3} آخرون
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Bookings for selected date */}
          {selectedDate && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                حجوزات {formatDate(selectedDate)}
              </h3>
              
              <div className="space-y-4">
                {bookingsByDate[selectedDate]?.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-${statusColors[booking.status]}-100 dark:bg-${statusColors[booking.status]}-900/20`}>
                          <FaClock className={`text-${statusColors[booking.status]}-600 dark:text-${statusColors[booking.status]}-400`} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{booking.timeSlot} - {booking.teacherName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">المستخدم:</span> {booking.userName}
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs bg-${statusColors[booking.status]}-100 dark:bg-${statusColors[booking.status]}-900/20 text-${statusColors[booking.status]}-800 dark:text-${statusColors[booking.status]}-300`}>
                            {booking.status === 'confirmed' && 'مؤكد'}
                            {booking.status === 'pending' && 'قيد الانتظار'}
                            {booking.status === 'cancelled' && 'ملغي'}
                            {booking.status === 'completed' && 'مكتمل'}
                          </span>
                          
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            booking.type === 'private' 
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                            : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300'
                          }`}>
                            {booking.type === 'private' 
                              ? 'فردي' 
                              : `جماعي (${booking.participants})`
                            }
                          </span>
                          
                          {booking.amount ? (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                              {booking.amount} ريال
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-xs">
                              مجاني
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FaEye size={14} />
                        <span>عرض</span>
                      </Button>
                      
                      {booking.status === 'pending' && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        >
                          <FaCheckCircle size={14} />
                          <span>تأكيد</span>
                        </Button>
                      )}
                      
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <FaTimesCircle size={14} />
                          <span>إلغاء</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}