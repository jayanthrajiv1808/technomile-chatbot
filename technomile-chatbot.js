class TechnoMileChatbot {
  constructor() {
    this.init();
  }

  init() {
    this.injectStyles();
    this.createChatWidget();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
      .tm-chatbot {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background-color: #002855;
        color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      .tm-chat-header {
        background-color: #00509e;
        padding: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
      .tm-chat-body {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #f4f4f4;
        color: #000;
      }
      .tm-chat-input {
        display: flex;
        padding: 10px;
        background: #fff;
      }
      .tm-chat-input input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .tm-chat-input button {
        margin-left: 5px;
        padding: 8px;
        background-color: #00509e;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
      .tm-chat-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #00509e;
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  createChatWidget() {
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("tm-chatbot");
    chatContainer.innerHTML = `
      <div class="tm-chat-header">TechnoMile Assistant</div>
      <div class="tm-chat-body" id="tm-chat-body"></div>
      <div class="tm-chat-input">
        <input type="text" id="tm-user-input" placeholder="Ask a question..." />
        <button onclick="sendMessage()">Send</button>
      </div>
    `;
    document.body.appendChild(chatContainer);
    
    const toggleButton = document.createElement("div");
    toggleButton.classList.add("tm-chat-toggle");
    toggleButton.innerText = "💬";
    toggleButton.onclick = () => {
      chatContainer.style.display = chatContainer.style.display === "none" ? "flex" : "none";
    };
    document.body.appendChild(toggleButton);
  }
}

function sendMessage() {
  const inputField = document.getElementById("tm-user-input");
  const message = inputField.value.trim();
  if (!message) return;
  
  const chatBody = document.getElementById("tm-chat-body");
  chatBody.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  inputField.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
  
  fetchZendeskArticles(message);
}

async function fetchZendeskArticles(query) {
  const chatBody = document.getElementById("tm-chat-body");
  chatBody.innerHTML += `<div><strong>Assistant:</strong> Searching TechnoMile Help Center...</div>`;
  
  try {
    const response = await fetch(`https://success.technomile.com/api/v2/help_center/articles/search.json?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.articles.length > 0) {
      chatBody.innerHTML += `<div><strong>Assistant:</strong> Here are some relevant articles:</div>`;
      data.articles.slice(0, 3).forEach(article => {
        chatBody.innerHTML += `<div><a href="${article.html_url}" target="_blank">${article.title}</a></div>`;
      });
    } else {
      fetchChatbotResponse(query);
    }
  } catch (error) {
    chatBody.innerHTML += `<div><strong>Assistant:</strong> Unable to fetch articles. Proceeding with AI response...</div>`;
    fetchChatbotResponse(query);
  }
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function fetchChatbotResponse(query) {
  const chatBody = document.getElementById("tm-chat-body");
  chatBody.innerHTML += `<div><strong>Assistant:</strong> Thinking...</div>`;
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer yeAtBsjhsEUO8kLJTNkEac01pGuURhoTQ6Gwj6Hv"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: query }],
    })
  });
  
  const data = await response.json();
  const reply = data.choices[0].message.content;
  chatBody.innerHTML += `<div><strong>Assistant:</strong> ${reply}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}

new TechnoMileChatbot();
