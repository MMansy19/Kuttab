"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, memo } from "react";
import { FaBook, FaUserGraduate, FaCalendarAlt, FaGlobe, FaAward, FaMedal, FaLaptop, FaComment, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
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

  const features = [
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
  
  // Memoized CounterStat component to prevent unnecessary re-renders
  const CounterStat = memo(({ endValue, label }: { endValue: number; label: string }) => {
    const [count, setCount] = useState(0);
    const animationRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number | null>(null);
    
    // Easing function for more natural animation
    const easeOutQuad = (t: number): number => t * (2 - t);
    
    // Trigger animation directly when component becomes visible
    useEffect(() => {
      if (isVisible && endValue > 0) {
        const animate = (timestamp: number) => {
          if (startTimeRef.current === null) {
            startTimeRef.current = timestamp;
          }
          
          const elapsed = timestamp - startTimeRef.current;
          const duration = 2000; // 2 seconds duration
          
          // Calculate progress and apply easing
          const rawProgress = Math.min(elapsed / duration, 1);
          const progress = easeOutQuad(rawProgress);
          
          // Calculate current value
          const currentValue = Math.floor(progress * endValue);
          setCount(currentValue);
          
          // Continue animation if not complete
          if (rawProgress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            // Ensure we end exactly at the target value
            setCount(endValue);
          }
        };
        
        // Start animation
        startTimeRef.current = null;
        animationRef.current = requestAnimationFrame(animate);
        
        // Clean up on unmount or when dependencies change
        return () => {
          if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
          }
        };
      }
    }, [isVisible, endValue]);
    
    // Set up intersection observer to detect when counter is visible
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );
      
      if (observerRef.current) {
        observer.observe(observerRef.current);
      }
      
      return () => {
        if (observerRef.current) {
          observer.unobserve(observerRef.current);
        }
      };
    }, []);
    
    return (
      <div 
        ref={observerRef} 
        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
      >
        <div className="text-3xl font-bold text-white">{count}+</div>
        <div className="text-xs text-gray-300">{label}</div>      
      </div>
    );
  });

    return (
    <main className="overflow-hidden">
      {/* Hero Section with Islamic Pattern Overlay */}      
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
      
      {/* Business Features */}
      <section id="business" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">لماذا تختار منصة <span className="text-emerald-700 dark:text-emerald-500">كُـــتَّـــاب</span>؟</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              نقدم لك تجربة تعليمية فريدة من نوعها مع أفضل المعلمين وأحدث التقنيات لضمان أقصى استفادة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
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
        {/* About Us Section */}
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
        {/* Testimonials Section */}
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
        {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800 relative">
        <OptimizedPatternBackground 
              opacity={0.1} 
              className="absolute inset-0 z-0" 
              aria-hidden="true"
            />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1 rounded-full text-emerald-700 dark:text-emerald-500 text-sm font-medium mb-4">
              تواصل معنا
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">نحن هنا لمساعدتك</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              هل لديك أسئلة أو استفسارات؟ فريقنا جاهز للرد عليك
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">أرسل لنا رسالة</h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2" htmlFor="name">الاسم</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                      placeholder="أدخل اسمك" 
                      dir="rtl"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2" htmlFor="email">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                      placeholder="أدخل بريدك الإلكتروني" 
                      dir="rtl"
                      aria-required="true"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2" htmlFor="subject">الموضوع</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    placeholder="موضوع الرسالة" 
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2" htmlFor="message">الرسالة</label>
                  <textarea 
                    id="message" 
                    rows={6} 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    placeholder="اكتب رسالتك هنا" 
                    dir="rtl"
                    aria-required="true"
                  />
                </div>
                
                <AccessibleButton
                  text="إرسال الرسالة"
                  ariaLabel="إرسال الرسالة المكتوبة"
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  variant="default"
                  type="submit"
                />
              </form>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">معلومات التواصل</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPhoneAlt className="text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white mb-1">رقم الهاتف</div>
                      <div className="text-gray-700 dark:text-gray-300" dir="ltr">+966 123 456 789</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white mb-1">البريد الإلكتروني</div>
                      <div className="text-gray-700 dark:text-gray-300">info@kottab.com</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white mb-1">العنوان</div>
                      <div className="text-gray-700 dark:text-gray-300">
                        المملكة العربية السعودية، الرياض<br />
                        طريق الملك فهد، مبنى الأمانة
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">ساعات العمل</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>السبت - الخميس: 9 صباحاً - 10 مساءً</p>
                  <p>الجمعة: مغلق</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Add CSS for text gradient and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}} />
    </main>
  );
}
