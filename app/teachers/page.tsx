"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState, useMemo } from 'react';
import teachersData from '../../data/teachers';
import { FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function TeachersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    isPaid: 'all',
    minRating: 0,
    subject: 'all',
    experience: 0,
    gender: 'all',
  });
  const [sortOption, setSortOption] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [teachers] = useState<Teacher[]>(teachersData);

  // Filtering logic
  const filteredTeachers = useMemo(() => {
    let result = teachers;
    if (filter.isPaid !== 'all') {
      result = result.filter(t => t.isPaid === (filter.isPaid === 'paid'));
    }
    if (filter.minRating > 0) {
      result = result.filter(t => t.rating >= filter.minRating);
    }
    if (filter.subject !== 'all') {
      result = result.filter(t => t.subjects.includes(filter.subject));
    }
    if (filter.experience > 0) {
      result = result.filter(t => t.experience >= filter.experience);
    }
    if (filter.gender !== 'all') {
      result = result.filter(t => t.gender === filter.gender);
    }
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchLower) || 
        t.subjects.some(subject => subject.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case 'feesLowToHigh':
          result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'feesHighToLow':
          result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'topRated':
          result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'experience':
          result = [...result].sort((a, b) => (b.experience || 0) - (a.experience || 0));
          break;
        case 'newest':
          // Assuming there's a joinedDate or similar field
          result = [...result].sort((a, b) => new Date(b.joinedDate || '').getTime() - new Date(a.joinedDate || '').getTime());
          break;
        default:
          break;
      }
    }
    
    return result;
  }, [teachers, filter, search, sortOption]);

  const handleBookTeacher = (teacherId: string) => {
    // Navigate to the booking page for this teacher
    router.push(`/book/${teacherId}`);
  };

  // Close sort dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('#sort-dropdown') && !target.closest('#sort-button')) {
        setShowSortDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Page title */}
      <div className="bg-gradient-to-r from-emerald-800 to-blue-800 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">معلمين القرآن</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-emerald-100">اختر المعلم المناسب وابدأ رحلتك في تعلم القرآن الكريم</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-72 lg:w-80 mb-4 md:mb-0 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col gap-4 sticky top-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <FaFilter className="text-emerald-600 dark:text-emerald-500" />
              <span className="font-bold text-lg text-gray-900 dark:text-white">تصفية المعلمين</span>
            </div>
            
            {/* Fee type filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">نوع الرسوم</label>
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                value={filter.isPaid}
                onChange={e => setFilter(f => ({ ...f, isPaid: e.target.value }))}
              >
                <option value="all">الكل (مجاني/مدفوع)</option>
                <option value="paid">مدفوع</option>
                <option value="free">مجاني</option>
              </select>
            </div>

            {/* Subject filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">المادة</label>
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                value={filter.subject}
                onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))}
              >
                <option value="all">كل المواد</option>
                {Array.from(new Set(teachers.flatMap(t => t.subjects))).map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Gender filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الجنس</label>
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500"
                value={filter.gender}
                onChange={e => setFilter(f => ({ ...f, gender: e.target.value }))}
              >
                <option value="all">الجميع</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            {/* Experience filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحد الأدنى للخبرة (سنوات)</label>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                value={filter.experience}
                onChange={e => setFilter(f => ({ ...f, experience: Number(e.target.value) }))}
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>0</span>
                <span>{filter.experience} سنة</span>
                <span>20+</span>
              </div>
            </div>

            {/* Rating filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحد الأدنى للتقييم</label>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                value={filter.minRating}
                onChange={e => setFilter(f => ({ ...f, minRating: Number(e.target.value) }))}
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">0</span>
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-lg ${star <= filter.minRating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">5</span>
              </div>
            </div>

            {/* Reset filters button */}
            <button
              onClick={() => setFilter({
                isPaid: 'all',
                minRating: 0,
                subject: 'all',
                experience: 0,
                gender: 'all'
              })}
              className="mt-2 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors duration-200"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Search and sort area */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            {/* Search by name */}
            <div className="relative w-full md:flex-1">
              <input
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 w-full text-right pr-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="ابحث باسم المعلم أو المادة..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                dir="rtl"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Sort dropdown */}
            <div className="w-full md:w-auto relative">
              <button
                id="sort-button"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 flex items-center justify-between gap-2 w-full md:w-64 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <span className="flex items-center gap-2">
                  <FaSortAmountDown className="text-emerald-600" />
                  <span>
                    {sortOption === 'feesLowToHigh' && 'السعر: من الأقل للأعلى'}
                    {sortOption === 'feesHighToLow' && 'السعر: من الأعلى للأقل'}
                    {sortOption === 'topRated' && 'الأعلى تقييمًا'}
                    {sortOption === 'experience' && 'الأكثر خبرة'}
                    {sortOption === 'newest' && 'الأحدث'}
                    {!sortOption && 'ترتيب حسب'}
                  </span>
                </span>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showSortDropdown && (
                <div 
                  id="sort-dropdown"
                  className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 overflow-hidden"
                >
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'feesLowToHigh' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('feesLowToHigh');
                      setShowSortDropdown(false);
                    }}
                  >
                    السعر: من الأقل للأعلى
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'feesHighToLow' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('feesHighToLow');
                      setShowSortDropdown(false);
                    }}
                  >
                    السعر: من الأعلى للأقل
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'topRated' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('topRated');
                      setShowSortDropdown(false);
                    }}
                  >
                    الأعلى تقييمًا
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'experience' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('experience');
                      setShowSortDropdown(false);
                    }}
                  >
                    الأكثر خبرة
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'newest' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('newest');
                      setShowSortDropdown(false);
                    }}
                  >
                    الأحدث
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button 
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setSortOption('');
                      setShowSortDropdown(false);
                    }}
                  >
                    إعادة ضبط
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            تم العثور على <span className="font-semibold">{filteredTeachers.length}</span> معلم
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.length === 0 ? (
              <div className="col-span-full text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-red-500 text-lg font-medium mb-2">لا يوجد معلمين مطابقين للبحث/التصفية</div>
                <p className="text-gray-600 dark:text-gray-400">يرجى تعديل معايير البحث أو التصفية للعثور على المعلمين</p>
              </div>
            ) : (
              filteredTeachers.map((teacher: Teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onBook={handleBookTeacher}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}
