'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SwipeStack } from '@/components/cards/SwipeStack'
import { MatchModal } from '@/components/cards/MatchModal'
import { getPhotoUrl } from '@/lib/photos'
import type { Profile, Photo } from '@/types/database'
import type { CandidateWithPhotos } from '@/components/cards/SwipeStack'

interface PendingMatch {
  matchId: string
  profile: Profile
  matchedPhotoUrl: string | null
}

export default function DiscoverPage() {
  const [candidates, setCandidates] = useState<CandidateWithPhotos[]>([])
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [myPhotoUrl, setMyPhotoUrl] = useState<string | null>(null)
  const [pendingMatch, setPendingMatch] = useState<PendingMatch | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      const { data: myPhoto } = await supabase
        .from('photos')
        .select('storage_path')
        .eq('user_id', user.id)
        .eq('display_order', 0)
        .maybeSingle()

      if (myPhoto) setMyPhotoUrl(getPhotoUrl(myPhoto.storage_path))

      const { data: me } = await supabase
        .from('profiles')
        .select('seeking, age_min, age_max')
        .eq('id', user.id)
        .single()

      const { data: swiped } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id)

      const swipedIds = (swiped ?? []).map((s) => s.swiped_id)

      let query = supabase
        .from('profiles')
        .select('*')
        .eq('onboarding_complete', true)
        .neq('id', user.id)

      if (swipedIds.length > 0) query = query.not('id', 'in', `(${swipedIds.join(',')})`)
      if (me?.seeking && me.seeking.length > 0) query = query.in('gender', me.seeking)
      if (me?.age_min) query = query.gte('age', me.age_min)
      if (me?.age_max) query = query.lte('age', me.age_max)

      const { data: profiles } = await query.limit(60)

      if (!profiles || profiles.length === 0) {
        setEmpty(true)
        setLoading(false)
        return
      }

      const { data: photos } = await supabase
        .from('photos')
        .select('*')
        .in('user_id', profiles.map((p) => p.id))
        .order('display_order', { ascending: true })

      const photosByUser: Record<string, Photo[]> = {}
      for (const photo of photos ?? []) {
        if (!photosByUser[photo.user_id]) photosByUser[photo.user_id] = []
        photosByUser[photo.user_id].push(photo as Photo)
      }

      setCandidates(profiles.map((p) => ({ profile: p as Profile, photos: photosByUser[p.id] ?? [] })))
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100dvh - var(--nav-height))' }}>
        <div className="w-8 h-8 rounded-full border-2 border-ember-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-8 text-center" style={{ height: 'calc(100dvh - var(--nav-height))' }}>
        <span className="text-5xl">🔥</span>
        <p className="text-lg font-semibold text-ember-50">You&apos;ve seen everyone</p>
        <p className="text-sm text-ember-200/50">Check back soon</p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - var(--nav-height))', paddingTop: 'max(48px, var(--safe-top))' }}
    >
      {/* Header */}
      <div className="shrink-0 px-4 pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-ember-400">ember</h1>
      </div>

      {/* Card stack — fills remaining height */}
      <div className="flex-1 flex flex-col items-center px-4 pb-4 min-h-0 w-full">
        {currentUserId && candidates.length > 0 && (
          <SwipeStack
            candidates={candidates}
            currentUserId={currentUserId}
            onMatch={(matchId, profile, matchedPhotoUrl) =>
              setPendingMatch({ matchId, profile, matchedPhotoUrl })
            }
            onEmpty={() => setEmpty(true)}
          />
        )}
      </div>

      {pendingMatch && (
        <MatchModal
          matchId={pendingMatch.matchId}
          matchedProfile={pendingMatch.profile}
          matchedPhotoUrl={pendingMatch.matchedPhotoUrl}
          myPhotoUrl={myPhotoUrl}
          onClose={() => setPendingMatch(null)}
        />
      )}
    </div>
  )
}
