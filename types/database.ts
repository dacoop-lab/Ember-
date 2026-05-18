export type Identity = 'redhead' | 'admirer'
export type Gender = 'man' | 'woman' | 'nonbinary' | 'other'
export type SwipeDirection = 'like' | 'pass'

export interface Profile {
  id: string
  name: string
  bio: string | null
  age: number | null
  city: string | null
  identity: Identity | null
  gender: Gender | null
  seeking: string[] | null
  age_min: number
  age_max: number
  subscription_status: string
  onboarding_complete: boolean
  created_at: string
}

export interface Photo {
  id: string
  user_id: string
  storage_path: string
  display_order: number
  created_at: string
}

export interface Swipe {
  id: string
  swiper_id: string
  swiped_id: string
  direction: SwipeDirection
  created_at: string
}

export interface Match {
  id: string
  user_a: string
  user_b: string
  created_at: string
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

export interface MatchWithProfile extends Match {
  other_user: Profile
  last_message?: Message | null
  photos?: Photo[]
}

export interface MessageWithSender extends Message {
  sender: Pick<Profile, 'id' | 'name'>
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          bio: string | null
          age: number | null
          city: string | null
          identity: string | null
          gender: string | null
          seeking: string[] | null
          age_min: number
          age_max: number
          subscription_status: string
          onboarding_complete: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          bio?: string | null
          age?: number | null
          city?: string | null
          identity?: string | null
          gender?: string | null
          seeking?: string[] | null
          age_min?: number
          age_max?: number
          subscription_status?: string
          onboarding_complete?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          age?: number | null
          city?: string | null
          identity?: string | null
          gender?: string | null
          seeking?: string[] | null
          age_min?: number
          age_max?: number
          subscription_status?: string
          onboarding_complete?: boolean
          created_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          storage_path: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          storage_path?: string
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          id: string
          swiper_id: string
          swiped_id: string
          direction: string
          created_at: string
        }
        Insert: {
          id?: string
          swiper_id: string
          swiped_id: string
          direction: string
          created_at?: string
        }
        Update: {
          id?: string
          swiper_id?: string
          swiped_id?: string
          direction?: string
          created_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          user_a: string
          user_b: string
          created_at: string
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          created_at?: string
        }
        Update: {
          id?: string
          user_a?: string
          user_b?: string
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
