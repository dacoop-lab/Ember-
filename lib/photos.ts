export function getPhotoUrl(storagePath: string): string {
  if (storagePath.startsWith('http')) return storagePath
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${storagePath}`
}
