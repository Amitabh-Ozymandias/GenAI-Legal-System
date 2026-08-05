import { useState } from 'react'
import { Scale, ShieldAlert, FileCheck2, DollarSign, Gavel, Cog, Megaphone, AlertTriangle, ArrowLeftRight, MessageSquare, FileText } from 'lucide-react'
import { analyzeContract, compareContracts } from './api/client'
import FileUploader from './components/FileUploader'
import CompareUploader from './components/CompareUploader'
import ComparisonResults from './components/ComparisonResults'
import ChatPanel from './components/ChatPanel'
import RiskCard from './components/RiskCard'
import SummaryCard from './components/SummaryCard'
import ClauseTable from './components/ClauseTable'
import ClauseDrawer from './components/ClauseDrawer'
import LoadingScreen from './components/LoadingScreen'

const riskTone = (level = '') => {
  const l = String(level).toLowerCase()
  if (l === 'low') return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (l === 'high') return 'bg-rose-50 text-rose-800 border-rose-200'
  return 'bg-amber-50 text-amber-800 border-amber-200'
}

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze') // 'analyze' | 'compare' | 'chat'

  // Analyze state
  const [loadingAnalyze, setLoadingAnalyze] = useState(false)
  const [errorAnalyze, setErrorAnalyze] = useState('')
  const [dataAnalyze, setDataAnalyze] = useState(null)

  // Compare state
  const [loadingCompare, setLoadingCompare] = useState(false)
  const [errorCompare, setErrorCompare] = useState('')
  const [dataCompare, setDataCompare] = useState(null)

  const [selectedClause, setSelectedClause] = useState(null)

  const handleAnalyze = async (file) => {
    setErrorAnalyze(''); setDataAnalyze(null); setLoadingAnalyze(true)
    try {
      const res = await analyzeContract(file)
      setDataAnalyze(res)
    } catch (e) {
      console.error(e)
      setErrorAnalyze(e?.response?.data?.detail || e.message || 'Failed to analyze contract.')
    } finally {
      setLoadingAnalyze(false)
    }
  }

  const handleCompare = async (fileA, fileB) => {
    setErrorCompare(''); setDataCompare(null); setLoadingCompare(true)
    try {
      const res = await compareContracts(fileA, fileB)
      setDataCompare(res)
    } catch (e) {
      console.error(e)
      setErrorCompare(e?.response?.data?.detail || e.message || 'Failed to compare contracts.')
    } finally {
      setLoadingCompare(false)
    }
  }

  // Compute aggregate risk breakdown from clause risk objects
  const computedRisk = (() => {
    if (!dataAnalyze?.clauses?.length) return null
    const clauses = dataAnalyze.clauses
    let fin = 0, leg = 0, op = 0, rep = 0, count = 0
    clauses.forEach(c => {
      if (c.risk) {
        fin += c.risk.financial_risk ?? 0
        leg += c.risk.legal_risk ?? 0
        op += c.risk.operational_risk ?? 0
        rep += c.risk.reputational_risk ?? 0
        count++
      }
    })
    if (!count) return null
    const avgFin = Math.round(fin / count)
    const avgLeg = Math.round(leg / count)
    const avgOp = Math.round(op / count)
    const avgRep = Math.round(rep / count)
    const overall = dataAnalyze.overall_risk ?? Math.round((avgFin + avgLeg + avgOp + avgRep) / 4)
    const level = overall >= 7 ? 'High' : overall >= 4 ? 'Medium' : 'Low'
    return { financial_risk: avgFin, legal_risk: avgLeg, operational_risk: avgOp, reputational_risk: avgRep, overall_risk: overall, risk_level: level }
  })()

  return (
    <div className="min-h-screen bg-white text-navy-900">
      {/* Header */}
      <header className="bg-white border-b border-navy-100 sticky top-0 z-40">
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

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-navy-50 p-1 rounded-xl border border-navy-100">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analyze'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Analyze</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chatbot</span>
            </button>
          </nav>

          <span className="hidden lg:inline-flex items-center gap-1 text-xs text-navy-500">
            <ShieldAlert className="w-4 h-4" /> AI Legal Intelligence
          </span>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs">
            <ShieldAlert className="w-3.5 h-3.5" /> Enterprise-grade legal document intelligence
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {activeTab === 'analyze' && 'Contract Risk & Classification Analysis'}
            {activeTab === 'compare' && 'Side-by-Side Contract Comparison'}
            {activeTab === 'chat' && 'Interactive Contract Assistant'}
          </h1>
          <p className="mt-3 text-navy-100/90 text-base max-w-2xl mx-auto">
            {activeTab === 'analyze' && 'Upload a contract to extract clauses, evaluate risks, and review market alignment.'}
            {activeTab === 'compare' && 'Compare two legal documents side-by-side to identify clause variations and risk gaps.'}
            {activeTab === 'chat' && 'Ask questions about your contract and get precise context-aware answers using RAG.'}
          </p>
        </div>
      </section>

      {/* Tab 1: ANALYZE */}
      {activeTab === 'analyze' && (
        <>
          <FileUploader onAnalyze={handleAnalyze} loading={loadingAnalyze} />

          {errorAnalyze && (
            <div className="max-w-6xl mx-auto px-4 mt-8">
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Analysis failed</p>
                  <p className="text-sm">{errorAnalyze}</p>
                </div>
              </div>
            </div>
          )}

          {loadingAnalyze && <LoadingScreen label="Analyzing your contract with AI..." />}

          {!loadingAnalyze && !dataAnalyze && !errorAnalyze && (
            <div className="max-w-6xl mx-auto px-4 mt-16 text-center">
              <p className="text-navy-400 text-sm">Upload a contract above to see risk insights, clause classifications, and an executive summary.</p>
            </div>
          )}

          {dataAnalyze && !loadingAnalyze && (
            <main className="max-w-6xl mx-auto px-4 mt-10 pb-20 space-y-8 animate-fadeUp">
              {/* Overview */}
              <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Overview label="File Name" value={dataAnalyze.file_name} mono />
                <Overview label="Total Clauses" value={dataAnalyze.total_clauses ?? '—'} />
                <Overview label="Overall Risk Score" value={`${dataAnalyze.overall_risk ?? '—'} / 10`} />
                <Overview
                  label="Risk Level"
                  value={
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-sm border ${riskTone(computedRisk?.risk_level)}`}>
                      {computedRisk?.risk_level || '—'}
                    </span>
                  }
                />
              </section>

              {/* Risk cards */}
              {computedRisk && (
                <section>
                  <h2 className="font-serif text-2xl text-navy-900 mb-4">Aggregate Risk Assessment</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RiskCard title="Financial Risk" score={computedRisk.financial_risk} icon={DollarSign} />
                    <RiskCard title="Legal Risk" score={computedRisk.legal_risk} icon={Gavel} />
                    <RiskCard title="Operational Risk" score={computedRisk.operational_risk} icon={Cog} />
                    <RiskCard title="Reputational Risk" score={computedRisk.reputational_risk} icon={Megaphone} />
                  </div>
                </section>
              )}

              {/* Executive Summary */}
              <SummaryCard summary={dataAnalyze.executive_summary} />

              {/* Clauses Table */}
              <ClauseTable clauses={dataAnalyze.clauses || []} onSelect={setSelectedClause} />
            </main>
          )}
        </>
      )}

      {/* Tab 2: COMPARE */}
      {activeTab === 'compare' && (
        <>
          <CompareUploader onCompare={handleCompare} loading={loadingCompare} />

          {errorCompare && (
            <div className="max-w-6xl mx-auto px-4 mt-8">
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Comparison failed</p>
                  <p className="text-sm">{errorCompare}</p>
                </div>
              </div>
            </div>
          )}

          {loadingCompare && <LoadingScreen label="Comparing contracts side-by-side..." />}

          {!loadingCompare && !dataCompare && !errorCompare && (
            <div className="max-w-6xl mx-auto px-4 mt-16 text-center">
              <p className="text-navy-400 text-sm">Upload Contract A and Contract B to generate a side-by-side clause comparison.</p>
            </div>
          )}

          {dataCompare && !loadingCompare && (
            <ComparisonResults data={dataCompare} />
          )}
        </>
      )}

      {/* Tab 3: CHAT */}
      {activeTab === 'chat' && (
        <ChatPanel />
      )}

      {/* Clause Drawer Modal */}
      <ClauseDrawer clause={selectedClause} onClose={() => setSelectedClause(null)} />

      {/* Footer */}
      <footer className="border-t border-navy-100 py-6 text-center text-xs text-navy-400 mt-auto">
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
