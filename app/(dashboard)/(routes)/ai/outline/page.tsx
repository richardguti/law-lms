'use client'
import { useCallback } from 'react'
import { useAIStore } from '@/store/useAIStore'
import { useAIChat } from '@/hooks/useAIChat'
import { AIChatInterface } from '@/components/ai/AIChatInterface'
import { AIFileUploader } from '@/components/ai/AIFileUploader'
import { SUBJECTS, OUTLINE_DEPTHS } from '@/lib/ai-constants'
import type { ChatMessage, ApiMsg } from '@/lib/ai-types'

export default function OutlinePage() {
  const {
    outlineMessages, outlineApiMessages, outlineSubject, outlineDepth,
    addOutlineMessage, setOutlineApiMessages, setOutlineSubject, setOutlineDepth,
    clearOutline, documents, addDocument,
  } = useAIStore()

  const handleMessage = useCallback((msg: ChatMessage) => addOutlineMessage(msg), [addOutlineMessage])
  const handleUpdateApi = useCallback((msgs: ApiMsg[]) => setOutlineApiMessages(msgs), [setOutlineApiMessages])

  const { sendMessage, isStreaming, streamingText, streamingTools } = useAIChat(
    'outline', outlineApiMessages, documents, handleMessage, handleUpdateApi,
  )

  const handleSend = (text: string) => {
    addOutlineMessage({ role: 'user', content: text })
    sendMessage(text)
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#F2F4FF]">
      {/* Left panel */}
      <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-[#E4E9F2] bg-white p-4 space-y-4">
        <div>
          <h2 className="text-[0.78rem] font-bold uppercase tracking-widest text-[#8896AB] mb-2">Outline Config</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[0.75rem] font-semibold text-[#4A5568]">Subject</label>
              <select
                value={outlineSubject}
                onChange={(e) => setOutlineSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E4E9F2] bg-[#F8F9FE] px-2 py-1.5 text-[0.82rem] text-[#2D3748] focus:border-[#6B5CE7] focus:outline-none"
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.75rem] font-semibold text-[#4A5568]">Depth</label>
              <select
                value={outlineDepth}
                onChange={(e) => setOutlineDepth(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E4E9F2] bg-[#F8F9FE] px-2 py-1.5 text-[0.82rem] text-[#2D3748] focus:border-[#6B5CE7] focus:outline-none"
              >
                {OUTLINE_DEPTHS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <AIFileUploader
          onSuccess={addDocument}
          label="Upload Notes to Outline"
          compact
        />

        {documents.length > 0 && (
          <div>
            <p className="text-[0.72rem] font-semibold text-[#8896AB] mb-1">Loaded ({documents.length})</p>
            <ul className="space-y-1">
              {documents.map((d) => (
                <li key={d.filename} className="text-[0.72rem] text-[#4A5568] truncate">📄 {d.filename}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-[#F2F4FF] p-3 text-[0.75rem] text-[#4A5568]">
          <p className="font-semibold mb-1 text-[#6B5CE7]">Quick prompts:</p>
          <ul className="space-y-1 text-[0.72rem]">
            <li>• "Generate a full midterm outline"</li>
            <li>• "Outline just the remedies section"</li>
            <li>• "Transform my notes into outline format"</li>
            <li>• "Add minority rules to this outline"</li>
          </ul>
        </div>

        <button
          onClick={clearOutline}
          className="w-full rounded-lg border border-[#E4E9F2] py-1.5 text-[0.78rem] text-[#8896AB] hover:border-red-300 hover:text-red-500 transition-colors"
        >
          Clear Session
        </button>
      </aside>

      {/* Chat */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#F8F9FE]">
        <div className="border-b border-[#E4E9F2] bg-white px-5 py-3">
          <h1 className="text-[0.95rem] font-bold text-[#1A2340]">
            Outline Generator · <span className="text-[#C9A84C]">{outlineSubject}</span>
          </h1>
          <p className="text-[0.75rem] text-[#8896AB]">
            {OUTLINE_DEPTHS.find((d) => d.value === outlineDepth)?.label ?? outlineDepth}
          </p>
        </div>
        <AIChatInterface
          messages={outlineMessages}
          isStreaming={isStreaming}
          streamingText={streamingText}
          streamingTools={streamingTools}
          onSend={handleSend}
          placeholder={`Generate a ${outlineDepth} outline for ${outlineSubject}…`}
        />
      </main>
    </div>
  )
}
