'use client';

import React from "react";
import { FaMicrophone, FaUserGraduate, FaGlobe, FaBook, FaChalkboardTeacher, FaHandsHelping, FaUniversity, FaLightbulb } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import Image from "next/image";

// Service Card Component
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
  <div className="h-full">
    <Card variant="raised" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all h-full hover:shadow-xl">
      <CardContent className="p-6">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </div>
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

// Values Data
const values = [
  {
    icon: <FaLightbulb size={24} />,
    title: "الأصالة",
    description: "نحافظ على المعرفة والمنهجيات التقليدية في التعليم الإسلامي مع تكييفها للعصر الرقمي"
  },
  {
    icon: <FaGlobe size={24} />,
    title: "سهولة الوصول",
    description: "نجعل التعليم متاحًا للجميع بغض النظر عن الموقع أو الظروف المالية أو الاجتماعية"
  },
  {
    icon: <FaChalkboardTeacher size={24} />,
    title: "الإتقان",
    description: "نحافظ على أعلى معايير الجودة في التعليم والتكنولوجيا لضمان تجربة تعليمية مثالية"
  },
  {
    icon: <FaHandsHelping size={24} />,
    title: "الأمة",
    description: "نبني روابط هادفة تتجاوز الحواجز الرقمية وتعزز شعور الانتماء والمشاركة"
  },
  {
    icon: <FaUniversity size={24} />,
    title: "الخدمة",
    description: "نضع التأثير التعليمي والمنفعة المجتمعية فوق الربح المادي كمؤسسة غير ربحية"
  },
  {
    icon: <FaLightbulb size={24} />,
    title: "الإبداع",
    description: "نبتكر حلولاً إبداعية للتحديات التعليمية مع الحفاظ على احترام التقاليد الأصيلة"
  }
];

// Goals Data
const educationalGoals = [
  "الحفاظ على المعرفة الإسلامية الأصيلة مع تكييفها للعصر الرقمي",
  "تعزيز العلاقات الهادفة بين المعلمين المؤهلين والطلاب الملتزمين",
  "دعم التعلم المستمر وإنشاء مسارات تعليمية من المستويات الأساسية إلى المتقدمة",
  "إحياء النصوص الإسلامية الكلاسيكية من خلال أساليب تدريس معاصرة"
];

const technicalGoals = [
  "تطوير منصة سهلة الاستخدام تلبي احتياجات المستخدمين المتنوعة",
  "توفير أدوات تعليمية متكاملة تعزز تجربة التعلم",
  "ضمان إمكانية الوصول العالمي للمنصة عبر مختلف المناطق والأجهزة",
  "استخدام البيانات والمقاييس المناسبة لتحسين التجربة التعليمية باستمرار"
];

const communityGoals = [
  "بناء مجتمع تعليمي عالمي يتجاوز الحدود الجغرافية",
  "توفير المساواة التعليمية من خلال المنح الدراسية والأسعار المخفضة للطلاب",
  "دعم تطوير المعلمين وتدريبهم على التدريس عبر الإنترنت بفعالية",
  "توثيق وصيانة سلاسل الإسناد التعليمية التقليدية"
];

const GoalItem = ({ children }: { children: React.ReactNode }) => (
  <li className="mb-2 flex items-start gap-2">
    <span className="inline-block mt-1 h-4 w-4 rounded-full bg-emerald-200 dark:bg-emerald-800 flex-shrink-0" />
    <span className="text-gray-700 dark:text-gray-300">{children}</span>
  </li>
);

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
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 p-2 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/icon-192x192.png"
                    alt="iKuttab Logo"
                    width={80}
                    height={80}
                    priority
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>      {/* Vision Section */}
      <Section background="light" spacing="large">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="رؤيتنا"
            description="أن نصبح الرائد العالمي في التعليم الإسلامي الأصيل عبر الإنترنت، حيث يتم الحفاظ على المعرفة التقليدية ونقلها من خلال علاقات هادفة بين المعلم والطالب معززة بالتكنولوجيا، مما يجعل التعليم الإسلامي عالي الجودة متاحًا لكل مسلم بغض النظر عن الموقع أو الظروف."
            centered
          />
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900">
            <p className="text-emerald-800 dark:text-emerald-300 font-medium italic">
              "أن نكون بإذن الله المنصة الرائدة عالميًا في التعليم الإسلامي الأصيل، حيث تُحفظ المعرفة التقليدية وتُنقل من خلال علاقات هادفة بين المعلم والطالب"
            </p>
          </div>
        </div>
      </Section>      {/* Our Mission */}
      <Section spacing="large">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="رسالتنا"
            description="منصة كُتّاب تربط معلمي العلوم الإسلامية المؤهلين بالطلاب في جميع أنحاء العالم من خلال منصة رقمية بديهية تحترم منهجيات التعليم التقليدية. نحن نيسر رحلات تعليمية مخصصة تحافظ على أصالة نقل المعرفة الإسلامية مع إزالة الحواجز الجغرافية والمالية والاجتماعية أمام التعليم."
            centered
          />
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-blue-800 dark:text-blue-300 font-medium italic">
              "تصل منصة كُتّاب بين معلمي العلوم الإسلامية المؤهلين والطلاب في جميع أنحاء العالم من خلال منصة رقمية سهلة الاستخدام تحترم طرق التعليم التقليدية"
            </p>
          </div>
        </div>
      </Section>

      {/* Our Services */}
      <Section background="light" spacing="large">
        <div>
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
        </div>
      </Section>      {/* Our Goals */}
      <Section spacing="large">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="أهدافنا"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
                <FaBook size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">الأهداف التعليمية</h3>
              <ul className="list-none pl-0">
                {educationalGoals.map((goal, index) => (
                  <GoalItem key={index}>{goal}</GoalItem>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <div className="mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-12 h-12 rounded-full flex items-center justify-center">
                <FaLightbulb size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">الأهداف التقنية</h3>
              <ul className="list-none pl-0">
                {technicalGoals.map((goal, index) => (
                  <GoalItem key={index}>{goal}</GoalItem>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 w-12 h-12 rounded-full flex items-center justify-center">
                <FaHandsHelping size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">أهداف المجتمع</h3>
              <ul className="list-none pl-0">
                {communityGoals.map((goal, index) => (
                  <GoalItem key={index}>{goal}</GoalItem>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>      {/* Our Values */}
      <Section background="light" spacing="large">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="قيمنا"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="ml-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 w-10 h-10 rounded-full flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>      {/* Our Story */}
      <Section spacing="large">
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
      </Section>      {/* Call to Action */}
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