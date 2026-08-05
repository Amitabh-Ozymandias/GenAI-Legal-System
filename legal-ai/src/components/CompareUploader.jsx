import { useRef, useState } from 'react'
import { Upload, FileText, X, Loader2, ArrowLeftRight } from 'lucide-react'

function DropSlot({ label, file, onPick, onClear, accent }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const pick = (f) => {
    if (!f) return
    if (!/\.(pdf|docx)$/i.test(f.name)) return alert('Please upload a PDF or DOCX file.')
    onPick(f)
  }

  return (
    <div className="flex-1 min-w-0">
      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accent}`}>{label}</p>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          drag ? 'border-navy-600 bg-navy-50' : 'border-navy-200 hover:border-navy-400 hover:bg-navy-50/40'
        }`}
      >
        <input
          ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-navy-700" />
          </div>
          <p className="text-sm text-navy-600">Drop contract here</p>
          <p className="text-xs text-navy-400">PDF or DOCX</p>
        </div>
      </div>
      {file && (
        <div className="mt-3 flex items-center justify-between bg-navy-50 border border-navy-100 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-navy-700 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy-900 truncate">{file.name}</p>
              <p className="text-xs text-navy-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClear() }} className="p-1 rounded hover:bg-navy-100 text-navy-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function CompareUploader({ onCompare, loading }) {
  const [fileA, setFileA] = useState(null)
  const [fileB, setFileB] = useState(null)

  return (
    <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-stretch">
          <DropSlot label="Contract A" file={fileA} onPick={setFileA} onClear={() => setFileA(null)} accent="text-indigo-600" />
          <div className="hidden sm:flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-navy-500" />
            </div>
          </div>
          <DropSlot label="Contract B" file={fileB} onPick={setFileB} onClear={() => setFileB(null)} accent="text-teal-600" />
        </div>
        <button
          disabled={!fileA || !fileB || loading}
          onClick={() => fileA && fileB && onCompare(fileA, fileB)}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Comparing…</>) : (<><ArrowLeftRight className="w-4 h-4" /> Compare Contracts</>)}
        </button>
      </div>
    </section>
  )
}
