'use client'
import { useState, useCallback } from 'react'
import type { Skill, ChatMessage, ApiMsg, UploadedDoc } from '@/lib/ai-types'

export function useAIChat(
  skill: Skill,
  apiMessages: ApiMsg[],
  documents: UploadedDoc[],
  onMessage: (msg: ChatMessage) => void,
  onUpdateApiMessages: (msgs: ApiMsg[]) => void,
) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [streamingTools, setStreamingTools] = useState<string[]>([])

  const sendMessage = useCallback(
    async (userText: string) => {
      const updatedApiMessages: ApiMsg[] = [
        ...apiMessages,
        { role: 'user', content: userText },
      ]

      setIsStreaming(true)
      setStreamingText('')
      setStreamingTools([])

      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiMessages: updatedApiMessages,
            skill,
            documentTexts: documents.map((d) => ({
              filename: d.filename,
              text: d.text,
            })),
          }),
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        if (!res.body) throw new Error('No response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''
        const tools: string[] = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const raw = decoder.decode(value, { stream: true })
          for (const line of raw.split('\n')) {
            if (!line.startsWith('data: ')) continue
            try {
              const data = JSON.parse(line.slice(6)) as {
                type: string
                text?: string
                name?: string
                messages?: ApiMsg[]
                message?: string
              }

              if (data.type === 'text' && data.text) {
                fullText += data.text
                setStreamingText(fullText)
              } else if (data.type === 'tool_use' && data.name) {
                tools.push(data.name)
                setStreamingTools([...tools])
              } else if (data.type === 'done' && data.messages) {
                onUpdateApiMessages(data.messages)
                onMessage({
                  role: 'assistant',
                  content: fullText,
                  toolsUsed: tools.length ? tools : undefined,
                })
              } else if (data.type === 'error') {
                throw new Error(data.message ?? 'Unknown error')
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      } finally {
        setIsStreaming(false)
        setStreamingText('')
        setStreamingTools([])
      }
    },
    [skill, apiMessages, documents, onMessage, onUpdateApiMessages],
  )

  return { sendMessage, isStreaming, streamingText, streamingTools }
}
