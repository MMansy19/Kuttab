import teachersData from '@/data/teachers';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Generate RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom">

  <channel>
    <title>منصة كُتّاب لتعليم القرآن الكريم</title>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}</link>
    <description>منصة كُتّاب تجمع بين المعلمين المتخصصين والطلاب الراغبين في تعلم القرآن الكريم والعلوم الإسلامية</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    
    <!-- Home Page -->
    <item>
      <title>منصة كُتّاب لتعليم القرآن الكريم</title>
      <link>${baseUrl}</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}</guid>
      <description>ابدأ رحلتك في تعلم القرآن الكريم مع أفضل المعلمين المؤهلين عبر منصة كُتّاب.</description>
    </item>
    
    <!-- About Page -->
    <item>
      <title>عن منصة كُتّاب | نبذة عن مشروعنا وأهدافنا</title>
      <link>${baseUrl}/about</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/about</guid>
      <description>تعرف على منصة كُتّاب لتعليم القرآن الكريم عن بعد، رسالتنا، رؤيتنا، وأهدافنا.</description>
    </item>
    
    <!-- Teachers Page -->
    <item>
      <title>معلمو القرآن الكريم المؤهلون</title>
      <link>${baseUrl}/teachers</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/teachers</guid>
      <description>تصفح قائمة معلمي القرآن الكريم المؤهلين في منصة كُتّاب.</description>
    </item>    
    <!-- Teacher Profiles -->
    ${teachersData.map((teacher: any) => `
    <item>
      <title>${teacher.name} - معلم ${teacher.subjects?.[0] || 'القرآن الكريم'}</title>
      <link>${baseUrl}/teachers/${teacher.id}</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/teachers/${teacher.id}</guid>
      <description>تعرف على ${teacher.name}، معلم ${teacher.subjects?.[0] || 'القرآن الكريم'} واحجز دروسك معه الآن.</description>
    </item>
    `).join('')}
    
    <!-- Contact Page -->
    <item>
      <title>اتصل بنا | منصة كُتّاب لتعليم القرآن الكريم</title>
      <link>${baseUrl}/contact</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/contact</guid>
      <description>تواصل مع فريق منصة كُتّاب لتعليم القرآن الكريم.</description>
    </item>
    
    <!-- Donate Page -->
    <item>
      <title>تبرع لدعم تعليم القرآن الكريم | منصة كُتّاب</title>
      <link>${baseUrl}/donate</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/donate</guid>
      <description>ساهم في نشر تعليم القرآن الكريم والعلوم الإسلامية من خلال التبرع لمنصة كُتّاب.</description>
    </item>
  </channel>
</rss>`;

  // Return the XML response
  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
