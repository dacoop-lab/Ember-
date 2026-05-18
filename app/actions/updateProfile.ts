'use server'

import { createClient } from '@supabase/supabase-js'

export async function updateProfile(
  id: string,
  name: string,
  age: number | null,
  bio: string | null,
): Promise<{ error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { id, name, age, bio, subscription_status: 'active', onboarding_complete: false },
        { onConflict: 'id', ignoreDuplicates: false },
      )

    if (error) {
      console.error('[updateProfile] upsert error:', error)
      return { error: error.message }
    }
    return { error: null }
  } catch (err) {
    console.error('[updateProfile] caught exception:', err)
    return { error: err instanceof Error ? err.message : String(err) }
  }
}
