'use client';
import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaUserGraduate, FaQuestion, FaChevronDown } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "@/utils/framer-motion";
import { FadeIn, StaggeredAnimation, ScaleIn, SlideIn, Bounce } from "@/components/ui/AnimationWrapper";
import IconWrapper from "@/components/ui/IconWrapper";

// Inline FAQ data instead of importing from external file
const faqsData = [
  {
    "id": "1",
    "question": "كيف يمكنني البدء في تعلم القرآن الكريم",
    "answer": "يمكنك البدء من خلال إنشاء حساب في منصتنا ثم اختيار المعلم المناسب لك وحجز موعد للبدء في الدروس الخاصة بك."
  },
  {
    "id": "2",
    "question": "هل يمكنني تجربة المنصة قبل الدفع",
    "answer": "نعم نقدم درسا تجريبيا مجانيا مع أي معلم تختاره لتجربة المنصة والتأكد من أنها تناسب احتياجاتك التعليمية."
  },
  {
    "id": "3",
    "question": "ما هي مؤهلات المعلمين لديكم",
    "answer": "جميع معلمينا حاصلون على إجازات معتمدة في تلاوة وتعليم القرآن الكريم ولديهم خبرة تدريسية لا تقل عن سنتين. يخضع المعلمون أيضا لعملية تقييم صارمة قبل انضمامهم للمنصة."
  },
  {
    "id": "4",
    "question": "كيف يمكنني تغيير أو إلغاء موعد درس",
    "answer": "يمكنك تغيير أو إلغاء المواعيد من خلال لوحة التحكم الخاصة بك مع مراعاة سياسة الإلغاء التي تتطلب إشعارا قبل 24 ساعة على الأقل من موعد الدرس."
  },
  {
    "id": "5",
    "question": "ما هي طرق الدفع المتاحة",
    "answer": "نقبل مجموعة متنوعة من طرق الدفع بما في ذلك بطاقات الائتمان باي بال التحويل المصرفي وبعض المحافظ الإلكترونية المحلية. يمكنك الاطلاع على التفاصيل في صفحة الدفع."
  },
  {
    "id": "6",
    "question": "هل يمكنني الوصول إلى تسجيلات الدروس السابقة",
    "answer": "نعم يتم حفظ تسجيلات جميع الدروس (بموافقة المعلم) ويمكنك الوصول إليها من خلال حسابك في أي وقت لمراجعة المحتوى."
  },
  {
    "id": "7",
    "question": "ما هي الأجهزة المدعومة لاستخدام المنصة",
    "answer": "منصتنا تدعم جميع أنواع الأجهزة تقريبا بما في ذلك أجهزة الكمبيوتر المكتبية واللابتوب والأجهزة اللوحية والهواتف الذكية التي تعمل بنظامي iOS وAndroid."
  },
  {
    "id": "8",
    "question": "كيف يمكنني التواصل مع الدعم الفني",
    "answer": "يمكنك التواصل مع فريق الدعم الفني عبر البريد الإلكتروني support@kottab.com أو من خلال نموذج الاتصال في صفحة التواصل أو عبر الدردشة المباشرة المتاحة في أسفل الشاشة."
  }
];

