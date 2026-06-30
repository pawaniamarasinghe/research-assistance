import React from 'react';

export const DashboardTemplate = ({ uploader, summaryPanel, chatWindow }) => {
  return (
    <div className="w-screen min-h-screen bg-[#070b14] text-slate-200 antialiased font-sans flex flex-col relative overflow-x-hidden select-none">
      
      {/* Dynamic Background ambient color nodes */}
      <div className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* 🚀 FIXED HEADER WRAPPER (Guaranteed to stay visible under all CDN scripts) */}
      <header className="w-full block relative z-50 h-20 min-h-[80px] px-8 border-b border-slate-900/80 bg-[#070b14]/80 backdrop-blur-xl shadow-lg shadow-black/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-extrabold tracking-widest uppercase bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
            Research Workspace
          </h1>
          <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 bg-blue-950/50 border border-blue-500/30 text-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.15)] flex items-center justify-center h-5">
            ⚙️ RAG Enabled
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center justify-center h-8 px-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-400 select-none shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-2"></span>
            Oxhsl...hsFG5
          </div>
        </div>
      </header>

      {/* Core Body Workspace Modules */}
      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-start px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        
        {/* File Upload Area */}
        <section className="max-w-xl mx-auto w-full block">
          {uploader}
        </section>
        
        {/* Main Workspaces Layout Splitting */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">
          <div className="w-full block">
            {summaryPanel}
          </div>
          <div className="flex flex-col w-full block">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">
              Context Query Hub
            </h2>
            {chatWindow}
          </div>
        </main>
      </div>

    </div>
  );
};