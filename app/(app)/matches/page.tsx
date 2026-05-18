'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getPhotoUrl } from '@/lib/photos'
import type { Profile } from '@/types/database'

interface MatchEntry {
  matchId: string
  profile: Profile
  photoUrl: string | null
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-charcoal-800 animate-pulse" style={{ aspectRatio: '3 / 4' }} />
      ))}
    </div>
  )
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: rawMatches } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!rawMatches || rawMatches.length === 0) { setLoading(false); return }

      const otherIds = rawMatches.map((m) => m.user_a === user.id ? m.user_b : m.user_a)

      const [{ data: profiles }, { data: photos }] = await Promise.all([
        supabase.from('profiles').select('*').in('id', otherIds),
        supabase.from('photos').select('storage_path, user_id').in('user_id', otherIds).eq('display_order', 0),
      ])

      const profileMap: Record<string, Profile> = {}
      for (const p of profiles ?? []) profileMap[p.id] = p as Profile

      const photoMap: Record<string, string> = {}
      for (const ph of photos ?? []) photoMap[ph.user_id] = getPhotoUrl(ph.storage_path)

      const result: MatchEntry[] = []
      for (const m of rawMatches) {
        const otherId = m.user_a === user.id ? m.user_b : m.user_a
        const profile = profileMap[otherId]
        if (!profile) continue
        result.push({ matchId: m.id, profile, photoUrl: photoMap[otherId] ?? null })
      }
      setMatches(result)
      setLoading(false)
    }

    load()
  }, [])

  return (
    <div className="px-4 pb-24" style={{ paddingTop: 'max(48px, var(--safe-top))' }}>
      <h1 className="text-xl font-semibold text-ember-50 mb-6">Matches</h1>

      {loading ? (
        <SkeletonGrid />
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 gap-3 text-center">
          <span className="text-5xl">♥</span>
          <p className="text-lg font-semibold text-ember-50">No matches yet</p>
          <p className="text-sm text-ember-200/50">Keep swiping to find your ember</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {matches.map(({ matchId, profile, photoUrl }) => (
            <Link
              key={matchId}
              href={`/messages/${matchId}`}
              className="relative rounded-2xl overflow-hidden bg-charcoal-800 block"
              style={{ aspectRatio: '3 / 4' }}
            >
              {photoUrl ? (
                <img src={photoUrl} alt={profile.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-ember-200/20">♥</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-semibold text-white text-sm leading-tight">{profile.name}</p>
                {profile.city && (
                  <p className="text-xs text-white/55 mt-0.5">{profile.city}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
