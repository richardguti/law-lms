'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, UploadedDoc, ApiMsg } from '@/lib/ai-types'

interface AIState {
  // Shared documents
  documents: UploadedDoc[]
  addDocument: (doc: UploadedDoc) => void
  removeDocument: (filename: string) => void
  clearDocuments: () => void

  // Study session
  studyMessages: ChatMessage[]
  studyApiMessages: ApiMsg[]
  studySubject: string
  studyMode: string
  studyFocus: string
  studyActive: boolean
  addStudyMessage: (msg: ChatMessage) => void
  setStudyApiMessages: (msgs: ApiMsg[]) => void
  setStudySubject: (v: string) => void
  setStudyMode: (v: string) => void
  setStudyFocus: (v: string) => void
  setStudyActive: (v: boolean) => void
  clearStudy: () => void

  // Outline
  outlineMessages: ChatMessage[]
  outlineApiMessages: ApiMsg[]
  outlineSubject: string
  outlineDepth: string
  outlineResult: string
  addOutlineMessage: (msg: ChatMessage) => void
  setOutlineApiMessages: (msgs: ApiMsg[]) => void
  setOutlineSubject: (v: string) => void
  setOutlineDepth: (v: string) => void
  setOutlineResult: (v: string) => void
  clearOutline: () => void

  // Research
  researchMessages: ChatMessage[]
  researchApiMessages: ApiMsg[]
  addResearchMessage: (msg: ChatMessage) => void
  setResearchApiMessages: (msgs: ApiMsg[]) => void
  clearResearch: () => void
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      // Documents
      documents: [],
      addDocument: (doc) =>
        set((s) => ({
          documents: s.documents.some((d) => d.filename === doc.filename)
            ? s.documents
            : [...s.documents, doc],
        })),
      removeDocument: (filename) =>
        set((s) => ({ documents: s.documents.filter((d) => d.filename !== filename) })),
      clearDocuments: () => set({ documents: [] }),

      // Study
      studyMessages: [],
      studyApiMessages: [],
      studySubject: 'Contracts',
      studyMode: 'STUDY — Socratic mode, fact patterns only',
      studyFocus: 'Mutual Assent',
      studyActive: false,
      addStudyMessage: (msg) => set((s) => ({ studyMessages: [...s.studyMessages, msg] })),
      setStudyApiMessages: (msgs) => set({ studyApiMessages: msgs }),
      setStudySubject: (v) => set({ studySubject: v }),
      setStudyMode: (v) => set({ studyMode: v }),
      setStudyFocus: (v) => set({ studyFocus: v }),
      setStudyActive: (v) => set({ studyActive: v }),
      clearStudy: () =>
        set({ studyMessages: [], studyApiMessages: [], studyActive: false }),

      // Outline
      outlineMessages: [],
      outlineApiMessages: [],
      outlineSubject: 'Contracts',
      outlineDepth: 'midterm',
      outlineResult: '',
      addOutlineMessage: (msg) => set((s) => ({ outlineMessages: [...s.outlineMessages, msg] })),
      setOutlineApiMessages: (msgs) => set({ outlineApiMessages: msgs }),
      setOutlineSubject: (v) => set({ outlineSubject: v }),
      setOutlineDepth: (v) => set({ outlineDepth: v }),
      setOutlineResult: (v) => set({ outlineResult: v }),
      clearOutline: () =>
        set({ outlineMessages: [], outlineApiMessages: [], outlineResult: '' }),

      // Research
      researchMessages: [],
      researchApiMessages: [],
      addResearchMessage: (msg) =>
        set((s) => ({ researchMessages: [...s.researchMessages, msg] })),
      setResearchApiMessages: (msgs) => set({ researchApiMessages: msgs }),
      clearResearch: () => set({ researchMessages: [], researchApiMessages: [] }),
    }),
    {
      name: 'bianna-ai-store',
      partialize: (s) => ({
        documents: s.documents,
        studyMessages: s.studyMessages,
        studyApiMessages: s.studyApiMessages,
        studySubject: s.studySubject,
        studyMode: s.studyMode,
        studyFocus: s.studyFocus,
        outlineMessages: s.outlineMessages,
        outlineApiMessages: s.outlineApiMessages,
        outlineSubject: s.outlineSubject,
        outlineDepth: s.outlineDepth,
        outlineResult: s.outlineResult,
        researchMessages: s.researchMessages,
        researchApiMessages: s.researchApiMessages,
      }),
    },
  ),
)
