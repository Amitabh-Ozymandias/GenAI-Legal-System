import { useRef, useState } from 'react'
import { Upload, FileText, X, Send, Loader2, Bot, User, MessageSquare } from 'lucide-react'
import { chatWithContract } from '../api/client'

export default function ChatPanel() {
  const inputRef = useRef(null)
  const chatEndRef = useRef(null)
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pick = (f) => {
    if (!f) return
    if (!/\.(pdf|docx)$/i.test(f.name)) return alert('Please upload a PDF or DOCX file.')
    setFile(f)
    setMessages([])
    setError('')
  }

  const handleSend = async () => {
    if (!file || !question.trim() || loading) return
    const q = question.trim()
    setQuestion('')
    setError('')

    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)

    try {
      const res = await chatWithContract(file, q)
      setMessages(prev => [...prev, { role: 'assistant', text: res.answer, meta: { file: res.file_name, clauses: res.total_clauses } }])
    } catch (e) {
      console.error(e)
      const msg = e?.response?.data?.detail || e.message || 'Failed to get answer.'
      setError(msg)
      setMessages(prev => [...prev, { role: 'error', text: msg }])
    } finally {
      setLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>

        {/* File upload area */}
        {!file ? (
          <div className="p-6 sm:p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                drag ? 'border-navy-600 bg-navy-50' : 'border-navy-200 hover:border-navy-400 hover:bg-navy-50/40'
              }`}
            >
              <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-navy-700" />
                </div>
                <div>
                  <p className="text-navy-900 font-semibold">Upload a contract to start chatting</p>
                  <p className="text-sm text-navy-500 mt-1">Drop your PDF or DOCX here, then ask questions about it</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File indicator bar */}
            <div className="flex items-center justify-between bg-navy-50 border-b border-navy-100 px-5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-navy-700 shrink-0" />
                <p className="text-sm font-medium text-navy-900 truncate">{file.name}</p>
                <span className="text-xs text-navy-400">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button onClick={() => { setFile(null); setMessages([]) }} className="p-1 rounded hover:bg-navy-100 text-navy-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: '380px' }}>
              {messages.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Bot className="w-10 h-10 text-navy-300 mx-auto mb-3" />
                  <p className="text-navy-400 text-sm">Ask any question about your contract.</p>
                  <p className="text-navy-300 text-xs mt-1">e.g. "What are the termination conditions?"</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 animate-fadeUp ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role !== 'user' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'error' ? 'bg-rose-100' : 'bg-navy-100'}`}>
                      <Bot className={`w-4 h-4 ${msg.role === 'error' ? 'text-rose-600' : 'text-navy-700'}`} />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-navy-900 text-white rounded-br-md'
                      : msg.role === 'error'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-md'
                        : 'bg-navy-50 text-navy-800 border border-navy-100 rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start animate-fadeUp">
                  <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-navy-700" />
                  </div>
                  <div className="bg-navy-50 border border-navy-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2 text-navy-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing contract and generating answer…
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-navy-100 p-4">
              <div className="flex gap-3">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your contract…"
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-sm rounded-xl border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none disabled:bg-navy-50 disabled:text-navy-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!question.trim() || loading}
                  className="px-5 py-3 bg-navy-900 hover:bg-navy-800 disabled:bg-navy-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
