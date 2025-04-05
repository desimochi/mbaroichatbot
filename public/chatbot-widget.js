(function () {
  const style = document.createElement("style");
  style.textContent = `
    .chatbot-toggle-btn {
      position: fixed;
      bottom: 80px;
      right: 40px;
      background: #fef2f2;
      border: 1px solid #b91c1c;
      color: #b91c1c;
      border-radius: 9999px;
      padding: 12px 16px;
      font-size: 14px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .chatbot-box {
      position: fixed;
      bottom: 150px;
      right: 40px;
      width: 350px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      z-index: 9999;
      font-family: sans-serif;
    }
    .chatbot-header {
      background: #b91c1c;
      color: white;
      padding: 10px;
      text-align: center;
      font-weight: bold;
    }
    .chatbot-body {
      padding: 10px;
      overflow-y: auto;
      flex-grow: 1;
      background: white;
      max-height: 400px;
    }
    .chatbot-message {
      font-size: 12px;
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 18px;
      max-width: 80%;
    }
    .chatbot-message.user {
      background: #fef2f2;
      align-self: flex-end;
    }
    .chatbot-message.bot {
      background: #f9fafb;
      align-self: flex-start;
    }
    .chatbot-footer {
      display: flex;
      padding: 10px;
      gap: 8px;
    }
    .chatbot-footer input {
      flex: 1;
      padding: 8px;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid #d1d5db;
    }
    .chatbot-footer button {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #b91c1c;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .chatbot-form input {
      margin-bottom: 8px;
      width: 100%;
      padding: 8px;
      font-size: 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
    }
    .chatbot-form button {
      width: 100%;
      background: #fef2f2;
      color: #b91c1c;
      padding: 6px;
      border: 1px solid #b91c1c;
      border-radius: 4px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "chatbot-toggle-btn";
  toggleBtn.textContent = "Ask Anything";
  document.body.appendChild(toggleBtn);

  const chatbot = document.createElement("div");
  chatbot.className = "chatbot-box";
  chatbot.style.display = "none";

  chatbot.innerHTML = `
    <div class="chatbot-header">MBAROI - AI Chatbot</div>
    <div class="chatbot-body" id="chatBody">
      <div id="chatMessages" style="display: flex; flex-direction: column;"></div>
    </div>
    <div id="chatForm" style="padding: 10px;">
      <form class="chatbot-form">
        <input type="text" placeholder="Name" name="name" required />
        <input type="email" placeholder="Email" name="email" required />
        <input type="tel" placeholder="Mobile" name="mobile" required />
        <button type="submit">Start Chat</button>
      </form>
    </div>
    <div class="chatbot-footer" style="display: none;">
      <input type="text" placeholder="Ask about MBA or PGDM..." id="chatInput" />
      <button id="chatSendBtn">➤</button>
    </div>
  `;
  document.body.appendChild(chatbot);

  let userInfo = null;
  const messages = [];

  const addMessage = (sender, text) => {
    const msg = document.createElement("div");
    msg.className = `chatbot-message ${sender}`;
    msg.textContent = text;
    document.getElementById("chatMessages").appendChild(msg);
    document.getElementById("chatBody").scrollTop = document.getElementById("chatBody").scrollHeight;
  };

  const handleBotReply = async (input) => {
    messages.push({ role: "user", content: input });
    const res = await fetch("https://mbaroichatbot.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json();
    messages.push({ role: "assistant", content: data.reply });
    addMessage("bot", data.reply);

    fetch("https://mbaroichatbot.vercel.app/api/saveMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        message: input,
      }),
    });
  };

  toggleBtn.addEventListener("click", () => {
    chatbot.style.display = chatbot.style.display === "none" ? "flex" : "none";
  });

  chatbot.querySelector(".chatbot-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const mobile = form.mobile.value;

    if (!name || !email || !mobile) return alert("Please fill all fields.");

    userInfo = { name, email, mobile };
    await fetch("https://mbaroichatbot.vercel.app/api/saveUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });

    document.getElementById("chatForm").style.display = "none";
    chatbot.querySelector(".chatbot-footer").style.display = "flex";
    addMessage("bot", `Hi ${name}! Ask me anything about MBA or PGDM.`);
  });

  document.getElementById("chatSendBtn").addEventListener("click", () => {
    const inputEl = document.getElementById("chatInput");
    const input = inputEl.value.trim();
    if (!input) return;
    inputEl.value = "";
    addMessage("user", input);
    handleBotReply(input);
  });
})();
