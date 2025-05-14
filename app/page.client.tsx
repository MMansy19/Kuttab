"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBook, FaUserGraduate, FaCalendarAlt, FaGlobe, FaAward, FaMedal, FaLaptop, FaComment, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";

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

  return (
    <main className="overflow-hidden">
      {/* Hero Section with Islamic Pattern Overlay */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('/images/islamic-pattern.png')] opacity-10 bg-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-blue-900/70 to-gray-900/70"></div>
        
        <div className="container mx-auto z-10 px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-right text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              تعلم <span className="text-emerald-400">القرآن الكريم</span> مع أفضل المعلمين
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-xl mx-auto md:mx-0">
              منصة كتّاب تربط بين الطلاب والمعلمين المتخصصين في تعليم القرآن الكريم والعلوم الإسلامية عبر الإنترنت
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4 mt-8">
              <Link href="/teachers" className="px-8 py-3 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all">
                ابحث عن معلم
              </Link>
              <Link href="/auth/signup" className="px-8 py-3 text-lg bg-white hover:bg-gray-100 text-emerald-900 rounded-md transition-all">
                سجل كمعلم
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative mt-12 md:mt-0">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
              <Image 
                src="/images/quran-teacher.webp" 
                alt="معلم قرآن كريم" 
                width={600} 
                height={500}
                className="relative rounded-lg shadow-2xl z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your homepage content */}
    </main>
  );
}
