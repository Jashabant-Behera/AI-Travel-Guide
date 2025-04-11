"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { toast } from "react-hot-toast";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await response.json();

      if (data?.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        toast.error("Bot did not respond.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-header">AI Travel Chatbot</h2>
      <div ref={chatRef} className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatbot-message-container ${
              msg.sender === "user" ? "user-msg" : "bot-msg"
            }`}
          >
            <div
              className={`chatbot-message-bubble ${
                msg.sender === "user" ? "user-bubble" : "bot-bubble"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="chatbot-thinking">Thinking...</div>}
      </div>
      <div className="chatbot-input-container">
        <input
          placeholder="Ask me about travel, culture, or food..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chatbot-input"
        />
        <button onClick={handleSend} disabled={loading} className="chatbot-send-button">
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
