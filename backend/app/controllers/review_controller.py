from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.mcp_server import mcp_server
from app.services.rag_pipeline import rag_pipeline
from app.services.llm_handler import llm_handler
from app.utils.context_manager import context_manager

router = APIRouter()

class ReviewRequest(BaseModel):
    business_name: str
    location: str = ""

@router.post("/summarize")
async def summarize_business(request: ReviewRequest):
    """
    Main endpoint for summarizing business reviews.
    Follows the RAG pipeline: Fetch -> Index -> Retrieve -> Summarize.
    """
    try:
        # 1. Start context tracking
        context_manager.start_request(request.business_name, request.location)
        
        # 2. Fetch data via MCP Bridge
        reviews = mcp_server.execute_tool("fetch_business_reviews", {
            "business_name": request.business_name,
            "location": request.location
        })
        
        if not reviews:
            summary = "Insufficient data to generate a valid summary."
            context_manager.finalize_request(summary)
            return {"summary": summary, "request_id": context_manager.request_id}

        # 3. Process and Index in RAG Pipeline
        rag_pipeline.process_and_index(reviews)
        
        # 4. Retrieve context
        query = f"What are the pros and cons of {request.business_name}?"
        retrieved_chunks = rag_pipeline.retrieve_context(query)
        
        # 5. Generate summary via LLM
        summary = llm_handler.generate_summary(request.business_name, retrieved_chunks)
        
        # 6. Finalize
        context_manager.finalize_request(summary)
        
        return {
            "summary": summary,
            "request_id": context_manager.request_id,
            "business_name": request.business_name
        }

    except Exception as e:
        context_manager.log_step("controller_error", f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history():
    """
    Returns the execution history/context for auditing.
    """
    return context_manager.get_history()
