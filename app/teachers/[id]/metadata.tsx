import { Metadata } from "next";
import teachersData from '@/data/teachers'; // Import your teachers data

// Generate static metadata for teacher profile
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Find the specific teacher
  const teacher = teachersData.find((t: any) => t.id === params.id);

  if (!teacher) {
    return {
      title: "معلم غير موجود | كُتّاب",
      description: "لم يتم العثور على المعلم المطلوب. الرجاء العودة لقائمة المعلمين.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const teacherUrl = `${baseUrl}/teachers/${params.id}`;
    // Keywords specific to this teacher
  const keywords = [
    teacher.name,
    `معلم ${teacher.subjects?.[0] || 'القرآن'}`,
    `${teacher.name} كُتّاب`,
    `دروس ${teacher.subjects?.[0] || 'القرآن'} اونلاين`,
    `تعلم ${teacher.subjects?.[0] || 'القرآن'} مع ${teacher.name}`,
  ];
  return {
    title: `${teacher.name} - معلم ${teacher.subjects?.[0] || 'القرآن الكريم'}`,
    description: teacher.bio || 
      `احجز دروسك مع ${teacher.name}، معلم ${teacher.subjects?.[0] || 'القرآن الكريم'} المؤهل في منصة كُتّاب. خبرة واسعة في تعليم ${teacher.subjects?.[0] || 'القرآن الكريم والتجويد'} بطرق مبتكرة وفعالة.`,
    keywords: keywords,
    alternates: {
      canonical: teacherUrl,
    },
    openGraph: {
      title: `${teacher.name} - معلم ${teacher.subjects?.[0] || 'القرآن الكريم'} في منصة كُتّاب`,
      description: teacher.bio ||
        `احجز دروسك مع ${teacher.name}، معلم ${teacher.subjects?.[0] || 'القرآن الكريم'} المؤهل في منصة كُتّاب. خبرة واسعة في تعليم ${teacher.subjects?.[0] || 'القرآن الكريم والتجويد'} بطرق مبتكرة وفعالة.`,
      url: teacherUrl,
      type: 'profile',      images: [
        {
          url: teacher.avatarUrl || `${baseUrl}/images/teachers/default.jpg`,
          width: 800,
          height: 600,
          alt: `صورة المعلم ${teacher.name}`,
        }
      ],
    }
  };
}
