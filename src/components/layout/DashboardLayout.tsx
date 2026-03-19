'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, FolderOpen, FileText, BarChart3, Shield,
  Users, Settings, Scale, Bell, Search, LogOut,
  Globe, Plus, FileCheck, MessageSquare, Menu, X,
  Sun, Moon
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Cases',     href: '/cases',       icon: FolderOpen      },
  { label: 'Forms',     href: '/forms',       icon: FileCheck       },
  { label: 'Assistant', href: '/assistant',   icon: MessageSquare   },
  { label: 'Documents', href: '/documents',   icon: FileText        },
  { label: 'Analytics', href: '/analytics',   icon: BarChart3       },
  { label: 'Compliance',href: '/compliance',  icon: Shield          },
  { label: 'Clients',   href: '/clients',     icon: Users           },
]

const NAV2 = [
  { label: 'Settings', href: '/settings', icon: Settings },
]

function NavItem({ item, onClick }: { item: typeof NAV[0]; onClick?: () => void }) {
  const pathname = usePathname()
  const active = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon
  return (
    <Link href={item.href} onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
        ${active
          ? 'bg-brand-600/15 text-brand-600 dark:text-brand-400 border border-brand-500/20'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'}`}>
      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors
        ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'}`} />
      {item.label}
    </Link>
  )
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { data: session } = useSession()
  const name = session?.user?.name ?? 'User'
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-slate-200 dark:border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-white text-base">ImmigAI</span>
        </Link>
      </div>

      {/* New case CTA */}
      <div className="px-3 py-3 border-b border-slate-200 dark:border-white/[0.06]">
        <Link href="/case/create" onClick={onNavClick}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-sm font-medium transition-all">
          <Plus className="w-4 h-4" />
          New Case
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => <NavItem key={item.href} item={item} onClick={onNavClick} />)}
        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/[0.05] space-y-0.5">
          {NAV2.map(item => <NavItem key={item.href} item={item} onClick={onNavClick} />)}
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.06] space-y-1">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-500 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 dark:text-white text-xs font-medium truncate">{name}</div>
            <div className="text-slate-400 dark:text-slate-600 text-[10px] truncate">{(session?.user as any)?.role ?? 'attorney'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Light mode default — initialize from localStorage or default to light
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Close sidebar on route change
  const pathname = usePathname()
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0d1117] overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide in when open */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 flex-shrink-0
        bg-white dark:bg-[#0d1117]
        border-r border-slate-200 dark:border-white/[0.06]
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile close button */}
        <button
          className="absolute top-3 right-3 lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          onClick={() => setSidebarOpen(false)}>
          <X className="w-4 h-4" />
        </button>
        <SidebarContent onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-200 dark:border-white/[0.06] flex items-center px-4 gap-3 bg-white dark:bg-[#0d1117] flex-shrink-0">

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases, clients..."
                className="w-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.07] flex items-center justify-center transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-slate-500" />}
            </button>

            <button className="relative w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.07] flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>

            <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.07] flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
