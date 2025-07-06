import React, { useState, useEffect } from 'react'
import { supabase, Comment, getClientIP } from '../lib/supabase'
import { MessageCircle, Reply, Send, Clock, CheckCircle } from 'lucide-react'

interface CommentSectionProps {
  articleId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [newComment, setNewComment] = useState({
    author_name: '',
    email: '',
    content: ''
  })

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (data) {
        // コメントを階層構造に変換
        const commentsMap = new Map<string, Comment>()
        const rootComments: Comment[] = []

        // まず全てのコメントをマップに追加
        data.forEach(comment => {
          commentsMap.set(comment.id, { ...comment, replies: [] })
        })

        // 親子関係を構築
        data.forEach(comment => {
          const commentWithReplies = commentsMap.get(comment.id)!
          if (comment.parent_id) {
            const parent = commentsMap.get(comment.parent_id)
            if (parent) {
              parent.replies!.push(commentWithReplies)
            }
          } else {
            rootComments.push(commentWithReplies)
          }
        })

        setComments(rootComments)
      }
    } catch (error) {
      console.error('コメントの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.author_name || !newComment.email || !newComment.content) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          article_id: articleId,
          parent_id: replyTo,
          author_name: newComment.author_name,
          email: newComment.email,
          content: newComment.content,
          status: 'pending'
        }])

      if (error) throw error

      setNewComment({ author_name: '', email: '', content: '' })
      setReplyTo(null)
      alert('コメントを投稿しました。管理者の承認後に表示されます。')
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error)
      alert('コメントの投稿に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{comment.author_name}</span>
            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
          </div>
          <button
            onClick={() => setReplyTo(comment.id)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>返信</span>
          </button>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      </div>
      
      {/* 返信表示 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-900">
          コメント ({comments.length})
        </h3>
      </div>

      {/* コメント投稿フォーム */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        {replyTo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">返信を投稿中...</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              キャンセル
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前 *
            </label>
            <input
              type="text"
              value={newComment.author_name}
              onChange={(e) => setNewComment({ ...newComment, author_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス *
            </label>
            <input
              type="email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            コメント *
          </label>
          <textarea
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="コメントを入力してください..."
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>コメントは管理者の承認後に表示されます</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? '投稿中...' : '投稿する'}</span>
          </button>
        </div>
      </form>

      {/* コメント一覧 */}
      <div>
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">まだコメントがありません。最初のコメントを投稿してみませんか？</p>
          </div>
        ) : (
          <div>
            {comments.map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection