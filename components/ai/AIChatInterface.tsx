'use client'
import { useRef, useEffect, useState, KeyboardEvent } from 'react'
import type { ChatMessage } from '@/lib/ai-types'

interface Props {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingText: string
  streamingTools: string[]
  onSend: (text: string) => void
  placeholder?: string
}

function ToolBadge({ name }: { name: string }) {
  const labels: Record<string, string> = {
    format_outline: '📋 Formatting outline…',
    create_case_brief: '📜 Briefing case…',
    draft_memo: '📄 Drafting memo…',
    web_search: '🔍 Searching web…',
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[0.72rem] font-medium text-[#6B5CE7]">
      {labels[name] ?? `🔧 ${name}`}
    </span>
  )
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5CE7] text-[0.7rem] font-bold text-white shadow-sm">
          B
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-[0.88rem] leading-relaxed shadow-sm ${
          isUser
            ? 'rounded-tr-sm bg-[#6B5CE7] text-white'
            : 'rounded-tl-sm bg-white text-[#2D3748] ring-1 ring-black/5'
        }`}
      >
        {msg.toolsUsed?.length ? (
          <div className="mb-2 flex flex-wrap gap-1">
            {msg.toolsUsed.map((t, i) => (
              <ToolBadge key={i} name={t} />
            ))}
          </div>
        ) : null}
        <div
          className="prose prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
        />
      </div>
      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1A2340] text-[0.7rem] font-bold text-[#C9A84C] shadow-sm">
          BLE
        </div>
      )}
    </div>
  )
}

function formatMessage(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-gray-100 px-1 py-0.5 text-[0.82em] font-mono">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}

export function AIChatInterface({
  messages,
  isStreaming,
  streamingText,
  streamingTools,
  onSend,
  placeholder = 'Ask anything…',
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    onSend(text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex h-full items-center justify-center text-[0.88rem] text-[#8896AB]">
            Start the conversation…
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {/* Streaming bubble */}
        {isStreaming && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#6B5CE7] text-[0.7rem] font-bold text-white shadow-sm">
              B
            </div>
            <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[0.88rem] leading-relaxed shadow-sm ring-1 ring-black/5">
              {streamingTools.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {streamingTools.map((t, i) => (
                    <ToolBadge key={i} name={t} />
                  ))}
                </div>
              )}
              {streamingText ? (
                <div
                  className="prose prose-sm max-w-none [&>p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: formatMessage(streamingText) }}
                />
              ) : (
                <span className="streaming-cursor inline-block h-4 w-0.5 animate-pulse bg-[#6B5CE7]" />
              )}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[#E4E9F2] bg-white px-4 py-3">
        <div className="flex items-end gap-2 rounded-2xl border border-[#E4E9F2] bg-[#F8F9FE] px-4 py-2 focus-within:border-[#6B5CE7] focus-within:ring-2 focus-within:ring-[#6B5CE7]/20 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); handleInput() }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none bg-transparent text-[0.88rem] text-[#2D3748] placeholder:text-[#8896AB] focus:outline-none disabled:opacity-60"
            style={{ minHeight: '24px', maxHeight: '160px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#6B5CE7] text-white transition-all hover:bg-[#5a4dd0] disabled:opacity-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-center text-[0.68rem] text-[#8896AB]">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
