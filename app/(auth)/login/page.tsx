'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', data.user.id)
        .maybeSingle()

      router.push(profile?.onboarding_complete ? '/discover' : '/onboarding/profile')
    }
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <img src="/logo.png" alt="Ember" className="h-16 w-auto mx-auto mb-2" />
        <p className="mt-2 text-base text-ember-200/60">Welcome back</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-charcoal-800 border border-ember-800/50 px-4 py-3.5 text-base text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-charcoal-800 border border-ember-800/50 px-4 py-3.5 text-base text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-ember-500 py-4 text-base font-semibold text-white tracking-wide hover:bg-ember-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ember-200/50">
        No account?{' '}
        <Link href="/signup" className="text-ember-300 hover:text-ember-200 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}
