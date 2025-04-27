"use client";

import React, { useState } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaUserCheck, 
  FaUserTimes, 
  FaUserEdit, 
  FaTrash, 
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Mock user data
const mockUsers = Array(50).fill(null).map((_, i) => ({
  id: `user-${i+1}`,
  name: [
    "أحمد محمد", "سارة أحمد", "محمد علي", "فاطمة حسن", "علي محمود", 
    "مريم خالد", "عمر يوسف", "لمياء سعيد", "خالد إبراهيم", "نورا عادل"
  ][Math.floor(Math.random() * 10)],
  email: `user${i+1}@example.com`,
  role: ["USER", "TEACHER", "ADMIN"][Math.floor(Math.random() * 2.7)], // Less chance of ADMIN
  status: ["active", "inactive"][Math.floor(Math.random() * 1.3)], // More active than inactive
  joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  lastActive: Math.random() > 0.3 
    ? new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0]
}));

type User = typeof mockUsers[0];
type SortField = 'name' | 'email' | 'role' | 'status' | 'joinDate' | 'lastActive';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Filter users based on search term and filters
  const filteredUsers = mockUsers.filter(user => {
    // Search term
    const searchMatch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const roleMatch = selectedRole === 'all' || user.role === selectedRole;
    
    // Status filter
    const statusMatch = selectedStatus === 'all' || user.status === selectedStatus;
    
    return searchMatch && roleMatch && statusMatch;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Special handling for date fields
    if (sortField === 'joinDate' || sortField === 'lastActive') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Regular string fields
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle status toggle
  const toggleUserStatus = (userId: string, currentStatus: string) => {
    // In a real app, this would call an API to update the user status
    console.log(`Toggling user ${userId} status from ${currentStatus} to ${currentStatus === 'active' ? 'inactive' : 'active'}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المستخدمين</h1>
        <Button variant="gradient" size="lg" className="flex items-center gap-2">
          إضافة مستخدم جديد
        </Button>
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
              placeholder="بحث عن المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Role filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">جميع الأدوار</option>
              <option value="USER">مستخدم</option>
              <option value="TEACHER">معلم</option>
              <option value="ADMIN">مشرف</option>
            </select>
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
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
          
          {/* Reset filters */}
          <Button 
            variant="outline"
            onClick={resetFilters}
            disabled={searchTerm === '' && selectedRole === 'all' && selectedStatus === 'all'}
          >
            إعادة ضبط الفلاتر
          </Button>
        </div>
        
        {/* Results count and export */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            عرض {filteredUsers.length} مستخدم من إجمالي {mockUsers.length}
          </p>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FaDownload size={14} />
            <span>تصدير CSV</span>
          </Button>
        </div>
      </Card>
      
      {/* Users table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center justify-end">
                    <span>الاسم</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center justify-end">
                    <span>البريد الإلكتروني</span>
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center justify-end">
                    <span>الدور</span>
                    {sortField === 'role' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
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
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('joinDate')}
                >
                  <div className="flex items-center justify-end">
                    <span>تاريخ التسجيل</span>
                    {sortField === 'joinDate' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastActive')}
                >
                  <div className="flex items-center justify-end">
                    <span>آخر نشاط</span>
                    {sortField === 'lastActive' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' 
                      : user.role === 'TEACHER'
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
                    }`}>
                      {user.role === 'ADMIN' ? 'مشرف' : user.role === 'TEACHER' ? 'معلم' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    }`}>
                      {user.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="عرض الملف الشخصي"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mr-2"
                        title="تعديل"
                      >
                        <FaUserEdit />
                      </button>
                      <button 
                        className={`${
                          user.status === 'active'
                          ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                          : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                        } mr-2`}
                        title={user.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        onClick={() => toggleUserStatus(user.id, user.status)}
                      >
                        {user.status === 'active' ? <FaUserTimes /> : <FaUserCheck />}
                      </button>
                      <button 
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 mr-2"
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
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
                عرض <span className="font-medium">{indexOfFirstUser + 1}</span> إلى <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> من <span className="font-medium">{filteredUsers.length}</span> مستخدم
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
    </div>
  );
}