"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState, useMemo } from 'react';
import teachersData from '../../data/teachers';
import { FaFilter, FaSearch, FaSortAmountDown, FaBook, FaStar, FaUserGraduate, FaQuran, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from '@/utils/framer-motion';
import { FadeIn, StaggeredAnimation, ScaleIn } from '@/components/ui/AnimationWrapper';
import IconWrapper from '@/components/ui/IconWrapper';

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
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex-1 py-2 text-center ${
      selected ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white'
    } transition-colors duration-200`}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: React.ReactNode;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => (
  <motion.div 
    className="space-y-2"
    whileHover={{ scale: 1.01 }}
    transition={{ duration: 0.2 }}
  >
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-500"
      value={value}
      onChange={onChange}
    >
      {options}
    </select>
  </motion.div>
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
  <motion.div 
    className="space-y-2"
    whileHover={{ scale: 1.01 }}
    transition={{ duration: 0.2 }}
  >
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
      <motion.div 
        className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span>{min}</span>
        <motion.span 
          className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full font-medium"
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {value} {displaySuffix}
        </motion.span>
        <span>{max}+</span>
      </motion.div>
    </div>
  </motion.div>
);

interface StarDisplayProps {
  rating: number;
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating }) => (
  <div className="flex items-center text-yellow-500">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.span 
        key={star} 
        className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: star * 0.05 }}
        whileHover={{ scale: 1.2, rotate: star <= rating ? 5 : 0 }}
      >
        ★
      </motion.span>
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
  <motion.div 
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index, duration: 0.4 }}
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <motion.div 
        className={`w-10 h-10 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center ml-3`}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className={`text-${color}-600 dark:text-${color}-400 font-bold`}>{initial}</span>
      </motion.div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
        <div className="flex text-yellow-400">
          {Array(5).fill('★').map((star, i) => (
            <motion.span 
              key={i} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + (i * 0.1) }}
            >
              {star}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300">"{text}"</p>
  </motion.div>
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

  // Get all unique specializations
  const specializations = useMemo(() => {
    const specs = teachers.map(t => t.specialization).filter(Boolean);
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
      result = result.filter(t => t.specialization === filter.specialization);
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
        (t.specialization && t.specialization.toLowerCase().includes(searchLower)) ||
        t.bio.toLowerCase().includes(searchLower)
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
              <FadeIn>
                <div className="text-center lg:text-right mb-8 lg:mb-0 lg:max-w-2xl">
                  <motion.h1 
                    className="text-3xl md:text-5xl font-bold mb-4" 
                    dir="rtl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    معلمو القرآن المميزون
                  </motion.h1>
                  <motion.p 
                    className="text-lg md:text-xl max-w-3xl mx-auto text-emerald-50" 
                    dir="rtl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    اختر المعلم المناسب وابدأ رحلتك في تعلم القرآن الكريم مع نخبة من أفضل المعلمين
                  </motion.p>
                  <motion.div 
                    className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-end"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {heroStats.map((stat, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full gap-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + (index * 0.1) }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                      >
                        <IconWrapper animate="bounce" color="text-yellow-300">
                          {stat.icon}
                        </IconWrapper>
                        <span className="text-white mt-1">{stat.label(teachers.length)}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </FadeIn>
              <ScaleIn>
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full opacity-20 blur-2xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  ></motion.div>
                  <motion.div 
                    className="relative z-10 w-full h-full rounded-xl overflow-hidden border-4 border-white/30 shadow-xl"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.7,
                      delay: 0.3,
                      type: "spring"
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image 
                      src="/images/man-reading.avif"
                      alt="معلم القرآن"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </ScaleIn>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Mobile filter toggle */}
        <div className="md:hidden flex justify-between items-center mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <motion.button
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
          
          {(sortOption || Object.values(filter).some(val => val !== 'all' && val !== 0)) && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters} 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <FaTimes className="h-4 w-4" />
              مسح التصفية
            </motion.button>
          )}
        </div>
        
        {/* Sidebar Filter */}
        <AnimatePresence>
          {(showMobileFilters || !window.matchMedia('(max-width: 768px)').matches) && (
            <motion.aside 
              className={`${showMobileFilters ? 'fixed inset-0 z-50 md:relative md:z-auto' : 'w-full md:w-72 lg:w-80 mb-4 md:mb-0 flex-shrink-0'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {showMobileFilters && (
                <motion.div 
                  className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                ></motion.div>
              )}
              
              <motion.div 
                className={`${
                  showMobileFilters 
                    ? 'h-[90vh] w-[85vw] max-w-sm overflow-y-auto mx-auto my-[5vh] relative z-10'
                    : 'sticky top-4'
                } bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col gap-4 border border-gray-200 dark:border-gray-700`}
                initial={{ y: showMobileFilters ? 20 : 0 }}
                animate={{ y: 0 }}
                exit={{ y: showMobileFilters ? 20 : 0 }}
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <IconWrapper animate="pulse" color="text-emerald-600 dark:text-emerald-500">
                      <FaFilter />
                    </IconWrapper>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">تصفية المعلمين</span>
                  </div>
                  
                  {showMobileFilters && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <FaTimes className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
                
                {/* Fee type filter */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
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
                </motion.div>

                {/* Subject category filter */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>

                {/* Subject filter - filtered by category */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
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
                </motion.div>

                {/* Specialization filter */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
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
                </motion.div>

                {/* Gender filter */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
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
                </motion.div>

                {/* Experience filter */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <RangeFilter
                    label="الحد الأدنى للخبرة (سنوات)"
                    value={filter.experience}
                    onChange={handlePriceFilterChange}
                    min={0}
                    max={20}
                    step={1}
                    displaySuffix="سنة"
                  />
                </motion.div>

                {/* Rating filter */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
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
                </motion.div>

                {/* Reset filters button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(5, 150, 105, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFilters}
                  className="mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  إعادة ضبط الفلاتر
                </motion.button>
                
                {showMobileFilters && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowMobileFilters(false)}
                    className="mt-2 py-3 px-4 bg-emerald-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
                  >
                    عرض النتائج ({filteredTeachers.length})
                  </motion.button>
                )}
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <motion.main 
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Search and sort area */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4 mb-6 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Search by name */}
            <div className="relative w-full md:flex-1">
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px rgba(5, 150, 105, 0.5)" }}
                className="rounded-full border border-gray-300 dark:border-gray-600 px-4 py-3 w-full text-right pr-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="ابحث باسم المعلم أو المادة..."
                value={search}
                onChange={handleSearchChange}
                dir="rtl"
              />
              <motion.div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <IconWrapper animate={search ? "pulse" : "none"}>
                  <FaSearch />
                </IconWrapper>
              </motion.div>
            </div>
            
            {/* Sort dropdown */}
            <div className="w-full md:w-auto relative">
              <motion.button
                id="sort-button"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-3 px-4 flex items-center justify-between gap-2 w-full md:w-64 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <IconWrapper animate={sortOption ? "pulse" : "none"} color="text-emerald-600">
                    <FaSortAmountDown />
                  </IconWrapper>
                  <span>
                    {sortOption ? 
                      sortOptions.find(opt => opt.id === sortOption)?.label : 
                      'ترتيب حسب'}
                  </span>
                </span>
                <motion.div
                  animate={{ rotate: showSortDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div 
                    id="sort-dropdown"
                    className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 overflow-hidden"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {sortOptions.map((option, index) => (
                      <motion.button 
                        key={option.id}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          sortOption === option.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-white'
                        }`}
                        onClick={() => {
                          setSortOption(option.id);
                          setShowSortDropdown(false);
                        }}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <motion.button 
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSortOption('');
                        setShowSortDropdown(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      إعادة ضبط
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              تم العثور على <motion.span 
                key={filteredTeachers.length} 
                className="font-bold text-emerald-600 dark:text-emerald-400"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {filteredTeachers.length}
              </motion.span> معلم
            </p>
            {(sortOption || Object.values(filter).some(val => val !== 'all' && val !== 0)) && (
              <motion.button 
                onClick={resetFilters} 
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                مسح التصفية
              </motion.button>
            )}
          </motion.div>
          
          <AnimatePresence mode="wait">
            {filteredTeachers.length === 0 ? (
              <motion.div 
                key="no-results"
                className="col-span-full text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20"
                  animate={{ 
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <motion.div 
                  className="text-red-500 text-xl font-bold mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >لا يوجد معلمين مطابقين للبحث</motion.div>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >يرجى تعديل معايير البحث أو التصفية للعثور على المعلمين</motion.p>
                <motion.button 
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center gap-2 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors duration-200 shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  إعادة ضبط جميع المعايير
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StaggeredAnimation staggerDelay={0.05} className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredTeachers.map((teacher: Teacher, idx) => (
                    <TeacherCard
                      key={teacher.id}
                      teacher={teacher}
                      onBook={handleBookTeacher}
                      index={idx}
                    />
                  ))}
                </StaggeredAnimation>
                
                {/* Testimonials section */}
                <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                  <FadeIn>
                    <div className="text-center mb-8">
                      <IconWrapper animate="pulse" size="xl" className="mx-auto mb-4">
                        <FaStar className="text-yellow-500" />
                      </IconWrapper>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">ماذا يقول طلابنا؟</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">تجارب حقيقية من طلاب استفادوا من منصتنا</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} index={index} />
                      ))}
                    </div>
                  </FadeIn>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </>
  );
}
