"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState, useMemo, useEffect } from 'react';
import teachersData from '../../data/teachers';
import { FaFilter, FaSearch, FaSortAmountDown, FaStar, FaUserGraduate, FaQuran, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Islamic Education Subject Categories
const subjectCategories = {
  "القرآن الكريم": ["القرآن الكريم", "التلاوة", "تحفيظ القرآن", "تحفيظ القرآن للأطفال", "مراجعة الحفظ"],
  "التجويد": ["التجويد", "مخارج الحروف", "الوقف والابتداء"],
  "القراءات": ["القراءات", "حفص عن عاصم", "ورش عن نافع", "قالون عن نافع"],
  "علوم القرآن": ["علوم القرآن", "التفسير", "المقامات القرآنية"],
  "تعليم خاص": ["تعليم القرآن لغير الناطقين بالعربية"]
};

// Sort options configuration
const sortOptions = [
  { id: 'feesLowToHigh', label: 'السعر: من الأقل للأعلى' },
  { id: 'feesHighToLow', label: 'السعر: من الأعلى للأقل' },
  { id: 'topRated', label: 'الأعلى تقييمًا' },
  { id: 'experience', label: 'الأكثر خبرة' },
  { id: 'newest', label: 'الأحدث' }
];

// Hero section items
interface HeroStat {
  icon: React.ReactNode;
  label: (count?: number) => string;
}

const heroStats: HeroStat[] = [
  { icon: <FaUserGraduate className="text-yellow-300 ml-2" />, label: (count) => `${count}+ معلم متميز` },
  { icon: <FaQuran className="text-yellow-300 ml-2" />, label: () => "تعليم قرآني متميز" },
  { icon: <FaStar className="text-yellow-300 ml-2" />, label: () => "تقييمات مصدقة" }
];

// Testimonials data
const testimonials = [
  {
    initial: "س",
    name: "سارة محمد",
    color: "emerald",
    text: "تعلمت الكثير من خلال دروس القرآن الكريم على المنصة. المعلمين محترفين وصبورين جداً."
  },
  {
    initial: "م",
    name: "محمد أحمد",
    color: "blue",
    text: "أستاذي عبر الإنترنت ساعدني كثيرًا في تحسين تجويدي للقرآن. الجدول مرن والدروس ممتازة."
  },
  {
    initial: "ن",
    name: "نور علي",
    color: "purple",
    text: "أنصح بشدة بالتعلم على هذه المنصة. المعلمون متخصصون والمنهج منظم بطريقة سلسة ومفهومة."
  }
];

// UI Components props interfaces
interface FilterButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ selected, onClick, children }) => (
  <button
    className={`flex-1 py-2 text-center ${selected ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'
      } transition-colors duration-200`}
    onClick={onClick}
  >
    {children}
  </button>
);

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: React.ReactNode;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-500"
      value={value}
      onChange={onChange}
    >
      {options}
    </select>
  </div>
);

interface RangeFilterProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  displaySuffix: string;
}

const RangeFilter: React.FC<RangeFilterProps> = ({ label, value, onChange, min, max, step, displaySuffix }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="px-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        value={value}
        onChange={onChange}
      />
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
        <span>{min}</span>
        <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full font-medium">
          {value} {displaySuffix}
        </span>
        <span>{max}+</span>
      </div>
    </div>
  </div>
);

interface StarDisplayProps {
  rating: number;
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating }) => (
  <div className="flex items-center text-yellow-500">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
      >
        ★
      </span>
    ))}
  </div>
);

