'use client';
import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaUserGraduate, FaQuestion, FaChevronDown } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import IconWrapper from "@/components/ui/IconWrapper";

const faqsData = [
  { id: "1", question: "كيف يمكنني البدء في تعلم القرآن الكريم", answer: "يمكنك البدء من خلال إنشاء حساب في منصتنا ثم اختيار المعلم المناسب لك وحجز موعد للبدء في الدروس الخاصة بك." },
  { id: "2", question: "هل يمكنني تجربة المنصة قبل الدفع", answer: "نعم نقدم درسا تجريبيا مجانيا مع أي معلم تختاره لتجربة المنصة والتأكد من أنها تناسب احتياجاتك التعليمية." },
  { id: "3", question: "ما هي مؤهلات المعلمين لديكم", answer: "جميع معلمينا حاصلون على إجازات معتمدة في تلاوة وتعليم القرآن الكريم ولديهم خبرة تدريسية لا تقل عن سنتين." },
  { id: "4", question: "كيف يمكنني تغيير أو إلغاء موعد درس", answer: "يمكنك تغيير أو إلغاء المواعيد من خلال لوحة التحكم الخاصة بك مع مراعاة سياسة الإلغاء التي تتطلب إشعارا قبل 24 ساعة على الأقل." },
  { id: "5", question: "ما هي طرق الدفع المتاحة", answer: "نقبل بطاقات الائتمان، باي بال، التحويل المصرفي وبعض المحافظ الإلكترونية المحلية." },
  { id: "6", question: "هل يمكنني الوصول إلى تسجيلات الدروس السابقة", answer: "نعم يتم حفظ تسجيلات الدروس (بموافقة المعلم) ويمكنك مراجعتها في أي وقت." },
  { id: "7", question: "ما هي الأجهزة المدعومة لاستخدام المنصة", answer: "ندعم أجهزة الكمبيوتر، اللابتوب، الأجهزة اللوحية، والهواتف الذكية بنظامي iOS وAndroid." },
  { id: "8", question: "كيف يمكنني التواصل مع الدعم الفني", answer: "عبر البريد الإلكتروني support@kottab.com أو نموذج الاتصال أو الدردشة المباشرة." }
];

const FAQItem = ({ faq }: { faq: any }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <details className="group">
      <summary className="flex items-center justify-between cursor-pointer p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{faq.question}؟</h3>
        <span className="ml-2 text-emerald-600 dark:text-emerald-400">
          <FaChevronDown />
        </span>
      </summary>
      <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
        <p>{faq.answer}</p>
      </div>
    </details>
  </div>
);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Section background="gradient" spacing="large" className="text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">نحن هنا لمساعدتك</p>
          <p className="text-lg opacity-80">هل لديك أسئلة أو استفسارات؟ فريقنا جاهز للرد عليك</p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-full">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur opacity-60"></div>
                <IconWrapper size="xl" className="relative z-10">
                  <FaEnvelope />
                </IconWrapper>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionHeader title="أرسل رسالة" description="يسعدنا تلقي رسالتك وسنقوم بالرد في أقرب وقت ممكن" />
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <form className="flex flex-col gap-5">
                <Input name="name" required placeholder="الاسم الكامل" icon={<IconWrapper><FaUserGraduate /></IconWrapper>} />
                <Input type="email" name="email" required placeholder="البريد الإلكتروني" icon={<IconWrapper><FaEnvelope /></IconWrapper>} />
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconWrapper><FaQuestion /></IconWrapper>
                  </div>
                  <select name="subject" required className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-200">
                    <option value="">نوع الاستفسار</option>
                    <option value="teachers">استفسار عن المعلمين</option>
                    <option value="courses">استفسار عن الدورات</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="payment">استفسار عن الدفع</option>
                    <option value="other">آخر</option>
                  </select>
                </div>
                <textarea name="message" required className="flex min-h-[150px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white transition-all duration-200" placeholder="رسالتك"></textarea>
                <Button type="submit" variant="gradient" size="lg" className="w-full transform transition-transform duration-200 hover:scale-105">إرسال الرسالة</Button>
              </form>
            </div>
          </div>

          <div>
            <SectionHeader title="معلومات الاتصال" description="يمكنك التواصل معنا مباشرة من خلال إحدى قنوات التواصل التالية" />
            <div className="grid grid-cols-1 gap-6 mt-8">
              <Card variant="bordered" className="hover:border-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <IconWrapper><FaEnvelope size={24} /></IconWrapper>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">البريد الإلكتروني</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">info@kottab.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">نستجيب خلال 24 ساعة</p>
                  </div>
                </CardContent>
              </Card>

              <Card variant="bordered" className="hover:border-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <IconWrapper><FaWhatsapp size={24} /></IconWrapper>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">واتساب</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">+966-555-123456</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">متاح من 9 صباحًا - 9 مساءً</p>
                  </div>
                </CardContent>
              </Card>

              <Card variant="bordered" className="hover:border-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <IconWrapper><FaPhone size={24} /></IconWrapper>
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

      <Section background="light" spacing="large">
        <SectionHeader title="الأسئلة الشائعة" description="إليك أجوبة الأسئلة الأكثر شيوعًا من طلابنا ومعلمينا" centered />
        <div className="max-w-3xl mx-auto mt-12">
          {faqsData.map((faq) => <FAQItem key={faq.id} faq={faq} />)}
        </div>
      </Section>

      <Section spacing="large">
        <SectionHeader title="موقعنا" description="يمكنك زيارتنا في المقر الرئيسي" centered />
        <div className="mt-8 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-500">
          <div className="relative w-full h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-center p-6">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                [هنا يظهر الخريطة التفاعلية]<br />يمكنك إضافة خريطة Google Maps تظهر موقع مكتب الشركة
              </p>
              <IconWrapper size="xl" className="mt-4">
                <FaMapMarkerAlt />
              </IconWrapper>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 flex items-center gap-3">
            <IconWrapper color="text-emerald-600 dark:text-emerald-400">
              <FaMapMarkerAlt size={22} />
            </IconWrapper>
            <p className="text-gray-600 dark:text-gray-400">
              3517 طريق الملك عبدالعزيز، حي الورود، الرياض، المملكة العربية السعودية، 12251
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}