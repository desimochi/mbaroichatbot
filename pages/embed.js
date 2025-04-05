// pages/embed.js
import Head from "next/head";
import ChatbotWidget from "@/components/Chatbot";

export default function EmbedPage() {
  return (
    <>
      <Head>
        <title>MBAROI Chatbot Widget</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
        <ChatbotWidget />
      </div>
    </>
  );
}
