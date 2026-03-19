'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Scale, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard'

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const [email, setEmail]       = useState(isDemoMode ? 'demo@immigai.com' : '')
  const [password, setPassword] = useState(isDemoMode ? 'demo1234' : '')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 grid-bg">
      <div className="hero-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">ImmigAI</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white text-center">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">Sign in to your account</p>
        </div>

        <div className="card p-6 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          {isDemoMode && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-brand-500/[0.06] border border-brand-500/20 mb-5">
            <AlertCircle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-brand-400 mb-0.5">Demo credentials pre-filled</p>
              <p className="text-[11px] text-slate-500">
                email: demo@immigai.com<br />
                password: demo1234
              </p>
            </div>
          </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="you@firm.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-2" size="lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2024 ImmigAI ·
          <Link href="/" className="hover:text-slate-400 transition-colors ml-1">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}