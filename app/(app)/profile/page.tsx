'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getPhotoUrl } from '@/lib/photos'
import { createPhoto } from '@/app/actions/createPhoto'
import { deletePhoto } from '@/app/actions/deletePhoto'
import type { Profile, Photo } from '@/types/database'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const inputClass = 'w-full rounded-xl bg-[#1A1410] border border-[#2A0A03] focus:border-[#C8553D] px-4 py-3.5 text-base text-[#F5E6DC] placeholder:text-[#4A1208] focus:outline-none transition-colors'
const labelClass = 'block text-xs font-medium tracking-widest uppercase text-[#8A6858] mb-1.5'

export default function ProfilePage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [addingPhoto, setAddingPhoto] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const [{ data: p }, { data: ph }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('photos').select('*').eq('user_id', user.id).order('display_order'),
      ])

      if (p) {
        setProfile(p as Profile)
        setName(p.name ?? '')
        setAge(p.age?.toString() ?? '')
        setBio(p.bio ?? '')
        setCity(p.city ?? '')
      }
      setPhotos((ph ?? []) as Photo[])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        age: age ? parseInt(age) : null,
        bio: bio.trim() || null,
        city: city.trim() || null,
      })
      .eq('id', userId)

    if (error) {
      setSaveError(error.message)
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
    setSaving(false)
  }

  async function handleDeletePhoto(photo: Photo) {
    setDeletingId(photo.id)
    const { error } = await deletePhoto(photo.id, photo.storage_path)
    if (!error) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    }
    setDeletingId(null)
  }

  async function handleAddPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    e.target.value = ''
    setAddingPhoto(true)

    const base64 = await fileToBase64(file)
    const nextOrder = photos.length > 0 ? Math.max(...photos.map((p) => p.display_order)) + 1 : 0
    const { error } = await createPhoto(userId, base64, file.name, nextOrder)

    if (!error) {
      const supabase = createClient()
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('user_id', userId)
        .order('display_order')
      setPhotos((data ?? []) as Photo[])
    }
    setAddingPhoto(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-[#C8553D] border-t-transparent animate-spin" />
      </div>
    )
  }

  const primaryPhoto = photos.find((p) => p.display_order === 0) ?? photos[0]
  const avatarUrl = primaryPhoto ? getPhotoUrl(primaryPhoto.storage_path) : null
  const identityLabel = profile?.identity === 'redhead' ? 'Redhead' : profile?.identity === 'admirer' ? 'Admirer' : null

  return (
    <div className="px-4 pb-24" style={{ paddingTop: 'max(48px, var(--safe-top))' }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-[#F5E6DC]">Profile</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-[#8A6858] hover:text-[#C4A898] transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Avatar + name + badge */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-[#221810] mb-3 ring-2 ring-[#2A0A03]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={profile?.name ?? ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#4A1208] text-3xl">♥</div>
          )}
        </div>
        <h2 className="text-xl font-bold text-[#F5E6DC]">{profile?.name}</h2>
        {identityLabel && (
          <span className="mt-1.5 text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#C8553D] text-white">
            {identityLabel}
          </span>
        )}
      </div>

      {/* Edit form */}
      <div className="space-y-4 mb-8">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            min={18}
            max={99}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
            placeholder="Your age"
          />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            placeholder="City, State"
          />
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Tell people about yourself…"
          />
        </div>

        {saveError && <p className="text-sm text-red-400">{saveError}</p>}
        {saveSuccess && <p className="text-sm text-[#E8A598]">Saved!</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl py-4 text-base font-semibold text-white tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(to right, #C8553D, #E8845C)' }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {/* Photos */}
      <div>
        <p className={labelClass}>Photos</p>
        <div className="grid grid-cols-3 gap-2.5 mt-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#221810]">
              <img src={getPhotoUrl(photo.storage_path)} alt="Photo" className="absolute inset-0 w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleDeletePhoto(photo)}
                disabled={deletingId === photo.id}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white text-xs hover:bg-black disabled:opacity-50 transition-colors"
                aria-label="Delete photo"
              >
                {deletingId === photo.id ? (
                  <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                ) : '✕'}
              </button>
              {photo.display_order === 0 && (
                <span className="absolute bottom-2 left-2 text-[10px] bg-[#C8553D] rounded-md px-1.5 py-0.5 font-semibold tracking-wide text-white">
                  MAIN
                </span>
              )}
            </div>
          ))}

          {photos.length < 3 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={addingPhoto}
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#2A0A03] flex flex-col items-center justify-center gap-1.5 text-[#4A1208] hover:border-[#4A1208] hover:text-[#8A6858] disabled:pointer-events-none transition-colors"
            >
              {addingPhoto ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#C8553D] border-t-transparent animate-spin" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAddPhoto}
      />
    </div>
  )
}
