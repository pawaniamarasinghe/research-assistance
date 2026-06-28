import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

export const FileUploader = ({ sessionId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading, success

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

      if (!response.ok) throw new Error("Upload process failed");

      const data = await response.json();
      onUploadSuccess(data.summary);
      setStatus("success");
    } catch (error) {
      alert("Error sending file to server. Verify your FastAPI backend is running.");
      setStatus("idle");
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-3">
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange} 
        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      {file && <p className="text-xs text-gray-600">📄 Selected paper: <strong>{file.name}</strong></p>}
      
      {status === "loading" ? (
        <LoadingSpinner message="Extracting text chunks & downloading embeddings model locally..." />
      ) : (
        <Button onClick={handleUpload} disabled={!file}>
          {status === "success" ? "Analysis Finished! Upload New File" : "Upload & Run Analysis"}
        </Button>
      )}
    </div>
  );
};