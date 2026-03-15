import { Brain, BookOpen, FileText, Search, FolderOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'

const skills = [
  {
    href: '/ai/study',
    icon: Brain,
    title: 'Study Session',
    description: 'Socratic dialogue with Professor B. Law-school-grade questioning that builds real understanding.',
    color: 'from-[#6B5CE7] to-[#8B7CF6]',
    badge: 'Socratic',
  },
  {
    href: '/ai/outline',
    icon: FileText,
    title: 'Outline Generator',
    description: 'Transform notes or generate a complete four-tier law school outline for any subject.',
    color: 'from-[#C9A84C] to-[#E8C96A]',
    badge: 'Four-Tier Format',
  },
  {
    href: '/ai/research',
    icon: Search,
    title: 'Legal Research',
    description: 'Draft legal memos, case briefs, IRAC essays, and research analyses.',
    color: 'from-[#2D9CDB] to-[#56CCF2]',
    badge: 'IRAC · Memo',
  },
]

const quickLinks = [
  { href: '/ai/docs', icon: FolderOpen, label: 'My Documents' },
  { href: '/ai/study', icon: BookOpen, label: 'Resume Study' },
]

export default function AIHomePage() {
  return (
    <div className="min-h-screen bg-[#F2F4FF] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B5CE7] shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A2340]">AI Law Assistant</h1>
            <p className="text-sm text-[#8896AB]">Powered by Claude · Bianna Lee Estrella</p>
          </div>
        </div>
      </div>

      {/* Skill cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {skills.map((skill) => {
          const Icon = skill.icon
          return (
            <Link
              key={skill.href}
              href={skill.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${skill.color}`} />
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${skill.color} shadow-sm`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-[1rem] font-bold text-[#1A2340]">{skill.title}</h3>
                <span className="rounded-full bg-[#F2F4FF] px-2 py-0.5 text-[0.65rem] font-semibold text-[#6B5CE7]">
                  {skill.badge}
                </span>
              </div>
              <p className="text-[0.82rem] leading-relaxed text-[#8896AB]">{skill.description}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[0.85rem] font-medium text-[#4A5568] shadow-sm ring-1 ring-black/5 transition-all hover:ring-[#6B5CE7] hover:text-[#6B5CE7]"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
