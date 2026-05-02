# Local Business Review Summarizer

A full-stack GenAI application that fetches, caches, indexes, and summarizes local business reviews using a RAG (Retrieval-Augmented Generation) pipeline.

## Tech Stack
- **Backend**: FastAPI, Python
- **APIs**: Serper API (Google Places & Reviews), Groq API
- **Vector Database**: Cloud ChromaDB
- **LLM Engine**: Groq Cloud API (`llama-3.3-70b-versatile` for generation), HuggingFace `sentence-transformers` (`all-MiniLM-L6-v2` for local vector embeddings)
- **Frontend**: React (Vite) with Component-based Architecture, Tailwind CSS, Framer Motion, Lucide Icons
- **Architecture**: MVC (Model-View-Controller) with decoupled, Vercel-ready frontend deployment support

## Key Features
- **Real-time MCP Ingestion**: Standardized data fetching via Model Context Protocol bridge.
- **Smart 30-Day Caching**: Avoids redundant API calls and vector indexing by caching raw review data locally.
- **Cloud Vector Storage**: Securely embeds and stores review chunks in a hosted Cloud ChromaDB instance using local HuggingFace embeddings.
- **RAG Pipeline**: Semantic search using localized vector retrieval.
- **Master Prompting**: Expert-engineered LLM prompts for grounded, neutral, and scale-agnostic executive summaries via the Groq API.
- **Interactive Recent Audits**: Clickable audit history allowing instant retrieval of past context and pipeline executions without reloading.
- **Premium UI**: Modularized Glassmorphism dashboard with dynamic pipeline status tracking.

## Prerequisites
1. **API Keys**:
   - `GROQ_API_KEY`: Get from [Groq Console](https://console.groq.com/) for lightning-fast LLM generation.
   - `SERPER_API_KEY`: Get from [serper.dev](https://serper.dev/) for fetching Google Reviews.
   - `CHROMA_HOST` & Keys: Credentials for your hosted ChromaDB instance (e.g., `api.trychroma.com`).
2. **Environment**: Python 3.10+, Node.js 18+.

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```
Update your `.env` with your API keys:
```env
GROQ_API_KEY="your_groq_api_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"
SERPER_API_KEY="your_serper_key"
CHROMA_HOST="api.trychroma.com"
CHROMA_API_KEY="your_chroma_key"
CHROMA_TENANT="your_tenant"
CHROMA_DATABASE="your_database"
CHROMADB_COLLECTION="business_reviews_v2"
```
Run the server:
```bash
python -m app.main
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## How to Use
1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Enter a business name (e.g., "Starbucks") and an optional location (e.g., "New York").
3. Click **Generate Summary**.
4. Watch the pipeline status as it fetches data via MCP, vectorizes it using HuggingFace sentence-transformers, and synthesizes the summary via the Groq Cloud LLM.
5. View the perfectly formatted "Executive Review Summary" with Key Strengths and Weaknesses.
6. Click on any item in the **Recent Audits** sidebar to instantly load previous summaries.

---

## Author
Developed by **Manu Bansal**  
GitHub: [ManuBansalS](https://github.com/ManuBansalS)  
Email: [manu03bansal@gmail.com](mailto:manu03bansal@gmail.com)

## License
This project is licensed under the MIT License - see the LICENSE file for details.
