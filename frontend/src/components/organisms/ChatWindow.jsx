import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from '../molecules/ChatInput';

export const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const promptToSend = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptToSend, session_id: sessionId }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "Unable to find context. Please confirm the document has been analyzed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-24 text-sm font-medium">
            💬 RAG Session Active. Type a query to search document contexts.
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-[80%] text-sm ${m.role === 'user' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-800'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-gray-400 animate-pulse italic">Llama is analyzing vectors...</div>}
        <div ref={scrollRef} />
      </div>
      <ChatInput value={input} onChange={(e) => setInput(e.target.value)} onSubmit={handleSend} disabled={isTyping} />
    </div>
  );
};