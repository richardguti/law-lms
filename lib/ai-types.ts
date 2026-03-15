export type Skill = 'study' | 'outline' | 'research'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  toolsUsed?: string[]
}

export interface UploadedDoc {
  filename: string
  text: string
}

export type ApiMsg =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: ApiBlock[] }

export type ApiBlock =
  | { type: 'text'; text: string }
  | { type: 'thinking'; thinking: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
