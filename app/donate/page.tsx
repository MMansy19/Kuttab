import React from "react";
import { FaHandHoldingHeart, FaGraduationCap, FaLaptop, FaGlobe, FaBookOpen } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Section
        background="gradient"
        spacing="large"
        className="text-center text-white"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ساهم في نشر تعليم القرآن الكريم</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            "مَنْ عَلَّمَ آيَةً مِنْ كِتَابِ اللهِ فَلَهُ أَجْرُهَا مَا تُلِيَتْ"
          </p>
          <div className="flex justify-center">
            <div className="relative animate-float">
              <FaHandHoldingHeart size={80} className="text-white/90" />
            </div>
          </div>
        </div>
      </Section>

      {/* Why Donate */}
      <Section spacing="large">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="لماذا ندعوك للمساهمة؟"
            description="تبرعك يساعدنا على توسيع نطاق خدماتنا التعليمية وإيصال تعليم القرآن الكريم إلى المزيد من المسلمين حول العالم، خاصة في المناطق النائية وللفئات الأقل حظاً."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card variant="bordered" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-emerald-600 p-4 text-white">
                  <h3 className="text-xl font-bold">الصدقة الجارية</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    دعمك لمنصة كُتّاب يُعد من الصدقة الجارية، حيث يستمر ثوابها ما دام العلم يُنتفع به.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <FaBookOpen size={40} className="text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="bordered" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-emerald-600 p-4 text-white">
                  <h3 className="text-xl font-bold">المساهمة في نشر العلم</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    تبرعك يساهم في نشر تعليم القرآن الكريم وعلومه لمن لا يستطيع الوصول إليه بسبب ظروف مادية أو جغرافية.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <FaGlobe size={40} className="text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Impact */}
      <Section background="light" spacing="large">
        <SectionHeader
          title="أثر تبرعك"
          description="تساهم تبرعاتك في تحقيق رسالتنا لتوفير تعليم قرآني عالي الجودة للجميع"
          accentColor="emerald"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">دعم الطلاب</h3>
              <p className="text-gray-600 dark:text-gray-400">
                توفير منح دراسية للطلاب غير القادرين على تحمل تكاليف التعليم
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLaptop size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">تطوير المنصة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                تطوير وتحسين المنصة لتقديم تجربة تعليمية أفضل وأكثر فعالية
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandHoldingHeart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">دعم المعلمين</h3>
              <p className="text-gray-600 dark:text-gray-400">
                مساعدة المعلمين على الاستمرار في رسالتهم النبيلة لتعليم القرآن الكريم وعلومه
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Donation Options */}
      <Section spacing="large">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="طرق التبرع"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">تبرع لمرة واحدة</h3>
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                  <Button variant="outline" className="w-20">10$</Button>
                  <Button variant="outline" className="w-20">25$</Button>
                  <Button variant="outline" className="w-20">50$</Button>
                  <Button variant="outline" className="w-20">100$</Button>
                  <Button variant="outline" className="w-20">آخر</Button>
                </div>
                <Button variant="gradient" size="lg" className="w-full">تبرع الآن</Button>
              </CardContent>
            </Card>

            <Card variant="bordered" className="text-center">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">تبرع شهري</h3>
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                  <Button variant="outline" className="w-20">5$/شهر</Button>
                  <Button variant="outline" className="w-20">10$/شهر</Button>
                  <Button variant="outline" className="w-20">20$/شهر</Button>
                  <Button variant="outline" className="w-20">آخر</Button>
                </div>
                <Button variant="gradient" size="lg" className="w-full">اشترك الآن</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Zakat Information */}
      <Section background="light" spacing="medium">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">هل تبرعات كُتّاب مؤهلة للزكاة؟</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            تبرعاتك لدعم الطلاب المحتاجين قد تكون مؤهلة للزكاة. لمزيد من المعلومات حول شروط الزكاة وكيفية حسابها، يرجى التواصل مع فريقنا.
          </p>
          <Button variant="secondary">تحدث مع مستشار الزكاة</Button>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="primary" spacing="medium">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">ساهم في نشر العلم النافع</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            كل تبرع، مهما كان صغيراً، يُحدث فرقاً في حياة طالب علم ويساعد في نشر كتاب الله
          </p>
          <Button variant="default" size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
            تبرع الآن
          </Button>
        </div>
      </Section>
    </main>
  );
}