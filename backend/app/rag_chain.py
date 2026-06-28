import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

class RAGAssistant:
    def __init__(self):
        # 1. Using Groq's free llama model as the brain
        self.llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
        
        # 2. Using HuggingFace local model for FREE math text embeddings
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        self.persist_directory_base = "./chroma_db"
        os.makedirs(self.persist_directory_base, exist_ok=True)

    def process_pdf(self, file_path: str, session_id: str):
        """Extracts text and saves vectors into a unique, isolated folder per session."""
        loader = PyPDFLoader(file_path)
        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)

        session_db_path = os.path.join(self.persist_directory_base, session_id)

        # Saves the database directly to your hard drive
        Chroma.from_documents(
            documents=splits, 
            embedding=self.embeddings,
            persist_directory=session_db_path
        )

    def generate_summary(self, file_path: str) -> str:
        """Generates a predefined structured summary."""
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        full_text = " ".join([doc.page_content for doc in docs[:2]]) 

        summary_prompt = f"""
        Analyze the following research paper text and generate a structured summary using exactly these sections:
        
        ### Title, Authors & Abstract
        [Provide content here]
        
        ### Problem Statement
        [Provide content here]
        
        ### Methodology
        [Provide content here]
        
        ### Key Results
        [Provide content here]
        
        ### Conclusion
        [Provide content here]

        Paper Content:
        {full_text}
        """
        response = self.llm.invoke(summary_prompt)
        return response.content

    def ask_question(self, question: str, session_id: str) -> str:
        """Dynamically loads the correct vector store folder for the asking user."""
        session_db_path = os.path.join(self.persist_directory_base, session_id)
        
        if not os.path.exists(session_db_path):
            return "No document context found for this session. Please upload a PDF first."
        
        vector_store = Chroma(
            persist_directory=session_db_path, 
            embedding_function=self.embeddings
        )
        
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
        
        system_prompt = (
            "You are an expert research assistant. Answer the user's question using the provided context. "
            "If you do not know the answer, say that you do not know.\n\n"
            "Context:\n{context}"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        
        question_answer_chain = create_stuff_documents_chain(self.llm, prompt)
        retrieval_chain = create_retrieval_chain(retriever, question_answer_chain)
        
        response = retrieval_chain.invoke({"input": question})
        return response["answer"]

# Global instance
AbstractIQ = RAGAssistant()