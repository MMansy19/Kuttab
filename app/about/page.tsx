import React from "react";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaMicrophone, FaUserGraduate, FaGlobe, FaBook } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";

// Service Card Component
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
  <Card variant="raised" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl">
    <CardContent className="p-6">
      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

// Services Data
const services = [
  {
    icon: <FaBook size={32} />,
    title: "تعلم القرآن الكريم",
    description: "تعلم قراءة القرآن الكريم بالتجويد الصحيح من معلمين حاصلين على إجازات في القراءات المختلفة."
  },
  {
    icon: <FaMicrophone size={32} />,
    title: "تعلم التجويد",
    description: "دروس متخصصة في علم التجويد وأحكامه، مع التطبيق العملي على آيات القرآن الكريم."
  },
  {
    icon: <FaUserGraduate size={32} />,
    title: "دورات إسلامية",
    description: "دورات متنوعة في العلوم الإسلامية الأساسية كالتفسير، والحديث، والسيرة النبوية."
  },
  {
    icon: <FaGlobe size={32} />,
    title: "تعليم دولي",
    description: "معلمون من مختلف أنحاء العالم بلغات متعددة، مما يتيح التعلم لغير الناطقين بالعربية."
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <Section
        background="gradient"
        spacing="large"
        className="text-center text-white"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">منصة كُـتَّـاب للتعليم القرآني</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            نهج تعليمي أصيل برؤية معاصرة
          </p>
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 p-2 backdrop-blur-sm animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBookOpenReader className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </Section>

      {/* Our Mission */}
      <Section spacing="large">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader 
            title="رسالتنا" 
            description="في منصة كُتّاب، نسعى لإحياء تراث تعليم القرآن الكريم بطريقة تناسب العصر الحديث، من خلال ربط الطلاب بمعلمين ذوي خبرة وإجازات معتمدة. هدفنا الرئيسي هو تسهيل الوصول إلى تعليم قرآني عالي الجودة لكل مسلم ومسلمة حول العالم، بغض النظر عن مكانهم أو ظروفهم."
            centered
          />
        </div>
      </Section>

      {/* Our Services */}
      <Section background="light" spacing="large">
        <SectionHeader 
          title="ماذا نقدم؟" 
          accentColor="emerald" 
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </Section>

      {/* Our Values */}
      <Section spacing="large">
        <div className="max-w-4xl mx-auto">
          <SectionHeader 
            title="قيمنا" 
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">الإتقان والجودة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                نلتزم بتقديم تعليم قرآني عالي الجودة من خلال اختيار معلمين متميزين بإجازات معتمدة وخبرات تدريسية واسعة.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">المرونة والتيسير</h3>
              <p className="text-gray-600 dark:text-gray-400">
                نؤمن بأن التعلم يجب أن يكون متاحاً للجميع، لذلك نقدم خيارات مرنة تناسب جداول الطلاب المختلفة وظروفهم.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">الأصالة والمعاصرة</h3>
              <p className="text-gray-600 dark:text-gray-400">
                نجمع بين طرق التعليم القرآني الأصيلة والتقنيات الحديثة لتوفير تجربة تعليمية فعالة ومتكاملة.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">الاحترام والتقدير</h3>
              <p className="text-gray-600 dark:text-gray-400">
                نحرص على توفير بيئة تعليمية قائمة على الاحترام المتبادل والتقدير بين المعلمين والطلاب.
              </p>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Our Story */}
      <Section background="light" spacing="large">
        <div className="max-w-4xl mx-auto">
          <SectionHeader 
            title="قصتنا" 
            description="بدأت منصة كُتّاب كحلم بسيط: إتاحة تعليم القرآن الكريم لكل مسلم في أي مكان وزمان. مع تزايد الحاجة إلى التعلم عن بُعد، أدركنا أهمية بناء منصة تجمع أفضل المعلمين المؤهلين مع الطلاب الراغبين في تعلم كتاب الله بإتقان."
            centered
          />
          
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <blockquote className="text-lg text-gray-600 dark:text-gray-400 text-center italic">
              "إِنَّ أَفْضَلَكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
              <footer className="mt-2 font-bold text-gray-900 dark:text-white">- رواه البخاري</footer>
            </blockquote>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="primary" spacing="medium">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">انضم إلى رحلة تعلم القرآن الكريم</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/teachers" 
              className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium text-lg inline-block"
            >
              تصفح المعلمين
            </a>
            <a 
              href="/auth/signup" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium text-lg inline-block"
            >
              سجل كمتعلم
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}