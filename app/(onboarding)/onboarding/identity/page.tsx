'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Identity, Gender } from '@/types/database'

const identities: { value: Identity; label: string; sub: string; emoji: string }[] = [
  { value: 'redhead', label: "I'm a Redhead",     sub: 'Natural or dyed — own it',    emoji: '🔥' },
  { value: 'admirer', label: 'I Admire Redheads', sub: 'Drawn to that rare flame',    emoji: '❤️' },
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
        <h2 className="text-2xl font-semibold text-[#F5E6DC]">How do you identify?</h2>
        <p className="mt-1 text-sm text-[#8A6858]">This helps us show you the right matches.</p>
      </div>

      {/* Identity cards with emoji */}
      <div className="flex flex-col gap-3">
        {identities.map((opt) => {
          const active = identity === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIdentity(opt.value)}
              className={`w-full rounded-2xl border p-6 text-center transition-all ${
                active
                  ? 'border-[#C8553D] bg-[#2A0A03]/60'
                  : 'border-[#2A0A03] bg-[#1A1410] hover:border-[#4A1208]'
              }`}
            >
              <div className="text-3xl mb-3">{opt.emoji}</div>
              <p className={`font-semibold text-lg ${active ? 'text-[#F5E6DC]' : 'text-[#C4A898]'}`}>
                {opt.label}
              </p>
              <p className="text-sm text-[#8A6858] mt-1">{opt.sub}</p>
            </button>
          )
        })}
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium tracking-widest uppercase text-[#8A6858] mb-3">Gender</p>
        <div className="grid grid-cols-2 gap-2.5">
          {genders.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(opt.value)}
              className={`rounded-xl border px-4 py-3.5 text-base font-medium transition-all ${
                gender === opt.value
                  ? 'border-[#C8553D] bg-[#2A0A03]/60 text-[#F5E6DC]'
                  : 'border-[#2A0A03] bg-[#1A1410] text-[#8A6858] hover:border-[#4A1208]'
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
          className="w-full rounded-xl py-4 text-base font-semibold text-white tracking-wide disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #C8553D, #E8845C)' }}
        >
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </form>
  )
}
