'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Pre-fill from existing profile row (created during signup)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('profiles')
        .select('name, age, bio')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (!data) return
          if (data.name) setName(data.name)
          if (data.age)  setAge(String(data.age))
          if (data.bio)  setBio(data.bio)
        })
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        age: parseInt(age),
        bio: bio.trim() || null,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/onboarding/identity')
  }

  const canContinue = name.trim().length > 0 && age !== ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-ember-50">Tell us about yourself</h2>
        <p className="mt-1 text-sm text-ember-200/50">This appears on your profile.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-1.5">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-charcoal-800 border border-ember-800/50 px-4 py-3.5 text-base text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-1.5">
            Age
          </label>
          <input
            id="age"
            type="number"
            min={18}
            max={99}
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-xl bg-charcoal-800 border border-ember-800/50 px-4 py-3.5 text-base text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors"
            placeholder="Your age"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium tracking-widest uppercase text-ember-200/60 mb-1.5">
            Bio <span className="normal-case text-ember-200/30">(optional)</span>
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            className="w-full rounded-xl bg-charcoal-800 border border-ember-800/50 px-4 py-3.5 text-base text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors resize-none"
            placeholder="A few words about you…"
          />
          <p className="mt-1 text-right text-xs text-ember-200/30">{bio.length}/300</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="mt-auto">
        <button
          type="submit"
          disabled={loading || !canContinue}
          className="w-full rounded-xl bg-ember-500 py-4 text-base font-semibold text-white tracking-wide hover:bg-ember-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </form>
  )
}
