import { X, ShieldAlert, DollarSign, Gavel, Cog, Megaphone } from 'lucide-react'

const riskTone = (s) => {
  if (s <= 3) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Low' }
  if (s <= 6) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Medium' }
  return { bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', label: 'High' }
}

function MiniRisk({ label, score, icon: Icon }) {
  const t = riskTone(score)
  const pct = Math.min(100, (score / 10) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-navy-600">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className={`text-xs font-bold ${t.text}`}>{score}/10</span>
      </div>
      <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden">
        <div className={`${t.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function ClauseDrawer({ clause, onClose }) {
  if (!clause) return null
  const conf = clause.classification?.confidence
  const sim = clause.market_comparison?.similarity_score
  const risk = clause.risk || {}
  const riskLevel = riskTone(risk.overall_risk_score ?? 0)

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
          {/* Full Content */}
          <section>
            <h4 className="text-sm font-semibold text-navy-700 mb-2">Full Content</h4>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4 text-sm text-navy-800 leading-relaxed whitespace-pre-line">
              {clause.content || 'No content provided.'}
            </div>
          </section>

          {/* Classification & Market */}
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

          {/* Risk Assessment */}
          {risk.overall_risk_score != null && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-navy-700" />
                <h4 className="text-sm font-semibold text-navy-700">Risk Assessment</h4>
              </div>

              {/* Overall risk banner */}
              <div className={`${riskLevel.bg} ${riskLevel.text} border ${riskLevel.border} rounded-xl p-4 mb-4`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider opacity-70">Overall Risk</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${riskLevel.border} ${riskLevel.bg} ${riskLevel.text}`}>
                    {risk.risk_level || riskLevel.label}
                  </span>
                </div>
                <p className="text-2xl font-bold">{risk.overall_risk_score} <span className="text-sm font-normal opacity-60">/ 10</span></p>
                {risk.reason && (
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{risk.reason}</p>
                )}
              </div>

              {/* Sub-scores */}
              <div className="space-y-3">
                <MiniRisk label="Financial Risk" score={risk.financial_risk ?? 0} icon={DollarSign} />
                <MiniRisk label="Legal Risk" score={risk.legal_risk ?? 0} icon={Gavel} />
                <MiniRisk label="Operational Risk" score={risk.operational_risk ?? 0} icon={Cog} />
                <MiniRisk label="Reputational Risk" score={risk.reputational_risk ?? 0} icon={Megaphone} />
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}
