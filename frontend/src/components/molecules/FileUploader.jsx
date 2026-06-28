import React, { useState } from 'react';
import { Upload, File, HelpCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export const FileUploader = ({ sessionId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("loading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:8000/upload?session_id=${sessionId}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      onUploadSuccess(data.summary);
      setStatus("success");
    } catch (error) {
      alert("Error uploading file to python server.");
      setStatus("idle");
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center gap-4 w-full">
      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full group py-4">
        <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-blue-500 group-hover:text-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
          <Upload size={20} />
        </div>
        <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 mt-2">PDF UPLOAD</span>
        <span className="text-[10px] text-slate-500">Drag-and-drop to browser it files here</span>
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
      </label>

      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        <Button variant="secondary" onClick={() => document.querySelector('input[type="file"]').click()}>
          Browse Research PDF
        </Button>
        {file && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 max-w-xs truncate">
            <File size={14} className="text-blue-500" />
            <span className="truncate">{file.name}</span>
          </div>
        )}
      </div>

      <div className="w-full border-t border-slate-800/60 pt-4 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 tracking-wider">MAX SIZE 10MB • ACADEMIC FORMAT</span>
        {status === "loading" ? (
          <LoadingSpinner message="Extracting Contexts..." />
        ) : (
          <Button onClick={handleUpload} disabled={!file}>
            {status === "success" ? "Analyze Another" : "Parse & Run RAG"}
          </Button>
        )}
      </div>
    </div>
  );
};