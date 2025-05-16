import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          {/* Preload critical resources */}
          <link
            rel="preload"
            href="/_next/static/css/styles.css"
            as="style"
          />

          {/* Safari pinned tab icon */}
          <link
            rel="mask-icon"
            href="/safari-pinned-tab.svg"
            color="#10b981"
          />

          {/* Favicons */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link rel="preload" href="/images/learn-quran2.avif" as="image" />
          <link rel="preload" href="/images/learn-online.webp" as="image" type="image/webp" />
          <link rel="preload" href="/images/kid-learns-online.webp" as="image" type="image/webp" />
          <link rel="preload" href="/images/islamic-pattern.webp" as="image" type="image/webp" />

          {/* Manifest */}
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body className="bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-white font-[Cairo] min-h-screen">
          <Main />
          <NextScript strategy="beforeInteractive" />
        </body>
      </Html>
    );
  }
}

export default MyDocument;