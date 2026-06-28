import React from 'react';

export const SummaryPanel = ({ summary }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[550px]">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">📋 Structured Paper Summary</h2>
      <div className="flex-1 overflow-y-auto pr-2 prose text-sm text-gray-600 leading-relaxed whitespace-pre-line font-sans">
        {summary}
      </div>
    </div>
  );
};