"use client";

import Link from "next/link";
import Image from "next/image";
import { FaBook, FaComment, FaLaptop, FaUserGraduate } from "react-icons/fa";
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
      <OptimizedPatternBackground 
        opacity={0.1} 
        className="absolute inset-0 z-0" 
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 blur-2xl opacity-20 -z-10 transform rotate-3"></div>
              <div className="flex flex-col justify-center items-center relative z-10">
                <div className="space-y-4">
                  <div className="sm:block hidden rounded-lg overflow-hidden shadow-xl h-64 border-4 border-white dark:border-gray-700">                      
                    <Image
                      src="/images/kid-learns-online.webp"
                      alt="طفل يتعلم القرآن عبر الإنترنت"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                      quality={75}
                      priority={true}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAKAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+AiiiigAooooA/9k="
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl h-64 border-4 border-white dark:border-gray-700">                    
                    <Image
                      src="/images/learn-online.webp"
                      alt="جلسات تعليمية عبر الإنترنت"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                      quality={80}
                      priority={true}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAKAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+AiiiigAooooA/9k="
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1 rounded-full text-emerald-700 dark:text-emerald-500 text-sm font-medium mb-4">
              من نحن
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white" dir="rtl">
              منصة <span className="text-emerald-700">كُـــتَّـــاب</span> للتعليم الإسلامي عن بعد
            </h2>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300" dir="rtl">
              تأسست منصة كُـــتَّـــاب بهدف نشر تعليم القرآن الكريم والعلوم الإسلامية بطريقة ميسرة وحديثة تتناسب مع متطلبات العصر، وتمكن الطلاب من التعلم في أي وقت ومن أي مكان.
            </p>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300" dir="rtl">
              نسعى لتوفير بيئة تعليمية تفاعلية وآمنة تجمع بين الأصالة والحداثة، مع فريق من المعلمين والمعلمات ذوي الخبرة والكفاءة العالية في مختلف التخصصات.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <FaUserGraduate className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">معلمون مجازون</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">بإجازات معتمدة</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <FaLaptop className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">منصة متطورة</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">سهلة الاستخدام</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <FaBook className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">مناهج متنوعة</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">لجميع المستويات</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <FaComment className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">دعم مستمر</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">على مدار الساعة</div>
                </div>
              </div>
            </div>
            
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-500 font-medium hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
              aria-label="تعرف أكثر على منصة كتّاب"
            >
              تعرف علينا أكثر
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
