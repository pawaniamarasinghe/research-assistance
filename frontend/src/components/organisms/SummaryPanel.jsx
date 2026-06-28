import React from 'react';
import { BookOpen } from 'lucide-react';

export const SummaryPanel = ({ summary }) => {
  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden backdrop-blur-md shadow-2xl">
      <div className="p-4 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Structured Template Extraction</h2>
        </div>
        <BookOpen size={16} className="text-blue-500" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-300 font-sans text-xs leading-relaxed">
        {summary.includes("Please upload") ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-center px-4">
            {summary}
          </div>
        ) : (
          <div className="space-y-4">
            {summary.split('###').map((section, idx) => {
              if (!section.trim()) return null;
              const lines = section.split('\n');
              const heading = lines[0].trim();
              const body = lines.slice(1).join('\n').trim();

              return (
                <div key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 space-y-2">
                  <h3 className="font-bold text-blue-400 tracking-wide uppercase text-[11px]">• {heading}</h3>
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line text-[12px]">{body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};