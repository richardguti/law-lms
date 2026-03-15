import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name
    const ext = filename.split('.').pop()?.toLowerCase() ?? ''

    let text = ''

    if (ext === 'pdf') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse')
      const parsed = await pdfParse(buffer)
      text = parsed.text
    } else if (ext === 'docx') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else {
      text = buffer.toString('utf-8')
    }

    // Cap at 50k characters to avoid massive token usage
    if (text.length > 50000) {
      text = text.slice(0, 50000) + '\n\n[Document truncated at 50,000 characters]'
    }

    return NextResponse.json({ filename, text })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
