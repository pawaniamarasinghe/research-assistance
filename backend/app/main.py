from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil

# Ensure this exact line matches your file layout
from app.rag_chain import AbstractIQ

app = FastAPI()

# Allow frontend ports to fetch from Python securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatRequest(BaseModel):
    message: str
    session_id: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), session_id: str = "default_user"):    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        print(f"🚀 [DEBUG] Starting PDF processing for session: {session_id}")
        AbstractIQ.process_pdf(file_path, session_id)
        
        print("🚀 [DEBUG] PDF processed successfully. Generating summary...")
        summary = AbstractIQ.generate_summary(file_path)
        
        print("🚀 [DEBUG] Summary generated successfully!")
        return {"summary": summary, "filename": file.filename}
    except Exception as e:
        # 🎯 THIS LINE WILL FORCE THE TRUE CRASH REASON TO PRINT IN YOUR TERMINAL
        import traceback
        print("\n❌ ❌ [BACKEND CRASH TRACEBACK] ❌ ❌")
        traceback.print_exc() 
        print("❌ ❌ ------------------------- ❌ ❌\n")
        
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        answer = AbstractIQ.ask_question(request.message, request.session_id)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))