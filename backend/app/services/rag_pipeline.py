import os
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv
from app.utils.context_manager import context_manager

load_dotenv()

class RAGPipeline:
    """
    RAG Pipeline: Chunking, Embedding, and ChromaDB storage.
    """
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.collection_name = os.getenv("CHROMADB_COLLECTION", "business_reviews")
        self.persist_directory = "backend/database/chroma_db"
        
        # Initialize embeddings
        self.embeddings = OpenAIEmbeddings(openai_api_key=self.openai_api_key)
        
        # Text splitter configuration
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )

    def process_and_index(self, reviews: List[dict]):
        if not reviews:
            context_manager.log_step("rag_skipped", "No reviews to index")
            return

        context_manager.log_step("rag_processing_started", f"Processing {len(reviews)} reviews for vector storage")

        # 1. Prepare documents
        texts = []
        metadatas = []
        for i, review in enumerate(reviews):
            text = review.get("text", "")
            if text:
                texts.append(text)
                metadatas.append({
                    "rating": review.get("rating", 0),
                    "date": review.get("date", "Unknown"),
                    "index": i
                })

        # 2. Chunking
        docs = self.text_splitter.create_documents(texts, metadatas=metadatas)
        context_manager.log_step("rag_chunking_completed", f"Split reviews into {len(docs)} chunks")

        # 3. Store in ChromaDB
        try:
            vector_db = Chroma.from_documents(
                documents=docs,
                embedding=self.embeddings,
                persist_directory=self.persist_directory,
                collection_name=self.collection_name
            )
            vector_db.persist()
            context_manager.log_step("rag_indexing_completed", "Successfully indexed chunks into ChromaDB")
            return vector_db
        except Exception as e:
            context_manager.log_step("rag_error", f"Error indexing to ChromaDB: {str(e)}")
            return None

    def retrieve_context(self, query: str, k: int = 10):
        """
        Retrieves relevant chunks from ChromaDB for a given query.
        """
        try:
            vector_db = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings,
                collection_name=self.collection_name
            )
            results = vector_db.similarity_search(query, k=k)
            context_manager.log_step("rag_retrieval_completed", f"Retrieved {len(results)} relevant chunks for synthesis")
            return [doc.page_content for doc in results]
        except Exception as e:
            context_manager.log_step("rag_retrieval_error", f"Error retrieving from ChromaDB: {str(e)}")
            return []

# Singleton instance
rag_pipeline = RAGPipeline()
