"use client";

import { AccessibleButton } from '@/components/ui/AccessibleButton';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-700 to-blue-800 text-white relative">
      <div className="absolute inset-0 bg-[url('/images/islamic-pattern.webp')] opacity-10 bg-repeat"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left md:max-w-lg">
            <h2 className="text-3xl font-bold mb-4">ابدأ رحلة التعلم مع كُـــتَّـــاب اليوم</h2>
            <p className="text-lg text-emerald-100">انضم إلى آلاف الطلاب الذين يتعلمون القرآن الكريم والعلوم الإسلامية على منصتنا</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <AccessibleButton
              text="تصفح المعلمين"
              ariaLabel="تصفح قائمة المعلمين المتاحين"
              className="px-8 py-3 rounded-full bg-white text-emerald-700 font-medium text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg min-w-[48px] min-h-[48px]"
              onClick={() => window.location.href = '/teachers'}
              variant="default"
            />
            <AccessibleButton
              text="إنشاء حساب"
              ariaLabel="إنشاء حساب جديد في المنصة"
              className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-white/20 text-white font-medium text-lg transition-colors duration-300 shadow-lg min-w-[48px] min-h-[48px]"
              onClick={() => window.location.href = '/auth/signup'}
              variant="default"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
