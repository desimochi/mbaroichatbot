// components/ChatbotWidget.js
import Link from "next/link";
import { useState, useRef } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", mobile: "" });
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: ``,
    },
  ]);
  const chatboxRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");

  const appendMessage = (sender, text) => {
    setChatHistory((prev) => [...prev, { sender, text }]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }, 100);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    appendMessage("user", input);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true); // Start typing animation
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setLoading(false); // End typing animation
    appendMessage("bot", data.reply);
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);

    try {
      await fetch("/api/saveMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          message: userMessage, // save only the user's message
        }),
      });
    } catch (err) {
      console.error("Message saving failed", err);
    }
  };

  const handleStartChat = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.mobile) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const res = await fetch("/api/saveUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
  
      const data = await res.json();
      console.log(data); // for debugging
  
      setStarted(true);
      appendMessage("bot", `Hi ${userInfo.name}! Ask me anything about MBA or PGDM.`);
    } catch (error) {
      console.error("User save failed", error);
      alert("Something went wrong while saving your info.");
    }
  };
  
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-15 sm:bottom-20 right-10 text-sm bg-red-50 border border-red-700 text-red-800 rounded-full px-4 py-3 cursor-pointer z-[999] shadow-2xl"
        
      >
        Ask Anything
      </button>

      {open && (
        <div className="fixed bottom-30 sm:bottom-40 right-10 sm:right-20 w-[320px] sm:w-[360px] bg-white rounded-lg shadow-xl flex flex-col z-[999] overflow-hidden max-h-screen">
          <div className="bg-red-700 text-center py-2.5 text-white" >
            MBAROI - AI Chatbot
          </div>

          {!started ? (
            <div style={{ padding: 20 }}>
              <p className="text-sm mb-4">Hi! Before starting the chat provide us some information about yourself</p>
              <input placeholder="Name" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} className="border border-gray-300 p-2 w-full rounded-sm" />
              <input placeholder="Email" type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} className="border border-gray-300 p-2 mt-3 w-full rounded-sm" />
              <input placeholder="Mobile" type="tel" value={userInfo.mobile} onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })} className="border border-gray-300 p-2 mt-3 w-full rounded-sm" />
              <button onClick={handleStartChat} className="border border-red-100 bg-red-50 w-full rounded-sm mt-4 mb-4 text-red-700 hover:bg-red-700 hover:text-white py-1 transition ease-in-out 3s">Start Chat</button>
            </div>
          ) : (
            <>
              <div ref={chatboxRef} style={{ padding: 10, overflowY: "auto", height: 400, backgroundColor: "white", flexGrow: 1 }}>
                <p className="text-sm text-center">Here are some information you might intersted</p>
                <div className="grid-cols-2 grid gap-1 mt-2 mb-4">
                  <Link href={`https://mbaroi.in/mba-roi-calculator/`} className="text-xs p-1 bg-red-50 text-red-800 rounded-full text-center">MBAROI Calculator</Link>
                  <Link href={`https://mbaroi.in/blog/gd-topics/`} className="text-xs p-1 bg-red-50 text-red-800 rounded-full text-center">GD Topics</Link>
                  <Link href={`https://mbaroi.in/cat/cat-all-previous-year-papers/`} className="text-xs p-1 bg-red-50 text-red-800 rounded-full text-center">Previous papers</Link>
                  <Link href={`https://mbaroi.in/about-cat-exam/`} className="text-xs p-1 bg-red-50 text-red-800 rounded-full text-center">CAT Exam Updates</Link>
                </div>
                <div style={{ 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "flex-start" // default
}}>
  {chatHistory.map((msg, i) => (
    <div
      key={i}
      style={{
        backgroundColor: msg.sender === "user" ? "#fef2f2" : "#fff",
        color: "black",
        padding: "10px 15px",
        margin: "8px 0",
        maxWidth: "80%",
        borderRadius: "18px",
        border: msg.sender === "user" ? "1px solid #fef2f2" : "1px solid #e5e7eb",
        display: "flex",
        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
        borderBottomRightRadius: msg.sender === "user" ? 0 : "18px",
        borderBottomLeftRadius: msg.sender === "bot" ? 0 : "18px",
        fontSize: "12px",
      }}
    >
      {msg.text}
    </div>
  ))}
  {loading && (
  <div
    style={{
      backgroundColor: "#fff",
      color: "black",
      padding: "10px 15px",
      margin: "8px 0",
      maxWidth: "80%",
      borderRadius: "18px",
      border: "1px solid #e5e7eb",
      alignSelf: "flex-start",
      fontSize: "12px",
      fontStyle: "italic",
    }}
  >
    Typing...
  </div>
)}
</div>
</div>

              <div style={{ display: "flex", padding: 10, gap: 8 }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about MBA or PGDM..." className="border w-4/5 text-sm border-gray-300 p-2 rounded-sm focus:border-gray-300" />
                <button onClick={handleSend} className="w-1/4 bg-red-50 flex items-center text-red-700 px-8 border rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" 
       viewBox="0 0 24 24" className="w-5 h-5 ">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
