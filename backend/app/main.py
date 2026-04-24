import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.controllers import review_controller

load_dotenv()

app = FastAPI(
    title="Local Business Review Summarizer API",
    description="GenAI powered RAG pipeline for summarizing business reviews.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(review_controller.router, prefix="/api/v1", tags=["Reviews"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Local Business Review Summarizer API"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
