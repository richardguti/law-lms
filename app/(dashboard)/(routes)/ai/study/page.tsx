'use client'
import { useCallback } from 'react'
import { useAIStore } from '@/store/useAIStore'
import { useAIChat } from '@/hooks/useAIChat'
import { AIChatInterface } from '@/components/ai/AIChatInterface'
import { AIFileUploader } from '@/components/ai/AIFileUploader'
import { SUBJECTS, SESSION_MODES, FOCUS_TOPICS } from '@/lib/ai-constants'
import type { ChatMessage, ApiMsg } from '@/lib/ai-types'

export default function StudyPage() {
  const {
    studyMessages, studyApiMessages, studySubject, studyMode, studyFocus,
    addStudyMessage, setStudyApiMessages, setStudySubject, setStudyMode,
    setStudyFocus, clearStudy, documents, addDocument,
  } = useAIStore()

  const handleMessage = useCallback((msg: ChatMessage) => addStudyMessage(msg), [addStudyMessage])
  const handleUpdateApi = useCallback((msgs: ApiMsg[]) => setStudyApiMessages(msgs), [setStudyApiMessages])

  const { sendMessage, isStreaming, streamingText, streamingTools } = useAIChat(
    'study', studyApiMessages, documents, handleMessage, handleUpdateApi,
  )

  const handleSend = (text: string) => {
    addStudyMessage({ role: 'user', content: text })
    sendMessage(text)
  }

  const focusTopics = FOCUS_TOPICS[studySubject] ?? []

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#F2F4FF]">
      {/* Left panel — settings */}
      <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-[#E4E9F2] bg-white p-4 space-y-4">
        <div>
          <h2 className="text-[0.78rem] font-bold uppercase tracking-widest text-[#8896AB] mb-2">Session Config</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[0.75rem] font-semibold text-[#4A5568]">Subject</label>
              <select
                value={studySubject}
                onChange={(e) => setStudySubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E4E9F2] bg-[#F8F9FE] px-2 py-1.5 text-[0.82rem] text-[#2D3748] focus:border-[#6B5CE7] focus:outline-none"
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.75rem] font-semibold text-[#4A5568]">Mode</label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E4E9F2] bg-[#F8F9FE] px-2 py-1.5 text-[0.82rem] text-[#2D3748] focus:border-[#6B5CE7] focus:outline-none"
              >
                {SESSION_MODES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            {focusTopics.length > 0 && (
              <div>
                <label className="text-[0.75rem] font-semibold text-[#4A5568]">Focus Topic</label>
                <select
                  value={studyFocus}
                  onChange={(e) => setStudyFocus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E4E9F2] bg-[#F8F9FE] px-2 py-1.5 text-[0.82rem] text-[#2D3748] focus:border-[#6B5CE7] focus:outline-none"
                >
                  {focusTopics.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <AIFileUploader
          onSuccess={addDocument}
          label="Upload Notes"
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
          onClick={clearStudy}
          className="w-full rounded-lg border border-[#E4E9F2] py-1.5 text-[0.78rem] text-[#8896AB] hover:border-red-300 hover:text-red-500 transition-colors"
        >
          Clear Session
        </button>
      </aside>

      {/* Right panel — chat */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#F8F9FE]">
        <div className="border-b border-[#E4E9F2] bg-white px-5 py-3">
          <h1 className="text-[0.95rem] font-bold text-[#1A2340]">
            Study Session · <span className="text-[#6B5CE7]">{studySubject}</span>
          </h1>
          <p className="text-[0.75rem] text-[#8896AB]">{studyMode.split(' — ')[0]} · {studyFocus}</p>
        </div>
        <AIChatInterface
          messages={studyMessages}
          isStreaming={isStreaming}
          streamingText={streamingText}
          streamingTools={streamingTools}
          onSend={handleSend}
          placeholder={`Ask Professor B about ${studySubject}…`}
        />
      </main>
    </div>
  )
}
