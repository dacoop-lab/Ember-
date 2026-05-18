'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Match } from '@/types/database'

export function useMatches(userId: string | undefined) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase
      .from('matches')
      .select('*')
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMatches(data ?? [])
        setLoading(false)
      })
  }, [userId])

  return { matches, loading }
}
