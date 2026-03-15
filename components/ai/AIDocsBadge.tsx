'use client'
import { useAIStore } from '@/store/useAIStore'

export function AIDocsBadge() {
  const count = useAIStore((s) => s.documents.length)
  if (!count) return null
  return (
    <span className="ml-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#6B5CE7] px-1 text-[0.6rem] font-bold text-white">
      {count}
    </span>
  )
}
