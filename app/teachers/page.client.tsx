"use client";

import type { Teacher } from '../../types';
import TeacherCard from '../../components/TeacherCard';
import React, { useState, useMemo, useEffect } from 'react';
import teachersData from '../../data/teachers';
import { FaFilter, FaSearch, FaSortAmountDown, FaBook, FaStar, FaUserGraduate, FaQuran, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SchemaOrgData } from '@/components/seo';

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
  { value: "rating", label: "التقييم الأعلى", icon: <FaStar /> },
  { value: "experience", label: "الخبرة", icon: <FaUserGraduate /> },
  { value: "sessions", label: "عدد الجلسات", icon: <FaBook /> }
];

// Filter component
function FilterSection({ 
  onFilterChange, 
  onSortChange, 
  activeFilters, 
  activeSort, 
  onClearFilter,
  isFilterOpen,
  toggleFilter
}: {
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortOption: string) => void;
  activeFilters: { subjects?: string[], gender?: string[] };
  activeSort: string;
  onClearFilter: () => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
}) {
  // Filter section state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "القرآن الكريم": true,
    "التجويد": false,
    "القراءات": false,
    "علوم القرآن": false,
    "تعليم خاص": false
  });

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaFilter className="text-emerald-600" /> تصفية النتائج
        </h3>
        <button 
          onClick={toggleFilter}
          className="text-gray-500 hover:text-gray-700 md:hidden"
        >
          {isFilterOpen ? <FaTimes /> : <FaFilter />}
        </button>
      </div>
      
      {/* Filter content - conditionally visible on mobile */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        {/* Sort section */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaSortAmountDown className="text-emerald-600" /> ترتيب حسب
          </h4>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-md w-full text-right transition ${
                  activeSort === option.value 
                    ? 'bg-emerald-50 text-emerald-700 font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-emerald-600">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Subject filter section */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaBook className="text-emerald-600" /> المواد التعليمية
          </h4>
          <div className="space-y-3">
            {Object.entries(subjectCategories).map(([category, subjects]) => (
              <div key={category} className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full py-1 font-medium hover:text-emerald-700"
                >
                  {category}
                  {expandedCategories[category] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
                
                {expandedCategories[category] && (
                  <div className="mt-1 space-y-1 pr-3">
                    {subjects.map(subject => (
                      <div key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          id={subject}
                          checked={activeFilters.subjects?.includes(subject) || false}
                          onChange={() => onFilterChange('subjects', subject)}
                          className="form-checkbox h-4 w-4 text-emerald-600 transition duration-150 ease-in-out"
                        />
                        <label htmlFor={subject} className="mr-2 text-sm text-gray-700">
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gender filter */}
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">الجنس</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="male"
                checked={activeFilters.gender?.includes('ذكر') || false}
                onChange={() => onFilterChange('gender', 'ذكر')}
                className="form-checkbox h-4 w-4 text-emerald-600"
              />
              <label htmlFor="male" className="mr-2 text-gray-700">معلم</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="female"
                checked={activeFilters.gender?.includes('أنثى') || false}
                onChange={() => onFilterChange('gender', 'أنثى')}
                className="form-checkbox h-4 w-4 text-emerald-600"
              />
              <label htmlFor="female" className="mr-2 text-gray-700">معلمة</label>
            </div>
          </div>
        </div>
        
        {/* Clear filters button */}
        <button
          onClick={onClearFilter}
          className="mt-6 w-full py-2 px-4 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
        >
          مسح التصفية
        </button>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  // List state management
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ 
    subjects?: string[];
    gender?: string[];
  }>({
    subjects: [],
    gender: []
  });
  const [sortBy, setSortBy] = useState('rating');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const router = useRouter();

  // Apply search, filters and sorting to teacher data
  const filteredTeachers = useMemo(() => {
    return teachersData
      .filter(teacher => {
        // Search query filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const nameMatch = teacher.name.toLowerCase().includes(query);
          const specializationMatch = teacher.specialization?.some(
            (spec: string) => spec.toLowerCase().includes(query)
          ) || false;
          const bioMatch = teacher.bio?.toLowerCase().includes(query);
          
          if (!(nameMatch || specializationMatch || bioMatch)) {
            return false;
          }
        }
        
        // Subject filtering
        if (filters.subjects && filters.subjects.length > 0) {
          if (!teacher.specialization?.some((spec: string) => 
            filters.subjects!.includes(spec)
          )) {
            return false;
          }
        }
        
        // Gender filtering
        if (filters.gender && filters.gender.length > 0) {
          if (!filters.gender.includes(teacher.gender)) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'experience':
            return b.experience - a.experience;
          case 'sessions': 
            return (b.sessionsCompleted || 0) - (a.sessionsCompleted || 0);
          default:
            return (b.rating || 0) - (a.rating || 0);
        }
      });
  }, [searchQuery, filters, sortBy, teachersData]);
  
  // Toggle filter visibility on mobile
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
    // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[filterType as keyof typeof prevFilters] || [];
      const valueIndex = currentValues.indexOf(value);
      
      let newValues;
      if (valueIndex === -1) {
        // Add the value if not present
        newValues = [...currentValues, value];
      } else {
        // Remove the value if already present
        newValues = currentValues.filter((v: string) => v !== value);
      }
      
      return {
        ...prevFilters,
        [filterType]: newValues
      };
    });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ subjects: [], gender: [] });
    setSearchQuery('');
    setSortBy('rating');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO Structured Data */}
      <SchemaOrgData />
      
      {/* Page header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">معلمو القرآن الكريم</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          اكتشف معلمين متخصصين في تعليم القرآن الكريم والعلوم الإسلامية. يمكنك البحث والتصفية للعثور على المعلم المناسب لاحتياجاتك.
        </p>
      </header>

      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="ابحث عن معلم، تخصص، أو موضوع..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white rounded-lg border border-gray-300 py-3 px-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          dir="rtl"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch />
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="md:w-64 md:flex-shrink-0">
          <FilterSection
            onFilterChange={handleFilterChange}
            onSortChange={setSortBy}
            activeFilters={filters}
            activeSort={sortBy}
            onClearFilter={handleClearFilters}
            isFilterOpen={isFilterOpen}
            toggleFilter={toggleFilter}
          />
        </aside>

        {/* Teachers grid */}
        <div className="flex-grow">
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="max-w-md mx-auto">
                <FaQuran className="mx-auto text-emerald-200 text-6xl mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">لم يتم العثور على نتائج</h3>
                <p className="text-gray-500 mb-6">
                  لم نتمكن من العثور على معلمين مطابقين لمعايير البحث الخاصة بك. يرجى تجربة معايير أخرى.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                >
                  مسح التصفية
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
