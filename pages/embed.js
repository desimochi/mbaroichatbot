// pages/index.js
import Script from 'next/script';

export default function HomePage() {
  return (
    <>
      <h1>Hello from MBAROI</h1>
      <Script src="/chatbot-widget.js" strategy="lazyOnload" />
    </>
  );
}
