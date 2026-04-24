# Local Business Review Summarizer

A full-stack GenAI application that fetches, indexes, and summarizes local business reviews using a RAG (Retrieval-Augmented Generation) pipeline.

## Tech Stack
- **Backend**: FastAPI, Serper API, ChromaDB, LangChain, Local Ollama.
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Architecture**: MVC (Model-View-Controller) with decoupled deployment support.

## Features
- **Real-time MCP Ingestion**: Standardized data fetching via Model Context Protocol bridge.
- **RAG Pipeline**: Semantic search using localized vector retrieval.
- **Master Prompting**: Expert-engineered LLM prompts for grounded, neutral, and scale-agnostic summaries.
- **Audit History**: Persistent context logging for every pipeline execution.
- **Premium UI**: Glassmorphism dashboard with dynamic status tracking.

## Prerequisites
1. **Ollama**: Install and run [Ollama](https://ollama.ai/) locally.
2. **API Keys**:
   - `SERPER_API_KEY`: Get from [serper.dev](https://serper.dev/)
   - `OPENAI_API_KEY`: Required for embeddings (OpenAI).
3. **Environment**: Python 3.10+, Node.js 18+.

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Update .env with your API keys
python app/main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## How to Use
1. Enter a business name (e.g., "Central Park") and optional location.
2. Click **Generate Summary**.
3. Watch the pipeline status as it fetches data via MCP, vectorizes it in ChromaDB, and synthesizes the summary via Ollama.
4. View the "Executive Review Summary" with key Pros and Cons.
5. Check the "Audit History" to see the full pipeline flow for past requests.
