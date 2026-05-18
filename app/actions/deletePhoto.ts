'use server'

import { createClient } from '@supabase/supabase-js'

export async function deletePhoto(
  photoId: string,
  storagePath: string,
): Promise<{ error: string | null }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([storagePath])

  if (storageError) return { error: storageError.message }

  const { error: rowError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)

  return { error: rowError?.message ?? null }
}
