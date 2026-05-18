'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getPhotoUrl } from '@/lib/photos'
import type { Profile, Message } from '@/types/database'

interface OtherUser {
  profile: Profile
  photoUrl: string | null
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2.5 py-3 px-4 border-b border-ember-900/60">
      <div className="w-8 h-8 rounded-full bg-charcoal-800 animate-pulse" />
      <div className="h-3.5 w-24 bg-charcoal-800 animate-pulse rounded-full" />
    </div>
  )
}

function MessagesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {[false, true, false, true, false].map((own, i) => (
        <div key={i} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
          <div className={`h-9 rounded-2xl bg-charcoal-800 animate-pulse ${own ? 'w-36' : 'w-48'}`} />
        </div>
      ))}
    </div>
  )
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.matchId as string

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [other, setOther] = useState<OtherUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingHeader, setLoadingHeader] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior })
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let userId: string | null = null

    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
          if (userId && newMsg.sender_id !== userId) {
            supabase.from('messages').update({ read: true }).eq('id', newMsg.id)
          }
        },
      )
      .subscribe()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      userId = user.id
      setCurrentUserId(user.id)

      const { data: match } = await supabase
        .from('matches')
        .select('user_a, user_b')
        .eq('id', matchId)
        .maybeSingle()

      if (!match || (match.user_a !== user.id && match.user_b !== user.id)) {
        router.push('/messages')
        return
      }

      const otherId = match.user_a === user.id ? match.user_b : match.user_a

      const [{ data: profile }, { data: photo }, { data: initialMessages }] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', otherId).single(),
          supabase.from('photos').select('storage_path').eq('user_id', otherId).eq('display_order', 0).maybeSingle(),
          supabase.from('messages').select('*').eq('match_id', matchId).order('created_at', { ascending: true }).limit(50),
        ])

      setOther({
        profile: profile as Profile,
        photoUrl: photo ? getPhotoUrl(photo.storage_path) : null,
      })
      setLoadingHeader(false)

      const msgs = (initialMessages ?? []) as Message[]
      setMessages(msgs)
      setLoadingMessages(false)

      const unreadIds = msgs.filter((m) => !m.read && m.sender_id !== user.id).map((m) => m.id)
      if (unreadIds.length > 0) {
        supabase.from('messages').update({ read: true }).in('id', unreadIds)
      }
    }

    load()
    return () => { supabase.removeChannel(channel) }
  }, [matchId, router])

  useEffect(() => {
    if (!loadingMessages) scrollToBottom('instant')
  }, [loadingMessages, scrollToBottom])

  useEffect(() => {
    if (!loadingMessages && messages.length > 0) scrollToBottom('smooth')
  }, [messages.length, loadingMessages, scrollToBottom])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const content = text.trim()
    if (!content || !currentUserId || sending) return

    setSending(true)
    setText('')

    const supabase = createClient()
    await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: currentUserId,
      content,
      read: false,
    })

    setSending(false)
    inputRef.current?.focus()
  }

  return (
    <div
      className="flex flex-col bg-charcoal-900"
      style={{ height: 'calc(100dvh - var(--nav-height))' }}
    >
      {/* Header */}
      <div
        className="relative flex items-center justify-center shrink-0 pb-3 px-14 border-b border-ember-900/60 bg-charcoal-900"
        style={{ paddingTop: 'max(48px, var(--safe-top))' }}
      >
        <Link
          href="/messages"
          className="absolute left-4 bottom-3 flex items-center justify-center w-11 h-11 text-ember-300/70 hover:text-ember-300 transition-colors"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {loadingHeader ? (
          <HeaderSkeleton />
        ) : other ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-charcoal-800 shrink-0">
              {other.photoUrl ? (
                <img src={other.photoUrl} alt={other.profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ember-200/20 text-sm">♥</div>
              )}
            </div>
            <p className="text-sm font-semibold text-ember-50 leading-none">{other.profile.name}</p>
          </div>
        ) : null}
      </div>

      {/* Message list */}
      {loadingMessages ? (
        <MessagesSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center pt-16">
              <span className="text-4xl">🔥</span>
              <p className="text-sm text-ember-200/50">You matched — say something!</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isOwn = msg.sender_id === currentUserId
            const prevMsg = messages[i - 1]
            const sameSenderAsPrev = prevMsg?.sender_id === msg.sender_id
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${sameSenderAsPrev ? 'mt-0.5' : 'mt-3'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed break-words ${
                    isOwn
                      ? 'bg-ember-500 text-white rounded-2xl rounded-br-sm'
                      : 'bg-charcoal-800 text-ember-50 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} className="h-px" />
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="shrink-0 flex items-center gap-3 px-4 py-3 border-t border-ember-900/60 bg-charcoal-900"
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          autoComplete="off"
          className="flex-1 rounded-full bg-charcoal-800 border border-ember-800/40 px-4 py-3 text-sm text-ember-50 placeholder:text-ember-50/20 focus:outline-none focus:border-ember-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-11 h-11 rounded-full bg-ember-500 flex items-center justify-center shrink-0 hover:bg-ember-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} className="w-4 h-4 translate-x-px">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  )
}
