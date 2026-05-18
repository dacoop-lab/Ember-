'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getPhotoUrl } from '@/lib/photos'
import type { Profile, Photo } from '@/types/database'

export interface SwipeCardHandle {
  triggerLike: () => void
  triggerPass: () => void
}

interface SwipeCardProps {
  profile: Profile
  photos: Photo[]
  onLike: () => void
  onPass: () => void
  isTop: boolean
  stackIndex: number
}

const THRESHOLD = 100
const STACK_SCALE = [1, 0.95, 0.90] as const
const STACK_Y     = [0, 8, 16] as const

const SPRING_SNAP = { tension: 300, friction: 20 }
const SPRING_EXIT = { tension: 220, friction: 28 }

function exitX(direction: 1 | -1) {
  return direction * (typeof window !== 'undefined' ? window.innerWidth + 240 : 800)
}

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(function SwipeCard(
  { profile, photos, onLike, onPass, isTop, stackIndex },
  ref,
) {
  const [{ x, rot }, api] = useSpring(() => ({ x: 0, rot: 0, config: SPRING_SNAP }))

  function animateExit(direction: 1 | -1) {
    api.start({
      x: exitX(direction),
      rot: direction * 30,
      config: SPRING_EXIT,
      onRest: () => (direction === 1 ? onLike() : onPass()),
    })
  }

  useImperativeHandle(ref, () => ({
    triggerLike: () => animateExit(1),
    triggerPass: () => animateExit(-1),
  }))

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (!isTop) return
      if (active) {
        api.start({ x: mx, rot: mx / 20, immediate: true })
      } else {
        const flicked = Math.abs(vx) > 0.5
        const goRight = flicked ? dx > 0 : mx > THRESHOLD
        const goLeft  = flicked ? dx < 0 : mx < -THRESHOLD
        if (goRight)     animateExit(1)
        else if (goLeft) animateExit(-1)
        else             api.start({ x: 0, rot: 0, config: SPRING_SNAP })
      }
    },
    { filterTaps: true },
  )

  const likeOpacity = x.to((v) => Math.min(Math.max(v, 0), THRESHOLD) / THRESHOLD)
  const passOpacity = x.to((v) => Math.min(Math.max(-v, 0), THRESHOLD) / THRESHOLD)

  const primaryPhoto = photos.find((p) => p.display_order === 0) ?? photos[0]
  const photoUrl = primaryPhoto ? getPhotoUrl(primaryPhoto.storage_path) : null
  const identityLabel = profile.identity === 'redhead' ? 'Redhead' : profile.identity === 'admirer' ? 'Admirer' : null

  return (
    <animated.div
      {...(isTop ? bind() : {})}
      style={{
        x,
        rotate: rot,
        scale: STACK_SCALE[stackIndex] ?? 0.90,
        y: STACK_Y[stackIndex] ?? 16,
        touchAction: 'none',
        position: 'absolute',
        inset: 0,
        zIndex: 10 - stackIndex,
        cursor: isTop ? 'grab' : 'default',
        pointerEvents: isTop ? 'auto' : 'none',
        willChange: 'transform',
      }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-charcoal-800 select-none shadow-2xl">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ember-900/30">
            <span className="text-7xl text-ember-200/10">♥</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        {isTop && (
          <animated.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 rotate-[-18deg] border-4 border-green-400 rounded-xl px-3 py-1.5 pointer-events-none"
          >
            <span className="text-green-400 text-xl font-black tracking-[0.2em] flex items-center gap-1.5">
              <span>♥</span><span>LIKE</span>
            </span>
          </animated.div>
        )}

        {isTop && (
          <animated.div
            style={{ opacity: passOpacity }}
            className="absolute top-8 right-6 rotate-[18deg] border-4 border-red-400 rounded-xl px-3 py-1.5 pointer-events-none"
          >
            <span className="text-red-400 text-xl font-black tracking-[0.2em] flex items-center gap-1.5">
              <span>✕</span><span>PASS</span>
            </span>
          </animated.div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end gap-2 flex-wrap">
            <h3 className="text-2xl font-bold text-white leading-none">{profile.name}</h3>
            {profile.age != null && (
              <span className="text-xl text-white/65 leading-none mb-px">{profile.age}</span>
            )}
            {identityLabel && (
              <span className="ml-auto text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-ember-500/70 text-ember-50">
                {identityLabel}
              </span>
            )}
          </div>
          {profile.city && (
            <p className="text-sm text-white/55 mt-1">{profile.city}</p>
          )}
        </div>
      </div>
    </animated.div>
  )
})
