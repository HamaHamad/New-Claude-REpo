'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, FolderOpen, FileText, BarChart3, Shield,
  Users, Settings, Bell, Search, LogOut,
  FileCheck, MessageSquare, Menu, X, Sun, Moon, Plus, Scale,
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

function NavItem({ item, onClick }: { item: typeof NAV[0]; onClick?: () => void }) {
  const pathname = usePathname()
  const active   = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon     = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      style={active ? {
        background: 'var(--brand-dim)',
        color: 'var(--brand)',
        border: '1px solid var(--brand-glow)',
        borderRadius: '10px',
      } : {
        borderRadius: '10px',
        border: '1px solid transparent',
      }}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all duration-150 group
        ${active
          ? ''
          : 'text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-subtle)]'
        }`}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0 transition-colors"
        style={{ color: active ? 'var(--brand)' : undefined }}
      />
      {item.label}
    </Link>
  )
}

function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const { data: session } = useSession()
  const name     = session?.user?.name ?? 'User'
  const email    = session?.user?.email ?? ''
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <Scale className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-base" style={{ color: 'var(--text-1)' }}>
            ImmigAI
          </span>
        </Link>
      </div>

      {/* New Case CTA */}
      <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link
          href="/case/create"
          onClick={onNavClick}
          className="btn-primary w-full justify-center text-xs py-2"
        >
          <Plus className="w-3.5 h-3.5" />
          New Case
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <NavItem key={item.href} item={item} onClick={onNavClick} />
        ))}
        <div className="pt-3 mt-3 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
          <NavItem item={{ label: 'Settings', href: '/settings', icon: Settings }} onClick={onNavClick} />
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--danger)'
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.06)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--brand) 0%, #2563EB 100%)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-1)' }}>{name}</div>
            <div className="text-[10px] truncate" style={{ color: 'var(--text-4)' }}>{email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark]           = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') { setIsDark(true); document.documentElement.classList.add('dark') }
    else { setIsDark(false); document.documentElement.classList.remove('dark') }
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(16,19,26,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[220px] flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}
      >
        <button
          className="absolute top-3 right-3 lg:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-3)' }}
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
        <Sidebar onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header
          className="h-14 flex items-center px-4 gap-3 flex-shrink-0"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}
        >
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-3)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-4)' }} />
              <input
                type="text"
                placeholder="Search cases, clients…"
                className="w-full rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none transition-all"
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-1)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => {
                  (e.target as HTMLElement).style.borderColor = 'var(--brand)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 0 0 3px var(--brand-dim)'
                }}
                onBlur={e => {
                  (e.target as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.target as HTMLElement).style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark
                ? <Sun  className="w-4 h-4" style={{ color: '#FBBF24' }} />
                : <Moon className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
              }
            </button>

            {/* Notifications */}
            <button
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
            >
              <Bell className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} />
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
