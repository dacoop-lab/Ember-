'use client'

import Link from 'next/link'
import type { Profile } from '@/types/database'

interface MatchModalProps {
  matchId: string
  matchedProfile: Profile
  matchedPhotoUrl: string | null
  myPhotoUrl: string | null
  onClose: () => void
}

export function MatchModal({ matchId, matchedProfile, matchedPhotoUrl, myPhotoUrl, onClose }: MatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 px-6 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center w-full max-w-[380px]">
        {/* Side-by-side photos */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-charcoal-900 bg-charcoal-800 shadow-xl z-10 translate-x-4">
            {myPhotoUrl ? (
              <img src={myPhotoUrl} alt="You" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ember-200/20 text-3xl">♥</div>
            )}
          </div>
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-charcoal-900 bg-charcoal-800 shadow-xl z-20 -translate-x-4">
            {matchedPhotoUrl ? (
              <img src={matchedPhotoUrl} alt={matchedProfile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ember-200/20 text-3xl">♥</div>
            )}
          </div>
        </div>

        <p className="text-sm font-semibold tracking-[0.25em] uppercase text-ember-400 mb-2">
          It&apos;s a Match
        </p>
        <h2 className="text-2xl font-bold text-ember-50 mb-1">
          You and {matchedProfile.name}
        </h2>
        <p className="text-sm text-ember-200/50 mb-10">liked each other</p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href={`/messages/${matchId}`}
            className="w-full rounded-xl bg-ember-500 py-4 text-base font-semibold text-white text-center tracking-wide hover:bg-ember-400 transition-colors"
          >
            Start chatting
          </Link>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-ember-800 py-4 text-base font-medium text-ember-300/70 hover:text-ember-300 hover:border-ember-700 transition-colors"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  )
}
