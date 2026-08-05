import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const typeColors = {
  termination: 'bg-rose-50 text-rose-700 border-rose-200',
  confidentiality: 'bg-violet-50 text-violet-700 border-violet-200',
  payment_terms: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ip_ownership: 'bg-blue-50 text-blue-700 border-blue-200',
  governing_law: 'bg-slate-50 text-slate-700 border-slate-200',
  limitation_of_liability: 'bg-amber-50 text-amber-700 border-amber-200',
  indemnity: 'bg-orange-50 text-orange-700 border-orange-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
}

function ClauseRow({ item, index }) {
  const [open, setOpen] = useState(index < 3)
  const color = typeColors[item.clause_type] || typeColors.other
  const aPresent = item.contract_a !== 'Not Present'
  const bPresent = item.contract_b !== 'Not Present'

  return (
    <div className="border border-navy-100 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-navy-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-md border capitalize ${color}`}>
            {item.clause_type?.replace(/_/g, ' ') || 'Unknown'}
          </span>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${aPresent ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}>
              A {aPresent ? '✓' : '✗'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${bPresent ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
              B {bPresent ? '✓' : '✗'}
            </span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-navy-400" /> : <ChevronDown className="w-4 h-4 text-navy-400" />}
      </button>

      {open && (
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-navy-100 border-t border-navy-100 animate-fadeUp">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Contract A</p>
            </div>
            <div className={`text-sm leading-relaxed whitespace-pre-line ${aPresent ? 'text-navy-700' : 'text-navy-300 italic'}`}>
              {item.contract_a}
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Contract B</p>
            </div>
            <div className={`text-sm leading-relaxed whitespace-pre-line ${bPresent ? 'text-navy-700' : 'text-navy-300 italic'}`}>
              {item.contract_b}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComparisonResults({ data }) {
  if (!data) return null

  return (
    <main className="max-w-6xl mx-auto px-4 mt-10 pb-20 space-y-6 animate-fadeUp">
      {/* Header */}
      <section className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-navy-100 rounded-xl shadow-soft p-5">
          <p className="text-xs uppercase tracking-wider text-navy-500">Contract A</p>
          <p className="mt-1 text-navy-900 font-semibold font-mono text-sm truncate">{data.contract_a}</p>
        </div>
        <div className="bg-white border border-navy-100 rounded-xl shadow-soft p-5">
          <p className="text-xs uppercase tracking-wider text-navy-500">Contract B</p>
          <p className="mt-1 text-navy-900 font-semibold font-mono text-sm truncate">{data.contract_b}</p>
        </div>
      </section>

      {/* Clause-by-clause comparison */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-navy-700" />
          <h2 className="font-serif text-2xl text-navy-900">Clause-by-Clause Comparison</h2>
          <span className="text-xs text-navy-400 ml-auto">{data.comparison?.length || 0} clause types</span>
        </div>
        <div className="space-y-3">
          {(data.comparison || []).map((item, i) => (
            <ClauseRow key={i} item={item} index={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
