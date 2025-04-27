"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState, useMemo } from 'react';
import teachersData from '../../data/teachers';
import { FaFilter, FaSearch, FaSortAmountDown, FaBook, FaStar, FaUserGraduate } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      {/* Hero Banner Section with Islamic pattern background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/islamic-pattern.svg')] opacity-10 bg-repeat"></div>
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-blue-800 text-white py-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-right mb-8 lg:mb-0 lg:max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4" dir="rtl">معلمين القرآن المميزين</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-emerald-50" dir="rtl">
                  اختر المعلم المناسب وابدأ رحلتك في تعلم القرآن الكريم مع نخبة من أفضل المعلمين
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-end">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full">
                    <FaUserGraduate className="text-yellow-300 mr-2" />
                    <span className="text-white">{teachers.length}+ معلم متميز</span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full">
                    <FaBook className="text-yellow-300 mr-2" />
                    <span className="text-white">دروس عالية الجودة</span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full">
                    <FaStar className="text-yellow-300 mr-2" />
                    <span className="text-white">تقييمات مصدقة</span>
                  </div>
                </div>
              </div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full opacity-20 blur-2xl"></div>
                <div className="relative z-10 w-full h-full rounded-xl overflow-hidden border-4 border-white/30 shadow-xl">
                  <Image 
                    src="/images/quran-teacher.jpg" 
                    alt="معلم القرآن"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <button
                  className={`flex-1 py-2 text-center ${filter.isPaid === 'all' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                  onClick={() => setFilter(f => ({ ...f, isPaid: 'all' }))}
                >
                  الكل
                </button>
                <button
                  className={`flex-1 py-2 text-center ${filter.isPaid === 'paid' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                  onClick={() => setFilter(f => ({ ...f, isPaid: 'paid' }))}
                >
                  مدفوع
                </button>
                <button
                  className={`flex-1 py-2 text-center ${filter.isPaid === 'free' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                  onClick={() => setFilter(f => ({ ...f, isPaid: 'free' }))}
                >
                  مجاني
                </button>
              </div>
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
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <button
                  className={`flex-1 py-2 text-center ${filter.gender === 'all' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                  onClick={() => setFilter(f => ({ ...f, gender: 'all' }))}
                >
                  الكل
                </button>
                <button
                  className={`flex-1 py-2 text-center ${filter.gender === 'male' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                  onClick={() => setFilter(f => ({ ...f, gender: 'male' }))}
                >
                  ذكر
                </button>
                <button
                  className={`flex-1 py-2 text-center ${filter.gender === 'female' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'}`}
                  onClick={() => setFilter(f => ({ ...f, gender: 'female' }))}
                >
                  أنثى
                </button>
              </div>
            </div>

            {/* Experience filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحد الأدنى للخبرة (سنوات)</label>
              <div className="px-2">
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={filter.experience}
                  onChange={e => setFilter(f => ({ ...f, experience: Number(e.target.value) }))}
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>0</span>
                  <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full font-medium">{filter.experience} سنة</span>
                  <span>20+</span>
                </div>
              </div>
            </div>

            {/* Rating filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحد الأدنى للتقييم</label>
              <div className="px-2">
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={filter.minRating}
                  onChange={e => setFilter(f => ({ ...f, minRating: Number(e.target.value) }))}
                />
                <div className="flex justify-between items-center text-sm mt-2">
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
              className="mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              إعادة ضبط الفلاتر
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {/* Search and sort area */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Search by name */}
            <div className="relative w-full md:flex-1">
              <input
                className="rounded-full border border-gray-300 dark:border-gray-600 px-4 py-3 w-full text-right pr-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
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
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-3 px-4 flex items-center justify-between gap-2 w-full md:w-64 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'feesLowToHigh' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('feesLowToHigh');
                      setShowSortDropdown(false);
                    }}
                  >
                    السعر: من الأقل للأعلى
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'feesHighToLow' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('feesHighToLow');
                      setShowSortDropdown(false);
                    }}
                  >
                    السعر: من الأعلى للأقل
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'topRated' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('topRated');
                      setShowSortDropdown(false);
                    }}
                  >
                    الأعلى تقييمًا
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'experience' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'}`}
                    onClick={() => {
                      setSortOption('experience');
                      setShowSortDropdown(false);
                    }}
                  >
                    الأكثر خبرة
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === 'newest' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'}`}
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
          
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2 mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              تم العثور على <span className="font-bold text-emerald-600 dark:text-emerald-400">{filteredTeachers.length}</span> معلم
            </p>
            {sortOption && (
              <button onClick={() => setSortOption('')} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                مسح الترتيب
              </button>
            )}
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.length === 0 ? (
              <div className="col-span-full text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
                <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-red-500 text-xl font-bold mb-2">لا يوجد معلمين مطابقين للبحث</div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">يرجى تعديل معايير البحث أو التصفية للعثور على المعلمين</p>
                <button 
                  onClick={() => {
                    setSearch('');
                    setFilter({
                      isPaid: 'all',
                      minRating: 0,
                      subject: 'all',
                      experience: 0,
                      gender: 'all'
                    });
                    setSortOption('');
                  }}
                  className="inline-flex items-center justify-center gap-2 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  إعادة ضبط جميع المعايير
                </button>
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
          
          {/* Testimonials section */}
          {filteredTeachers.length > 0 && (
            <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">ماذا يقول طلابنا؟</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">تجارب حقيقية من طلاب استفادوا من منصتنا</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                      <span className="text-emerald-600 font-bold">س</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">سارة محمد</h4>
                      <div className="flex text-yellow-400">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">"تعلمت الكثير من خلال دروس القرآن الكريم على المنصة. المعلمين محترفين وصبورين جداً."</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold">م</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">محمد أحمد</h4>
                      <div className="flex text-yellow-400">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">"أستاذي عبر الإنترنت ساعدني كثيرًا في تحسين تجويدي للقرآن. الجدول مرن والدروس ممتازة."</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-bold">ن</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">نور علي</h4>
                      <div className="flex text-yellow-400">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">"أنصح بشدة بالتعلم على هذه المنصة. المعلمون متخصصون والمنهج منظم بطريقة سلسة ومفهومة."</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
