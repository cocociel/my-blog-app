import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型定義
export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  category_tags: string[]
  created_at: string
  updated_at: string
  published_at?: string
  view_count: number
  like_count: number
}

export interface Member {
  id: string
  name: string
  nickname: string
  age: number
  birthday: string
  position: string
  personality: string
  hobbies: string
  image_color: string
  catchphrase: string
  profile_image_url: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  created_at: string
}