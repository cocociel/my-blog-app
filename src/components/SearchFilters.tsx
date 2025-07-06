import React, { useState, useEffect } from 'react'
import { supabase, Category } from '../lib/supabase'
import { Search, Filter, Calendar, TrendingUp, X } from 'lucide-react'

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void
}

export interface SearchFilters {
  searchTerm: string
  selectedCategories: string[]
  dateRange: {
    start: string
    end: string
  }
  sortBy: 'newest' | 'oldest' | 'most_liked' | 'most_viewed'
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedCategories: [],
    dateRange: { start: '', end: '' },
    sortBy: 'newest'
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (data) setCategories(data)
    } catch (error) {
      console.error('カテゴリの取得に失敗しました:', error)
    }
  }

  const handleCategoryToggle = (categorySlug: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categorySlug)
        ? prev.selectedCategories.filter(c => c !== categorySlug)
        : [...prev.selectedCategories, categorySlug]
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategories: [],
      dateRange: { start: '', end: '' },
      sortBy: 'newest'
    })
  }

  const hasActiveFilters = filters.searchTerm || 
    filters.selectedCategories.length > 0 || 
    filters.dateRange.start || 
    filters.dateRange.end ||
    filters.sortBy !== 'newest'

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* 基本検索 */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="記事を検索..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              showAdvancedFilters 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>詳細フィルタ</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>クリア</span>
            </button>
          )}
        </div>
      </div>

      {/* 詳細フィルタ */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* ソート */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              並び順
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'newest', label: '新しい順' },
                { value: 'oldest', label: '古い順' },
                { value: 'most_liked', label: 'いいね順' },
                { value: 'most_viewed', label: '閲覧数順' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    filters.sortBy === option.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリ選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              カテゴリ（複数選択可）
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.slug)}
                  className={`px-3 py-2 text-sm rounded-full transition-colors ${
                    filters.selectedCategories.includes(category.slug)
                      ? 'text-white border-2'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: filters.selectedCategories.includes(category.slug) 
                      ? category.color 
                      : undefined,
                    borderColor: category.color
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 日付範囲 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              投稿日期間
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">開始日</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">終了日</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アクティブフィルタ表示 */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                検索: "{filters.searchTerm}"
              </span>
            )}
            {filters.selectedCategories.map(categorySlug => {
              const category = categories.find(c => c.slug === categorySlug)
              return category ? (
                <span
                  key={categorySlug}
                  className="inline-flex items-center px-3 py-1 text-white text-sm rounded-full"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              ) : null
            })}
            {filters.dateRange.start && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {filters.dateRange.start} 以降
              </span>
            )}
            {filters.dateRange.end && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {filters.dateRange.end} 以前
              </span>
            )}
            {filters.sortBy !== 'newest' && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {filters.sortBy === 'oldest' && '古い順'}
                {filters.sortBy === 'most_liked' && 'いいね順'}
                {filters.sortBy === 'most_viewed' && '閲覧数順'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFiltersComponent