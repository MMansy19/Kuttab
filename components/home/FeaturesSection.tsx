"use client";

import { FaBook, FaCalendarAlt, FaGlobe, FaUserGraduate } from "react-icons/fa";
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';

const featuresData = [
  {
    icon: <FaUserGraduate className="text-3xl text-emerald-600" />,
    title: "معلمون محترفون",
    description: "نخبة من أفضل المعلمين والمعلمات في مجال تعليم القرآن والعلوم الإسلامية"
  },
  {
    icon: <FaCalendarAlt className="text-3xl text-emerald-600" />,
    title: "جلسات مرنة",
    description: "اختر الوقت المناسب لجدولك واحجز جلساتك التعليمية بكل سهولة"
  },
  {
    icon: <FaGlobe className="text-3xl text-emerald-600" />,
    title: "دروس عن بعد",
    description: "تعلم من أي مكان في العالم عبر منصة تواصل احترافية واضحة"
  },
  {
    icon: <FaBook className="text-3xl text-emerald-600" />,
    title: "مناهج متنوعة",
    description: "تخصصات متعددة في علوم القرآن والتجويد والتفسير واللغة العربية"
  }
];

const FeaturesSection = () => {
  return (
    <section id="business" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">لماذا تختار منصة <span className="text-emerald-700 dark:text-emerald-500">كُـــتَّـــاب</span>؟</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            نقدم لك تجربة تعليمية فريدة من نوعها مع أفضل المعلمين وأحدث التقنيات لضمان أقصى استفادة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Banner */}
        <div className="mt-16 relative overflow-hidden rounded-2xl">
          <OptimizedPatternBackground 
            opacity={0.1} 
            className="absolute inset-0 z-0" 
            aria-hidden="true"
          />
          <div className="bg-gradient-to-r from-emerald-600 to-blue-700 p-8 md:p-12 text-center relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">ابدأ رحلتك التعليمية اليوم</h3>
            <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
              احجز جلستك الأولى مع أحد معلمينا المتميزين واستمتع بتجربة تعليمية فريدة من نوعها
            </p>
            <AccessibleButton
              text="تصفح المعلمين"
              ariaLabel="استعراض قائمة المعلمين المتاحين"
              className="px-8 py-3 rounded-full bg-white text-emerald-700 font-medium text-lg hover:bg-emerald-50 transition-colors duration-300 inline-block shadow-lg"
              onClick={() => window.location.href = '/teachers'}
              variant="default"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
