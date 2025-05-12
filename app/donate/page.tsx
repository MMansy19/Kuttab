'use client';
import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaUserGraduate, FaQuestion, FaChevronDown } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import IconWrapper from "@/components/ui/IconWrapper";

const faqsData = [
  {
    id: "1",
    question: "كيف يمكنني البدء في تعلم القرآن الكريم",
    answer: "يمكنك البدء من خلال إنشاء حساب في منصتنا ثم اختيار المعلم المناسب لك وحجز موعد للبدء في الدروس الخاصة بك."
  },
  {
    id: "2",
    question: "هل يمكنني تجربة المنصة قبل الدفع",
    answer: "نعم نقدم درسا تجريبيا مجانيا مع أي معلم تختاره لتجربة المنصة والتأكد من أنها تناسب احتياجاتك التعليمية."
  },
  // ... remaining FAQs
];

const FAQItem = ({ faq }: { faq: any }) => {
  return (
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
};

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
            <SectionHeader
              title="أرسل رسالة"
              description="يسعدنا تلقي رسالتك وسنقوم بالرد في أقرب وقت ممكن"
            />
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <form className="flex flex-col gap-5">
                <Input
                  placeholder="الاسم الكامل"
                  name="name"
                  required
                  icon={<IconWrapper><FaUserGraduate /></IconWrapper>}
                />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  name="email"
                  required
                  icon={<IconWrapper><FaEnvelope /></IconWrapper>}
                />
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconWrapper><FaQuestion /></IconWrapper>
                  </div>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:text-white transition-all duration-200"
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
                    className="flex min-h-[150px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:text-white transition-all duration-200"
                    placeholder="رسالتك"
                    name="message"
                    required
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full transform transition-transform duration-200 hover:scale-105"
                >
                  إرسال الرسالة
                </Button>
              </form>
            </div>
          </div>

          <div>
            <SectionHeader
              title="معلومات الاتصال"
              description="يمكنك التواصل معنا مباشرة من خلال إحدى قنوات التواصل التالية"
            />
            <div className="grid grid-cols-1 gap-6 mt-8">
              <Card variant="bordered" className="transition-all duration-300 hover:border-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <IconWrapper>
                      <FaEnvelope size={24} />
                    </IconWrapper>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">البريد الإلكتروني</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">info@kottab.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">نستجيب خلال 24 ساعة</p>
                  </div>
                </CardContent>
              </Card>
              <Card variant="bordered" className="transition-all duration-300 hover:border-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <IconWrapper>
                      <FaWhatsapp size={24} />
                    </IconWrapper>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">واتساب</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">+966-555-123456</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">متاح من 9 صباحًا - 9 مساءً</p>
                  </div>
                </CardContent>
              </Card>
              <Card variant="bordered" className="transition-all duration-300 hover:border-emerald-500">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                    <IconWrapper>
                      <FaPhone size={24} />
                    </IconWrapper>
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
        <SectionHeader
          title="الأسئلة الشائعة"
          description="إليك أجوبة الأسئلة الأكثر شيوعًا من personally طلابنا ومعلمينا"
          centered
        />
        <div className="max-w-3xl mx-auto mt-12">
          {faqsData.map((faq) => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">لم تجد إجابة لسؤالك؟</p>
            <button className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-emerald-500 text-emerald-600 px-4 py-2 rounded-md">
              عرض المزيد من الأسئلة الشائعة
            </button>
          </div>
        </div>
      </Section>
    </main>
  );
}