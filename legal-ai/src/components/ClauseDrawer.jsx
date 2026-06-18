import { X } from 'lucide-react'

export default function ClauseDrawer({ clause, onClose }) {
  if (!clause) return null
  const conf = clause.classification?.confidence
  const sim = clause.market_comparison?.similarity_score

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl animate-slideIn overflow-y-auto">
        <header className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-navy-500">Clause</p>
            <h3 className="font-serif text-xl text-navy-900">{clause.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-navy-50 text-navy-600">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-navy-700 mb-2">Full Content</h4>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4 text-sm text-navy-800 leading-relaxed whitespace-pre-line">
              {clause.content || 'No content provided.'}
            </div>
          </section>

          <section className="grid sm:grid-cols-2 gap-4">
            <div className="border border-navy-100 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wider text-navy-500">Classification</p>
              <p className="mt-1 font-semibold text-navy-900 capitalize">
                {clause.classification?.clause_type || '—'}
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Confidence: {conf != null ? `${(conf*100).toFixed(0)}%` : '—'}
              </p>
            </div>
            <div className="border border-navy-100 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wider text-navy-500">Market Comparison</p>
              <p className="mt-1 font-semibold text-navy-900 capitalize">
                {clause.market_comparison?.comparison || '—'}
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Similarity: {sim != null ? sim.toFixed(2) : '—'}
              </p>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
