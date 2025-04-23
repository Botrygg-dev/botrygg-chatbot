import { useState, useEffect, useRef } from 'react';
import React from 'react';
export default function ChatDemo() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hej! Hur kan jag hjälpa dig idag?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      const botReply = data.reply || "Jag kunde tyvärr inte hitta något svar just nu.";
      const botMessage = { from: "bot", text: botReply };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { from: "bot", text: "Något gick fel." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ height: 400, overflowY: 'auto', border: '1px solid #ccc', padding: 10, borderRadius: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'bot' ? 'left' : 'right', marginBottom: 5 }}>
            <div style={{ background: msg.from === 'bot' ? '#f0f0f0' : '#d0eaff', display: 'inline-block', padding: '8px 12px', borderRadius: 8 }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Skriv din fråga här..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Skickar..." : "Skicka"}
        </button>
      </div>
    </div>
  );
}
