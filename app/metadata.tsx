import { Metadata } from "next";
import { siteKeywords } from "@/lib/metadata";

// Home page has the most optimized metadata as it's the entry point
export const metadata: Metadata = {
  title: "كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت",
  description: "منصة كُتّاب هي الوجهة الأولى لتعلم وتعليم القرآن الكريم عبر الإنترنت، احجز دروسك الآن مع أفضل المعلمين المتخصصين في القراءة، التجويد، الحفظ والتفسير بطريقة سهلة وميسرة.",
  keywords: [
    ...siteKeywords,
    "أفضل منصة لتعليم القرآن",
    "دروس قرآن مباشرة",
    "تحفيظ القرآن للأطفال",
    "تعلم التجويد من البداية",
    "معلمين قرآن معتمدين",
    "منصة تعليمية إسلامية آمنة",
    "دورات تحسين التلاوة",
    "أفضل معلمي قرآن أونلاين",
    "أسهل طريقة لحفظ القرآن"
  ],
  openGraph: {
    title: "كُتّاب | أفضل منصة لتعليم القرآن الكريم عبر الإنترنت",
    description: "منصة كُتّاب هي الوجهة الأولى لتعلم وتعليم القرآن الكريم عبر الإنترنت، احجز دروسك الآن مع أفضل المعلمين المتخصصين في القراءة، التجويد، الحفظ والتفسير بطريقة سهلة وميسرة.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "كُتّاب",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/images/og-home-image.jpg`,
        width: 1200,
        height: 630,
        alt: "كُتّاب - منصة تعليم القرآن الكريم",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "كُتّاب | منصة تعليم القرآن الكريم عبر الإنترنت",
    description: "تعلم القرآن الكريم مع أفضل المعلمين المؤهلين. دروس مباشرة، تجويد، حفظ، وتلاوة. ابدأ رحلتك الآن!",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/images/twitter-home-image.jpg`],
    site: "@kottab",
    creator: "@kottab",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    languages: {
      "ar": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  },
};
