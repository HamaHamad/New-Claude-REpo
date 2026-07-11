'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search, FolderOpen, AlertCircle, CheckCircle2, Clock, Brain, Loader2 } from 'lucide-react'

interface CaseRow {
  id: string
  applicantName: string
  visaCategory: string
  caseType: string
  currentStage: string
  status: string
  approvalProbabilityScore: number
  estimatedCompletionDate: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_FILTERS = ['All', 'Active', 'Submitted', 'RFE Received', 'Approved', 'Denied'] as const
type StatusFilter = typeof STATUS_FILTERS[number]

const STATUS_LABEL: Record<string, string> = {
  active:       'Active',
  submitted:    'Submitted',
  rfe_received: 'RFE Received',
  approved:     'Approved',
  denied:       'Denied',
}

const STATUS_COLORS: Record<string, string> = {
  Active:       'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
  Submitted:    'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  'RFE Received': 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  Approved:     'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
  Denied:       'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
}

export default function CasesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm" style={{ color: 'var(--text-3)' }}>Loading…</div>}>
      <CasesPageInner />
    </Suspense>
  )
}

function CasesPageInner() {
  const params = useSearchParams()
  const initialQ = params.get('q') ?? ''

  const [cases, setCases]           = useState<CaseRow[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState(initialQ)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [page, setPage]             = useState(1)
  const pageSize = 25

  // Debounce search input
  const [searchInput, setSearchInput] = useState(initialQ)
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/cases?q=' + encodeURIComponent(search) + '&status=' + statusFilter + '&page=' + page)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        setCases(data.cases ?? [])
      })
      .catch(() => { if (!cancelled) setCases([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [search, statusFilter, page])

  const summary = useMemo(() => ({
    total:    cases.length,
    high:     cases.filter(c => c.approvalProbabilityScore < 75).length,
    rfe:      cases.filter(c => c.status === 'rfe_received').length,
    approved: cases.filter(c => c.status === 'approved').length,
  }), [cases])

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl" style={{ color: 'var(--text-1)' }}>Cases</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
              {loading ? 'Loading…' : `${summary.total} cases shown`}
            </p>
          </div>
          <Link href="/case/create" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" aria-hidden="true" /> New Case
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: 'Total Shown',  value: summary.total,    icon: FolderOpen,   color: 'text-[var(--brand)]',   bg: 'bg-[var(--brand-dim)]'   },
            { label: 'High Risk',    value: summary.high,     icon: AlertCircle,  color: 'text-rose-500',         bg: 'bg-rose-50 dark:bg-rose-500/10' },
            { label: 'RFE Pending',  value: summary.rfe,      icon: Clock,        color: 'text-amber-500',        bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { label: 'Approved',     value: summary.approved, icon: CheckCircle2, color: 'text-emerald-500',      bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card p-3 sm:p-4 flex items-center gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} aria-hidden="true" />
                </div>
                <div>
                  <div className={`font-display font-bold text-xl sm:text-2xl ${s.color}`}>{s.value}</div>
                  <div className="text-xs leading-tight" style={{ color: 'var(--text-3)' }}>{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card p-3 sm:p-4 mb-4 sm:mb-6 space-y-3">
          <label htmlFor="cases-search" className="sr-only">Search cases by applicant, visa category, or stage</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-4)' }} aria-hidden="true" />
            <input
              id="cases-search"
              type="search"
              role="searchbox"
              placeholder="Search by applicant, visa category, stage…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="input pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(1) }}
                aria-pressed={statusFilter === f}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  statusFilter === f
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-3)] border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_140px_120px_120px_80px] gap-4 px-4 py-3 border-b text-xs font-medium uppercase tracking-wide" style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}>
            <span>Applicant</span>
            <span>Visa</span>
            <span>Status</span>
            <span>Stage</span>
            <span>Score</span>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {loading ? (
              <div className="py-12 flex items-center justify-center gap-3" style={{ color: 'var(--text-3)' }}>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span className="text-sm">Loading cases…</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="py-12 text-center text-sm" style={{ color: 'var(--text-4)' }}>
                No cases match your search
              </div>
            ) : (
              cases.map(c => {
                const statusLabel = STATUS_LABEL[c.status] ?? c.status
                return (
                  <Link key={c.id} href={`/case/${c.id}`} className="block hover:bg-[var(--bg-subtle)] transition-colors">
                    {/* Mobile card view */}
                    <div className="md:hidden p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-sm" style={{ color: 'var(--text-1)' }}>{c.applicantName}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{c.visaCategory}</div>
                        </div>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[statusLabel] ?? ''}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-3)' }}>
                        <span>{c.currentStage}</span>
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3" aria-hidden="true" />{c.approvalProbabilityScore}%
                        </span>
                      </div>
                    </div>

                    {/* Desktop row view */}
                    <div className="hidden md:grid grid-cols-[1fr_140px_120px_120px_80px] gap-4 px-4 py-3.5 items-center">
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate" style={{ color: 'var(--text-1)' }}>{c.applicantName}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{new Date(c.updatedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm truncate" style={{ color: 'var(--text-2)' }}>{c.visaCategory}</div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border w-fit ${STATUS_COLORS[statusLabel] ?? ''}`}>
                        {statusLabel}
                      </span>
                      <span className="text-sm truncate" style={{ color: 'var(--text-2)' }}>{c.currentStage}</span>
                      <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-2)' }}>
                        <Brain className="w-3 h-3" style={{ color: 'var(--brand)' }} aria-hidden="true" />{c.approvalProbabilityScore}%
                      </span>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {!loading && cases.length === pageSize && (
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="btn-secondary text-xs disabled:opacity-50" aria-label="Previous page">Previous</button>
            <span className="text-xs flex items-center" style={{ color: 'var(--text-3)' }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs" aria-label="Next page">Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
