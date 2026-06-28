import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Disc } from 'lucide-react';

// Helper function to turn Markdown text into styled HTML elements safely
const formatBotResponse = (text) => {
  if (!text) return "";
  
  // Clean bold highlights (**text**)
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400 font-bold">$1</strong>');
  
  // Clean lists/bullet points (* text)
  formatted = formatted.replace(/^\s*[\*\-]\s+(.*)$/gm, '<div class="pl-4 py-0.5 text-slate-300 flex items-start gap-2"><span>•</span><span>$1</span></div>');
  
  // Clean structural paragraph spacing
  return formatted;
};

export const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const shortcutChips = [
    "Identify Problem Statement",
    "Verify Methodology",
    "Extract Key Results",
    "Compare Conclusions",
    "Find Vector Clusters",
    "Explore Citations"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: query }]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, session_id: sessionId }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "Error syncing with vector stream." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-md shadow-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="p-4 bg-blue-950/30 border border-blue-900/40 text-blue-500 rounded-2xl mb-4 relative shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <Cpu size={32} className="animate-pulse" />
              <Disc size={12} className="absolute -top-1 -right-1 text-indigo-400 animate-spin" />
            </div>
            <p className="text-sm font-bold tracking-wider text-slate-300 uppercase">AbstractIQ Agent</p>
            <p className="text-[11px] text-slate-500 mt-1 mb-6 max-w-xs">Query document index nodes directly using vector match sequences.</p>
            
            <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
              {shortcutChips.map((chip, i) => (
                <button key={i} onClick={() => handleSend(chip)} className="px-3 py-2 bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded-xl transition text-left truncate">
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="p-3.5 rounded-2xl max-w-[80%] text-[12px] leading-relaxed tracking-wide shadow-md border bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-500/30 text-slate-200 rounded-br-none">
                {m.text}
              </div>
            ) : (
              <div 
                className="p-3.5 rounded-2xl max-w-[80%] text-[12px] leading-relaxed tracking-wide shadow-md border bg-slate-950/70 border-slate-800 text-slate-300 rounded-bl-none whitespace-pre-line space-y-1"
                dangerouslySetInnerHTML={{ __init__ : false, __html: formatBotResponse(m.text) }}
              />
            )}
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-blue-400 italic animate-pulse">AbstractIQ is analyzing local embedding nodes...</div>}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex gap-2 items-center">
        <input 
          type="text"
          className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition placeholder-slate-600"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="What is this paper about?"
        />
        <button type="submit" disabled={isTyping || !input.trim()} className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/40 hover:text-blue-300 disabled:opacity-30 transition">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};