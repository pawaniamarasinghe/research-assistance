import React, { useState } from 'react';
import { DashboardTemplate } from './components/templates/DashboardTemplate';
import { FileUploader } from './components/molecules/FileUploader';
import { SummaryPanel } from './components/organisms/SummaryPanel';
import { ChatWindow } from './components/organisms/ChatWindow';

function App() {
  const [summary, setSummary] = useState("Please upload a research PDF to process the automated analytical structural summary template.");
  
  // Creates a stable session token base identifier
  const [sessionToken] = useState(() => `session_${Date.now()}`);
  
  // This version number acts as a toggle signal to tell the chat window to empty its array
  const [docVersion, setDocVersion] = useState(0);

  const handleUploadSuccess = (extractedSummary) => {
    setSummary(extractedSummary);
    // Incrementing this notifies the ChatWindow that a completely new paper is active
    setDocVersion(prev => prev + 1);
  };

  return (
    <DashboardTemplate
      uploader={
        <FileUploader 
          sessionId={sessionToken} 
          onUploadSuccess={handleUploadSuccess} 
        />
      }
      summaryPanel={<SummaryPanel summary={summary} />}
      chatWindow={<ChatWindow docVersion={docVersion} sessionId={sessionToken} />}
    />
  );
}

export default App;