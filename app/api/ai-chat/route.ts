import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '@/lib/ai-prompts'
import { AI_TOOLS, executeToolCall } from '@/lib/ai-tools'
import type { Skill, UploadedDoc } from '@/lib/ai-types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  const { apiMessages, skill, documentTexts } = (await req.json()) as {
    apiMessages: Anthropic.MessageParam[]
    skill: Skill
    documentTexts: UploadedDoc[]
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const system = buildSystemPrompt(skill, documentTexts)
  const current: Anthropic.MessageParam[] = [...apiMessages]
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          // controller already closed
        }
      }

      try {
        while (true) {
          const anthropicStream = client.messages.stream({
            model: 'claude-opus-4-6',
            max_tokens: 8096,
            thinking: { type: 'enabled', budget_tokens: 8000 },
            system,
            messages: current,
            tools: AI_TOOLS as unknown as Anthropic.Tool[],
          })

          // Stream text deltas in real time
          anthropicStream.on('text', (text) => {
            send({ type: 'text', text })
          })

          const finalMsg = await anthropicStream.finalMessage()

          // Append assistant turn to history
          current.push({ role: 'assistant', content: finalMsg.content })

          if (finalMsg.stop_reason !== 'tool_use') break

          // Execute each tool and collect results
          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const block of finalMsg.content) {
            if (block.type === 'tool_use') {
              send({ type: 'tool_use', name: block.name })
              if (block.name !== 'web_search') {
                const result = executeToolCall(
                  block.name,
                  block.input as Record<string, unknown>,
                )
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: result,
                })
              }
            }
          }
          if (toolResults.length) {
            current.push({ role: 'user', content: toolResults })
          }
        }

        send({ type: 'done', messages: current })
      } catch (err) {
        send({ type: 'error', message: String(err) })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
