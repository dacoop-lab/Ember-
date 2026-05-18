'use server'

import { createClient } from '@supabase/supabase-js'

export async function createProfile(id: string, name: string): Promise<{ error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  try {
    const upsertPromise = supabase
      .from('profiles')
      .upsert(
        { id, name, subscription_status: 'active', onboarding_complete: false },
        { onConflict: 'id', ignoreDuplicates: false },
      )

    const timeout = new Promise<{ error: { message: string } }>(
      (resolve) => setTimeout(() => resolve({ error: { message: 'Request timed out' } }), 10_000),
    )

    const { error } = await Promise.race([upsertPromise, timeout])
    if (error) {
      console.error('[createProfile] upsert error:', error)
      return { error: error.message }
    }
    return { error: null }
  } catch (err) {
    console.error('[createProfile] caught exception:', err)
    return { error: err instanceof Error ? err.message : String(err) }
  }
}
