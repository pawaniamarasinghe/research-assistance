import React, { useState } from 'react';
import { DashboardTemplate } from './components/templates/DashboardTemplate';
import { FileUploader } from './components/molecules/FileUploader';
import { SummaryPanel } from './components/organisms/SummaryPanel';
import { ChatWindow } from './components/organisms/ChatWindow';

function App() {
  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState("");
  const [docVersion, setDocVersion] = useState(0);
  
  // Unique identification string constructor for new isolated nodes
  const generateNewSessionId = () => `session_${Date.now()}`;
  const [activeSessionId, setActiveSessionId] = useState(() => generateNewSessionId());

  // Calculates if a document is already linked to the current active log segment
  const isDocUploaded = sessions.some(s => s.id === activeSessionId);

  // Executed by FileUploader on a successful 200 pipeline completion from Python
  const handleUploadSuccess = (extractedSummary, filename) => {
    setSummary(extractedSummary);
    setDocVersion(prev => prev + 1);

    setSessions(prev => {
      const exists = prev.find(s => s.id === activeSessionId);
      if (exists) return prev;
      return [...prev, {
        id: activeSessionId,
        name: filename || `Paper Index #${prev.length + 1}`,
        summary: extractedSummary
      }];
    });
  };

  // Restores a historical cache node when clicked from the Workspace Sidebar list
  const handleSelectSession = (session) => {
    setActiveSessionId(session.id);
    setSummary(session.summary);
    setDocVersion(prev => prev + 1);
  };

  // Triggers a complete layout reset for a brand new, empty workspace target run
  const handleStartNewSession = () => {
    const newId = generateNewSessionId();
    setActiveSessionId(newId);
    setSummary(""); // Clear out central panels to prepare for the new upload
    setDocVersion(prev => prev + 1);
  };

  return (
    <DashboardTemplate
      sessions={sessions}
      activeSessionId={activeSessionId}
      onSelectSession={handleSelectSession}
      onNewSession={handleStartNewSession}
      
      // 🛠️ Feature 1: Hides drag/drop selector box instantly once a document finishes parsing
      uploader={
        !isDocUploaded ? (
          <FileUploader 
            sessionId={activeSessionId} 
            onUploadSuccess={handleUploadSuccess} 
          />
        ) : (
          <div className="w-full text-center py-3 bg-emerald-950/20 border border-emerald-800/30 rounded-xl text-emerald-400 font-mono text-[10px] tracking-wide select-none shadow-md">
            🔒 Document index loaded into live session context layer.
          </div>
        )
      }
      
      summaryPanel={
        isDocUploaded ? (
          <SummaryPanel summary={summary} />
        ) : (
          <div className="p-6 border border-slate-900 bg-[#040810]/40 rounded-2xl text-center text-xs text-slate-500 italic mt-4">
            Upload a research PDF above to generate the structured extraction layout template.
          </div>
        )
      }
      
      // 🛠️ Feature 2: key={activeSessionId} forces an explicit component demounting 
      // when users hit "+ New Chat" or swap sessions, stopping cross-talk data leaks.
      chatWindow={
        <ChatWindow 
          key={activeSessionId} 
          sessionId={activeSessionId} 
          docVersion={docVersion} 
          isDocUploaded={isDocUploaded} 
        />
      }
    />
  );
}

export default App;