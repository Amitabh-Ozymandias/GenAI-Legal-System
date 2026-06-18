import { useState } from 'react'
import { Scale, ShieldAlert, FileCheck2, DollarSign, Gavel, Cog, Megaphone, AlertTriangle } from 'lucide-react'
import { analyzeContract } from './api/client'
import FileUploader from './components/FileUploader'
import RiskCard from './components/RiskCard'
import SummaryCard from './components/SummaryCard'
import ClauseTable from './components/ClauseTable'
import ClauseDrawer from './components/ClauseDrawer'
import LoadingScreen from './components/LoadingScreen'

const riskTone = (level = '') => {
  const l = level.toLowerCase()
  if (l === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (l === 'high') return 'bg-rose-50 text-rose-800 border-rose-200'
  return 'bg-amber-50 text-amber-800 border-amber-200'
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)

  const handleAnalyze = async (file) => {
    setError(''); setData(null); setLoading(true)
    try {
      const res = await analyzeContract(file)
      setData(res)
    } catch (e) {
      console.error(e)
      setError(e?.response?.data?.detail || e.message || 'Failed to analyze contract.')
    } finally {
      setLoading(false)
    }
  }

  const r = data?.risk_report || {}

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-navy-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-serif text-navy-900 font-semibold leading-tight">LexIntel</p>
              <p className="text-xs text-navy-500 leading-tight">Legal Document Intelligence</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-navy-500">
            <FileCheck2 className="w-4 h-4" /> AI Contract Review
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white pt-16 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs">
            <ShieldAlert className="w-3.5 h-3.5" /> Enterprise-grade contract intelligence
          </span>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            Legal Document Intelligence System
          </h1>
          <p className="mt-4 text-navy-100/90 text-lg max-w-2xl mx-auto">
            AI-Powered Contract Analysis and Risk Assessment
          </p>
        </div>
      </section>

      {/* Uploader */}
      <FileUploader onAnalyze={handleAnalyze} loading={loading} />

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Analysis failed</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingScreen />}

      {/* Empty state */}
      {!loading && !data && !error && (
        <div className="max-w-6xl mx-auto px-4 mt-16 text-center">
          <p className="text-navy-400 text-sm">Upload a contract to see risk insights, clause classifications, and an executive summary.</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <main className="max-w-6xl mx-auto px-4 mt-10 pb-20 space-y-8 animate-fadeUp">
          {/* Overview */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Overview label="File Name" value={data.file_name} mono />
            <Overview label="Total Clauses" value={data.total_clauses ?? '—'} />
            <Overview label="Overall Risk Score" value={`${data.overall_risk ?? '—'} / 10`} />
            <Overview
              label="Risk Level"
              value={
                <span className={`inline-flex px-2.5 py-1 rounded-md text-sm border ${riskTone(r.risk_level)}`}>
                  {r.risk_level || '—'}
                </span>
              }
            />
          </section>

          {/* Risk cards */}
          <section>
            <h2 className="font-serif text-2xl text-navy-900 mb-4">Risk Assessment</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RiskCard title="Financial Risk" score={r.financial_risk ?? 0} icon={DollarSign} />
              <RiskCard title="Legal Risk" score={r.legal_risk ?? 0} icon={Gavel} />
              <RiskCard title="Operational Risk" score={r.operational_risk ?? 0} icon={Cog} />
              <RiskCard title="Reputational Risk" score={r.reputational_risk ?? 0} icon={Megaphone} />
            </div>
          </section>

          {/* AI Risk Analysis alert */}
          <section className={`rounded-2xl border p-6 ${riskTone(r.risk_level)}`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider opacity-70">AI Risk Analysis</p>
                <h3 className="font-serif text-xl mt-0.5">Risk Level: {r.risk_level || '—'}</h3>
                <p className="mt-2 leading-relaxed">{r.reason || 'No reasoning provided.'}</p>
              </div>
            </div>
          </section>

          {/* Summary */}
          <SummaryCard summary={data.executive_summary} />

          {/* Clauses */}
          <ClauseTable clauses={data.clauses || []} onSelect={setSelected} />
        </main>
      )}

      <ClauseDrawer clause={selected} onClose={() => setSelected(null)} />

      <footer className="border-t border-navy-100 py-6 text-center text-xs text-navy-400">
        © {new Date().getFullYear()} LexIntel · Legal Document Intelligence System
      </footer>
    </div>
  )
}

function Overview({ label, value, mono }) {
  return (
    <div className="bg-white border border-navy-100 rounded-xl shadow-soft p-5">
      <p className="text-xs uppercase tracking-wider text-navy-500">{label}</p>
      <p className={`mt-1 text-navy-900 font-semibold truncate ${mono ? 'font-mono text-sm' : 'text-lg'}`} title={typeof value === 'string' ? value : undefined}>
        {value}
      </p>
    </div>
  )
}
