import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaUserGraduate, FaQuestion } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <Section
        background="gradient"
        spacing="large"
        className="text-center text-white"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            نحن هنا لمساعدتك
          </p>
          <p className="text-lg opacity-80">
            هل لديك أسئلة أو استفسارات؟ فريقنا جاهز للرد عليك
          </p>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section spacing="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <SectionHeader 
              title="أرسل رسالة" 
              description="يسعدنا تلقي رسالتك وسنقوم بالرد في أقرب وقت ممكن"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-8 border border-gray-200 dark:border-gray-700">
              <form className="flex flex-col gap-5">
                <Input 
                  placeholder="الاسم الكامل" 
                  name="name" 
                  required
                  icon={<FaUserGraduate className="text-gray-400" />}
                />
                
                <Input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  name="email" 
                  required
                  icon={<FaEnvelope className="text-gray-400" />}
                />
                
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaQuestion className="text-gray-400" />
                  </div>
                  <select 
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                    name="subject"
                    required
                  >
                    <option value="">نوع الاستفسار</option>
                    <option value="teachers">استفسار عن المعلمين</option>
                    <option value="courses">استفسار عن الدورات</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="payment">استفسار عن الدفع</option>
                    <option value="other">آخر</option>
                  </select>
                </div>
                
                <div className="relative w-full">
                  <textarea 
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
                    placeholder="رسالتك"
                    name="message"
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" variant="gradient" size="lg">
                  إرسال الرسالة
                </Button>
              </form>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <SectionHeader 
              title="معلومات الاتصال" 
              description="يمكنك التواصل معنا مباشرة من خلال إحدى قنوات التواصل التالية"
            />
            
            <div className="grid grid-cols-1 gap-6 mt-8">
              <Card variant="bordered">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">البريد الإلكتروني</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">info@kottab.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">نستجيب خلال 24 ساعة</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="bordered">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <FaWhatsapp size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">واتساب</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">+966-555-123456</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">متاح من 9 صباحًا - 9 مساءً</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="bordered">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <FaPhone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">الهاتف</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">+966-11-2345678</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">متاح من 9 صباحًا - 5 مساءً</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section background="light" spacing="large">
        <SectionHeader 
          title="الأسئلة الشائعة" 
          description="إليك أجوبة الأسئلة الأكثر شيوعًا من طلابنا ومعلمينا"
          centered
        />
        
        <div className="max-w-3xl mx-auto mt-12">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">كيف يمكنني البدء في تعلم القرآن الكريم؟</h3>
              <p className="text-gray-600 dark:text-gray-400">
                يمكنك البدء من خلال إنشاء حساب في منصتنا، ثم اختيار المعلم المناسب لك وحجز موعد للبدء في الدروس الخاصة بك.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">هل يمكنني تجربة المنصة قبل الدفع؟</h3>
              <p className="text-gray-600 dark:text-gray-400">
                نعم، نقدم درسًا تجريبيًا مجانيًا مع أي معلم تختاره لتجربة المنصة والتأكد من أنها تناسب احتياجاتك التعليمية.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">ما هي مؤهلات المعلمين لديكم؟</h3>
              <p className="text-gray-600 dark:text-gray-400">
                جميع معلمينا حاصلون على إجازات معتمدة في تلاوة وتعليم القرآن الكريم، ولديهم خبرة تدريسية لا تقل عن سنتين. يخضع المعلمون أيضًا لعملية تقييم صارمة قبل انضمامهم للمنصة.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">كيف يمكنني تغيير أو إلغاء موعد درس؟</h3>
              <p className="text-gray-600 dark:text-gray-400">
                يمكنك تغيير أو إلغاء المواعيد من خلال لوحة التحكم الخاصة بك، مع مراعاة سياسة الإلغاء التي تتطلب إشعارًا قبل 24 ساعة على الأقل من موعد الدرس.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">لم تجد إجابة لسؤالك؟</p>
            <Button variant="outline">عرض المزيد من الأسئلة الشائعة</Button>
          </div>
        </div>
      </Section>

      {/* Map Section */}
      <Section spacing="large">
        <SectionHeader 
          title="موقعنا" 
          description="يمكنك زيارتنا في المقر الرئيسي"
          centered
        />
        
        <div className="mt-8 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
          <div className="relative w-full h-80">
            <div className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center text-center p-6">
              <p className="text-gray-500 dark:text-gray-400">
                [هنا يظهر الخريطة التفاعلية]<br />
                يمكنك إضافة خريطة Google Maps تظهر موقع مكتب الشركة
              </p>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 flex items-center gap-3">
            <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={22} />
            <p className="text-gray-600 dark:text-gray-400">
              3517 طريق الملك عبدالعزيز، حي الورود، الرياض، المملكة العربية السعودية، 12251
            </p>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="primary" spacing="medium">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">هل أنت مستعد للانضمام إلى رحلة تعلم القرآن الكريم؟</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            انضم إلى آلاف الطلاب الذين يتعلمون القرآن الكريم والعلوم الإسلامية عبر منصة كُتّاب
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
              ابدأ رحلتك الآن
            </Button>
            <Button variant="secondary" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
              تواصل مع مستشار تعليمي
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}