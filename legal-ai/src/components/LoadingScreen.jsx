import { Loader2 } from 'lucide-react'
export default function LoadingScreen({ label = 'Analyzing your contract…' }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <div className="bg-white border border-navy-100 rounded-2xl shadow-soft p-12 flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-navy-700 animate-spin" />
        <p className="text-navy-700 font-medium">{label}</p>
        <p className="text-sm text-navy-400">This may take up to a minute.</p>
      </div>
    </div>
  )
}
