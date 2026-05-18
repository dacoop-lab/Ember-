'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Gender } from '@/types/database'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'man',       label: 'Men' },
  { value: 'woman',     label: 'Women' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'other',     label: 'Other' },
]

export default function OnboardingPreferencesPage() {
  const router = useRouter()
  const [seeking, setSeeking]   = useState<Gender[]>([])
  const [ageMin, setAgeMin]     = useState(18)
  const [ageMax, setAgeMax]     = useState(45)
  const [city, setCity]         = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  function toggleSeeking(value: Gender) {
    setSeeking((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (seeking.length === 0) { setError('Select at least one option.'); return }
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        seeking,
        age_min: ageMin,
        age_max: ageMax,
        city: city.trim() || null,
        onboarding_complete: true,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/discover')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-ember-50">Your preferences</h2>
        <p className="mt-1 text-sm text-ember-200/50">You can always change these later.</p>
      </div>

      {/* Seeking */}
      <div>
        <p className="text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-3">
          I'm interested in
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {genderOptions.map((opt) => {
            const active = seeking.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleSeeking(opt.value)}
                className={`rounded-xl border px-4 py-3.5 text-base font-medium transition-all flex items-center justify-between gap-2 ${
                  active
                    ? 'border-ember-400 bg-ember-900/40 text-ember-100'
                    : 'border-ember-800/50 bg-charcoal-800 text-ember-200/70 hover:border-ember-700'
                }`}
              >
                <span>{opt.label}</span>
                {active && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Age range */}
      <div>
        <p className="text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-3">
          Age range
        </p>
        <div className="bg-charcoal-800 rounded-2xl px-4 py-4 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-ember-200/50 mb-2">
              <span>Minimum</span>
              <span className="font-semibold text-ember-300">{ageMin}</span>
            </div>
            <input
              type="range"
              min={18}
              max={ageMax - 1}
              value={ageMin}
              onChange={(e) => setAgeMin(parseInt(e.target.value))}
              className="w-full accent-ember-400 cursor-pointer"
            />
          </div>
          <div className="border-t border-ember-800/40" />
          <div>
            <div className="flex justify-between text-xs text-ember-200/50 mb-2">
              <span>Maximum</span>
              <span className="font-semibold text-ember-300">{ageMax}</span>
            </div>
            <input
              type="range"
              min={ageMin + 1}
              max={99}
              value={ageMax}
              onChange={(e) => setAgeMax(parseInt(e.target.value))}
              className="w-full accent-ember-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-1.5">
          City <span className="normal-case text-ember-200/30">(optional)</span>
        </label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl bg-charcoal-800 border border-ember-800/50 px-4 py-3.5 text-base text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors"
          placeholder="Where are you based?"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="mt-auto">
        <button
          type="submit"
          disabled={loading || seeking.length === 0}
          className="w-full rounded-xl bg-ember-500 py-4 text-base font-semibold text-white tracking-wide hover:bg-ember-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Finishing…' : 'Start discovering'}
        </button>
      </div>
    </form>
  )
}
