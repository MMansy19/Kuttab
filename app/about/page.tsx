import React from "react";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaMicrophone, FaUserGraduate, FaGlobe, FaBook, FaChalkboardTeacher, FaHandsHelping, FaUniversity, FaLightbulb } from "react-icons/fa";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "@/utils/framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// Service Card Component
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
  <motion.div
    variants={scaleIn}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <Card variant="raised" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all h-full hover:shadow-xl">
      <CardContent className="p-6">
        <motion.div 
          className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
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
    title: "الأصالة (Authenticity)",
    description: "نحافظ على المعرفة والمنهجيات التقليدية في التعليم الإسلامي مع تكييفها للعصر الرقمي"
  },
  {
    icon: <FaGlobe size={24} />,
    title: "سهولة الوصول (Accessibility)",
    description: "نجعل التعليم متاحًا للجميع بغض النظر عن الموقع أو الظروف المالية أو الاجتماعية"
  },
  {
    icon: <FaChalkboardTeacher size={24} />,
    title: "الإتقان (Excellence)",
    description: "نحافظ على أعلى معايير الجودة في التعليم والتكنولوجيا لضمان تجربة تعليمية مثالية"
  },
  {
    icon: <FaHandsHelping size={24} />,
    title: "الأمة (Community)",
    description: "نبني روابط هادفة تتجاوز الحواجز الرقمية وتعزز شعور الانتماء والمشاركة"
  },
  {
    icon: <FaUniversity size={24} />,
    title: "الخدمة (Service)",
    description: "نضع التأثير التعليمي والمنفعة المجتمعية فوق الربح المادي كمؤسسة غير ربحية"
  },
  {
    icon: <FaLightbulb size={24} />,
    title: "الإبداع (Innovation)",
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
  <motion.li 
    variants={fadeIn}
    className="mb-2 flex items-start gap-2"
  >
    <span className="inline-block mt-1 h-4 w-4 rounded-full bg-emerald-200 dark:bg-emerald-800 flex-shrink-0" />
    <span className="text-gray-700 dark:text-gray-300">{children}</span>
  </motion.li>
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
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">منصة كُـتَّـاب للتعليم القرآني</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            نهج تعليمي أصيل برؤية معاصرة
          </p>
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.2 
            }}
          >
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 p-2 backdrop-blur-sm animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBookOpenReader className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* Vision Section */}
      <Section background="light" spacing="large">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <SectionHeader 
            title="رؤيتنا (Our Vision)" 
            description="أن نصبح الرائد العالمي في التعليم الإسلامي الأصيل عبر الإنترنت، حيث يتم الحفاظ على المعرفة التقليدية ونقلها من خلال علاقات هادفة بين المعلم والطالب معززة بالتكنولوجيا، مما يجعل التعليم الإسلامي عالي الجودة متاحًا لكل مسلم بغض النظر عن الموقع أو الظروف."
            centered
          />
          <motion.div
            className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-emerald-800 dark:text-emerald-300 font-medium italic">
              "To become the global leader in authentic online Islamic education, where traditional knowledge is preserved and transmitted through meaningful teacher-student relationships empowered by technology"
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* Our Mission */}
      <Section spacing="large">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <SectionHeader 
            title="رسالتنا (Our Mission)" 
            description="منصة آي كُتّاب تربط معلمي العلوم الإسلامية المؤهلين بالطلاب في جميع أنحاء العالم من خلال منصة رقمية بديهية تحترم منهجيات التعليم التقليدية. نحن نيسر رحلات تعليمية مخصصة تحافظ على أصالة نقل المعرفة الإسلامية مع إزالة الحواجز الجغرافية والمالية والاجتماعية أمام التعليم."
            centered
          />
          <motion.div
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="text-blue-800 dark:text-blue-300 font-medium italic">
              "iKuttab connects qualified teachers of Islamic sciences with students worldwide through an intuitive digital platform that honors traditional educational methodologies"
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* Our Services */}
      <Section background="light" spacing="large">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
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
        </motion.div>
      </Section>

      {/* Our Goals */}
      <Section spacing="large">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <SectionHeader 
            title="أهدافنا (Our Goals)" 
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
              variants={scaleIn}
            >
              <div className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
                <FaBook size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">الأهداف التعليمية</h3>
              <motion.ul variants={staggerContainer} className="list-none pl-0">
                {educationalGoals.map((goal, index) => (
                  <GoalItem key={index}>{goal}</GoalItem>
                ))}
              </motion.ul>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
              variants={scaleIn}
            >
              <div className="mb-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-12 h-12 rounded-full flex items-center justify-center">
                <FaLightbulb size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">الأهداف التقنية</h3>
              <motion.ul variants={staggerContainer} className="list-none pl-0">
                {technicalGoals.map((goal, index) => (
                  <GoalItem key={index}>{goal}</GoalItem>
                ))}
              </motion.ul>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
              variants={scaleIn}
            >
              <div className="mb-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 w-12 h-12 rounded-full flex items-center justify-center">
                <FaHandsHelping size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">أهداف المجتمع</h3>
              <motion.ul variants={staggerContainer} className="list-none pl-0">
                {communityGoals.map((goal, index) => (
                  <GoalItem key={index}>{goal}</GoalItem>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* Our Values */}
      <Section background="light" spacing="large">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <SectionHeader 
            title="قيمنا (Our Values)" 
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 w-10 h-10 rounded-full flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>
      
      {/* Our Story */}
      <Section spacing="large">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <SectionHeader 
            title="قصتنا" 
            description="بدأت منصة كُتّاب كحلم بسيط: إتاحة تعليم القرآن الكريم لكل مسلم في أي مكان وزمان. مع تزايد الحاجة إلى التعلم عن بُعد، أدركنا أهمية بناء منصة تجمع أفضل المعلمين المؤهلين مع الطلاب الراغبين في تعلم كتاب الله بإتقان."
            centered
          />
          
          <motion.div 
            className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <blockquote className="text-lg text-gray-600 dark:text-gray-400 text-center italic">
              "إِنَّ أَفْضَلَكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
              <footer className="mt-2 font-bold text-gray-900 dark:text-white">- رواه البخاري</footer>
            </blockquote>
          </motion.div>
        </motion.div>
      </Section>

      {/* Call to Action */}
      <Section background="primary" spacing="medium">
        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-6">انضم إلى رحلة تعلم القرآن الكريم</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a 
              href="/teachers" 
              className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium text-lg inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              تصفح المعلمين
            </motion.a>
            <motion.a 
              href="/auth/signup" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium text-lg inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              سجل كمتعلم
            </motion.a>
          </div>
        </motion.div>
      </Section>
    </main>
  );
}