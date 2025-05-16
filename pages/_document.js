import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          {/* DNS Prefetching */}
          <link rel="dns-prefetch" href="//your-api-domain.com" />

          {/* Critical Preloads */}
          <link
            rel="preload"
            href="/_next/static/css/styles.css"
            as="style"
            fetchPriority="high"
          />
          <link
            rel="preload"
            href="/fonts/Cairo-Regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            fetchPriority="high"
          />
          <link
            rel="preload"
            href="/images/learn-quran2.avif"
            as="image"
            type="image/avif"
            fetchPriority="high"
          />
          <link
            rel="preload"
            href="/images/islamic-pattern.webp"
            as="image"
            type="image/webp"
            fetchPriority="low"
          />
        </Head>
        <body className="bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-white font-[Cairo] min-h-screen">
          <Main />
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;