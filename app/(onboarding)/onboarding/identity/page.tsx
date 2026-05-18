'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Identity, Gender } from '@/types/database'

const identities: { value: Identity; label: string; sub: string }[] = [
  { value: 'redhead', label: "I'm a Redhead",       sub: 'Natural or dyed — own it' },
  { value: 'admirer', label: 'I Admire Redheads',   sub: 'Drawn to that rare flame' },
]

const genders: { value: Gender; label: string }[] = [
  { value: 'man',       label: 'Man' },
  { value: 'woman',     label: 'Woman' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other',     label: 'Other' },
]

export default function OnboardingIdentityPage() {
  const router = useRouter()
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!identity || !gender) return
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ identity, gender })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/onboarding/photos')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-ember-50">How do you identify?</h2>
        <p className="mt-1 text-sm text-ember-200/50">This helps us show you the right matches.</p>
      </div>

      {/* Identity cards */}
      <div className="flex flex-col gap-3">
        {identities.map((opt) => {
          const active = identity === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIdentity(opt.value)}
              className={`w-full rounded-2xl border p-5 text-left transition-all ${
                active
                  ? 'border-ember-400 bg-ember-900/40 shadow-[0_0_0_1px] shadow-ember-400/20'
                  : 'border-ember-800/50 bg-charcoal-800 hover:border-ember-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${active ? 'text-ember-100' : 'text-ember-50'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-ember-200/50 mt-0.5">{opt.sub}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'border-ember-400 bg-ember-400' : 'border-ember-700'
                  }`}
                >
                  {active && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-3">Gender</p>
        <div className="grid grid-cols-2 gap-2.5">
          {genders.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(opt.value)}
              className={`rounded-xl border px-4 py-3.5 text-base font-medium transition-all ${
                gender === opt.value
                  ? 'border-ember-400 bg-ember-900/40 text-ember-100'
                  : 'border-ember-800/50 bg-charcoal-800 text-ember-200/70 hover:border-ember-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="mt-auto">
        <button
          type="submit"
          disabled={loading || !identity || !gender}
          className="w-full rounded-xl bg-ember-500 py-4 text-base font-semibold text-white tracking-wide hover:bg-ember-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </form>
  )
}
