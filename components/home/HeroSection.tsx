"use client";

import Image from "next/image";
import { FaAward, FaMedal, FaUserGraduate } from "react-icons/fa";
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';
import CounterStat from './CounterStat';

const HeroSection = () => {
  return (
    <section className="relative flex items-center md:min-h-[80vh]"> 
      <OptimizedPatternBackground opacity={0.1} />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-blue-900/70 to-gray-900/70"></div>
      
      <div className="container mx-auto px-4 py-16 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-right lg:max-w-2xl">
            <div className="inline-block animate-float">
              <div className="bg-white dark:bg-gray-800 px-4 py-1 rounded-full text-emerald-700 dark:text-emerald-500 text-sm font-medium mb-6 mx-auto lg:mx-0 inline-flex items-center">
                <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-emerald-500 ml-2"></span>
                منصة تعليمية متميزة
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight" dir="rtl">
              تعلم 
              <span className="text-gradient bg-gradient-to-r from-emerald-400 to-blue-500"> القرآن الكريم </span>
              مع أفضل المعلمين
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0" dir="rtl">
              منصة كُـــتَّـــاب تجمع بين الطلاب والمعلمين المتميزين لجلسات تعليمية عالية الجودة عبر الإنترنت. ابدأ رحلتك التعليمية الآن.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
              <AccessibleButton 
                text="ابدأ الآن"
                ariaLabel="بدء رحلتك التعليمية"
                icon={<FaUserGraduate />}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => window.location.href = '/teachers'}
                variant="default"
              />
              
              <AccessibleButton
                text="اكتشف المزيد"
                ariaLabel="اكتشف المزيد عن المنصة"
                className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium text-lg transition-all duration-300 border border-white/20 transform hover:scale-105"
                onClick={() => window.location.href = '/about'}
                variant="ghost"
              />
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <CounterStat endValue={500} label="طالب مسجل" />
              <CounterStat endValue={50} label="معلم متميز" />
              <CounterStat endValue={1000} label="جلسة ناجحة" />
            </div>
          </div>
          
          <div className="sm:block hidden relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-emerald-900 to-blue-900 rounded-xl p-2 shadow-2xl z-10">
              <div className="rounded-lg overflow-hidden border-2 border-white/20 shadow-inner">
                <Image 
                  src="/images/learn-quran2.avif"
                  alt="تعليم القرآن" 
                  width={600} 
                  height={600} 
                  className="w-full h-auto"
                  quality={75}
                  priority={true}
                  loading="eager" // Explicit eager loading
                  placeholder="blur" // Add if you can provide a blurDataURL
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAKAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+AiiiigAooooA/9k="
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FaAward className="text-emerald-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900 dark:text-white">تجربة فريدة</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">منصة تعليمية مميزة</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaMedal className="text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900 dark:text-white">معلمون متميزون</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">خبرة عالية في التعليم</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
