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
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffDays === 0) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (diffDays < 7)  return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function SkeletonList() {
  return (
    <div className="divide-y divide-ember-900/60">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-4">
          <div className="w-14 h-14 rounded-full bg-charcoal-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-charcoal-800 animate-pulse rounded-full w-28" />
            <div className="h-3 bg-charcoal-800 animate-pulse rounded-full w-44" />
          </div>
          <div className="h-3 bg-charcoal-800 animate-pulse rounded-full w-10 shrink-0" />
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
    <div className="px-4 pb-24" style={{ paddingTop: 'max(48px, var(--safe-top))' }}>
      <h1 className="text-xl font-semibold text-ember-50 mb-6">Messages</h1>

      {loading ? (
        <SkeletonList />
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 gap-3 text-center">
          <span className="text-5xl">💬</span>
          <p className="text-lg font-semibold text-ember-50">No conversations yet</p>
          <p className="text-sm text-ember-200/50">Match with someone to start chatting</p>
        </div>
      ) : (
        <div className="divide-y divide-ember-900/60">
          {conversations.map(({ matchId, profile, photoUrl, lastMessage }) => {
            const isUnread =
              lastMessage !== null &&
              lastMessage.read === false &&
              lastMessage.sender_id !== currentUserId

            return (
              <Link
                key={matchId}
                href={`/messages/${matchId}`}
                className="flex items-center gap-3 py-4 -mx-1 px-1 rounded-xl hover:bg-charcoal-800/40 transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-charcoal-800 shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ember-200/20 text-xl">♥</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-base leading-snug truncate ${isUnread ? 'font-semibold text-ember-400' : 'font-medium text-ember-50'}`}>
                    {profile.name}
                  </p>
                  {lastMessage ? (
                    <p className={`text-sm truncate mt-0.5 ${isUnread ? 'font-medium text-ember-200/80' : 'text-ember-200/45'}`}>
                      {lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-ember-400/50 italic mt-0.5">Say hello!</p>
                  )}
                </div>

                {lastMessage && (
                  <span className="text-sm text-ember-200/35 shrink-0 self-start mt-0.5">
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
