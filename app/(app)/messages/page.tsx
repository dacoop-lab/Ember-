'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getPhotoUrl } from '@/lib/photos'
import type { Profile, Message } from '@/types/database'

interface ConversationEntry {
  matchId: string
  profile: Profile
  photoUrl: string | null
  lastMessage: Message | null
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000)

  if (diffDays === 0) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (diffDays < 7)  return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function SkeletonList() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-4 px-4 border-b border-[#1A1410]">
          <div className="w-14 h-14 rounded-full bg-[#1A1410] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-[#1A1410] animate-pulse rounded-full w-28" />
            <div className="h-3 bg-[#1A1410] animate-pulse rounded-full w-44" />
          </div>
          <div className="h-3 bg-[#1A1410] animate-pulse rounded-full w-10 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationEntry[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      const { data: rawMatches } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!rawMatches || rawMatches.length === 0) { setLoading(false); return }

      const otherIds = rawMatches.map((m) => m.user_a === user.id ? m.user_b : m.user_a)
      const matchIds = rawMatches.map((m) => m.id)

      const [{ data: profiles }, { data: photos }, { data: allMessages }] = await Promise.all([
        supabase.from('profiles').select('*').in('id', otherIds),
        supabase.from('photos').select('storage_path, user_id').in('user_id', otherIds).eq('display_order', 0),
        supabase.from('messages').select('*').in('match_id', matchIds).order('created_at', { ascending: false }),
      ])

      const profileMap: Record<string, Profile> = {}
      for (const p of profiles ?? []) profileMap[p.id] = p as Profile

      const photoMap: Record<string, string> = {}
      for (const ph of photos ?? []) photoMap[ph.user_id] = getPhotoUrl(ph.storage_path)

      const lastMsgMap: Record<string, Message> = {}
      for (const msg of allMessages ?? []) {
        if (!lastMsgMap[msg.match_id]) lastMsgMap[msg.match_id] = msg as Message
      }

      const result: ConversationEntry[] = []
      for (const m of rawMatches) {
        const otherId = m.user_a === user.id ? m.user_b : m.user_a
        const profile = profileMap[otherId]
        if (!profile) continue
        result.push({ matchId: m.id, profile, photoUrl: photoMap[otherId] ?? null, lastMessage: lastMsgMap[m.id] ?? null })
      }
      setConversations(result)
      setLoading(false)
    }

    load()
  }, [])

  return (
    <div className="pb-24" style={{ paddingTop: 'max(48px, var(--safe-top))' }}>
      <h1 className="text-xl font-semibold text-[#F5E6DC] mb-2 px-4">Messages</h1>

      {loading ? (
        <SkeletonList />
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 gap-3 text-center px-4">
          <span className="text-5xl">💬</span>
          <p className="text-lg font-semibold text-[#F5E6DC]">No conversations yet</p>
          <p className="text-sm text-[#8A6858]">Match with someone to start chatting</p>
        </div>
      ) : (
        <div>
          {conversations.map(({ matchId, profile, photoUrl, lastMessage }) => {
            const isUnread =
              lastMessage !== null &&
              lastMessage.read === false &&
              lastMessage.sender_id !== currentUserId

            return (
              <Link
                key={matchId}
                href={`/messages/${matchId}`}
                className="flex items-center gap-3 py-4 px-4 border-b border-[#1A1410] hover:bg-[#1A1410]/40 transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#221810] shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4A1208] text-xl">♥</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-base leading-snug truncate ${isUnread ? 'font-semibold text-[#C8553D]' : 'font-semibold text-[#F5E6DC]'}`}>
                    {profile.name}
                  </p>
                  {lastMessage ? (
                    <p className={`text-sm truncate mt-0.5 ${isUnread ? 'font-medium text-[#C4A898]' : 'text-[#8A6858]'}`}>
                      {lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-[#C8553D]/60 italic mt-0.5">Say hello!</p>
                  )}
                </div>

                {lastMessage && (
                  <span className="text-xs text-[#8A6858] shrink-0 self-start mt-0.5">
                    {formatTimestamp(lastMessage.created_at)}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
