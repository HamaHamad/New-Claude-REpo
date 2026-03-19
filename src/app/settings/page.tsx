'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  User, Bell, Shield, Globe, CreditCard, Link2,
  Brain, Key, Building2, ChevronRight, Check, Zap
} from 'lucide-react'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'firm', label: 'Firm', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Settings', icon: Brain },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

const INTEGRATIONS = [
  { name: 'Microsoft Word', desc: 'Generate and export documents', status: 'connected', icon: '📄' },
  { name: 'Google Drive', desc: 'Sync and store case files', status: 'connected', icon: '☁️' },
  { name: 'Slack', desc: 'Receive case alerts and updates', status: 'connected', icon: '💬' },
  { name: 'DocuSign', desc: 'Electronic signatures for petitions', status: 'disconnected', icon: '✍️' },
  { name: 'Outlook / Gmail', desc: 'Client communication sync', status: 'connected', icon: '📧' },
  { name: 'Clio', desc: 'Legal practice management', status: 'disconnected', icon: '⚖️' },
  { name: 'MyCase', desc: 'Case management platform', status: 'disconnected', icon: '📁' },
  { name: 'Salesforce', desc: 'CRM and client relationship', status: 'disconnected', icon: '☁️' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    rfe: true, deadline: true, approval: true, regulatory: true, weekly: false, client: true,
  })

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-white">Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your account, firm, and platform preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <nav className="card p-2 space-y-0.5">
              {TABS.map(tab => {
                const Icon = tab.icon
                return (
                  <button key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
                      ${activeTab === tab.id
                        ? 'bg-brand-600/15 text-brand-400'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'}`}>
                    <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-400' : 'text-slate-600'}`} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card p-6 space-y-6">
                <h2 className="font-semibold text-white text-lg">Profile Settings</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                    SC
                  </div>
                  <div>
                    <button className="btn-secondary text-xs">Change Photo</button>
                    <p className="text-slate-600 text-xs mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', value: 'Sarah' },
                    { label: 'Last Name', value: 'Chen' },
                    { label: 'Email', value: 'sarah@chenimmigration.com' },
                    { label: 'Phone', value: '+1 (415) 555-0192' },
                    { label: 'Bar Number', value: 'CA-123456' },
                    { label: 'Title', value: 'Managing Partner' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-xs text-slate-500 block mb-1.5">{f.label}</label>
                      <input defaultValue={f.value} className="input" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-6 space-y-5">
                <h2 className="font-semibold text-white text-lg">Notification Preferences</h2>
                {[
                  { key: 'rfe', label: 'RFE Received', desc: 'Alert when USCIS issues a Request for Evidence' },
                  { key: 'deadline', label: 'Deadline Reminders', desc: 'Reminders 30, 14, 7, and 1 day before deadlines' },
                  { key: 'approval', label: 'Case Approvals/Denials', desc: 'Notify when case status changes' },
                  { key: 'regulatory', label: 'Regulatory Changes', desc: 'AI-detected immigration law updates' },
                  { key: 'client', label: 'Client Portal Activity', desc: 'When clients upload documents or send messages' },
                  { key: 'weekly', label: 'Weekly Summary Report', desc: 'Email digest of firm performance metrics' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div>
                      <div className="text-white text-sm font-medium">{n.label}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{n.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifications[n.key as keyof typeof notifications] ? 'bg-brand-600' : 'bg-white/[0.1]'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[n.key as keyof typeof notifications] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="card p-6 space-y-6">
                <h2 className="font-semibold text-white text-lg">AI Configuration</h2>
                <div className="p-4 rounded-xl bg-brand-500/[0.05] border border-brand-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-brand-400" />
                    <span className="text-white text-sm font-medium">AI Engine: GPT-4 Turbo</span>
                    <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">Optimized for immigration legal documents and forms</p>
                </div>
                {[
                  { label: 'Auto-populate forms from case data', sub: 'AI extracts and fills form fields automatically' },
                  { label: 'AI document verification', sub: 'Scan uploaded docs for completeness and accuracy' },
                  { label: 'Approval probability scores', sub: 'Show AI confidence scores on all cases' },
                  { label: 'Regulatory monitoring', sub: 'Monitor USCIS, DOS, and Federal Register automatically' },
                  { label: 'Smart deadline suggestions', sub: 'AI recommends optimal filing dates' },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div>
                      <div className="text-white text-sm">{setting.label}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{setting.sub}</div>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-brand-600 relative flex-shrink-0 cursor-pointer">
                      <span className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-white text-lg mb-5">Integrations</h2>
                {INTEGRATIONS.map(intg => (
                  <div key={intg.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-xl flex-shrink-0">
                      {intg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{intg.name}</div>
                      <div className="text-slate-500 text-xs">{intg.desc}</div>
                    </div>
                    <button className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${intg.status === 'connected'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
                      : 'bg-brand-500/10 text-brand-400 border-brand-500/20 hover:bg-brand-600 hover:text-white'}`}>
                      {intg.status === 'connected' ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-4">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white text-lg">Current Plan</h2>
                    <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-medium">
                      Professional
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="font-display font-bold text-4xl text-white">$799</span>
                    <span className="text-slate-500 text-sm mb-1">/month</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Cases Used', value: '248 / 300' },
                      { label: 'Team Members', value: '4 / 10' },
                      { label: 'Storage', value: '24GB / 100GB' },
                    ].map(u => (
                      <div key={u.label} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <div className="text-xs text-slate-500 mb-1">{u.label}</div>
                        <div className="text-white text-sm font-medium">{u.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-primary text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Upgrade to Enterprise
                    </button>
                    <button className="btn-secondary text-sm">Manage Plan</button>
                  </div>
                </div>
              </div>
            )}

            {!['profile', 'notifications', 'ai', 'integrations', 'billing'].includes(activeTab) && (
              <div className="card p-6">
                <h2 className="font-semibold text-white text-lg mb-4">{TABS.find(t => t.id === activeTab)?.label} Settings</h2>
                <p className="text-slate-400 text-sm">Settings for this section are available in the full version.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
