import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

const PAGE_SIZE = 8

export default function ClauseTable({ clauses = [], onSelect }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'title', dir: 'asc' })

  const rows = useMemo(() => {
    const filtered = clauses.filter(c => {
      const s = q.trim().toLowerCase()
      if (!s) return true
      return (
        c.title?.toLowerCase().includes(s) ||
        c.classification?.clause_type?.toLowerCase().includes(s) ||
        c.market_comparison?.comparison?.toLowerCase().includes(s)
      )
    })
    const get = (c, k) => {
      switch (k) {
        case 'title': return c.title || ''
        case 'type': return c.classification?.clause_type || ''
        case 'confidence': return c.classification?.confidence ?? 0
        case 'comparison': return c.market_comparison?.comparison || ''
        case 'similarity': return c.market_comparison?.similarity_score ?? 0
        default: return ''
      }
    }
    const sorted = [...filtered].sort((a, b) => {
      const av = get(a, sort.key), bv = get(b, sort.key)
      if (av < bv) return sort.dir === 'asc' ? -1 : 1
      if (av > bv) return sort.dir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [clauses, q, sort])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const slice = rows.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const toggle = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

  const Th = ({ k, children, className = '' }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-navy-600 uppercase tracking-wider ${className}`}>
      <button className="inline-flex items-center gap-1 hover:text-navy-900" onClick={() => toggle(k)}>
        {children}
        {sort.key === k ? (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
      </button>
    </th>
  )

  const compTone = (c) => {
    const v = (c || '').toLowerCase()
    if (v.includes('standard') || v.includes('typical')) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (v.includes('unusual') || v.includes('aggressive')) return 'bg-rose-50 text-rose-700 border-rose-200'
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }

  return (
    <div className="bg-white border border-navy-100 rounded-2xl shadow-soft overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-navy-100">
        <h3 className="font-serif text-xl text-navy-900">Clause Analysis</h3>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="Search clauses…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-navy-50">
            <tr>
              <Th k="title">Clause Title</Th>
              <Th k="type">Clause Type</Th>
              <Th k="confidence">Confidence</Th>
              <Th k="comparison">Market Comparison</Th>
              <Th k="similarity">Similarity</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {slice.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-navy-400">No clauses found.</td></tr>
            ) : slice.map((c, i) => (
              <tr
                key={i}
                onClick={() => onSelect?.(c)}
                className="hover:bg-navy-50/60 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-navy-900">{c.title}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-navy-100 text-navy-700 capitalize">
                    {c.classification?.clause_type || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-700">
                  {c.classification?.confidence != null
                    ? `${(c.classification.confidence * 100).toFixed(0)}%` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md border capitalize ${compTone(c.market_comparison?.comparison)}`}>
                    {c.market_comparison?.comparison || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-700">
                  {c.market_comparison?.similarity_score != null
                    ? c.market_comparison.similarity_score.toFixed(2) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-navy-100 text-sm">
        <span className="text-navy-500">
          {rows.length === 0 ? '0' : `${(cur-1)*PAGE_SIZE+1}-${Math.min(cur*PAGE_SIZE, rows.length)}`} of {rows.length}
        </span>
        <div className="flex gap-1">
          <button
            disabled={cur <= 1}
            onClick={() => setPage(p => Math.max(1, p-1))}
            className="px-3 py-1 rounded border border-navy-200 disabled:opacity-40 hover:bg-navy-50"
          >Prev</button>
          <span className="px-3 py-1 text-navy-700">Page {cur} / {pages}</span>
          <button
            disabled={cur >= pages}
            onClick={() => setPage(p => Math.min(pages, p+1))}
            className="px-3 py-1 rounded border border-navy-200 disabled:opacity-40 hover:bg-navy-50"
          >Next</button>
        </div>
      </div>
    </div>
  )
}
