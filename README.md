# Local Business Review Summarizer

A full-stack GenAI application that fetches, caches, indexes, and summarizes local business reviews using a RAG (Retrieval-Augmented Generation) pipeline.

## Tech Stack
- **Backend**: FastAPI, Python
- **APIs**: Serper API (Google Places & Reviews)
- **Vector Database**: Cloud ChromaDB
- **LLM Engine**: Local Ollama (`qwen2.5` for generation, `nomic-embed-text` for embeddings)
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Architecture**: MVC (Model-View-Controller) with decoupled deployment support

## Key Features
- **Real-time MCP Ingestion**: Standardized data fetching via Model Context Protocol bridge.
- **Smart 30-Day Caching**: Avoids redundant API calls and vector indexing by caching raw review data locally.
- **Cloud Vector Storage**: Securely embeds and stores review chunks in a hosted Cloud ChromaDB instance.
- **RAG Pipeline**: Semantic search using localized vector retrieval.
- **Master Prompting**: Expert-engineered LLM prompts for grounded, neutral, and scale-agnostic executive summaries.
- **Interactive Recent Audits**: Clickable audit history allowing instant retrieval of past context and pipeline executions without reloading.
- **Premium UI**: Glassmorphism dashboard with dynamic pipeline status tracking.

## Prerequisites
1. **Ollama**: Install and run [Ollama](https://ollama.ai/) locally. Make sure to pull the required models:
   ```bash
   ollama pull qwen2.5:0.5b
   ollama pull nomic-embed-text
   ```
2. **API Keys**:
   - `SERPER_API_KEY`: Get from [serper.dev](https://serper.dev/) for fetching Google Reviews.
   - `CHROMA_HOST` & Keys: Credentials for your hosted ChromaDB instance (e.g., `api.trychroma.com`).
3. **Environment**: Python 3.10+, Node.js 18+.

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
SERPER_API_KEY="your_serper_key"
CHROMA_HOST="api.trychroma.com"
CHROMA_API_KEY="your_chroma_key"
CHROMA_TENANT="your_tenant"
CHROMA_DATABASE="your_database"
CHROMADB_COLLECTION="business_reviews_ollama"
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
2. Enter a business name (e.g., "Amazon") and an optional location (e.g., "New York").
3. Click **Generate Summary**.
4. Watch the pipeline status as it fetches data via MCP, vectorizes it to the cloud, and synthesizes the summary via your local Ollama model.
5. View the perfectly formatted "Executive Review Summary" with Key Strengths and Weaknesses.
6. Click on any item in the **Recent Audits** sidebar to instantly load previous summaries.

---

## Author
Developed by **Manu Bansal**  
GitHub: [ManuBansalS](https://github.com/ManuBansalS)  
Email: [manu03bansal@gmail.com](mailto:manu03bansal@gmail.com)

## License
This project is licensed under the MIT License - see the LICENSE file for details.
