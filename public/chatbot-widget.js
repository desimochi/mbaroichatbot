(function () {
  const style = document.createElement("style");
  style.textContent = `
  .chatbot-toggle-btn {
    position: fixed;
    bottom: 60px;
    right: 80px;
    background: #fef2f2;
    border: 1px solid #b91c1c;
    color: #b91c1c;
    border-radius: 9999px;
    padding: 14px 20px;
    font-size: 16px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .chatbot-box {
    position: fixed;
    bottom: 140px;
    right: 80px;
    width: 400px;
    max-height: 480px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    z-index: 9999;
    font-family: sans-serif;
  }
  .initial{
     font-size: 14px
  }
  .chatbot-header {
    background: #b91c1c;
    color: white;
    padding: 16px;
    text-align: center;
    font-size: 18px;
  }

  .chatbot-body {
    padding: 10px;
    overflow-y: auto;
    flex-grow: 1;
    background: white;
  }

  .chatbot-message {
    font-size: 14px;
    margin-bottom: 10px;
    padding: 10px 14px;
    border-radius: 18px;
    max-width: 85%;
    word-wrap: break-word;
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
    padding: 12px;
    gap: 8px;
    background: white;
    border-top: 1px solid #e5e7eb;
  }

  .chatbot-footer input {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    margin-bottom: 8px;
  }

  .chatbot-footer button {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #b91c1c;
    padding: 6px 10px;
    border-radius: 6px;
    
  }

  .chatbot-form input {
    margin-bottom: 10px;
    width: 100%;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
  }

  .chatbot-form button {
    width: 100%;
    background: #fef2f2;
    color: #b91c1c;
    padding: 10px;
    border: 1px solid #b91c1c;
    border-radius: 6px;
    cursor: pointer;
    margin-top:20px;
    margin-bottom:20px;
    font-size: 14px;
  }


    @media (min-width: 420px) and (max-width: 767px) {
    .chatbot-box {
      bottom: 140px;
      right: 20px;
      width: 380px;
      height: 480px;
      border-radius: 12px;
    }
      .chatbot-toggle-btn{
      right: 10px;
      }
    
  }
       @media (min-width: 360px) and (max-width: 415px) {
  .chatbot-box {
    width: 350px;
    height: 480px;
    right:20px;
    bottom: 140px;
    border-radius: 12px;
  }
    .chatbot-toggle-btn{
      right: 20px;
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
      <p class="initial">Hi! Before starting the chat provide us some information about yourself</p>
      <div id="chatMessages" style="display: flex; flex-direction: column;"></div>
    </div>
    <div id="chatForm" style="padding: 10px;">
      <form class="chatbot-form">
        <input type="text" placeholder="Name" name="name" required />
        <input type="email" placeholder="Email" name="email" required />
        <input
  type="tel"
  placeholder="Mobile"
  name="mobile"
  pattern="\d{10}"
  maxlength="10"
  minlength="10"
  required
  inputmode="numeric"
/>
        <button type="submit">Start Chat</button>
      </form>
    </div>
    <div class="chatbot-footer" style="display: none;">
      <input type="text" placeholder="Ask about MBA or PGDM..." id="chatInput" />
      <button id="chatSendBtn">➤</button>
    </div>
  `;
  const mobileInput = chatbot.querySelector('input[name="mobile"]');

mobileInput.addEventListener("input", function () {
  // Remove anything that is not a digit and limit to 10 numbers
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
});
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
