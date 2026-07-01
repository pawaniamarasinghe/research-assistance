import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Disc } from 'lucide-react';

// 📂 Look at the top of src/components/organisms/ChatWindow.jsx
const formatBotResponse = (text) => {
  if (!text) return "";
  
  let formatted = text;

  // 1. 🚀 STAMP OUT ASCII REPETITIVE ACCENT BARS (====== or ------ strings)
  // This catches any sequence of 3 or more repeated dashes, equals, or underscores 
  // and turns them into a clean, modern HTML border element.
  formatted = formatted.replace(/^[=\-_]{3,}$/gm, '<hr class="border-t border-slate-800/80 my-3 w-full" />');

  // 2. Force remove all text decorations/underlines globally
  formatted = `<div class="no-underline text-decoration-none list-none select-text">${formatted}</div>`;

  // 3. Parse Markdown Tables (lines starting/containing '|')
  const lines = formatted.split('\n'); // Parse out using the initial clean up layout
  let inTable = false;
  let tableHtml = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('|') && line.endsWith('|')) {
      if (line.includes('---') || line.includes('-:-')) {
        continue;
      }
      
      if (!inTable) {
        inTable = true;
        tableHtml += '<div class="overflow-x-auto my-3 border border-slate-800 rounded-xl bg-slate-950/60 shadow-inner"><table class="w-full text-[11px] text-left border-collapse">';
      }
      
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      tableHtml += '<tr class="border-b border-slate-900 hover:bg-slate-900/30 transition">';
      cells.forEach(cell => {
        if (!tableHtml.includes('<\/th>') && !tableHtml.includes('<\/td>')) {
          tableHtml += `<th class="p-2.5 bg-slate-900/80 font-bold text-blue-400 border-r border-slate-900">${cell}</th>`;
        } else {
          tableHtml += `<td class="p-2.5 text-slate-300 border-r border-slate-900">${cell}</td>`;
        }
      });
      tableHtml += '</tr>';
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</table></div>';
        formatted = formatted.replace(lines.slice(0, i).join('\n'), tableHtml);
      }
    }
  }
  if (inTable) {
    tableHtml += '</table></div>';
  }

  // 4. Render bold structures (**text**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400 font-bold no-underline">$1</strong>');
  
  // 5. Clean up standard list bullets (- or *)
  formatted = formatted.replace(/^\s*[\*\-]\s+(.*)$/gm, '<div class="pl-4 py-0.5 text-slate-300 flex items-start gap-2 no-underline"><span>•</span><span>$1</span></div>');

  return tableHtml || formatted;
};

export const ChatWindow = ({ sessionId, docVersion, isDocUploaded }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const shortcutChips = [
    "Identify Problem Statement",
    "Verify Methodology",
    "Extract Key Results",
    "Compare Conclusions"
  ];

  useEffect(() => {
    const cached = sessionStorage.getItem(`chat_cache_${sessionId}`);
    if (cached) {
      setMessages(JSON.parse(cached));
    } else {
      setMessages([]);
    }
    setInput("");
  }, [sessionId, docVersion]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`chat_cache_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!isDocUploaded) {
      setMessages(prev => [...prev, 
        { role: "user", text: query },
        { role: "assistant", text: "⚠️ AbstractIQ has no document source of truth for this active session node. Please upload a PDF file first to map vector sequences." }
      ]);
      if (!textToSend) setInput("");
      return;
    }

    const updatedUserMessages = [...messages, { role: "user", text: query }];
    setMessages(updatedUserMessages);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, session_id: sessionId }),
      });
      const data = await response.json();
      
      const absoluteUpdatedMessages = [...updatedUserMessages, { role: "assistant", text: data.answer }];
      setMessages(absoluteUpdatedMessages);
      sessionStorage.setItem(`chat_cache_${sessionId}`, JSON.stringify(absoluteUpdatedMessages));
    } catch (error) {
      setMessages([...updatedUserMessages, { role: "assistant", text: "Error syncing with vector stream." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-md shadow-2xl overflow-hidden select-text">
      
      {/* Message window panel layer */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/10 no-underline text-decoration-none">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="p-3 bg-blue-950/30 border border-blue-900/40 text-blue-500 rounded-2xl mb-3 relative">
              <Cpu size={22} className="animate-pulse" />
              <Disc size={10} className="absolute -top-0.5 -right-0.5 text-indigo-400 animate-spin" />
            </div>
            <p className="text-xs font-bold tracking-wider text-slate-300 uppercase no-underline">AbstractIQ Agent</p>
            <p className="text-[10px] text-slate-500 mt-1 mb-4 max-w-xs no-underline">
              {!isDocUploaded 
                ? "Waiting for document synchronization..." 
                : "Query document nodes using live vector matches."}
            </p>
            
            {isDocUploaded && (
              <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
                {shortcutChips.map((chip, i) => (
                  <button key={i} onClick={() => handleSend(chip)} className="px-2.5 py-2 bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded-xl transition text-left truncate no-underline">
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} no-underline`}>
            {m.role === 'user' ? (
              <div className="p-3 rounded-2xl max-w-[80%] text-[11px] leading-relaxed tracking-wide shadow-md border bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-500/30 text-slate-200 rounded-br-none no-underline text-decoration-none">
                {m.text}
              </div>
            ) : (
              <div 
                className="p-3 rounded-2xl max-w-[95%] w-full sm:w-auto text-[11px] leading-relaxed tracking-wide shadow-md border bg-slate-950/70 border-slate-800 text-slate-300 rounded-bl-none whitespace-pre-line space-y-1 no-underline text-decoration-none"
                dangerouslySetInnerHTML={{ __html: formatBotResponse(m.text) }}
              />
            )}
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-blue-400 italic animate-pulse pl-1">AbstractIQ is analyzing context nodes...</div>}
        <div ref={scrollRef} />
      </div>

      {/* Input container row controls */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-2.5 border-t border-slate-800/80 bg-slate-950/40 flex gap-2 items-center">
        <input 
          type="text"
          className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition placeholder-slate-600"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder={isDocUploaded ? "Ask about the document..." : "Please upload a document to unlock chat..."}
          disabled={!isDocUploaded && isTyping}
        />
        <button type="submit" disabled={isTyping || !input.trim()} className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/40 disabled:opacity-30 transition">
          <Send size={12} />
        </button>
      </form>
    </div>
  );
};