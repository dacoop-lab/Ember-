'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) { router.push('/onboarding/profile'); return }

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
        <div className="w-8 h-8 rounded-full border-2 border-[#C8553D] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-8 text-center" style={{ height: 'calc(100dvh - var(--nav-height))' }}>
        <span className="text-5xl">🔥</span>
        <p className="text-lg font-semibold text-[#F5E6DC]">You&apos;ve seen everyone</p>
        <p className="text-sm text-[#8A6858]">Check back soon</p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - var(--nav-height))', paddingTop: 'max(48px, var(--safe-top))' }}
    >
      {/* Header: logo left, notifications right */}
      <div className="shrink-0 flex items-center justify-between px-4 pb-3">
        <img src="/logo-clean.png" alt="Ember" className="h-8 w-auto" />
        <button
          className="w-10 h-10 flex items-center justify-center text-[#4A1208] hover:text-[#C8553D] transition-colors"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {/* Card stack */}
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
