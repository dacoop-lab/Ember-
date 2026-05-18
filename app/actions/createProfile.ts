'use server'

import { createClient } from '@supabase/supabase-js'

export async function createProfile(id: string, name: string): Promise<{ error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { error } = await supabase
    .from('profiles')
    .insert({ id, name, subscription_status: 'active', onboarding_complete: false })

  return { error: error?.message ?? null }
}
