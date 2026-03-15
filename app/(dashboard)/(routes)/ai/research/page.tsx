'use client'
import { useCallback } from 'react'
import { useAIStore } from '@/store/useAIStore'
import { useAIChat } from '@/hooks/useAIChat'
import { AIChatInterface } from '@/components/ai/AIChatInterface'
import { AIFileUploader } from '@/components/ai/AIFileUploader'
import type { ChatMessage, ApiMsg } from '@/lib/ai-types'

export default function ResearchPage() {
  const {
    researchMessages, researchApiMessages,
    addResearchMessage, setResearchApiMessages,
    clearResearch, documents, addDocument,
  } = useAIStore()

  const handleMessage = useCallback((msg: ChatMessage) => addResearchMessage(msg), [addResearchMessage])
  const handleUpdateApi = useCallback((msgs: ApiMsg[]) => setResearchApiMessages(msgs), [setResearchApiMessages])

  const { sendMessage, isStreaming, streamingText, streamingTools } = useAIChat(
    'research', researchApiMessages, documents, handleMessage, handleUpdateApi,
  )

  const handleSend = (text: string) => {
    addResearchMessage({ role: 'user', content: text })
    sendMessage(text)
  }

  const templates = [
    'Draft a legal memo on [issue] under [jurisdiction] law',
    'Write a case brief for [case name]',
    'Coach me through IRAC for this hypo: [facts]',
    'What is the circuit split on [issue]?',
    'Draft a demand letter for [situation]',
    'Analyze whether [statute] preempts [state law]',
  ]

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#F2F4FF]">
      {/* Left panel */}
      <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-[#E4E9F2] bg-white p-4 space-y-4">
        <div>
          <h2 className="text-[0.78rem] font-bold uppercase tracking-widest text-[#8896AB] mb-2">Research Tools</h2>
          <div className="space-y-1.5">
            {templates.map((t, i) => (
              <button
                key={i}
                onClick={() => handleSend(t)}
                disabled={isStreaming}
                className="w-full rounded-lg bg-[#F2F4FF] px-3 py-2 text-left text-[0.72rem] text-[#4A5568] hover:bg-[#EEF0FF] hover:text-[#6B5CE7] transition-colors disabled:opacity-50"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <AIFileUploader
          onSuccess={addDocument}
          label="Upload Case Materials"
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

        <button
          onClick={clearResearch}
          className="w-full rounded-lg border border-[#E4E9F2] py-1.5 text-[0.78rem] text-[#8896AB] hover:border-red-300 hover:text-red-500 transition-colors"
        >
          Clear Session
        </button>
      </aside>

      {/* Chat */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#F8F9FE]">
        <div className="border-b border-[#E4E9F2] bg-white px-5 py-3">
          <h1 className="text-[0.95rem] font-bold text-[#1A2340]">
            Legal Research · <span className="text-[#2D9CDB]">Senior Associate</span>
          </h1>
          <p className="text-[0.75rem] text-[#8896AB]">Memos · Case Briefs · IRAC · Analysis</p>
        </div>
        <AIChatInterface
          messages={researchMessages}
          isStreaming={isStreaming}
          streamingText={streamingText}
          streamingTools={streamingTools}
          onSend={handleSend}
          placeholder="Ask for a memo, brief a case, or analyze an issue…"
        />
      </main>
    </div>
  )
}
