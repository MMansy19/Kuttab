"use client";

import Image from "next/image";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaUserCircle } from "react-icons/fa";
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';

const testimonials = [
  {
    name: "أحمد محمود",
    role: "طالب",
    image: "",
    text: "منصة كتّاب ساعدتني كثيراً في تعلم القرآن الكريم والتجويد. المعلمون هنا محترفون وصبورون."
  },
  {
    name: "فاطمة علي",
    role: "والدة طالب",
    image: "",
    text: "ابني أصبح يحب تعلم القرآن بفضل المعلمين المتميزين في كتّاب. أنا سعيدة جداً بالتقدم الذي حققه."
  },
  {
    name: "محمد السيد",
    role: "معلم",
    image: "",
    text: "كتّاب منصة رائعة تتيح لي الوصول إلى طلاب من جميع أنحاء العالم وتمكنني من نشر علمي بكل سهولة."
  }
];

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <OptimizedPatternBackground 
        opacity={0.1} 
        className="absolute inset-0 z-0" 
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1 rounded-full text-emerald-700 dark:text-emerald-500 text-sm font-medium mb-4">
            تجارب الطلاب
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">ماذا يقول طلابنا عن منصة كُـــتَّـــاب؟</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            آراء حقيقية من طلاب استفادوا من خدماتنا التعليمية
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 blur-2xl opacity-10 -z-10 transform rotate-3"></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 relative z-10">
            <div className="mb-10">
              <div className="text-gray-800 dark:text-gray-200 text-lg md:text-xl italic md:line-clamp-1 line-clamp-2">
                "{testimonials[activeTestimonial].text}"
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-300 dark:border-emerald-700">
                  {testimonials[activeTestimonial].image ? (
                    <Image 
                      src={testimonials[activeTestimonial].image} 
                      alt={testimonials[activeTestimonial].name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                      quality={80}
                      priority={true}
                      fetchPriority="high"
                      sizes="60px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-600">
                      <FaUserCircle className="w-14 h-14" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{testimonials[activeTestimonial].name}</div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-500">{testimonials[activeTestimonial].role}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <AccessibleButton
                  text=""
                  ariaLabel="عرض الشهادة السابقة"
                  icon={<FaArrowRight className="w-5 h-5" />}
                  onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 transition-colors min-w-[48px] min-h-[48px]"
                  variant="ghost"
                />
                <AccessibleButton
                  text=""
                  ariaLabel="عرض الشهادة التالية"
                  icon={<FaArrowLeft className="w-5 h-5" />}
                  onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 transition-colors min-w-[48px] min-h-[48px]"
                  variant="ghost"
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  aria-label={`View testimonial ${index + 1} of ${testimonials.length}`}
                  className={`mx-1 rounded-full min-w-8 min-h-8 flex items-center justify-center ${activeTestimonial === index ? 'bg-emerald-600 w-6' : 'bg-gray-300 dark:bg-gray-600 w-4 h-4'} transition-all`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
