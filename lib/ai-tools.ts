import type Anthropic from '@anthropic-ai/sdk'

export const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'format_outline',
    description: 'Format and structure a legal outline in the standard four-tier law school format. Use this when the user asks to generate, improve, or restructure an outline.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: { type: 'string', description: 'The law school subject' },
        content: { type: 'string', description: 'The outline content to format' },
      },
      required: ['subject', 'content'],
    },
  },
  {
    name: 'create_case_brief',
    description: 'Create a structured case brief with Facts, Issue, Holding, Reasoning, and Significance sections.',
    input_schema: {
      type: 'object' as const,
      properties: {
        case_name: { type: 'string', description: 'Full case name and citation' },
        content: { type: 'string', description: 'The case information to brief' },
      },
      required: ['case_name', 'content'],
    },
  },
  {
    name: 'draft_memo',
    description: 'Draft a legal memorandum with Issue, Brief Answer, Facts, Analysis, and Conclusion sections.',
    input_schema: {
      type: 'object' as const,
      properties: {
        question_presented: { type: 'string', description: 'The legal question to analyze' },
        facts: { type: 'string', description: 'The relevant facts' },
        jurisdiction: { type: 'string', description: 'The applicable jurisdiction' },
      },
      required: ['question_presented', 'facts'],
    },
  },
]

export function executeToolCall(
  name: string,
  input: Record<string, unknown>,
): string {
  switch (name) {
    case 'format_outline':
      return `[Outline formatting applied for ${input.subject}. Content structured in four-tier format.]`
    case 'create_case_brief':
      return `[Case brief structure applied for ${input.case_name}.]`
    case 'draft_memo':
      return `[Legal memo structure applied. Question presented: ${input.question_presented}]`
    default:
      return `[Tool ${name} executed]`
  }
}
