import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className='scroll-smooth' style={{ scrollBehavior: 'smooth' }} lang='en'>
      <Head >
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5086988366991731"
          crossorigin="anonymous"></script>
      </Head >
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
