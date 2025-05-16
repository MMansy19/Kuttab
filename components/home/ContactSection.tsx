"use client";

import { FaComment, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import OptimizedPatternBackground from '@/components/performance/OptimizedPatternBackground';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800 relative">
      <OptimizedPatternBackground 
        opacity={0.05} 
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
  );
};

export default ContactSection;
