import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase'
import ArticleCard from '../components/ArticleCard'
import SearchFiltersComponent, { SearchFilters } from '../components/SearchFilters'
import SEOHead from '../components/SEOHead'
import { useDebounce } from '../hooks/useDebounce'
import { BookOpen } from 'lucide-react'

const BlogPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedCategories: [],
    dateRange: { start: '', end: '' },
    sortBy: 'newest'
  })
  const articlesPerPage = 9

  // 検索語句のデバウンス
  const debouncedSearchTerm = useDebounce(currentFilters.searchTerm, 300)

  useEffect(() => {
    fetchArticles(currentFilters, 1)
  }, [debouncedSearchTerm, currentFilters.selectedCategories, currentFilters.dateRange, currentFilters.sortBy])

  const fetchArticles = async (filters: SearchFilters, page = 1) => {
    setLoading(true)
    try {
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .eq('status', 'published')

      // 検索フィルタ
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,content.ilike.%${filters.searchTerm}%`)
      }

      // カテゴリフィルタ（複数選択対応）
      if (filters.selectedCategories.length > 0) {
        const categoryConditions = filters.selectedCategories.map(category => 
          `category_tags.cs.["${category}"]`
        ).join(',')
        query = query.or(categoryConditions)
      }

      // 日付範囲フィルタ
      if (filters.dateRange.start) {
        query = query.gte('published_at', filters.dateRange.start)
      }
      if (filters.dateRange.end) {
        query = query.lte('published_at', filters.dateRange.end + 'T23:59:59')
      }

      // ソート
      switch (filters.sortBy) {
        case 'oldest':
          query = query.order('published_at', { ascending: true })
          break
        case 'most_liked':
          query = query.order('like_count', { ascending: false })
          break
        case 'most_viewed':
          query = query.order('view_count', { ascending: false })
          break
        default: // newest
          query = query.order('published_at', { ascending: false })
      }

      // ページネーション
      const from = (page - 1) * articlesPerPage
      const to = from + articlesPerPage - 1
      query = query.range(from, to)

      const { data, count, error } = await query

      if (error) throw error

      if (data) {
        setArticles(data)
        setTotalPages(Math.ceil((count || 0) / articlesPerPage))
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('記事の取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (filters: SearchFilters) => {
    setCurrentFilters(filters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    fetchArticles(currentFilters, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && articles.length === 0) {
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
        title="技術ブログ"
        description="Shiki∞Linkメンバーが書いた技術記事で、一緒に学びませんか？TypeScript、React、Web技術の記事を多数掲載しています。"
        keywords={['技術ブログ', 'TypeScript', 'React', 'Web技術', 'プログラミング', '学習']}
      />

      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              技術ブログ
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Shiki∞Linkメンバーが書いた技術記事で、一緒に学びませんか？
            </p>
          </div>
        </div>
      </section>

      {/* 検索とフィルタ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchFiltersComponent onFiltersChange={handleFiltersChange} />
        </div>
      </section>

      {/* 記事一覧 */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                記事が見つかりません
              </h3>
              <p className="text-gray-600">
                検索条件を変更してもう一度お試しください。
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      前へ
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      次へ
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogPage