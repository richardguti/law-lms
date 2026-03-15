'use client'

import { BarChart, Brain, Compass, FileText, FolderOpen, Layout, List, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarItem } from './sidebar-item'
import { useAIStore } from '@/store/useAIStore'

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
]

const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
]

const aiRoutes = [
  {
    icon: Brain,
    label: 'Study Session',
    href: '/ai/study',
  },
  {
    icon: FileText,
    label: 'Outline Generator',
    href: '/ai/outline',
  },
  {
    icon: Search,
    label: 'Legal Research',
    href: '/ai/research',
  },
  {
    icon: FolderOpen,
    label: 'My Documents',
    href: '/ai/docs',
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname()
  const docCount = useAIStore((s) => s.documents.length)

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isAIPage = pathname?.startsWith('/ai')

  const routes = isTeacherPage ? teacherRoutes : guestRoutes

  return (
    <div className="flex w-full flex-col">
      {routes.map((route) => (
        <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
      ))}

      {/* AI section divider */}
      <div className="mx-3 my-2 border-t border-slate-200" />
      <p className="px-4 pb-1 text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
        AI Assistant
      </p>
      {aiRoutes.map((route) => (
        <div key={route.href} className="relative">
          <SidebarItem icon={route.icon} label={route.label} href={route.href} />
          {route.href === '/ai/docs' && docCount > 0 && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#6B5CE7] px-1 text-[0.6rem] font-bold text-white">
              {docCount}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