interface TestimonialCardProps {
  initial: string;
  name: string;
  color: string;
  text: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ initial, name, color, text, index }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800">
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-10 h-10 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center ml-3`}>
        <span className={`text-${color}-600 dark:text-${color}-400 font-bold`}>{initial}</span>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
        <div className="flex text-yellow-400">
          {Array(5).fill('★').map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300">"{text}"</p>
  </div>
);

export default function TeachersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    isPaid: 'all',
    minRating: 0,
    subject: 'all',
    subjectCategory: 'all',
    specialization: 'all',
    experience: 0,
    gender: 'all',
  });
  const [sortOption, setSortOption] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [teachers] = useState<Teacher[]>(teachersData);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle media queries safely with useEffect
  useEffect(() => {
    const checkIfMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
      }
    };

    // Check initially
    checkIfMobile();

    // Set up listener for window resize
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia('(max-width: 768px)');

      // Modern approach with addEventListener
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', checkIfMobile);
      }
      // Fallback for older browsers
      else if ('addListener' in mediaQueryList) {
        // @ts-ignore - for older browser support
        mediaQueryList.addListener(checkIfMobile);
      }

      // Cleanup
      return () => {
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', checkIfMobile);
        }
        // @ts-ignore - for older browser support
        else if ('removeListener' in mediaQueryList) {
          // @ts-ignore - for older browser support
          mediaQueryList.removeListener(checkIfMobile);
        }
      };
    }
  }, []);

  // Get all unique specializations
  const specializations = useMemo(() => {
    const specs = teachers
      .map(t => t.specialization)
      .filter(Boolean)
      .flatMap(spec => typeof spec === 'string' ? [spec] : spec) as string[];
    return Array.from(new Set(specs));
  }, [teachers]);

  // Get all unique subjects
  const subjects = useMemo(() => {
    return Array.from(new Set(teachers.flatMap(t => t.subjects)));
  }, [teachers]);

  // Filtering logic
  const filteredTeachers = useMemo(() => {
    let result = teachers;

    if (filter.isPaid !== 'all') {
      result = result.filter(t => t.isPaid === (filter.isPaid === 'paid'));
    }

    if (filter.minRating > 0) {
      result = result.filter(t => t.rating >= filter.minRating);
    }

    if (filter.subjectCategory !== 'all') {
      const categorySubjects = subjectCategories[filter.subjectCategory as keyof typeof subjectCategories] || [];
      result = result.filter(t =>
        t.subjects.some(subj => categorySubjects.includes(subj))
      );
    }

    if (filter.subject !== 'all') {
      result = result.filter(t => t.subjects.includes(filter.subject));
    }

    if (filter.specialization !== 'all') {
      result = result.filter(t => {
        if (!t.specialization) return false;
        return Array.isArray(t.specialization) 
          ? t.specialization.includes(filter.specialization)
          : t.specialization === filter.specialization;
      });
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
        t.subjects.some(subject => subject.toLowerCase().includes(searchLower)) ||
        (t.specialization && (
          Array.isArray(t.specialization) 
            ? t.specialization.some(spec => spec.includes(searchLower))
            : typeof t.specialization === 'string' ? t.specialization : false
        )) ||
        (t.education && t.education.includes(searchLower)) ||
        (t.certifications && t.certifications.some(cert => cert.includes(searchLower))) ||
        (t.teachingApproach && t.teachingApproach.includes(searchLower)) 
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
          result = [...result].sort((a, b) => new Date(b.joinedDate || '').getTime() - new Date(a.joinedDate || '').getTime());
          break;
      }
    }

    return result;
  }, [teachers, filter, search, sortOption]);

  const resetFilters = () => {
    setSearch('');
    setFilter({
      isPaid: 'all',
      minRating: 0,
      subject: 'all',
      subjectCategory: 'all',
      specialization: 'all',
      experience: 0,
      gender: 'all'
    });
    setSortOption('');
  };

  const handleBookTeacher = (teacherId: string) => {
    router.push(`/book/${teacherId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubjectFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(f => ({ ...f, subject: e.target.value }));
  };

  const handleGenderFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(f => ({ ...f, gender: e.target.value }));
  };

  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(f => ({ ...f, experience: parseInt(e.target.value) }));
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

  const filterCount = Object.values(filter).filter(val => val !== 'all' && val !== 0).length + (sortOption ? 1 : 0);

  return (
    <>
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/islamic-pattern.png')] opacity-10 bg-repeat"></div>
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-blue-800 text-white py-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-right mb-8 lg:mb-0 lg:max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4" dir="rtl">
                  معلمو القرآن المميزون
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-emerald-50" dir="rtl">
                  اختر المعلم المناسب وابدأ رحلتك في تعلم القرآن الكريم مع نخبة من أفضل المعلمين
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-end">
                  {heroStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full gap-1"
                    >
                      {stat.icon}
                      <span className="text-white mt-1">{stat.label(teachers.length)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full opacity-20 blur-2xl"></div>
                <div className="relative z-10 w-full h-full rounded-xl overflow-hidden border-4 border-white/30 shadow-xl">
                  <Image
                    src="/images/man-reading.avif"
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
        {/* Mobile filter toggle */}
        <div className="md:hidden flex justify-between items-center mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-medium"
            onClick={() => setShowMobileFilters(prev => !prev)}
          >
            <FaFilter />
            <span>التصفية والفرز</span>
            {filterCount > 0 && (
              <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>

          {(sortOption || Object.values(filter).some(val => val !== 'all' && val !== 0)) && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <FaTimes className="h-4 w-4" />
              مسح التصفية
            </button>
          )}
        </div>

        {/* Sidebar Filter */}
        {(showMobileFilters || !isMobile) && (
          <aside className={`${showMobileFilters ? 'fixed inset-0 z-50 md:relative md:z-auto' : 'w-full md:w-72 lg:w-80 mb-4 md:mb-0 flex-shrink-0'}`}>
            {showMobileFilters && (
              <div
                className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden"
                onClick={() => setShowMobileFilters(false)}
              ></div>
            )}

            <div className={`${showMobileFilters
                ? 'h-[90vh] w-[85vw] max-w-sm overflow-y-auto mx-auto my-[5vh] relative z-10'
                : 'sticky top-4'
              } bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col gap-4 border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-emerald-600 dark:text-emerald-500" />
                  <span className="font-bold text-lg text-gray-900 dark:text-white">تصفية المعلمين</span>
                </div>

                {showMobileFilters && (
                  <button
                    className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Fee type filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">نوع الرسوم</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['all', 'paid', 'free'].map((option, index) => (
                    <FilterButton
                      key={option}
                      selected={filter.isPaid === option}
                      onClick={() => setFilter(f => ({ ...f, isPaid: option }))}
                    >
                      {option === 'all' ? 'الكل' : option === 'paid' ? 'مدفوع' : 'مجاني'}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Subject category filter */}
              <div>
                <FilterSelect
                  label="فئة المواد"
                  value={filter.subjectCategory}
                  onChange={e => setFilter(f => ({
                    ...f,
                    subjectCategory: e.target.value,
                    subject: 'all' // Reset subject when changing category
                  }))}
                  options={(
                    <>
                      <option value="all">جميع الفئات</option>
                      {Object.keys(subjectCategories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </>
                  )}
                />
              </div>

              {/* Subject filter - filtered by category */}
              <div>
                <FilterSelect
                  label="المادة"
                  value={filter.subject}
                  onChange={handleSubjectFilterChange}
                  options={(
                    <>
                      <option value="all">كل المواد</option>
                      {filter.subjectCategory !== 'all'
                        ? subjectCategories[filter.subjectCategory as keyof typeof subjectCategories]?.map(subj => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))
                        : subjects.map(subj => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))
                      }
                    </>
                  )}
                />
              </div>

              {/* Specialization filter */}
              <div>
                <FilterSelect
                  label="التخصص"
                  value={filter.specialization}
                  onChange={e => setFilter(f => ({ ...f, specialization: e.target.value }))}
                  options={(
                    <>
                      <option value="all">كل التخصصات</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </>
                  )}
                />
              </div>

              {/* Gender filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الجنس</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  {['all', 'male', 'female'].map(option => (
                    <FilterButton
                      key={option}
                      selected={filter.gender === option}
                      onClick={() => setFilter(f => ({ ...f, gender: option }))}
                    >
                      {option === 'all' ? 'الكل' : option === 'male' ? 'ذكر' : 'أنثى'}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Experience filter */}
              <div>
                <RangeFilter
                  label="الحد الأدنى للخبرة (سنوات)"
                  value={filter.experience}
                  onChange={handlePriceFilterChange}
                  min={0}
                  max={20}
                  step={1}
                  displaySuffix="سنة"
                />
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
                    <StarDisplay rating={filter.minRating} />
                    <span className="text-gray-600 dark:text-gray-400">5</span>
                  </div>
                </div>
              </div>

              {/* Reset filters button */}
              <button
                onClick={resetFilters}
                className="mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                إعادة ضبط الفلاتر
              </button>

              {showMobileFilters && (
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="mt-2 py-3 px-4 bg-emerald-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  عرض النتائج ({filteredTeachers.length})
                </button>
              )}
            </div>
          </aside>
        )}

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
                onChange={handleSearchChange}
                dir="rtl"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
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
                    {sortOption ?
                      sortOptions.find(opt => opt.id === sortOption)?.label :
                      'ترتيب حسب'}
                  </span>
                </span>
                {showSortDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {showSortDropdown && (
                <div
                  id="sort-dropdown"
                  className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sortOption === option.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'
                        }`}
                      onClick={() => {
                        setSortOption(option.id);
                        setShowSortDropdown(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
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
              تم العثور على <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {filteredTeachers.length}
              </span> معلم
            </p>
            {(sortOption || Object.values(filter).some(val => val !== 'all' && val !== 0)) && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                مسح التصفية
              </button>
            )}
          </div>

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
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors duration-200 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                إعادة ضبط جميع المعايير
              </button>
            </div>
          ) : (
            <div>
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredTeachers.map((teacher: Teacher, idx) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    onBook={handleBookTeacher}
                  />
                ))}
              </div>

              {/* Testimonials section */}
              <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                <div className="text-center mb-8">
                  <FaStar className="text-yellow-500 mx-auto mb-4 text-2xl" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">ماذا يقول طلابنا؟</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">تجارب حقيقية من طلاب استفادوا من منصتنا</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} index={index} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}