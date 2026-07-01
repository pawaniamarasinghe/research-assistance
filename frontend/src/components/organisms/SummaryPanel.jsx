import React from 'react';

// Specialized markdown formatter for the structured extraction summary fields
const formatSummaryText = (text) => {
  if (!text) return "";

  let formatted = text;

  // 1. Convert Markdown headers (### Subheader) into glowing cyber subtitles
  formatted = formatted.replace(/^### (.*)$/gm, '<h3 class="text-blue-400 font-extrabold tracking-wider text-[11px] uppercase mt-6 mb-2 border-b border-slate-900 pb-1">$1</h3>');

  // 2. Format inline bold labels (**Label:**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-200 font-bold">$1</strong>');

  // 3. Convert raw list dash characters (- Subitem) into beautifully padded grid points
  formatted = formatted.replace(/^\s*[\*\-]\s+(.*)$/gm, '<div class="pl-4 py-1 text-slate-300 flex items-start gap-2 text-[11px] leading-relaxed"><span class="text-blue-500">•</span><span>$1</span></div>');

  // 4. Wrap lingering unformatted plain paragraph lines into legible text rows
  const blocks = formatted.split('\n');
  const processedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (trimmed && !trimmed.startsWith('<h3') && !trimmed.startsWith('<div')) {
      return `<p class="text-[11px] text-slate-400 leading-relaxed my-2 pl-1">${trimmed}</p>`;
    }
    return block;
  });

  return processedBlocks.join('\n');
};

export const SummaryPanel = ({ summary }) => {
  return (
    <div className="w-full border border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-md shadow-2xl p-6 select-text">
      {/* Container Header Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Structured Template Extraction
        </h2>
      </div>

      {/* Main Dynamically Parsed Output Panel Content */}
      <div 
        className="space-y-2 text-[11px] text-slate-300 antialiased tracking-wide no-underline text-decoration-none"
        dangerouslySetInnerHTML={{ __html: formatSummaryText(summary) }}
      />
    </div>
  );
};