// FAQ Accordion Item Component
const FAQItem = ({ faq, index }: { faq: { id: string; question: string; answer: string }, index: number }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1 }
        }
      }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer p-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{faq.question}؟</h3>
          <motion.span 
            className="ml-2 text-emerald-600 dark:text-emerald-400"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </motion.span>
        </summary>
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700"
        >
          <p>{faq.answer}</p>
        </motion.div>
      </details>
    </motion.div>
  );
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <Section
        background="gradient"
        spacing="large"
        className="text-center text-white"
      >
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <Bounce>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h1>
            </Bounce>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                نحن هنا لمساعدتك
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <p className="text-lg opacity-80">
                هل لديك أسئلة أو استفسارات؟ فريقنا جاهز للرد عليك
              </p>
            </FadeIn>
            
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.5
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur opacity-60"></div>
                  <IconWrapper animate="pulse" size="xl" className="relative z-10">
                    <FaEnvelope />
                  </IconWrapper>
                </div>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </Section>

      {/* Contact Form Section */}
      <Section spacing="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <FadeIn>
            <SectionHeader 
              title="أرسل رسالة" 
              description="يسعدنا تلقي رسالتك وسنقوم بالرد في أقرب وقت ممكن"
            />
            
            <ScaleIn delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mt-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <form className="flex flex-col gap-5">
                  <StaggeredAnimation>
                    <motion.div variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}>
                      <Input 
                        placeholder="الاسم الكامل" 
                        name="name" 
                        required
                        icon={<IconWrapper><FaUserGraduate /></IconWrapper>}
                      />
                    </motion.div>
                    
                    <motion.div variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}>
                      <Input 
                        type="email" 
                        placeholder="البريد الإلكتروني" 
                        name="email" 
                        required
                        icon={<IconWrapper><FaEnvelope /></IconWrapper>}
                      />
                    </motion.div>
                    
                    <motion.div variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }} className="relative w-full">
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
                    </motion.div>
                    
                    <motion.div variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }} className="relative w-full">
                      <textarea 
                        className="flex min-h-[150px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:text-white transition-all duration-200"
                        placeholder="رسالتك"
                        name="message"
                        required
                      ></textarea>
                    </motion.div>
                    
                    <motion.div variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}>
                      <Button 
                        type="submit" 
                        variant="gradient" 
                        size="lg"
                        className="w-full transform transition-transform duration-200 hover:scale-105"
                      >
                        إرسال الرسالة
                      </Button>
                    </motion.div>
                  </StaggeredAnimation>
                </form>
              </div>
            </ScaleIn>
          </FadeIn>
          
          {/* Contact Information */}
          <FadeIn delay={0.2}>
            <SectionHeader 
              title="معلومات الاتصال" 
              description="يمكنك التواصل معنا مباشرة من خلال إحدى قنوات التواصل التالية"
            />
            
            <div className="grid grid-cols-1 gap-6 mt-8">
              <StaggeredAnimation staggerDelay={0.15}>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card variant="bordered" className="transition-all duration-300 hover:border-emerald-500">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                        <IconWrapper animate="pulse">
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
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card variant="bordered" className="transition-all duration-300 hover:border-emerald-500">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                        <IconWrapper animate="bounce">
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
                </motion.div>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card variant="bordered" className="transition-all duration-300 hover:border-emerald-500">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 p-3 rounded-full">
                        <IconWrapper animate="shake">
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
                </motion.div>
              </StaggeredAnimation>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section background="light" spacing="large">
        <FadeIn>
          <SectionHeader 
            title="الأسئلة الشائعة" 
            description="إليك أجوبة الأسئلة الأكثر شيوعًا من طلابنا ومعلمينا"
            centered
          />
          
          <div className="max-w-3xl mx-auto mt-12">
            <StaggeredAnimation>
              {faqsData.map((faq, index) => (
                <FAQItem key={faq.id} faq={faq} index={index} />
              ))}
            </StaggeredAnimation>
            
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">لم تجد إجابة لسؤالك؟</p>
              <Button 
                variant="outline"
                className="shadow-sm hover:shadow-md transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                عرض المزيد من الأسئلة الشائعة
              </Button>
            </motion.div>
          </div>
        </FadeIn>
      </Section>

      {/* Map Section */}
      <Section spacing="large">
        <FadeIn>
          <SectionHeader 
            title="موقعنا" 
            description="يمكنك زيارتنا في المقر الرئيسي"
            centered
          />
          
          <ScaleIn delay={0.2}>
            <div className="mt-8 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-500">
              <div className="relative w-full h-80">
                <motion.div 
                  className="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center text-center p-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <p className="text-gray-500 dark:text-gray-400">
                      [هنا يظهر الخريطة التفاعلية]<br />
                      يمكنك إضافة خريطة Google Maps تظهر موقع مكتب الشركة
                    </p>
                    <IconWrapper animate="pulse" size="xl" className="mt-4">
                      <FaMapMarkerAlt />
                    </IconWrapper>
                  </motion.div>
                </motion.div>
              </div>
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 flex items-center gap-3"
                whileHover={{ backgroundColor: "rgba(5, 150, 105, 0.05)" }}
              >
                <IconWrapper animate="bounce" color="text-emerald-600 dark:text-emerald-400">
                  <FaMapMarkerAlt size={22} />
                </IconWrapper>
                <p className="text-gray-600 dark:text-gray-400">
                  3517 طريق الملك عبدالعزيز، حي الورود، الرياض، المملكة العربية السعودية، 12251
                </p>
              </motion.div>
            </div>
          </ScaleIn>
        </FadeIn>
      </Section>

      {/* Call to Action */}
      <Section background="primary" spacing="medium">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 10,
              delay: 0.2
            }}
          >
            هل أنت مستعد للانضمام إلى رحلة تعلم القرآن الكريم؟
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            انضم إلى آلاف الطلاب الذين يتعلمون القرآن الكريم والعلوم الإسلامية عبر منصة كُتّاب
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 shadow-lg">
                ابدأ رحلتك الآن
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                تواصل مع مستشار تعليمي
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Section>
    </main>
  );
}