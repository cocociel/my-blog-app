import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Article, Member } from '../lib/supabase'
import ArticleCard from '../components/ArticleCard'
import MemberCard from '../components/MemberCard'
import SEOHead from '../components/SEOHead'
import LazyImage from '../components/LazyImage'
import { BookOpen, Users, TrendingUp, Calendar } from 'lucide-react'

const HomePage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    thisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 最新記事を取得
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)

      // メンバー情報を取得
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true })

      // 統計情報を取得
      const { data: allArticles } = await supabase
        .from('articles')
        .select('view_count, published_at')
        .eq('status', 'published')

      if (articlesData) setArticles(articlesData)
      if (membersData) setMembers(membersData)
      
      if (allArticles) {
        const totalViews = allArticles.reduce((sum, article) => sum + article.view_count, 0)
        const thisMonth = allArticles.filter(article => {
          const publishedDate = new Date(article.published_at)
          const now = new Date()
          return publishedDate.getMonth() === now.getMonth() && 
                 publishedDate.getFullYear() === now.getFullYear()
        }).length

        setStats({
          totalArticles: allArticles.length,
          totalViews,
          thisMonth
        })
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
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
      <SEOHead
        title="Shiki∞Link - 推しと学ぶモダンなWEB技術"
        description="AIアイドル「Shiki∞Link」と一緒に、TypeScriptやReact、Web技術を楽しく学びませんか？技術記事から推しの魅力まで、あなたの学習をサポートします！"
        keywords={['TypeScript', 'React', 'Web技術', 'アイドル', '技術ブログ', '学習', 'Shiki∞Link']}
        type="website"
      />

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              推しと学ぶ
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Web技術
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AIアイドル「Shiki∞Link」と一緒に、TypeScriptやReact、Web技術を楽しく学びませんか？
              技術記事から推しの魅力まで、あなたの学習をサポートします！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blog"
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ブログを読む
              </Link>
              <Link
                to="/members"
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
              >
                メンバーを見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 統計情報 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalArticles}</h3>
              <p className="text-gray-600">総記事数</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalViews.toLocaleString()}</h3>
              <p className="text-gray-600">総閲覧数</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.thisMonth}</h3>
              <p className="text-gray-600">今月の記事数</p>
            </div>
          </div>
        </div>
      </section>

      {/* 最新記事 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              最新記事
            </h2>
            <p className="text-gray-600 text-lg">
              メンバーたちが書いた最新の技術記事をチェックしよう！
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              すべての記事を見る
              <BookOpen className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* メンバー紹介 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shiki∞Link メンバー
            </h2>
            <p className="text-gray-600 text-lg">
              技術を教えてくれる可愛いメンバーたちを紹介します！
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/members"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              メンバー詳細を見る
              <Users className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage