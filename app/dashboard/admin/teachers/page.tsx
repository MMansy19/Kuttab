"use client";

import React, { useState } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheck,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaStar,
  FaCertificate,
  FaCalendarCheck,
  FaGraduationCap,
  FaHistory,
  FaTrophy,
  FaChartLine,
  FaDownload,
  FaChevronRight,
  FaChevronLeft,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import RatingComp from '@/components/common/RatingComp';
import teachersData from '@/data/teachers';

// Add more teacher fields for admin management
const enhancedTeachers = teachersData.map(teacher => ({
  ...teacher,
  status: ['active', 'pending', 'suspended'][Math.floor(Math.random() * 3)],
  verificationStatus: ['verified', 'pending', 'rejected'][Math.floor(Math.random() * 3)],
  registeredDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  completedSessions: Math.floor(Math.random() * 500),
  revenue: Math.floor(Math.random() * 15000) + 500,
  featured: Math.random() > 0.8,
  location: teacher.contactInfo?.telegram || 'المملكة العربية السعودية', // Adding location property
  image: teacher.avatarUrl || '', // Adding image property from avatarUrl
  subjects: [
    'القرآن الكريم',
    'التجويد',
    'التفسير',
    'الحديث',
    'الفقه',
    'العقيدة',
    'السيرة النبوية',
    'اللغة العربية'
  ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1),
  preferredTime: ['morning', 'afternoon', 'evening', 'flexible'][Math.floor(Math.random() * 4)],
  sessionPrice: Math.floor(Math.random() * 200) + 50,
}));

// Define teacher management types
type TeacherStatus = 'all' | 'active' | 'pending' | 'suspended';
type VerificationStatus = 'all' | 'verified' | 'pending' | 'rejected';
type SortField = 'name' | 'rating' | 'experience' | 'completedSessions' | 'revenue' | 'registeredDate';

// Subject options
const SUBJECTS = [
  'القرآن الكريم',
  'التجويد',
  'التفسير',
  'الحديث',
  'الفقه',
  'العقيدة',
  'السيرة النبوية', 
  'اللغة العربية',
];

// Experience ranges
const EXPERIENCE_RANGES = [
  { label: 'أقل من سنة', value: 'lt1' },
  { label: '1-3 سنوات', value: '1-3' },
  { label: '3-5 سنوات', value: '3-5' },
  { label: '5-10 سنوات', value: '5-10' },
  { label: 'أكثر من 10 سنوات', value: 'gt10' },
];

export default function TeacherManagementPage() {
  // States for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<TeacherStatus>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationStatus>('all');
  const [sortField, setSortField] = useState<SortField>('registeredDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  
  // Filter teachers based on all criteria
  const filteredTeachers = enhancedTeachers.filter(teacher => {
    // Search term filter
    const searchMatch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const subjectMatch = selectedSubject === 'all' || teacher.subjects.includes(selectedSubject);
    
    // Rating filter
    const ratingMatch = !selectedRating || teacher.rating >= selectedRating;
    
    // Experience filter
    let experienceMatch = true;
    if (selectedExperience !== 'all') {
      if (selectedExperience === 'lt1') experienceMatch = teacher.experience < 1;
      else if (selectedExperience === '1-3') experienceMatch = teacher.experience >= 1 && teacher.experience <= 3;
      else if (selectedExperience === '3-5') experienceMatch = teacher.experience > 3 && teacher.experience <= 5;
      else if (selectedExperience === '5-10') experienceMatch = teacher.experience > 5 && teacher.experience <= 10;
      else if (selectedExperience === 'gt10') experienceMatch = teacher.experience > 10;
    }
    
    // Status filter
    const statusMatch = selectedStatus === 'all' || teacher.status === selectedStatus;
    
    // Verification filter
    const verificationMatch = selectedVerification === 'all' || teacher.verificationStatus === selectedVerification;
    
    // Featured filter
    const featuredMatch = !featuredOnly || teacher.featured;
    
    return searchMatch && subjectMatch && ratingMatch && experienceMatch && statusMatch && verificationMatch && featuredMatch;
  });
  
  // Sort filtered teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    // Special handling for dates
    if (sortField === 'registeredDate') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Numeric comparison for numbers
    if (typeof a[sortField] === 'number') {
      return sortDirection === 'asc' 
        ? (a[sortField] as number) - (b[sortField] as number) 
        : (b[sortField] as number) - (a[sortField] as number);
    }
    
    // String comparison for strings
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });
  
  // Pagination
  const indexOfLastTeacher = currentPage * itemsPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
  const currentTeachers = sortedTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(sortedTeachers.length / itemsPerPage);
  
  // Handle sort change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedRating(null);
    setSelectedExperience('all');
    setSelectedStatus('all');
    setSelectedVerification('all');
    setFeaturedOnly(false);
  };
  
  // Update teacher verification status
  const handleVerifyTeacher = (teacherId: string, status: VerificationStatus) => {
    // In a real app, this would call an API to update the teacher's status
    console.log(`Updating teacher ${teacherId} verification status to ${status}`);
  };
  
  // Update teacher feature status
  const handleFeatureToggle = (teacherId: string, featured: boolean) => {
    // In a real app, this would call an API to update the teacher's featured status
    console.log(`Setting teacher ${teacherId} featured status to ${featured}`);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'verified': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'rejected': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };
  
  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-SA').format(date);
  };
  
  // View teacher details
  const handleViewTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
  };
  
  // Get selected teacher details
  const selectedTeacher = selectedTeacherId 
    ? enhancedTeachers.find(t => t.id === selectedTeacherId)
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المعلمين</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FaFilter size={14} />
            <span>الفلاتر</span>
            {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <FaDownload size={14} />
            <span>تصدير</span>
          </Button>
        </div>
      </div>
      
      {/* Search and basic filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-10 p-2.5"
              placeholder="ابحث عن اسم المعلم، التخصص، الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-10 p-2.5 appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TeacherStatus)}
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="pending">قيد الانتظار</option>
              <option value="suspended">موقوف</option>
            </select>
          </div>
          
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaCertificate className="text-gray-400" />
            </div>
            <select
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-10 p-2.5 appearance-none"
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value as VerificationStatus)}
            >
              <option value="all">جميع حالات التحقق</option>
              <option value="verified">مُتحقق</option>
              <option value="pending">قيد التحقق</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="featuredOnly" 
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={featuredOnly}
              onChange={() => setFeaturedOnly(!featuredOnly)}
            />
            <label htmlFor="featuredOnly" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              المعلمين المميزين فقط
            </label>
          </div>
        </div>
        
        {/* Advanced filters (collapsible) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                التخصص
              </label>
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">جميع التخصصات</option>
                {SUBJECTS.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                التقييم
              </label>
              <div className="flex items-center space-x-1 space-x-reverse">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`p-2 ${
                      selectedRating === rating 
                        ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                        : 'text-gray-400 hover:text-yellow-500'
                    } rounded-md transition-colors`}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  >
                    <FaStar size={16} />
                  </button>
                ))}
                {selectedRating && (
                  <button
                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline ml-2"
                    onClick={() => setSelectedRating(null)}
                  >
                    إعادة ضبط
                  </button>
                )}
              </div>
              {selectedRating && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedRating}+ نجوم
                </p>
              )}
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                سنوات الخبرة
              </label>
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <option value="all">جميع مستويات الخبرة</option>
                {EXPERIENCE_RANGES.map((range, index) => (
                  <option key={index} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Results count and reset filters */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            عرض <span className="font-medium">{filteredTeachers.length}</span> من أصل <span className="font-medium">{enhancedTeachers.length}</span> معلم
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={resetFilters}
            disabled={!searchTerm && selectedSubject === 'all' && !selectedRating && selectedExperience === 'all' && selectedStatus === 'all' && selectedVerification === 'all' && !featuredOnly}
          >
            إعادة ضبط الفلاتر
          </Button>
        </div>
      </Card>
      
      {/* Teachers Data Table */}
      {selectedTeacher ? (
        <TeacherDetails 
          teacher={selectedTeacher} 
          onBack={() => setSelectedTeacherId(null)}
          onVerify={(status) => handleVerifyTeacher(selectedTeacher.id, status as VerificationStatus)}
          onFeatureToggle={(featured) => handleFeatureToggle(selectedTeacher.id, featured)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center justify-center">
                      <span>المعلم</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center justify-center">
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
                    <div className="flex items-center justify-center">
                      <span>الخبرة</span>
                      {sortField === 'experience' && (
                        sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span>التخصص</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span>الحالة</span>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('completedSessions')}
                  >
                    <div className="flex items-center justify-center">
                      <span>الجلسات</span>
                      {sortField === 'completedSessions' && (
                        sortDirection === 'asc' ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span>التحقق</span>
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
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {teacher.image ? (
                            <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                              {teacher.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {teacher.name}
                            {teacher.featured && (
                              <span className="mr-1 text-yellow-500" title="معلم مميز">
                                <FaStar size={12} />
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{teacher.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RatingComp initialRating={teacher.rating} />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({teacher.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <span>{teacher.experience}</span> 
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">سنة</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map((subject, idx) => (
                          <span 
                            key={idx}
                            className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full px-2 py-1"
                          >
                            {subject}
                          </span>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <span className="inline-block text-xs text-gray-500 dark:text-gray-400 px-2">
                            +{teacher.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(teacher.status)}`}>
                        {teacher.status === 'active' && 'نشط'}
                        {teacher.status === 'pending' && 'قيد الانتظار'}
                        {teacher.status === 'suspended' && 'موقوف'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {teacher.completedSessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(teacher.verificationStatus)}`}>
                        {teacher.verificationStatus === 'verified' && 'مُتحقق'}
                        {teacher.verificationStatus === 'pending' && 'قيد التحقق'}
                        {teacher.verificationStatus === 'rejected' && 'مرفوض'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          onClick={() => handleViewTeacher(teacher.id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300"
                        >
                          <FaEdit />
                        </button>
                        {teacher.status !== 'suspended' ? (
                          <button
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="إيقاف"
                          >
                            <FaTimes />
                          </button>
                        ) : (
                          <button
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            title="تفعيل"
                          >
                            <FaCheck />
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
          {filteredTeachers.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    عرض <span className="font-medium">{indexOfFirstTeacher + 1}</span> إلى <span className="font-medium">{Math.min(indexOfLastTeacher, filteredTeachers.length)}</span> من <span className="font-medium">{filteredTeachers.length}</span> معلم
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        currentPage === 1 
                          ? 'text-gray-300 dark:text-gray-600 cursor-default' 
                          : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">السابق</span>
                      <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNum
                              ? 'z-10 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } text-sm font-medium`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'text-gray-300 dark:text-gray-600 cursor-default' 
                          : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">التالي</span>
                      <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {filteredTeachers.length === 0 && (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا يوجد معلمين</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                لم يتم العثور على معلمين تطابق معايير البحث الخاصة بك.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 mx-auto"
                >
                  <FaFilter size={14} />
                  <span>إعادة ضبط الفلاتر</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// Teacher Details Component
type TeacherDetailsProps = {
  teacher: any;
  onBack: () => void;
  onVerify: (status: string) => void;
  onFeatureToggle: (featured: boolean) => void;
};

function TeacherDetails({ teacher, onBack, onVerify, onFeatureToggle }: TeacherDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="ml-2 bg-white dark:bg-gray-800 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaChevronRight />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">تفاصيل المعلم</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main profile info */}
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
              {teacher.image ? (
                <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-4xl font-bold">
                  {teacher.name[0]}
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
            <div className="flex items-center mt-2">
              <RatingComp rating={teacher.rating} size="lg" />
              <span className="text-gray-600 dark:text-gray-400 ml-2">({teacher.rating})</span>
            </div>
            
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400 text-sm">الحالة:</span>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  teacher.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                  teacher.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                  {teacher.status === 'active' && 'نشط'}
                  {teacher.status === 'pending' && 'قيد الانتظار'}
                  {teacher.status === 'suspended' && 'موقوف'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400 text-sm">التحقق:</span>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  teacher.verificationStatus === 'verified' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 
                  teacher.verificationStatus === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                  {teacher.verificationStatus === 'verified' && 'مُتحقق'}
                  {teacher.verificationStatus === 'pending' && 'قيد التحقق'}
                  {teacher.verificationStatus === 'rejected' && 'مرفوض'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400 text-sm">المميز:</span>
                <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                  teacher.featured 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' 
                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                }`}>
                  {teacher.featured ? (
                    <><FaStar className="mr-1" /> مميز</>
                  ) : (
                    'غير مميز'
                  )}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400 text-sm">سعر الجلسة:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {teacher.sessionPrice} ريال
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400 text-sm">تاريخ التسجيل:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(teacher.registeredDate).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <Button 
                variant={teacher.verificationStatus === 'verified' ? 'outline' : 'default'}
                onClick={() => onVerify('verified')}
                disabled={teacher.verificationStatus === 'verified'}
                className="flex items-center justify-center gap-2"
              >
                <FaCheck size={14} />
                <span>تأكيد المعلم</span>
              </Button>
              <Button
                variant={teacher.featured ? 'outline' : 'secondary'}
                onClick={() => onFeatureToggle(!teacher.featured)}
                className="flex items-center justify-center gap-2"
              >
                <FaStar size={14} />
                <span>{teacher.featured ? 'إلغاء التمييز' : 'تمييز المعلم'}</span>
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Stats and progress */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تفاصيل المعلم</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">السيرة الذاتية</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {teacher.bio}
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">التخصصات</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject: string, idx: number) => (
                  <span 
                    key={idx}
                    className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full px-3 py-1"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mb-2">
                  <FaCalendarCheck className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {teacher.completedSessions}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
                  الجلسات المكتملة
                </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mb-2">
                  <FaGraduationCap className="text-emerald-600 dark:text-emerald-400" size={18} />
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {teacher.experience}+
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
                  سنوات الخبرة
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mb-2">
                  <FaMoneyBillWave className="text-amber-600 dark:text-amber-400" size={18} />
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {new Intl.NumberFormat('ar-SA').format(teacher.revenue)}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  إجمالي الإيرادات
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mb-2">
                  <FaStar className="text-purple-600 dark:text-purple-400" size={18} />
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {teacher.rating}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 text-center">
                  متوسط التقييم
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="danger" size="sm" className="flex items-center gap-2">
                  <FaTrash size={14} />
                  <span>حذف المعلم</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FaEdit size={14} />
                  <span>تعديل البيانات</span>
                </Button>
                <Link href={`/teachers/${teacher.id}`} passHref>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FaEye size={14} />
                    <span>عرض الصفحة العامة</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Activity and performance */}
        <Card className="p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">النشاط والأداء</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <FaHistory className="ml-2" />
                <span>نشاط الحجوزات</span>
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">هذا الأسبوع:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 10) + 1} جلسة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">هذا الشهر:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 30) + 10} جلسة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">إجمالي الساعات:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(teacher.completedSessions * 0.75)} ساعة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">معدل التأكيد:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 20) + 80}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <FaTrophy className="ml-2" />
                <span>أداء المعلم</span>
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">التزام بالمواعيد</span>
                    <span className="text-green-600 dark:text-green-400">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">رضا الطلاب</span>
                    <span className="text-green-600 dark:text-green-400">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">معدل استجابة للرسائل</span>
                    <span className="text-yellow-600 dark:text-yellow-400">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <FaChartLine className="ml-2" />
                <span>الإحصائيات</span>
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">معدل الإكمال:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 10) + 90}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">معدل الإلغاء:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 10) + 1}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">طلاب جدد (شهرياً):</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(Math.random() * 10) + 5}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">متوسط الجلسات شهرياً:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.floor(teacher.completedSessions / 12)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">ملاحظات إدارية</h4>
            <textarea 
              className="w-full px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              placeholder="أضف ملاحظات إدارية حول المعلم (لن تكون مرئية للمعلم أو المستخدمين الآخرين)"
            ></textarea>
            
            <div className="flex justify-end mt-2">
              <Button size="sm">حفظ الملاحظات</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}