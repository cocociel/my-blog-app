import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react'
import CommentSection from '../components/CommentSection'
import LikeButton from '../components/LikeButton'
import ShareButtons from '../components/ShareButtons'
import SEOHead from '../components/SEOHead'

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchArticle()
      incrementViewCount()
    }
  }, [id])

  const fetchArticle = async () => {
    try {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()

      if (data) {
        setArticle(data)
      }
    } catch (error) {
      console.error('記事の取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async () => {
    try {
      const { data } = await supabase
        .from('articles')
        .select('view_count')
        .eq('id', id)
        .single()

      if (data) {
        await supabase
          .from('articles')
          .update({ view_count: data.view_count + 1 })
          .eq('id', id)
      }
    } catch (error) {
      console.error('閲覧数の更新に失敗しました:', error)
    }
  }

  const handleLikeChange = (newCount: number) => {
    if (article) {
      setArticle({ ...article, like_count: newCount })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">記事が見つかりません</h1>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  const currentUrl = window.location.href
  const publishedTime = article.published_at || article.created_at

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={article.title}
        description={article.excerpt || article.content.substring(0, 160)}
        keywords={article.category_tags}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={article.updated_at}
        author="Shiki∞Link"
        section="技術記事"
        tags={article.category_tags}
        url={currentUrl}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          ブログ一覧に戻る
        </Link>

        {/* 記事ヘッダー */}
        <header className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(publishedTime)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{article.view_count} 閲覧</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LikeButton
                articleId={article.id}
                initialLikeCount={article.like_count}
                onLikeChange={handleLikeChange}
              />
              
              <ShareButtons
                url={currentUrl}
                title={article.title}
                description={article.excerpt}
              />
            </div>
          </div>
          
          {/* カテゴリタグ */}
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-2">
              {article.category_tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* 記事本文 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                code: ({ inline, children }) => (
                  inline ? (
                    <code className="bg-gray-100 text-pink-600 px-2 py-1 rounded text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      {children}
                    </code>
                  )
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 text-gray-700">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* コメントセクション */}
        <CommentSection articleId={article.id} />
      </article>
    </div>
  )
}

export default BlogDetailPage