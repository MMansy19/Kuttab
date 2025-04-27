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
  FaDownload,
  FaStar,
  FaCertificate,
  FaGraduationCap
} from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import teachersData from '@/data/teachers';

// Add missing properties for consistent teacher data
const enhancedTeachers = teachersData.map((teacher, index) => ({
  ...teacher,
  joinedDate: teacher.joinedDate || '2023-01-01',
  status: Math.random() > 0.2 ? 'active' : Math.random() > 0.5 ? 'pending' : 'inactive',
  verified: Math.random() > 0.3,
}));

type Teacher = typeof enhancedTeachers[0];
type SortField = 'name' | 'rating' | 'experience' | 'specialization' | 'status' | 'joinedDate';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage, setTeachersPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [isPaidFilter, setIsPaidFilter] = useState<string>('all');
  const [isVerifiedFilter, setIsVerifiedFilter] = useState<string>('all');
  
  // Get unique subjects from teachers
  const allSubjects = Array.from(
    new Set(
      enhancedTeachers.flatMap(teacher => teacher.subjects)
    )
  ).sort();
  
  // Filter teachers based on search and filters
  const filteredTeachers = enhancedTeachers.filter(teacher => {
    // Search term
    const searchMatch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const subjectMatch = selectedSubject === 'all' || teacher.subjects.includes(selectedSubject);
    
    // Gender filter
    const genderMatch = selectedGender === 'all' || teacher.gender === selectedGender;
    
    // Status filter
    const statusMatch = selectedStatus === 'all' || teacher.status === selectedStatus;
    
    // Rating filter
    const ratingMatch = teacher.rating >= minRating;
    
    // Experience filter
    const experienceMatch = teacher.experience >= minExperience;
    
    // Paid/Free filter
    const paidMatch = isPaidFilter === 'all' || 
                    (isPaidFilter === 'paid' && teacher.isPaid) || 
                    (isPaidFilter === 'free' && !teacher.isPaid);
                    
    // Verified filter
    const verifiedMatch = isVerifiedFilter === 'all' ||
                        (isVerifiedFilter === 'verified' && teacher.verified) ||
                        (isVerifiedFilter === 'unverified' && !teacher.verified);
    
    return searchMatch && subjectMatch && genderMatch && statusMatch && 
           ratingMatch && experienceMatch && paidMatch && verifiedMatch;
  });
  
  // Sort teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    // Special handling for date fields
    if (sortField === 'joinedDate') {
      const dateA = new Date(a.joinedDate).getTime();
      const dateB = new Date(b.joinedDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Rating and experience sorting
    if (sortField === 'rating' || sortField === 'experience') {
      return sortDirection === 'asc' ? 
        a[sortField] - b[sortField] : 
        b[sortField] - a[sortField];
    }
    
    // Regular string fields
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Pagination
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = sortedTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(sortedTeachers.length / teachersPerPage);
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for new sort fields
    }
  };
  
  // Toggle teacher status
  const toggleTeacherStatus = (teacherId: string, currentStatus: string) => {
    // In a real app, this would call an API to update the teacher status
    console.log(`Toggling teacher ${teacherId} status from ${currentStatus}`);
  };
  
  // Toggle teacher verification
  const toggleTeacherVerification = (teacherId: string, currentVerified: boolean) => {
    // In a real app, this would call an API to update the teacher verification status
    console.log(`Toggling teacher ${teacherId} verification from ${currentVerified ? 'verified' : 'unverified'}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedGender('all');
    setSelectedStatus('all');
    setMinRating(0);
    setMinExperience(0);
    setIsPaidFilter('all');
    setIsVerifiedFilter('all');
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المعلمين</h1>
        <Button variant="success" size="sm" className="flex items-center gap-2">
          <FaGraduationCap size={14} />
          إضافة معلم جديد
        </Button>
      </div>
      
      {/* Filters and search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search box */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="بحث عن المعلمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Subject filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">جميع المواد</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          {/* Gender filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="all">جميع الجنسين</option>
              <option value="male">معلمين</option>
              <option value="female">معلمات</option>
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
              <option value="pending">قيد الانتظار</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
          
          {/* Minimum rating filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              الحد الأدنى للتقييم: {minRating} <FaStar className="inline text-yellow-500 mb-1" />
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
            />
          </div>
          
          {/* Minimum experience filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              الحد الأدنى للخبرة: {minExperience} سنوات
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              value={minExperience}
              onChange={(e) => setMinExperience(parseInt(e.target.value))}
            />
          </div>
          
          {/* Paid/Free filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={isPaidFilter}
              onChange={(e) => setIsPaidFilter(e.target.value)}
            >
              <option value="all">مدفوع/مجاني</option>
              <option value="paid">مدفوع</option>
              <option value="free">مجاني</option>
            </select>
          </div>
          
          {/* Verification filter */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="block w-full p-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={isVerifiedFilter}
              onChange={(e) => setIsVerifiedFilter(e.target.value)}
            >
              <option value="all">الجميع</option>
              <option value="verified">تم التحقق</option>
              <option value="unverified">لم يتم التحقق</option>
            </select>
          </div>
          
          {/* Reset filters */}
          <Button 
            variant="outline"
            onClick={resetFilters}
            disabled={
              searchTerm === '' && 
              selectedSubject === 'all' && 
              selectedGender === 'all' && 
              selectedStatus === 'all' && 
              minRating === 0 && 
              minExperience === 0 && 
              isPaidFilter === 'all' &&
              isVerifiedFilter === 'all'
            }
          >
            إعادة ضبط الفلاتر
          </Button>
        </div>
        
        {/* Results count and export */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            عرض {filteredTeachers.length} معلم من إجمالي {enhancedTeachers.length}
          </p>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FaDownload size={14} />
            <span>تصدير CSV</span>
          </Button>
        </div>
      </Card>
      
      {/* Teachers table */}
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span>المواد</span>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('specialization')}
                >
                  <div className="flex items-center justify-end">
                    <span>التخصص</span>
                    {sortField === 'specialization' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center justify-end">
                    <span>التقييم</span>
                    {sortField === 'rating' && (
                      sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('experience')}
                >
                  <div className="flex items-center justify-end">
                    <span>الخبرة</span>
                    {sortField === 'experience' && (
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>الإجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center overflow-hidden">
                        {teacher.avatarUrl ? (
                          <img 
                            src={teacher.avatarUrl} 
                            alt={teacher.name} 
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{teacher.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="mr-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {teacher.name}
                          </div>
                          {teacher.verified && (
                            <span title="معلم موثق" className="mr-1 text-blue-500">
                              <FaCertificate size={12} />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          {teacher.gender === 'male' ? 'معلم' : 'معلمة'}
                          {teacher.isPaid && (
                            <span className="mr-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded">
                              مدفوع
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                    <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                      {teacher.subjects.slice(0, 2).map((subject, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          +{teacher.subjects.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                    {teacher.specialization || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end">
                      <span className="text-gray-900 dark:text-white">{teacher.rating.toFixed(1)}</span>
                      <FaStar className="ml-1 text-yellow-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                    {teacher.experience} سنوات
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                      : teacher.status === 'pending'
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    }`}>
                      {teacher.status === 'active' 
                        ? 'نشط' 
                        : teacher.status === 'pending'
                        ? 'قيد الانتظار'
                        : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="عرض الملف الشخصي"
                        onClick={() => window.open(`/teachers/${teacher.id}`, '_blank')}
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
                          teacher.verified
                          ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                          : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                        } mr-2`}
                        title={teacher.verified ? 'إلغاء التوثيق' : 'توثيق'}
                        onClick={() => toggleTeacherVerification(teacher.id, teacher.verified)}
                      >
                        <FaCertificate />
                      </button>
                      <button 
                        className={`${
                          teacher.status === 'active'
                          ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                          : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                        } mr-2`}
                        title={teacher.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        onClick={() => toggleTeacherStatus(teacher.id, teacher.status)}
                      >
                        {teacher.status === 'active' ? <FaUserTimes /> : <FaUserCheck />}
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
                عرض <span className="font-medium">{indexOfFirstTeacher + 1}</span> إلى <span className="font-medium">{Math.min(indexOfLastTeacher, filteredTeachers.length)}</span> من <span className="font-medium">{filteredTeachers.length}</span> معلم
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