'use server'

import { createClient } from '@supabase/supabase-js'

export async function createPhoto(
  userId: string,
  base64: string,
  filename: string,
  displayOrder: number,
): Promise<{ storagePath: string | null; error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const buffer = Buffer.from(base64, 'base64')
  const ext = filename.split('.').pop() ?? 'jpg'
  const storagePath = `${userId}/${Date.now()}_${displayOrder}.${ext}`
  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(storagePath, buffer, { contentType, upsert: true })

  if (uploadError) return { storagePath: null, error: uploadError.message }

  const { error: rowError } = await supabase
    .from('photos')
    .insert({ user_id: userId, storage_path: storagePath, display_order: displayOrder })

  if (rowError) return { storagePath: null, error: rowError.message }

  return { storagePath, error: null }
}
