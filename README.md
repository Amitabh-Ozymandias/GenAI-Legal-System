# LexIntel — Legal Document Intelligence System

An end-to-end **Generative AI** application that ingests legal contracts (PDF/DOCX), breaks them into clauses, classifies and scores risk, compares wording against market standards, and presents results through a modern web dashboard.

**Live demo:** [https://gen-ai-legal-system.vercel.app/](https://gen-ai-legal-system.vercel.app/)

Built as a **Gen AI module assignment** demonstrating practical LLM integration, embeddings, retrieval-augmented generation (RAG), and full-stack deployment.

---

## What This Project Does

Legal contract review is slow and expensive. LexIntel automates the first pass of due diligence by:

1. **Extracting text** from uploaded contracts
2. **Splitting** the document into individual clauses
3. **Classifying** each clause (termination, indemnity, liability, etc.)
4. **Scoring risk** across financial, legal, operational, and reputational dimensions
5. **Comparing** clause language to predefined market-standard templates using semantic similarity
6. **Summarizing** findings in an executive summary for quick review

The frontend (**LexIntel**) provides a polished UI for uploading a contract and exploring clause-level insights.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (legal-ai)                     │
│   Vite · Tailwind CSS · Axios · lucide-react                     │
│   Upload → Loading → Risk cards · Summary · Clause table        │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /analyze  (multipart file)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FastAPI Backend (GENAI-finale)                  │
│                                                                   │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────────────┐  │
│  │  Ingestion  │ → │   Analysis   │ → │  Market Comparison    │  │
│  │ PDF / DOCX  │   │ Classify     │   │ SentenceTransformers  │  │
│  │ Clause split│   │ Risk (Gemini)│   │ Cosine similarity     │  │
│  └─────────────┘   │ Exec summary │   └───────────────────────┘  │
│                    └──────────────┘                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  RAG Chatbot (built, not yet exposed via API)               │  │
│  │  FAISS vector store · MiniLM embeddings · Gemini answers    │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios |
| **Backend** | FastAPI, Uvicorn, Python 3.11 |
| **LLM** | Google Gemini 2.5 Flash (`google-generativeai`) |
| **Embeddings** | `sentence-transformers` (`all-MiniLM-L6-v2`) |
| **Vector search** | FAISS (`faiss-cpu`) |
| **Document parsing** | PyMuPDF (PDF), `python-docx` (DOCX) |
| **ML utilities** | scikit-learn (cosine similarity), NumPy |

---

## Project Structure

```
GenAI-Legal-System/
├── GENAI-finale/                 # Python FastAPI backend
│   ├── main.py                   # API entry point (/analyze, /compare)
│   ├── config.py                 # Gemini model (lazy-loaded)
│   ├── ingestion/
│   │   ├── pdf_parser.py         # PDF text extraction
│   │   ├── docx_parser.py        # DOCX text extraction
│   │   └── clause_splitter.py    # Regex-based clause segmentation
│   ├── analysis/
│   │   ├── contract_analyzer.py  # Main analysis orchestrator
│   │   ├── clause_classifier.py  # Keyword-based clause typing
│   │   ├── risk_analyzer.py      # Gemini risk scoring + local fallback
│   │   ├── market_comparison.py  # Embedding similarity vs standards
│   │   ├── executive_summary.py  # Summary generation
│   │   ├── contract_comparison.py# Side-by-side contract diff
│   │   └── json_parser.py        # Parse JSON from LLM responses
│   ├── chatbot/                  # RAG pipeline (not wired to API yet)
│   │   ├── embeddings.py
│   │   ├── vector_store.py       # FAISS index
│   │   ├── index_builder.py
│   │   ├── retriever.py
│   │   └── chatbot.py
│   ├── comparison/               # LLM-powered clause comparison
│   ├── data/standards/
│   │   └── market_standards.json # Reference clause templates
│   └── reports/
│       └── report_generator.py   # Save summaries to disk
│
└── legal-ai/                     # React frontend
    └── src/
        ├── App.jsx               # Main dashboard layout
        ├── api/client.js         # Backend API client
        └── components/
            ├── FileUploader.jsx  # Drag-and-drop upload
            ├── RiskCard.jsx      # Risk score visualization
            ├── SummaryCard.jsx   # Executive summary panel
            ├── ClauseTable.jsx   # Searchable clause table
            ├── ClauseDrawer.jsx  # Clause detail side panel
            └── LoadingScreen.jsx
```

---

## How It Works

### 1. Document ingestion

When a file is uploaded to `POST /analyze`, the backend saves it temporarily, detects the extension, and extracts plain text:

- **PDF** → PyMuPDF (`fitz`)
- **DOCX** → `python-docx`

### 2. Clause splitting

`clause_splitter.py` uses regex to detect common legal heading patterns:

- Numbered sections (`1 Definitions`, `2.1 Payment Terms`)
- `ARTICLE I`, `SECTION 2.3`
- ALL-CAPS headings (`TERMINATION RIGHTS`)

Each match becomes a `{ title, content }` clause object.

### 3. Clause classification

`clause_classifier.py` maps clause titles to types using keyword matching:

| Keyword in title | Clause type |
|-----------------|-------------|
| termination | `termination` |
| confidentiality | `confidentiality` |
| payment | `payment_terms` |
| liability | `limitation_of_liability` |
| indemnity | `indemnity` |
| intellectual / ownership | `ip_ownership` |
| governing | `governing_law` |
| *(default)* | `other` |

> Classification is currently rule-based (marked `"status": "mock"`). This keeps the pipeline fast and deterministic for demos.

### 4. Risk analysis

For each clause, `risk_analyzer.py` prompts **Gemini 2.5 Flash** to return structured JSON:

- Financial, legal, operational, and reputational risk (0–10)
- Overall risk score and level (`Low` / `Medium` / `High`)
- Natural-language reasoning

If the API call fails (missing key, quota, etc.), a **local fallback** scores risk from a static map keyed by clause type.

### 5. Market comparison

`market_comparison.py` embeds the clause text and a reference standard from `market_standards.json` using **SentenceTransformers**, then computes **cosine similarity**:

| Similarity | Verdict |
|-----------|---------|
| ≥ 0.85 | `market_standard` |
| ≥ 0.65 | `unusual` |
| < 0.65 | `unfavourable` |

### 6. Executive summary

`executive_summary.py` aggregates clause count and overall risk into a readable summary. Currently uses template-based mock text when Gemini is unavailable.

### 7. Contract comparison (API only)

`POST /compare` accepts two contracts, analyzes both, and aligns clauses by type for side-by-side comparison. Not yet integrated into the frontend UI.

### 8. RAG chatbot (infrastructure ready)

The `chatbot/` module implements a full retrieval pipeline:

1. Embed clause text with MiniLM
2. Store vectors in a FAISS index
3. Retrieve top-k relevant chunks for a user question
4. Answer with Gemini using retrieved context only

This is implemented but **not yet exposed** as an API endpoint in `main.py`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Health status |
| `POST` | `/analyze` | Upload and analyze a single contract (`file`) |
| `POST` | `/compare` | Upload and compare two contracts (`contract_a`, `contract_b`) |

### Example: analyze response shape

```json
{
  "file_name": "sample.pdf",
  "overall_risk": 5.67,
  "total_clauses": 12,
  "executive_summary": "...",
  "clauses": [
    {
      "title": "1. TERMINATION",
      "content": "...",
      "classification": { "clause_type": "termination", "confidence": 1.0, "status": "mock" },
      "risk": { "financial_risk": 7, "legal_risk": 8, "overall_risk_score": 6.5, "risk_level": "Medium", "reason": "..." },
      "market_comparison": { "comparison": "unusual", "similarity_score": 0.72 }
    }
  ]
}
```

---

## Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- A **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/apikey))

### Backend setup

```bash
cd GENAI-finale

# Create and activate a virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt

# Create .env with your API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Start the API server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API docs available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### Frontend setup

```bash
cd legal-ai

npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Optional: create `legal-ai/.env` to override the backend URL:

```
VITE_API_URL=http://127.0.0.1:8000
```

### Production build

```bash
cd legal-ai
npm run build
npm run preview
```

---

## Gen AI Concepts Demonstrated

| Concept | Where it's used |
|---------|----------------|
| **LLM prompting** | Risk analysis, contract comparison, RAG answers |
| **Structured output parsing** | `json_parser.py` extracts JSON from Gemini responses |
| **Text embeddings** | `sentence-transformers` for semantic similarity |
| **Vector databases** | FAISS for in-memory similarity search |
| **RAG** | Chatbot retrieves clause chunks before generating answers |
| **Graceful degradation** | Local risk fallback when Gemini is unavailable |
| **Lazy model loading** | Heavy models load on first request, not at startup |

---


