# Legal Document Intelligence System — Frontend

Modern React + Vite + Tailwind frontend for an AI-powered contract analysis backend.

## Stack
- React 18 + Vite
- Tailwind CSS
- Axios
- lucide-react icons

## Setup
```bash
npm install
npm run dev
```

The app expects the FastAPI backend at `http://127.0.0.1:8000`.
Override via `.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```

## Build
```bash
npm run build
npm run preview
```

## Components
- `FileUploader` — drag-and-drop PDF/DOCX upload
- `RiskCard` — color-coded risk score card with progress bar
- `SummaryCard` — executive summary panel
- `ClauseTable` — searchable, sortable, paginated clause list
- `ClauseDrawer` — side panel with full clause detail
- `LoadingScreen` — loading state

## API
- `GET /` — health check
- `POST /analyze` — multipart form upload (`file`)
