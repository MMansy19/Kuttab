import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <meta name="theme-color" content="#10b981" />
        </Head>
        <body className="bg-emerald-50 text-emerald-900 dark:bg-gray-900 dark:text-white font-[Cairo] min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
