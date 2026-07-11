'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Scale, Mail, Lock, User, Building2, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const registered = params.get('registered') === '1'

  const [form, setForm] = useState({
    name: '', email: '', password: '', firm: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData()
    fd.set('name', form.name)
    fd.set('email', form.email)
    fd.set('password', form.password)
    fd.set('firm', form.firm)

    const res = await fetch('/api/auth/signup', { method: 'POST', body: fd })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Sign up failed')
      return
    }
    // Auto sign-in after signup
    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    })
    if (result?.error) {
      router.push('/login')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      <div className="fixed pointer-events-none"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(10,145,97,0.08) 0%, transparent 65%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }}
      />
      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6" aria-label="ImmigAI home">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand)', boxShadow: 'var(--shadow-brand)' }}>
              <Scale className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-xl" style={{ color: 'var(--text-1)', letterSpacing: '-0.04em' }}>ImmigAI</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-center" style={{ color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
            Create your account
          </h1>
          <p className="text-sm mt-1 text-center" style={{ color: 'var(--text-3)' }}>
            Start your 14-day free trial — no credit card required
          </p>
        </div>

        {registered && (
          <div className="card p-3.5 mb-4 flex items-center gap-2.5" style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} aria-hidden="true" />
            <p className="text-xs font-medium" style={{ color: 'var(--success)' }}>Account created — sign in to continue.</p>
          </div>
        )}

        <div className="card p-7" style={{ boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl mb-5" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }} role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--danger)' }} aria-hidden="true" />
              <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-2)' }}>Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-4)' }} aria-hidden="true" />
                <input id="name" type="text" required autoComplete="name" placeholder="Sarah Chen"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-2)' }}>Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-4)' }} aria-hidden="true" />
                <input id="email" type="email" required autoComplete="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="firm" className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-2)' }}>Firm name <span className="font-normal" style={{ color: 'var(--text-4)' }}>(optional)</span></label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-4)' }} aria-hidden="true" />
                <input id="firm" type="text" autoComplete="organization" placeholder="Chen & Associates"
                  value={form.firm} onChange={e => setForm({ ...form, firm: e.target.value })}
                  className="input pl-10" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-2)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-4)' }} aria-hidden="true" />
                <input id="password" type={showPass ? 'text' : 'password'} required autoComplete="new-password" placeholder="At least 8 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10" minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm mt-2" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Creating account…
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-5">
          <Link href="/login" className="text-xs flex items-center justify-center gap-1.5 hover:underline" style={{ color: 'var(--text-3)' }}>
            <ArrowLeft className="w-3 h-3" aria-hidden="true" /> Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
