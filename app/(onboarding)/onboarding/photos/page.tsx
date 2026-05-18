'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { createPhoto } from '@/app/actions/createPhoto'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const MAX_PHOTOS = 3

export default function OnboardingPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<{ url: string; file: File }[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_PHOTOS - photos.length
    const added = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...added])
    // Reset input so the same file can be re-selected after removal
    e.target.value = ''
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleContinue() {
    if (photos.length === 0) { setError('Add at least one photo to continue.'); return }
    setError(null)
    setUploading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    try {
      for (let i = 0; i < photos.length; i++) {
        const { file } = photos[i]
        const base64 = await fileToBase64(file)
        const { error: rowError } = await createPhoto(user.id, base64, file.name, i)
        if (rowError) throw new Error(rowError)
      }

      router.push('/onboarding/preferences')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-ember-50">Add your photos</h2>
        <p className="mt-1 text-sm text-ember-200/50">
          Up to {MAX_PHOTOS} photos. First one is your profile photo.
        </p>
      </div>

      {/* Photo grid — 3 fixed slots */}
      <div className="grid grid-cols-3 gap-2.5">
        {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
          const photo = photos[i]
          return photo ? (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-800">
              <Image src={photo.url} alt={`Photo ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white text-xs hover:bg-black transition-colors"
                aria-label="Remove photo"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 text-[10px] bg-ember-500/90 rounded-md px-1.5 py-0.5 font-semibold tracking-wide">
                  MAIN
                </span>
              )}
            </div>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-ember-800/50 flex flex-col items-center justify-center gap-1.5 text-ember-200/30 hover:border-ember-700 hover:text-ember-200/50 disabled:pointer-events-none transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[11px] font-medium">Add</span>
            </button>
          )
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="mt-auto">
        <button
          onClick={handleContinue}
          disabled={uploading || photos.length === 0}
          className="w-full rounded-xl bg-ember-500 py-3.5 text-sm font-semibold text-white tracking-wide hover:bg-ember-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
