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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center w-full max-w-[380px]">
        {/* Side-by-side photos with rose ring */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-[#E8A598] bg-[#221810] shadow-xl z-10 translate-x-4">
            {myPhotoUrl ? (
              <img src={myPhotoUrl} alt="You" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#E8A598]/30 text-3xl">♥</div>
            )}
          </div>
          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-[#E8A598] bg-[#221810] shadow-xl z-20 -translate-x-4">
            {matchedPhotoUrl ? (
              <img src={matchedPhotoUrl} alt={matchedProfile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#E8A598]/30 text-3xl">♥</div>
            )}
          </div>
        </div>

        <h2
          className="text-3xl font-bold mb-2"
          style={{
            background: 'linear-gradient(to right, #E8A598, #C8553D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          It&apos;s a Match
        </h2>
        <p className="text-base text-[#F5E6DC] mb-1">
          You and <span className="font-semibold">{matchedProfile.name}</span>
        </p>
        <p className="text-sm text-[#8A6858] mb-10">liked each other</p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href={`/messages/${matchId}`}
            className="w-full rounded-xl py-4 text-base font-semibold text-white text-center tracking-wide transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #C8553D, #E8845C)' }}
          >
            Start chatting
          </Link>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-[#C8553D]/40 py-4 text-base font-medium text-[#C4A898] hover:border-[#C8553D]/70 hover:text-[#F5E6DC] transition-colors"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  )
}
