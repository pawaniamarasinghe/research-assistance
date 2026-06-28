import React from 'react';

export const DashboardTemplate = ({ uploader, summaryPanel, chatWindow }) => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 antialiased font-sans flex relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Workspace Area (No left sidebar) */}
      <div className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        
        {/* Simplified Header */}
        <header className="p-6 border-b border-slate-900 bg-[#070b14]/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Research Workspace
            </h1>
            <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 bg-blue-950/40 border border-blue-800/40 text-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.1)]">
              ⚙️ RAG Enabled
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-1"></span>
            Oxhsl...hsFG5
          </div>
        </header>

        {/* Content Layout Grid */}
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* File Upload Module */}
          <section className="max-w-xl mx-auto w-full">{uploader}</section>
          
          {/* Main Panels Split-screen */}
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>{summaryPanel}</div>
            <div className="flex flex-col">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">
                Context Query Hub
              </h2>
              {chatWindow}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
};