'use client'
import { useState } from 'react'
import type { UploadedDoc } from '@/lib/ai-types'

export function useAIFileUpload(onSuccess: (doc: UploadedDoc) => void) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/ai-upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const doc = (await res.json()) as UploadedDoc
      onSuccess(doc)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading, error }
}
