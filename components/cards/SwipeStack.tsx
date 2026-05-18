'use client'

import { useState, useCallback, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { SwipeCard, type SwipeCardHandle } from './SwipeCard'
import { recordSwipe, checkForMatch } from '@/lib/matching'
import { getPhotoUrl } from '@/lib/photos'
import type { Profile, Photo } from '@/types/database'

export interface CandidateWithPhotos {
  profile: Profile
  photos: Photo[]
}

interface SwipeStackProps {
  candidates: CandidateWithPhotos[]
  currentUserId: string
  onMatch: (matchId: string, matchedProfile: Profile, matchedPhotoUrl: string | null) => void
  onEmpty: () => void
}

function CircleButton({
  onClick,
  variant,
  children,
}: {
  onClick: () => void
  variant: 'pass' | 'like'
  children: React.ReactNode
}) {
  const [{ scale }, api] = useSpring(() => ({ scale: 1, config: { tension: 400, friction: 15 } }))

  function handleClick() {
    api.start({ scale: 0.84 })
    api.start({ scale: 1, delay: 100, config: { tension: 300, friction: 18 } })
    onClick()
  }

  return (
    <animated.button
      style={{
        scale,
        background: variant === 'like' ? '#C8553D' : '#2A0A03',
        border: variant === 'like' ? 'none' : '1px solid rgba(200,85,61,0.4)',
      }}
      onClick={handleClick}
      className="w-16 h-16 rounded-full flex items-center justify-center text-xl shadow-lg text-white"
      aria-label={variant === 'pass' ? 'Pass' : 'Like'}
    >
      {children}
    </animated.button>
  )
}

export function SwipeStack({ candidates, currentUserId, onMatch, onEmpty }: SwipeStackProps) {
  const [index, setIndex] = useState(0)
  const topCardRef = useRef<SwipeCardHandle>(null)

  const handleLike = useCallback(async () => {
    const candidate = candidates[index]
    if (!candidate) return

    const nextIndex = index + 1
    setIndex(nextIndex)
    if (nextIndex >= candidates.length) onEmpty()

    try {
      await recordSwipe(currentUserId, candidate.profile.id, 'like')
      const result = await checkForMatch(currentUserId, candidate.profile.id)
      if (result.matched && result.matchId) {
        const primaryPhoto = candidate.photos.find((p) => p.display_order === 0) ?? candidate.photos[0]
        const photoUrl = primaryPhoto ? getPhotoUrl(primaryPhoto.storage_path) : null
        onMatch(result.matchId, candidate.profile, photoUrl)
      }
    } catch {
      // non-critical — swipe is optimistic
    }
  }, [index, candidates, currentUserId, onMatch, onEmpty])

  const handlePass = useCallback(async () => {
    const candidate = candidates[index]
    if (!candidate) return

    const nextIndex = index + 1
    setIndex(nextIndex)
    if (nextIndex >= candidates.length) onEmpty()

    try {
      await recordSwipe(currentUserId, candidate.profile.id, 'pass')
    } catch {
      // non-critical
    }
  }, [index, candidates, currentUserId, onEmpty])

  const visible = candidates.slice(index, index + 3)

  if (visible.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {/* Card area */}
      <div className="relative flex-1 w-full max-w-[380px] min-h-0">
        {[...visible].reverse().map((candidate, reversedIdx) => {
          const stackIndex = visible.length - 1 - reversedIdx
          const isTop = stackIndex === 0
          return (
            <SwipeCard
              key={candidate.profile.id}
              ref={isTop ? topCardRef : null}
              profile={candidate.profile}
              photos={candidate.photos}
              onLike={handleLike}
              onPass={handlePass}
              isTop={isTop}
              stackIndex={stackIndex}
            />
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-10 shrink-0 pb-2">
        <CircleButton variant="pass" onClick={() => topCardRef.current?.triggerPass()}>
          ✕
        </CircleButton>
        <CircleButton variant="like" onClick={() => topCardRef.current?.triggerLike()}>
          ♥
        </CircleButton>
      </div>
    </div>
  )
}
