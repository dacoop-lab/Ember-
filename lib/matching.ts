import { createClient } from '@/lib/supabase/client'
import type { SwipeDirection } from '@/types/database'

export async function recordSwipe(
  swiperId: string,
  swipedId: string,
  direction: SwipeDirection,
) {
  const supabase = createClient()
  const { error } = await supabase
    .from('swipes')
    .insert({ swiper_id: swiperId, swiped_id: swipedId, direction })

  if (error) throw error
}

export async function checkForMatch(
  swiperId: string,
  swipedId: string,
): Promise<{ matched: boolean; matchId?: string }> {
  const supabase = createClient()

  const { data: existingLike } = await supabase
    .from('swipes')
    .select('id')
    .eq('swiper_id', swipedId)
    .eq('swiped_id', swiperId)
    .eq('direction', 'like')
    .maybeSingle()

  if (!existingLike) return { matched: false }

  // Canonical ordering: smaller UUID is always user_a
  const [user_a, user_b] = [swiperId, swipedId].sort()

  const { data: match, error } = await supabase
    .from('matches')
    .insert({ user_a, user_b })
    .select('id')
    .single()

  if (error) throw error

  return { matched: true, matchId: match.id }
}
