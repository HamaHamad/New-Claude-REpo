'use client'
import Link from 'next/link'
import {
  ArrowRight, Brain, FileText, BarChart3, Shield, Users, Globe,
  CheckCircle2, ChevronRight, Zap, Clock, TrendingUp, Star,
  Building2, Scale, Workflow, Bell, Lock, MessageSquare, Play
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#' },
]

const STATS = [
  { value: '94%', label: 'Approval Rate', sub: 'vs 78% industry avg' },
  { value: '10x', label: 'Faster Filing', sub: 'than manual process' },
  { value: '60%', label: 'Cost Reduction', sub: 'in admin overhead' },
  { value: '50+', label: 'Visa Types', sub: 'fully supported' },
]

const FEATURES = [
  {
    icon: FileText,
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-400',
    title: 'Document & Form Automation',
    desc: 'Automatically populate complex visa applications and immigration forms. Draft RFE responses, legal documents, and petitions in minutes—not days.',
    tags: ['Auto-populate', 'RFE Drafting', 'AI Verification'],
  },
  {
    icon: BarChart3,
    color: 'from-violet-500/20 to-violet-600/5',
    iconColor: 'text-violet-400',
    title: 'Predictive Analytics',
    desc: 'Forecast visa approval probabilities and processing times using historical USCIS data. Make data-driven strategic decisions for every petition.',
    tags: ['Approval Forecast', 'Timeline Predictions', 'Strategy Insights'],
  },
  {
    icon: Users,
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-400',
    title: 'Client Management',
    desc: 'Secure client portals for document upload and real-time progress tracking. AI chatbot handles eligibility screening and routine client queries 24/7.',
    tags: ['Client Portal', 'AI Chatbot', 'Multilingual'],
  },
  {
    icon: Shield,
    color: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'text-amber-400',
    title: 'Compliance & Risk',
    desc: 'Real-time regulatory change monitoring with NLP-powered analysis. Automated EB-5 compliance checks and critical deadline management.',
    tags: ['Reg Tracking', 'EB-5 Checks', 'Deadlines'],
  },
  {
    icon: Workflow,
    color: 'from-teal-500/20 to-teal-600/5',
    iconColor: 'text-teal-400',
    title: 'Workflow Automation',
    desc: 'End-to-end case lifecycle management from initial intake to final filing. Integrates with Microsoft Word, Slack, Google Drive, and your existing tools.',
    tags: ['Case Lifecycle', 'Integrations', 'Team Collaboration'],
  },
  {
    icon: Globe,
    color: 'from-rose-500/20 to-rose-600/5',
    iconColor: 'text-rose-400',
    title: 'Global Business Immigration',
    desc: 'Handle complex corporate visa categories, L-1, H-1B, O-1, and cross-border personnel movements. Scaled for high-volume corporate clients.',
    tags: ['H-1B/L-1', 'Corporate', 'Global Mobility'],
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    desc: 'Perfect for solo practitioners and small firms',
    features: [
      'Up to 50 active cases',
      'Form auto-population',
      'Client portal (10 clients)',
      'Basic analytics dashboard',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$799',
    period: '/month',
    desc: 'For growing immigration firms',
    features: [
      'Up to 300 active cases',
      'Full AI form & RFE automation',
      'Unlimited client portals',
      'Predictive analytics & forecasting',
      'Compliance monitoring',
      'Multilingual support (12 languages)',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large firms and corporate departments',
    features: [
      'Unlimited cases',
      'Custom AI model training',
      'API access & integrations',
      'Dedicated account manager',
      'SLA guarantees',
      'On-premise deployment option',
      'Custom compliance rules',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const TESTIMONIALS = [
  {
    quote: "ImmigAI reduced our RFE response time from 3 weeks to 2 days. The predictive analytics have transformed how we advise clients on case strategy.",
    name: "Sarah Chen",
    role: "Managing Partner",
    firm: "Chen & Associates Immigration Law",
  },
  {
    quote: "We process 400+ H-1B cases per year. Before ImmigAI, we needed 8 paralegals. Now 3 can handle the same volume with fewer errors.",
    name: "Michael Torres",
    role: "Head of Immigration",
    firm: "Global Tech Corp",
  },
  {
    quote: "The compliance monitoring caught a critical regulatory change that could have derailed 20 pending cases. That alone was worth the subscription.",
    name: "Amanda Patel",
    role: "Immigration Attorney",
    firm: "Patel Immigration Group",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">ImmigAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href}
                className="text-sm text-slate-400 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login"
              className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/dashboard"
              className="btn-primary flex items-center gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 grid-bg">
        <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 opacity-60" />
        <div className="hero-glow top-0 right-0 translate-x-1/4 opacity-30" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-medium mb-8 animate-fade-in">
            <Zap className="w-3 h-3" />
            AI-Powered Immigration Platform — Now with GPT-4 Integration
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.08] mb-6 animate-fade-up">
            Immigration Law,{' '}
            <span className="bg-gradient-to-r from-brand-400 via-blue-300 to-teal-300 bg-clip-text text-transparent">
              Automated.
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up delay-100">
            The end-to-end platform for immigration law firms and corporate teams.
            AI-driven document automation, predictive analytics, compliance monitoring,
            and client management—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
            <Link href="/dashboard"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-glow text-sm">
              Start Free 14-Day Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>

          <p className="text-slate-600 text-xs mt-6 animate-fade-up delay-300">
            No credit card required · GDPR compliant · SOC 2 Type II certified
          </p>

          {/* Dashboard preview card */}
          <div className="mt-16 relative animate-fade-up delay-400">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent z-10 pointer-events-none" style={{top: '60%'}} />
            <div className="card border-white/[0.08] overflow-hidden shadow-[0_0_80px_rgba(59,142,248,0.08)]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 h-5 bg-white/[0.04] rounded mx-4 flex items-center px-3">
                  <span className="text-[10px] text-slate-500">app.immigai.com/dashboard</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-4 gap-3">
                {[
                  { label: 'Active Cases', value: '248', color: 'text-brand-400', icon: '📁' },
                  { label: 'Pending Review', value: '14', color: 'text-amber-400', icon: '⏳' },
                  { label: 'Filed This Month', value: '67', color: 'text-emerald-400', icon: '✅' },
                  { label: 'Avg Approval Rate', value: '94%', color: 'text-violet-400', icon: '📈' },
                ].map(s => (
                  <div key={s.label} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                    <div className="text-base mb-1">{s.icon}</div>
                    <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <div className="bg-white/[0.02] rounded-lg border border-white/[0.05] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">Recent Cases</span>
                    <span className="text-xs text-brand-400">View All</span>
                  </div>
                  {[
                    { name: 'Zhang, Wei — H-1B Cap', status: 'Approved', color: 'badge-green' },
                    { name: 'Patel, Raj — L-1A Petition', status: 'In Review', color: 'badge-blue' },
                    { name: 'Garcia, Ana — EB-2 NIW', status: 'RFE Received', color: 'badge-yellow' },
                    { name: 'Kim, Ji-Yeon — O-1A', status: 'Filed', color: 'badge-purple' },
                  ].map(c => (
                    <div key={c.name} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-xs text-slate-300">{c.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${c.color === 'badge-green' ? 'bg-emerald-500/10 text-emerald-400' :
                          c.color === 'badge-blue' ? 'bg-blue-500/10 text-blue-400' :
                          c.color === 'badge-yellow' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-violet-500/10 text-violet-400'}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.value} className="text-center">
              <div className="font-display font-bold text-4xl text-white mb-1">{s.value}</div>
              <div className="text-sm text-slate-300 font-medium">{s.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-3">Platform Features</div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Everything your firm needs
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Built specifically for immigration practitioners who deal with high volumes,
              complex compliance, and demanding clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title}
                  className="card card-hover p-6 group cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map(tag => (
                      <span key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform section */}
      <section id="platform" className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-brand-400 text-sm font-medium uppercase tracking-widest mb-3">AI-Powered Core</div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
                From intake to approval,{' '}
                <span className="gradient-text">fully automated</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Our platform handles the entire case lifecycle. From the moment a client submits their information,
                AI immediately begins analyzing eligibility, pre-populating forms, flagging compliance risks,
                and tracking deadlines—so your attorneys can focus on strategy, not paperwork.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Brain, label: 'AI reads and extracts data from any client document automatically' },
                  { icon: FileText, label: 'Forms pre-filled in seconds, reviewed by AI before attorney sign-off' },
                  { icon: Bell, label: 'Automated deadline alerts sent to case managers and clients' },
                  { icon: TrendingUp, label: 'Approval predictions updated in real-time as case develops' },
                  { icon: Lock, label: 'End-to-end encrypted, HIPAA & GDPR compliant data handling' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-brand-400" />
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.label}</p>
                    </div>
                  )
                })}
              </div>

              <Link href="/dashboard"
                className="inline-flex items-center gap-2 mt-8 btn-primary py-3 px-6">
                Explore the Platform <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Workflow steps visual */}
              {[
                { step: '01', title: 'Client Intake', desc: 'AI chatbot screens eligibility, collects documents via secure portal', color: 'border-brand-500/30', dot: 'bg-brand-500' },
                { step: '02', title: 'Document Processing', desc: 'OCR + NLP extracts and validates all supporting materials automatically', color: 'border-violet-500/30', dot: 'bg-violet-500' },
                { step: '03', title: 'Form Generation', desc: 'Applications auto-populated, compliance checks run, attorney reviews', color: 'border-teal-500/30', dot: 'bg-teal-500' },
                { step: '04', title: 'Filing & Monitoring', desc: 'USCIS submission tracked with real-time status updates and alerts', color: 'border-emerald-500/30', dot: 'bg-emerald-500' },
              ].map((s, i) => (
                <div key={s.step}
                  className={`card border-l-2 ${s.color} p-5 flex gap-4 card-hover`}>
                  <div className={`w-2 h-2 rounded-full ${s.dot} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-slate-600">{s.step}</span>
                      <span className="font-display font-semibold text-white text-sm">{s.title}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 self-center" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="py-16 px-6 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-8 uppercase tracking-widest">Integrates with the tools you already use</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Microsoft Word', 'Google Drive', 'Slack', 'Outlook', 'DocuSign', 'Salesforce', 'Clio', 'MyCase'].map(tool => (
              <div key={tool}
                className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400 text-sm font-medium">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-white mb-3">Trusted by immigration professionals</h2>
            <p className="text-slate-400">See how firms are transforming their practices with ImmigAI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6 card-hover">
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="border-t border-white/[0.06] pt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role} · {t.firm}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start with a 14-day free trial. No credit card required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div key={plan.name}
                className={`card p-7 flex flex-col relative ${plan.highlighted
                  ? 'border-brand-500/40 shadow-glow'
                  : ''}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-white text-xl mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="font-display font-bold text-4xl text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm pb-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard"
                  className={`text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${plan.highlighted
                    ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-sm'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4 relative z-10">
              Ready to transform your immigration practice?
            </h2>
            <p className="text-slate-400 text-lg mb-8 relative z-10">
              Join 500+ firms already using ImmigAI to handle more cases with less effort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/dashboard"
                className="btn-primary py-3 px-8 text-base shadow-glow flex items-center gap-2 justify-center">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => window.location.href = 'mailto:sales@immigai.com'}
                className="btn-secondary py-3 px-8 text-base flex items-center gap-2 justify-center">
                <MessageSquare className="w-4 h-4" />
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-white text-lg">ImmigAI</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The end-to-end AI immigration platform built for law firms and corporate teams who need to scale.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Dashboard', 'Analytics', 'Compliance', 'Pricing'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Case Studies', 'Webinars'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy Policy', 'Terms of Service', 'Security'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white text-sm font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© {new Date().getFullYear()} ImmigAI, Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <Lock className="w-3 h-3" /> SOC 2 Type II
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <Shield className="w-3 h-3" /> GDPR Compliant
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-600">
                <Building2 className="w-3 h-3" /> HIPAA Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
