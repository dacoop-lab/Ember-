import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

const { data: existing } = await supabase.storage.getBucket('photos')

if (existing) {
  console.log('Bucket "photos" already exists.')
  process.exit(0)
}

const { error } = await supabase.storage.createBucket('photos', { public: true })

if (error) {
  console.error('Failed to create bucket:', error.message)
  process.exit(1)
}

console.log('Bucket "photos" created successfully.')
