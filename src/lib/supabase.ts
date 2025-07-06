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

export interface Comment {
  id: string
  article_id: string
  parent_id?: string
  author_name: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  replies?: Comment[]
}

export interface Like {
  id: string
  article_id: string
  ip_address: string
  created_at: string
}

// ユーティリティ関数
export const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('IP取得エラー:', error)
    return 'unknown'
  }
}