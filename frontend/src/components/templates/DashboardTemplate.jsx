import React from 'react';

export const DashboardTemplate = ({ uploader, summaryPanel, chatWindow }) => {
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🔬 AI Research Assistant</h1>
          <p className="text-sm text-gray-500">Upload documents to extract templates, parse vectors locally, and query your isolated RAG environment.</p>
        </header>

        <section>{uploader}</section>
        
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>{summaryPanel}</div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">💬 Chat Q&A Playground</h2>
            {chatWindow}
          </div>
        </main>
      </div>
    </div>
  );
};