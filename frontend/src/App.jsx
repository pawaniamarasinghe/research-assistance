import React, { useState, useMemo } from 'react';
import { DashboardTemplate } from './components/templates/DashboardTemplate';
import { FileUploader } from './components/molecules/FileUploader';
import { SummaryPanel } from './components/organisms/SummaryPanel';
import { ChatWindow } from './components/organisms/ChatWindow';

function App() {
  const [summary, setSummary] = useState("Please upload a research PDF to process the automated analytical structural summary template.");
  
  // Creates an isolated session per browser load
  const sessionToken = useMemo(() => `session_${Date.now()}`, []);

  return (
    <DashboardTemplate
      uploader={<FileUploader sessionId={sessionToken} onUploadSuccess={(val) => setSummary(val)} />}
      summaryPanel={<SummaryPanel summary={summary} />}
      chatWindow={<ChatWindow sessionId={sessionToken} />}
    />
  );
}

export default App;