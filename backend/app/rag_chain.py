import os
from dotenv import load_dotenv

# Load environment variables from the .env file dynamically
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq

class RAGAssistant:
    def __init__(self):
        # Explicit model initialization
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("⚠️ WARNING: GROQ_API_KEY could not be loaded from your .env file!")
            
        self.llm = ChatGroq(
            model="llama-3.1-8b-instant", 
            temperature=0.1, # Slightly elevated for fluent articulation while retaining factual accuracy
            groq_api_key=api_key
        )
        # Dictionary to store isolated vector stores per session
        self.vector_stores = {}

    def process_pdf(self, file_path: str, session_id: str):
        """Loads a PDF, splits text, and houses it in an isolated vector memory pool."""
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        # Optimized chunk size to capture better context details for the chat
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=250)
        splits = text_splitter.split_documents(docs)
        
        # Build vector store locally and isolate by session ID
        vector_store = FAISS.from_documents(splits, self.embeddings)
        self.vector_stores[session_id] = vector_store

    def generate_summary(self, file_path: str) -> str:
        """Generates a strictly structured, professionally formatted summary template."""
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        # Read slightly more text (up to first 3 pages) to prevent missing information
        full_text = " ".join([doc.page_content for doc in docs[:3]]) 

        summary_prompt = f"""
        You are an expert academic research analyst. Analyze the provided research paper text and generate a comprehensive, professional, structured template summary.
        
        CRITICAL FORMATTING RULES:
        1. You must use EXACTLY the markdown headings listed below. Do not alter them.
        2. Use bolding (**concept**) for key terms and organized paragraph breaks.
        3. Keep the content dense, deeply academic, informative, and beautifully clear.

        ### Title, Authors & Abstract
        - **Title:** [Extract full paper title]
        - **Authors:** [List all contributing authors]
        - **Core Focus:** [Provide a detailed 3-4 sentence academic breakdown of the abstract focus]
        
        ### Problem Statement
        [Detail the specific real-world or theoretical problem, limitation, or gap in research this paper addresses in a structured paragraph]
        
        ### Methodology
        - **Research Approach:** [Explain the core paradigm or architecture used]
        - **Data/Framework Setup:** [List the datasets, variables, tools, or logical parameters used]
        - **Execution Sequence:** [Briefly list the logical execution steps taken]
        
        ### Key Results
        - [Result 1 with explicit metrics, data points, or core breakthroughs discovered]
        - [Result 2 with explicit metrics, data points, or core breakthroughs discovered]
        
        ### Conclusion
        [Synthesize the final impact, core takeaways, and suggested future work outlined by the authors]

        Paper Content Material:
        {full_text}
        """
        response = self.llm.invoke(summary_prompt)
        return response.content

    def ask_question(self, question: str, session_id: str) -> str:
        """Queries the vector store and returns highly accurate, clean, markdown-formatted answers."""
        if session_id not in self.vector_stores:
            return "No document context found for this session. Please upload a PDF first."
            
        vector_store = self.vector_stores[session_id]
        
        # Pulling 4 rich chunks instead of 3 for deep context gathering
        retriever = vector_store.as_retriever(search_kwargs={"k": 4}) 
        relevant_docs = retriever.invoke(question)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        qa_prompt = f"""
        You are AbstractIQ, an elite academic AI research partner. Your task is to provide an incredibly thorough, well-structured, and insightful answer to the user's question using ONLY the document context provided below.

        RULES FOR HIGH-QUALITY ANSWERS:
        1. Formulate your response using beautiful structural markdown layout conventions.
        2. Use **bold text** to highlight critical statistics, key figures, or major findings.
        3. When explaining sequences, components, or results, use clear bullet points (`- Item`).
        4. Organize long answers into distinct structural blocks with concise subheaders if needed.
        5. If the provided context does not contain the answer, say exactly: "I cannot find the explicit answer within the provided document chunks." Do not hallucinate.

        Context Material:
        {context}

        User Question:
        {question}

        Answer:
        """
        response = self.llm.invoke(qa_prompt)
        return response.content

# Export the precise global variable name your main.py relies on
AbstractIQ = RAGAssistant()