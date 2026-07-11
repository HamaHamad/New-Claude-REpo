'use client'

import { useState, useTransition } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  User, Bell, Shield, Link2, Brain, Building2,
  Check, AlertCircle, Loader2,
} from 'lucide-react'
import {
  updateProfile, changePassword, updateNotificationPreferences,
} from '@/lib/actions/users'

interface Preferences {
  rfe: boolean; deadline: boolean; approval: boolean
  regulatory: boolean; client: boolean; weekly: boolean
  emailEnabled: boolean; inAppEnabled: boolean
}

export function SettingsClient({
  initialUser,
  initialPrefs,
}: {
  initialUser: { name: string | null; email: string; firm?: string | null; phone?: string | null; barNumber?: string | null; title?: string | null }
  initialPrefs: Preferences
}) {
  const [activeTab, setActiveTab] = useState('profile')
  const [prefs, setPrefs] = useState<Preferences>(initialPrefs)
  const [pending, startTransition] = useTransition()
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  function showFlash(type: 'success' | 'error', msg: string) {
    setFlash({ type, msg })
    setTimeout(() => setFlash(null), 4000)
  }

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await updateProfile(fd)
      showFlash(res.success ? 'success' : 'error', res.success ? 'Profile updated' : res.error ?? 'Update failed')
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await changePassword(fd)
      showFlash(res.success ? 'success' : 'error', res.success ? 'Password changed' : res.error ?? 'Change failed')
      if (res.success) (e.target as HTMLFormElement).reset()
    })
  }

  async function togglePref(key: keyof Preferences) {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    startTransition(async () => {
      const res = await updateNotificationPreferences(next)
      if (!res.success) {
        setPrefs(prefs)
        showFlash('error', res.error ?? 'Update failed')
      }
    })
  }

  const TABS = [
    { id: 'profile',       label: 'Profile',       icon: User },
    { id: 'firm',          label: 'Firm',          icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security',      label: 'Security',      icon: Shield },
    { id: 'ai',            label: 'AI Settings',   icon: Brain },
    { id: 'integrations',  label: 'Integrations',  icon: Link2 },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-1)' }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>Manage your account, firm, and platform preferences</p>
        </div>

        {flash && (
          <div
            className="mb-4 p-3.5 rounded-xl flex items-center gap-2.5"
            style={{
              background: flash.type === 'success' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
              border: `1px solid ${flash.type === 'success' ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}`,
            }}
            role="alert"
          >
            {flash.type === 'success'
              ? <Check className="w-4 h-4" style={{ color: 'var(--success)' }} aria-hidden="true" />
              : <AlertCircle className="w-4 h-4" style={{ color: 'var(--danger)' }} aria-hidden="true" />}
            <span className="text-sm font-medium" style={{ color: flash.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
              {flash.msg}
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="card p-2 space-y-0.5" aria-label="Settings sections">
              {TABS.map(tab => {
                const Icon = tab.icon
                return (
                  <button key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={activeTab === tab.id}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
                      ${activeTab === tab.id
                        ? 'bg-[var(--brand-dim)] text-[var(--brand)]'
                        : 'text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-subtle)]'}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="card p-6 space-y-5">
                <h2 className="font-semibold text-lg" style={{ color: 'var(--text-1)' }}>Profile Settings</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--brand) 0%, #2563EB 100%)' }}
                    aria-hidden="true">
                    {(initialUser.name ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Full Name</label>
                    <input id="name" name="name" defaultValue={initialUser.name ?? ''} className="input" required />
                  </div>
                  <div>
                    <label htmlFor="email-readonly" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Email (read-only)</label>
                    <input id="email-readonly" value={initialUser.email} readOnly className="input opacity-60" aria-readonly="true" />
                  </div>
                  <div>
                    <label htmlFor="firm" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Firm</label>
                    <input id="firm" name="firm" defaultValue={initialUser.firm ?? ''} className="input" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Phone</label>
                    <input id="phone" name="phone" type="tel" defaultValue={initialUser.phone ?? ''} className="input" />
                  </div>
                  <div>
                    <label htmlFor="barNumber" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Bar Number</label>
                    <input id="barNumber" name="barNumber" defaultValue={initialUser.barNumber ?? ''} className="input" />
                  </div>
                  <div>
                    <label htmlFor="title" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Title</label>
                    <input id="title" name="title" defaultValue={initialUser.title ?? ''} className="input" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={pending} className="btn-primary" style={{ opacity: pending ? 0.7 : 1 }}>
                    {pending ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Saving…</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'firm' && (
              <div className="card p-6">
                <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-1)' }}>Firm Settings</h2>
                <p className="text-sm mb-5" style={{ color: 'var(--text-3)' }}>
                  Firm-wide preferences and branding are available on the Enterprise plan. Contact sales to enable.
                </p>
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Current firm</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-1)' }}>{initialUser.firm || '—'}</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-6 space-y-3">
                <h2 className="font-semibold text-lg" style={{ color: 'var(--text-1)' }}>Notification Preferences</h2>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                  Changes are saved automatically. Notifications are delivered in-app; email delivery requires SMTP configuration.
                </p>
                {[
                  { key: 'rfe' as const,         label: 'RFE Received',        desc: 'Alert when USCIS issues a Request for Evidence' },
                  { key: 'deadline' as const,    label: 'Deadline Reminders',  desc: 'Reminders at 30, 14, 7, 3, and 1 day before deadlines' },
                  { key: 'approval' as const,    label: 'Case Approvals/Denials', desc: 'Notify when case status changes' },
                  { key: 'regulatory' as const,  label: 'Regulatory Changes',  desc: 'AI-detected immigration law updates' },
                  { key: 'client' as const,      label: 'Client Portal Activity', desc: 'When clients upload documents or send messages' },
                  { key: 'weekly' as const,      label: 'Weekly Summary Report', desc: 'Email digest of firm performance metrics' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{n.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{n.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref(n.key)}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs[n.key] ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'}`}
                      aria-pressed={prefs[n.key]}
                      aria-label={`Toggle ${n.label}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs[n.key] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
                <div className="pt-3">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Delivery channels</h3>
                  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>In-app notifications</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Show in the bell dropdown</div>
                    </div>
                    <button type="button" onClick={() => togglePref('inAppEnabled')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.inAppEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'}`}
                      aria-pressed={prefs.inAppEnabled}
                      aria-label="Toggle in-app notifications">
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.inAppEnabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>Email notifications</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Send to {initialUser.email}</div>
                    </div>
                    <button type="button" onClick={() => togglePref('emailEnabled')}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${prefs.emailEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'}`}
                      aria-pressed={prefs.emailEnabled}
                      aria-label="Toggle email notifications">
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.emailEnabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-4">
                <h2 className="font-semibold text-lg" style={{ color: 'var(--text-1)' }}>Change Password</h2>
                <div>
                  <label htmlFor="currentPassword" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>Current Password</label>
                  <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="input" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="text-xs block mb-1.5" style={{ color: 'var(--text-3)' }}>New Password</label>
                  <input id="newPassword" name="newPassword" type="password" required autoComplete="new-password" minLength={8} className="input" />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-4)' }}>Minimum 8 characters</p>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={pending} className="btn-primary" style={{ opacity: pending ? 0.7 : 1 }}>
                    {pending ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Updating…</> : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'ai' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-lg" style={{ color: 'var(--text-1)' }}>AI Configuration</h2>
                <div className="p-4 rounded-xl" style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-glow)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4" style={{ color: 'var(--brand)' }} aria-hidden="true" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>AI Engine: Claude Sonnet 4</span>
                    <span className="ml-auto text-xs flex items-center gap-1" style={{ color: 'var(--success)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" /> Active
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Optimized for immigration legal documents and forms</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                  Per-feature AI toggles (auto-populate, verification, regulatory monitoring) are coming in a future release.
                  All AI outputs require attorney review before filing.
                </p>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="card p-6">
                <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-1)' }}>Integrations</h2>
                <p className="text-sm mb-5" style={{ color: 'var(--text-3)' }}>
                  Native integrations are available on the Professional and Enterprise plans.
                </p>
                <div className="space-y-3">
                  {[
                    { name: 'Microsoft Word', desc: 'Generate and export documents', icon: '📄' },
                    { name: 'Google Drive',   desc: 'Sync and store case files',     icon: '☁️' },
                    { name: 'Slack',          desc: 'Receive case alerts',           icon: '💬' },
                    { name: 'DocuSign',       desc: 'Electronic signatures',         icon: '✍️' },
                    { name: 'Clio',           desc: 'Legal practice management',     icon: '⚖️' },
                  ].map(intg => (
                    <div key={intg.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">{intg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{intg.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-3)' }}>{intg.desc}</div>
                      </div>
                      <button className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--brand-glow)', color: 'var(--brand)' }}>
                        Coming soon
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
