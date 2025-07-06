import React, { useState, useEffect } from 'react'
import { supabase, getClientIP } from '../lib/supabase'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  articleId: string
  initialLikeCount: number
  onLikeChange?: (newCount: number) => void
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  articleId, 
  initialLikeCount, 
  onLikeChange 
}) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userIP, setUserIP] = useState<string>('')

  useEffect(() => {
    initializeLikeStatus()
  }, [articleId])

  const initializeLikeStatus = async () => {
    try {
      const ip = await getClientIP()
      setUserIP(ip)

      // ユーザーがすでにいいねしているかチェック
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('ip_address', ip)
        .single()

      setIsLiked(!!data)

      // 最新のいいね数を取得
      const { data: articleData } = await supabase
        .from('articles')
        .select('like_count')
        .eq('id', articleId)
        .single()

      if (articleData) {
        setLikeCount(articleData.like_count)
      }
    } catch (error) {
      console.error('いいね状態の初期化に失敗しました:', error)
    }
  }

  const handleLike = async () => {
    if (loading || !userIP) return

    setLoading(true)
    try {
      if (isLiked) {
        // いいね取り消し
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', articleId)
          .eq('ip_address', userIP)

        if (error) throw error

        // 記事のいいね数を減らす
        const { error: updateError } = await supabase
          .from('articles')
          .update({ like_count: Math.max(0, likeCount - 1) })
          .eq('id', articleId)

        if (updateError) throw updateError

        setIsLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
        onLikeChange?.(Math.max(0, likeCount - 1))
      } else {
        // いいね追加
        const { error } = await supabase
          .from('likes')
          .insert([{
            article_id: articleId,
            ip_address: userIP
          }])

        if (error) throw error

        // 記事のいいね数を増やす
        const { error: updateError } = await supabase
          .from('articles')
          .update({ like_count: likeCount + 1 })
          .eq('id', articleId)

        if (updateError) throw updateError

        setIsLiked(true)
        setLikeCount(prev => prev + 1)
        onLikeChange?.(likeCount + 1)
      }
    } catch (error) {
      console.error('いいね操作に失敗しました:', error)
      alert('いいね操作に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isLiked 
          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-300 ${
          isLiked ? 'fill-current scale-110' : ''
        }`} 
      />
      <span className="font-medium">
        {loading ? '...' : likeCount}
      </span>
      <span className="text-sm">
        {isLiked ? 'いいね済み' : 'いいね'}
      </span>
    </button>
  )
}

export default LikeButton