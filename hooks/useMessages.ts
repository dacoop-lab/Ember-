'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types/database'

export function useMessages(matchId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!matchId) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [matchId])

  return { messages, loading, setMessages }
}
