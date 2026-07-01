import React from 'react';
import { History, Plus, MessageSquare } from 'lucide-react';

export const DashboardTemplate = ({ 
  uploader, 
  summaryPanel, 
  chatWindow, 
  sessions, 
  activeSessionId, 
  onSelectSession,
  onNewSession 
}) => {
  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#070b14', color: '#e2e8f0', display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      
      {/* Sidebar Panel Layout */}
      <aside style={{ width: '256px', minWidth: '256px', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#040810', borderRight: '1px solid #0f172a', zIndex: 50 }}>
        
        {/* HIGH-VISIBILITY ACTION HEADER */}
        <div style={{ height: '64px', minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #1e293b' }}>
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <History size={12} className="text-blue-500" />
            <span>Workspace Logs</span>
          </div>
          
          {/* 🔥 Glowing, high-contrast action button */}
          <button 
            onClick={onNewSession}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95"
            title="Start a brand new chat context"
          >
            <Plus size={12} strokeWidth={3} />
            <span>New</span>
          </button>
        </div>

        {/* Saved Session Channels */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {sessions.length === 0 ? (
            <div className="text-[10px] text-slate-600 italic p-4 text-center mt-6 leading-relaxed">
              No index tracks cached yet. Drop a file to start.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  style={{ display: 'flex', width: '100%', alignItems: 'start', gap: '10px', padding: '10px', marginBottom: '6px' }}
                  className={`rounded-xl text-left transition border ${
                    isActive 
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.05)]' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900/40 hover:text-slate-300'
                  }`}
                >
                  <MessageSquare size={13} className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate tracking-wide leading-tight">{session.name}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        
        {/* Global Header Element */}
        <header style={{ height: '64px', minHeight: '64px', maxHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid #0f172a', backgroundColor: '#070b14', relative: 'true', zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Research Workspace
            </h1>
            <span className="text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 bg-blue-950/40 border border-blue-800/40 text-blue-400 rounded-full">
              ⚙️ Multi-Session Cache V2
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-[9px] bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-1.5"></span>
            Node ID: {activeSessionId.split('_')[1] || "idle"}
          </div>
        </header>

        {/* Scroll Body Panels Frame */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section style={{ maxWidth: '576px', margin: '0 auto', width: '100%' }}>{uploader}</section>
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
              <div className="w-full block">{summaryPanel}</div>
              <div className="flex flex-col w-full">{chatWindow}</div>
            </main>
          </div>
        </div>

      </div>
    </div>
  );
};