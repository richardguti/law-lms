'use client'
import { useRef, useState, DragEvent } from 'react'
import { useAIFileUpload } from '@/hooks/useAIFileUpload'
import type { UploadedDoc } from '@/lib/ai-types'

interface Props {
  onSuccess: (doc: UploadedDoc) => void
  label?: string
  compact?: boolean
}

export function AIFileUploader({ onSuccess, label, compact = false }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, isUploading, error } = useAIFileUpload(onSuccess)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) {
      uploadFile(file)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  if (compact) {
    return (
      <div className="space-y-1">
        {label && <div className="text-[0.75rem] font-semibold text-[#4A5568]">{label}</div>}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full rounded-lg border border-dashed border-[#E4E9F2] bg-[#F8F9FE] px-3 py-2 text-[0.78rem] text-[#8896AB] hover:border-[#6B5CE7] hover:text-[#6B5CE7] transition-colors disabled:opacity-50"
        >
          {isUploading ? '📤 Uploading…' : '📎 Click to attach files (PDF, DOCX, TXT)'}
        </button>
        <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.txt,.md" className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
        {error && <p className="text-[0.72rem] text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && <div className="text-[0.82rem] font-semibold text-[#4A5568]">{label}</div>}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all
          ${dragging ? 'border-[#6B5CE7] bg-[#EEF0FF]' : 'border-[#E4E9F2] bg-[#F8F9FE] hover:border-[#6B5CE7] hover:bg-[#EEF0FF]/50'}
          ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div className="text-3xl mb-2">📄</div>
        <div className="text-[0.88rem] font-semibold text-[#4A5568]">
          {isUploading ? 'Uploading…' : 'Drag & drop or click to upload'}
        </div>
        <div className="mt-1 text-[0.75rem] text-[#8896AB]">PDF, DOCX, TXT, MD supported</div>
      </div>
      <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.txt,.md" className="hidden"
        onChange={(e) => handleFiles(e.target.files)} />
      {error && <p className="text-[0.75rem] text-red-500">{error}</p>}
    </div>
  )
}
