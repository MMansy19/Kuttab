'use client';

import React, { useState } from "react";
import Image from 'next/image';
import { FaHandHoldingHeart, FaGraduationCap, FaLaptop, FaGlobe, FaBookOpen, FaCreditCard, FaPaypal, FaRegCreditCard } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "@/utils/framer-motion";
import { FadeIn, StaggeredAnimation, ScaleIn, SlideIn, Bounce } from "@/components/ui/AnimationWrapper";
import IconWrapper from "@/components/ui/IconWrapper";

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState('25');
  const [monthlyAmount, setMonthlyAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState(false);
  const [customMonthlyAmount, setCustomMonthlyAmount] = useState(false);

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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">ساهم في نشر تعليم القرآن الكريم</h1>
            </Bounce>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                "مَنْ عَلَّمَ آيَةً مِنْ كِتَابِ اللهِ فَلَهُ أَجْرُهَا مَا تُلِيَتْ"
              </p>
            </FadeIn>
            
            <motion.div 
              className="flex justify-center mt-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.4
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur opacity-60"></div>
                  <IconWrapper animate="pulse" size="xl" className="relative z-10">
                    <FaHandHoldingHeart size={80} className="text-white" />
                  </IconWrapper>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-xs text-gray-300">متبرع شهري</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-xs text-gray-300">منحة دراسية</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-xs text-gray-300">دولة مستفيدة</div>
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </Section>

      {/* Why Donate */}
      <Section spacing="large">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <SectionHeader 
              title="لماذا ندعوك للمساهمة؟" 
              description="تبرعك يساعدنا على توسيع نطاق خدماتنا التعليمية وإيصال تعليم القرآن الكريم إلى المزيد من المسلمين حول العالم، خاصة في المناطق النائية وللفئات الأقل حظاً."
              centered
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <motion.div 
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card variant="bordered" className="overflow-hidden h-full">
                  <CardContent className="p-0 h-full">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 text-white">
                      <h3 className="text-xl font-bold">الصدقة الجارية</h3>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                      <p className="text-gray-600 dark:text-gray-400 flex-grow">
                        دعمك لمنصة كُتّاب يُعد من الصدقة الجارية، حيث يستمر ثوابها ما دام العلم يُنتفع به.
                      </p>
                      <div className="mt-4 flex justify-center">
                        <IconWrapper animate="bounce" color="text-emerald-600 dark:text-emerald-500" size="lg">
                          <FaBookOpen />
                        </IconWrapper>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card variant="bordered" className="overflow-hidden h-full">
                  <CardContent className="p-0 h-full">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                      <h3 className="text-xl font-bold">المساهمة في نشر العلم</h3>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                      <p className="text-gray-600 dark:text-gray-400 flex-grow">
                        تبرعك يساهم في نشر تعليم القرآن الكريم وعلومه لمن لا يستطيع الوصول إليه بسبب ظروف مادية أو جغرافية.
                      </p>
                      <div className="mt-4 flex justify-center">
                        <IconWrapper animate="pulse" color="text-blue-600 dark:text-blue-500" size="lg">
                          <FaGlobe />
                        </IconWrapper>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Impact */}
      <Section background="light" spacing="large">
        <FadeIn>
          <SectionHeader 
            title="أثر تبرعك" 
            description="تساهم تبرعاتك في تحقيق رسالتنا لتوفير تعليم قرآني عالي الجودة للجميع"
            accentColor="emerald" 
            centered
          />

          <StaggeredAnimation className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="text-center h-full transform transition-transform">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <IconWrapper animate="bounce">
                      <FaGraduationCap size={32} />
                    </IconWrapper>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">دعم الطلاب</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    توفير منح دراسية للطلاب غير القادرين على تحمل تكاليف التعليم، وضمان وصول المعرفة لجميع الراغبين في تعلم القرآن الكريم
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="text-center h-full transform transition-transform">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <IconWrapper animate="pulse">
                      <FaLaptop size={32} />
                    </IconWrapper>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">تطوير المنصة</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    تطوير وتحسين المنصة لتقديم تجربة تعليمية أفضل وأكثر فعالية، وإضافة أدوات تعليمية حديثة تسهل عملية التعلم عن بُعد
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="text-center h-full transform transition-transform">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <IconWrapper animate="shake">
                      <FaHandHoldingHeart size={32} />
                    </IconWrapper>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">دعم المعلمين</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    مساعدة المعلمين على الاستمرار في رسالتهم النبيلة لتعليم القرآن الكريم وعلومه، وتدريبهم على أحدث أساليب التدريس عن بُعد
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggeredAnimation>
        </FadeIn>
      </Section>

      {/* Donation Options */}
      <Section spacing="large">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <SectionHeader 
              title="طرق التبرع" 
              centered
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <ScaleIn>
                <Card variant="bordered" className="text-center border-2 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <IconWrapper animate="pulse">
                        <FaCreditCard size={32} />
                      </IconWrapper>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">تبرع لمرة واحدة</h3>
                    
                    <div className="flex flex-wrap gap-4 justify-center mb-6">
                      {['10', '25', '50', '100', 'آخر'].map((amount) => (
                        <motion.div
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={donationAmount === amount ? 'gradient' : 'outline'}
                            className={`w-20 ${donationAmount === amount ? 'ring-2 ring-emerald-500' : ''}`}
                            onClick={() => {
                              setDonationAmount(amount);
                              setCustomAmount(amount === 'آخر');
                            }}
                          >
                            {amount === 'آخر' ? 'آخر' : `${amount}$`}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    
                    {customAmount && (
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="relative w-full max-w-xs mx-auto">
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">$</span>
                          <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="أدخل المبلغ"
                            min="1"
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="mt-auto"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        variant="gradient" 
                        size="lg" 
                        className="w-full shadow-md hover:shadow-lg"
                      >
                        تبرع الآن
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </ScaleIn>
              
              <ScaleIn delay={0.1}>
                <Card variant="bordered" className="text-center border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-6 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <IconWrapper animate="bounce">
                        <FaRegCreditCard size={32} />
                      </IconWrapper>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">تبرع شهري</h3>
                    
                    <div className="flex flex-wrap gap-4 justify-center mb-6">
                      {['5', '10', '20', 'آخر'].map((amount) => (
                        <motion.div
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={monthlyAmount === amount ? 'gradient' : 'outline'}
                            className={`w-24 ${monthlyAmount === amount ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => {
                              setMonthlyAmount(amount);
                              setCustomMonthlyAmount(amount === 'آخر');
                            }}
                          >
                            {amount === 'آخر' ? 'آخر' : `${amount}$/شهر`}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    
                    {customMonthlyAmount && (
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="relative w-full max-w-xs mx-auto">
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">$</span>
                          <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="أدخل المبلغ الشهري"
                            min="1"
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="mt-auto"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        variant="gradient" 
                        size="lg" 
                        className="w-full shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-blue-500"
                      >
                        اشترك الآن
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </ScaleIn>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <FadeIn delay={0.2}>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-sm">
                  <FaPaypal className="text-blue-500" size={24} />
                  <span className="text-gray-600 dark:text-gray-300">PayPal</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-sm">
                  <FaCreditCard className="text-gray-700 dark:text-gray-300" size={24} />
                  <span className="text-gray-600 dark:text-gray-300">بطاقة ائتمان</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-sm">
                  <IconWrapper><FaGlobe className="text-emerald-600" size={20} /></IconWrapper>
                  <span className="text-gray-600 dark:text-gray-300">حوالة بنكية</span>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Zakat Information */}
      <Section background="light" spacing="medium">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">هل تبرعات كُتّاب مؤهلة للزكاة؟</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              تبرعاتك لدعم الطلاب المحتاجين قد تكون مؤهلة للزكاة. لمزيد من المعلومات حول شروط الزكاة وكيفية حسابها، يرجى التواصل مع فريقنا.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="secondary"
                className="shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                تحدث مع مستشار الزكاة
              </Button>
            </motion.div>
          </div>
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
            ساهم في نشر العلم النافع
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            كل تبرع، مهما كان صغيراً، يُحدث فرقاً في حياة طالب علم ويساعد في نشر كتاب الله
          </motion.p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button variant="default" size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 shadow-lg">
              تبرع الآن
            </Button>
          </motion.div>
        </motion.div>
      </Section>
    </main>
  );
}