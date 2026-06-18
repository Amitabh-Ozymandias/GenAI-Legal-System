import { ScrollText } from 'lucide-react'
export default function SummaryCard({ summary }) {
  return (
    <div className="bg-white border border-navy-100 rounded-2xl shadow-soft p-6 sm:p-8">
      <div className="flex items-center gap-2 text-navy-700 mb-3">
        <ScrollText className="w-5 h-5" />
        <h3 className="font-serif text-xl text-navy-900">Executive Summary</h3>
      </div>
      <p className="text-navy-700 leading-relaxed whitespace-pre-line">
        {summary || 'No summary available.'}
      </p>
    </div>
  )
}
