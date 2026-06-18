const tone = (s) => {
  if (s <= 3) return { label: 'Low', bar: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', ring: 'ring-emerald-100' }
  if (s <= 6) return { label: 'Medium', bar: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200', ring: 'ring-amber-100' }
  return { label: 'High', bar: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200', ring: 'ring-rose-100' }
}

export default function RiskCard({ title, score = 0, icon: Icon }) {
  const t = tone(score)
  const pct = Math.min(100, (score / 10) * 100)
  return (
    <div className={`bg-white border border-navy-100 rounded-xl p-5 shadow-soft ring-1 ${t.ring}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-navy-700">
          {Icon && <Icon className="w-4 h-4" />}
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${t.chip}`}>{t.label}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-navy-900">{score}</span>
        <span className="text-sm text-navy-400">/ 10</span>
      </div>
      <div className="mt-3 h-2 bg-navy-100 rounded-full overflow-hidden">
        <div className={`${t.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
