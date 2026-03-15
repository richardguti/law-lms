'use client'
import { useAIStore } from '@/store/useAIStore'
import { AIFileUploader } from '@/components/ai/AIFileUploader'
import { FolderOpen, Trash2, FileText } from 'lucide-react'

export default function DocsPage() {
  const { documents, addDocument, removeDocument, clearDocuments } = useAIStore()

  return (
    <div className="min-h-screen bg-[#F2F4FF] p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B5CE7]">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A2340]">My Documents</h1>
            <p className="text-sm text-[#8896AB]">Shared across all AI sessions</p>
          </div>
        </div>

        {/* Uploader */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <AIFileUploader onSuccess={addDocument} label="Add documents" />
        </div>

        {/* Document list */}
        {documents.length === 0 ? (
          <div className="rounded-2xl bg-white py-12 text-center shadow-sm ring-1 ring-black/5">
            <FolderOpen className="mx-auto mb-3 h-10 w-10 text-[#E4E9F2]" />
            <p className="text-[0.88rem] text-[#8896AB]">No documents uploaded yet</p>
            <p className="mt-1 text-[0.78rem] text-[#8896AB]">Upload PDFs, Word docs, or text files to reference them in your study sessions</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[0.82rem] font-semibold text-[#4A5568]">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
              <button
                onClick={clearDocuments}
                className="text-[0.78rem] text-[#8896AB] hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
            {documents.map((doc) => (
              <div
                key={doc.filename}
                className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5"
              >
                <FileText className="h-5 w-5 flex-shrink-0 text-[#6B5CE7]" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[0.85rem] font-medium text-[#1A2340]">{doc.filename}</p>
                  <p className="text-[0.72rem] text-[#8896AB]">{(doc.text.length / 1000).toFixed(1)}k characters</p>
                </div>
                <button
                  onClick={() => removeDocument(doc.filename)}
                  className="flex-shrink-0 rounded-lg p-1.5 text-[#8896AB] hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
