'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputClass = 'w-full rounded-xl bg-[#1A1410] border border-[#4A1208] focus:border-[#C8553D] px-4 py-4 text-base text-[#F5E6DC] placeholder:text-[#4A1208] focus:outline-none transition-colors'
const labelClass = 'block text-sm font-medium tracking-widest uppercase text-[#8A6858] mb-2'

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
        <div className="relative inline-flex justify-center mb-4">
          <div
            className="absolute inset-0 rounded-full scale-150"
            style={{ background: 'radial-gradient(ellipse at center, #C8553D20 0%, transparent 70%)' }}
          />
          <img src="/logo-clean.png" alt="Ember" className="h-20 w-auto relative" />
        </div>
        <h1 className="text-2xl font-semibold text-[#F5E6DC] mt-2">Welcome back</h1>
        <p className="mt-1 text-sm text-[#8A6858]">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-4 text-base font-semibold text-white tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90 mt-2"
          style={{ background: 'linear-gradient(to right, #C8553D, #E8845C)' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#8A6858]">
        No account?{' '}
        <Link href="/signup" className="text-[#C8553D] hover:text-[#E8845C] transition-colors font-medium">
          Create one
        </Link>
      </p>
    </div>
  )
}
