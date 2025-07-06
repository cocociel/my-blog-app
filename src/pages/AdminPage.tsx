import React, { useState, useEffect } from 'react'
import { supabase, Article, Comment } from '../lib/supabase'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

const AdminPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    pendingComments: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'articles' | 'comments'>('articles')
  const [showNewArticleForm, setShowNewArticleForm] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_tags: [''],
    status: 'draft' as 'draft' | 'published'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 記事データを取得
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      // コメントデータを取得
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })

      if (articlesData) {
        setArticles(articlesData)
        
        // 統計を計算
        const published = articlesData.filter(article => article.status === 'published')
        const totalViews = articlesData.reduce((sum, article) => sum + article.view_count, 0)
        const totalLikes = articlesData.reduce((sum, article) => sum + article.like_count, 0)
        
        setStats(prev => ({
          ...prev,
          totalArticles: articlesData.length,
          publishedArticles: published.length,
          totalViews,
          totalLikes
        }))
      }

      if (commentsData) {
        setComments(commentsData)
        const pendingComments = commentsData.filter(comment => comment.status === 'pending').length
        setStats(prev => ({ ...prev, pendingComments }))
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([{
          ...newArticle,
          category_tags: newArticle.category_tags.filter(tag => tag.trim() !== ''),
          published_at: newArticle.status === 'published' ? new Date().toISOString() : null
        }])

      if (error) throw error

      setShowNewArticleForm(false)
      setNewArticle({
        title: '',
        content: '',
        excerpt: '',
        category_tags: [''],
        status: 'draft'
      })
      fetchData()
    } catch (error) {
      console.error('記事の作成に失敗しました:', error)
    }
  }

  const handleToggleStatus = async (article: Article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published'
      const publishedAt = newStatus === 'published' ? new Date().toISOString() : null

      const { error } = await supabase
        .from('articles')
        .update({ 
          status: newStatus,
          published_at: publishedAt
        })
        .eq('id', article.id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('記事の状態変更に失敗しました:', error)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('本当に削除しますか？')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('記事の削除に失敗しました:', error)
    }
  }

  const handleCommentAction = async (commentId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: action })
        .eq('id', commentId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('コメントの更新に失敗しました:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('本当に削除しますか？')) return

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('コメントの削除に失敗しました:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Settings className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              管理画面
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              記事とコメントの管理、サイト統計を確認できます
            </p>
          </div>
        </div>
      </section>

      {/* 統計情報 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">総記事数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalArticles}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">公開記事数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.publishedArticles}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">総閲覧数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">総いいね数</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLikes}</p>
                </div>
                <Users className="w-8 h-8 text-pink-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">承認待ち</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingComments}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'articles'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                記事管理
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  activeTab === 'comments'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                コメント管理
                {stats.pendingComments > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.pendingComments}
                  </span>
                )}
              </button>
            </div>

            {/* 記事管理タブ */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">記事管理</h2>
                  <button
                    onClick={() => setShowNewArticleForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新規記事作成</span>
                  </button>
                </div>

                {/* 新規記事作成フォーム */}
                {showNewArticleForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">新規記事作成</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          タイトル
                        </label>
                        <input
                          type="text"
                          value={newArticle.title}
                          onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="記事のタイトルを入力"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          概要
                        </label>
                        <textarea
                          value={newArticle.excerpt}
                          onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="記事の概要を入力"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          本文（Markdown）
                        </label>
                        <textarea
                          value={newArticle.content}
                          onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                          rows={10}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="記事の本文をMarkdown形式で入力"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          カテゴリタグ
                        </label>
                        <input
                          type="text"
                          value={newArticle.category_tags[0]}
                          onChange={(e) => setNewArticle({ ...newArticle, category_tags: [e.target.value] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="カテゴリタグを入力（例: typescript, react）"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          状態
                        </label>
                        <select
                          value={newArticle.status}
                          onChange={(e) => setNewArticle({ ...newArticle, status: e.target.value as 'draft' | 'published' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="draft">下書き</option>
                          <option value="published">公開</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          onClick={handleCreateArticle}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          記事を作成
                        </button>
                        <button
                          onClick={() => setShowNewArticleForm(false)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 記事一覧 */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">タイトル</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">状態</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">作成日</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">閲覧数</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">いいね</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{article.title}</div>
                            <div className="text-sm text-gray-500">{article.excerpt}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status === 'published' ? '公開' : '下書き'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {formatDate(article.created_at)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {article.view_count}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {article.like_count}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleStatus(article)}
                                className={`p-2 rounded-md transition-colors ${
                                  article.status === 'published'
                                    ? 'text-yellow-600 hover:bg-yellow-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={article.status === 'published' ? '下書きに戻す' : '公開する'}
                              >
                                {article.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="削除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* コメント管理タブ */}
            {activeTab === 'comments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">コメント管理</h2>
                
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">{comment.author_name}</span>
                            <span className="text-sm text-gray-500">{comment.email}</span>
                            <span className="text-sm text-gray-400">{formatDate(comment.created_at)}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              comment.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : comment.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {comment.status === 'approved' && <><CheckCircle className="w-3 h-3 mr-1" />承認済み</>}
                              {comment.status === 'rejected' && <><XCircle className="w-3 h-3 mr-1" />却下</>}
                              {comment.status === 'pending' && <><Clock className="w-3 h-3 mr-1" />承認待ち</>}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.content}</p>
                          {comment.parent_id && (
                            <p className="text-sm text-blue-600">返信コメント</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          {comment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleCommentAction(comment.id, 'approved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="承認"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCommentAction(comment.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="却下"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">コメントがありません。</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminPage