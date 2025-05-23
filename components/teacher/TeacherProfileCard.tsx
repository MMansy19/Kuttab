"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Teacher } from '@/types';
import { FaStar, FaCalendarAlt, FaGlobe, FaGraduationCap, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter } from '../ui/Card';

// TeacherStats component to display certifications, experience, and languages
const TeacherStats = React.memo(({ teacher }: { teacher: Teacher }) => {
  return (
    <div className="grid grid-cols-3 border-t border-b border-gray-200 dark:border-gray-700">
      <div className="py-3 text-center border-l border-gray-200 dark:border-gray-700">
        <div className="text-emerald-600 dark:text-emerald-400 flex justify-center">
          <FaGraduationCap />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">الإجازات</div>
        <div className="font-bold text-gray-900 dark:text-white">{teacher.certifications?.length || 0}</div>
      </div>
      <div className="py-3 text-center border-l border-gray-200 dark:border-gray-700">
        <div className="text-emerald-600 dark:text-emerald-400 flex justify-center">
          <FaCalendarAlt />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">سنوات الخبرة</div>
        <div className="font-bold text-gray-900 dark:text-white">{teacher.experience || '0'}</div>
      </div>
      <div className="py-3 text-center">
        <div className="text-emerald-600 dark:text-emerald-400 flex justify-center">
          <FaGlobe />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">اللغات</div>
        <div className="font-bold text-gray-900 dark:text-white">{teacher.languages?.length || 1}</div>
      </div>
    </div>
  );
});

TeacherStats.displayName = 'TeacherStats';

interface TeacherProfileCardProps {
  teacher: Teacher;
  variant?: 'default' | 'compact' | 'featured';
  showBookButton?: boolean;
  showViewProfileButton?: boolean;
}

// TeacherAvatar component for better reusability
const TeacherAvatar = React.memo(({ 
  teacher, 
  variant, 
  isFeatured 
}: { 
  teacher: Teacher; 
  variant: string; 
  isFeatured: boolean;
}) => {
  return (
    <div className="relative">
      {isFeatured && (
        <div className="absolute -top-1 -left-1 z-10">
          <Badge variant="warning" className="flex gap-1 items-center px-2 py-1 rounded-md">
            <FaStar size={12} />
            <span>Featured</span>
          </Badge>
        </div>
      )}
      
      {teacher.avatarUrl ? (
        <div className={`rounded-full overflow-hidden border-2 ${isFeatured ? 'border-emerald-500' : 'border-gray-200 dark:border-gray-700'}`}>
          <Image 
            src={teacher.avatarUrl} 
            alt={teacher.name} 
            width={variant === 'compact' ? 64 : 80}
            height={variant === 'compact' ? 64 : 80}
            className="object-cover rounded-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div 
          className={`flex items-center justify-center rounded-full bg-emerald-600 text-white text-2xl font-bold ${
            variant === 'compact' ? 'w-16 h-16' : 'w-20 h-20'
          }`}
        >
          {teacher.name?.charAt(0) || "?"}
        </div>
      )}
    </div>
  );
});

// Rating component for cleaner separation of concerns
const TeacherRating = React.memo(({ rating, compact }: { rating: number; compact: boolean }) => {
  return (
    <div className="flex items-center gap-1 justify-center md:justify-end mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar 
          key={i} 
          className={i < (rating || 0) 
            ? "text-amber-400" 
            : "text-gray-300 dark:text-gray-600"
          } 
          size={compact ? 14 : 16} 
        />
      ))}
      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
        ({Math.round(rating || 0)})
      </span>
    </div>
  );
});

TeacherAvatar.displayName = 'TeacherAvatar';
TeacherRating.displayName = 'TeacherRating';

export const TeacherProfileCard = React.memo(({ 
  teacher, 
  variant = 'default',
  showBookButton = true,
  showViewProfileButton = true
}: TeacherProfileCardProps) => {
  // Return placeholder if no teacher data
  if (!teacher) {
    return (
      <Card variant="bordered" className="animate-pulse">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </Card>
    );
  }
  // Use useMemo to calculate derived values
  const cardClasses = useMemo(() => {
    return `overflow-hidden transition-all duration-300 hover:shadow-lg ${variant === 'featured' ? 'border-emerald-500 dark:border-emerald-400' : ''}`;
  }, [variant]);

  const headerClasses = useMemo(() => {
    return `p-5 ${variant === 'featured' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`;
  }, [variant]);

  return (
    <Card
      variant="bordered"
      className={cardClasses}
    >
      <CardContent className="p-0">
        {/* Teacher Info Header */}
        <div className={headerClasses}>
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">{/* Teacher Avatar */}
              <TeacherAvatar 
                teacher={teacher} 
                variant={variant} 
                isFeatured={variant === 'featured'} 
              />
            
              {/* Teacher Details */}
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
                
                {variant !== 'compact' && teacher.specialization && (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {teacher.specialization}
                  </p>
                )}
                
                {/* Rating */}
                <TeacherRating 
                  rating={teacher.rating || 0} 
                  compact={variant === 'compact'} 
                />
              
              {variant !== 'compact' && (
                <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-end">
                  {teacher.subjects?.slice(0, 3).map((subject: string, index: number) => (
                    <Badge key={index}>
                      {subject}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
          {/* Teacher Stats */}
        {variant !== 'compact' && <TeacherStats teacher={teacher} />}
        
        {/* Teacher Bio (not shown in compact mode) */}
        {variant !== 'compact' && teacher.bio && (
          <div className="p-5">
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
              {teacher.bio}
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Action Buttons */}
      <CardFooter className={`flex ${variant === 'compact' ? 'flex-col' : 'flex-row'} gap-2 p-4 pt-2`}>
        {showBookButton && (
          <Button 
            variant="gradient" 
            rounded="full"
            size={variant === 'compact' ? 'sm' : 'default'} 
            className="flex-1"
            asChild
          >
            <Link href={`/book/${teacher.id}`}>
              حجز جلسة
              <FaArrowRight className="ml-2 rtl:rotate-180" />
            </Link>
          </Button>
        )}
        
        {showViewProfileButton && variant !== 'compact' && (
          <Button 
            variant="outline" 
            rounded="full" 
            className="flex-1"
            asChild
          >
            <Link href={`/teachers/${teacher.id}`}
              className="flex justify-center items-center gap-2 flex-row-reverse">
              الملف الشخصي
                <FaArrowLeft className="mr-2 rtl:rotate-180" />
            </Link>
          </Button>
        )}      </CardFooter>
    </Card>
  );
});

// Export the memoized component as default 
export default TeacherProfileCard;