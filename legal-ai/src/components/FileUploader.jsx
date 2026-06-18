import { useRef, useState } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

export default function FileUploader({ onAnalyze, loading }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)

  const pick = (f) => {
    if (!f) return
    const ok = /\.(pdf|docx)$/i.test(f.name)
    if (!ok) return alert('Please upload a PDF or DOCX file.')
    setFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false)
    pick(e.dataTransfer.files?.[0])
  }

  return (
    <section className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            drag ? 'border-navy-600 bg-navy-50' : 'border-navy-200 hover:border-navy-400 hover:bg-navy-50/40'
          }`}
        >
          <input
            ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-navy-700" />
            </div>
            <div>
              <p className="text-navy-900 font-semibold">
                Drag &amp; drop your contract here
              </p>
              <p className="text-sm text-navy-500 mt-1">
                or click to browse — PDF or DOCX
              </p>
            </div>
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-navy-50 border border-navy-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-navy-700 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-navy-900 truncate">{file.name}</p>
                <p className="text-xs text-navy-500">{(file.size/1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
              className="p-1 rounded hover:bg-navy-100 text-navy-600"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          disabled={!file || loading}
          onClick={() => file && onAnalyze(file)}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>) : 'Analyze Contract'}
        </button>
      </div>
    </section>
  )
}
