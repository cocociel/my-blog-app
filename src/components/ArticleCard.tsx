import React from 'react'
import { Link } from 'react-router-dom'
import { Article } from '../lib/supabase'
import { Calendar, Eye, Heart, Tag } from 'lucide-react'
import LazyImage from './LazyImage'
import { getOptimizedImageUrl } from '../utils/performance'

interface ArticleCardProps {
  article: Article
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 記事のサムネイル画像を生成（実際の実装では記事にimage_urlフィールドを追加することを推奨）
  const thumbnailUrl = getOptimizedImageUrl(
    'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    400,
    250
  )

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* サムネイル画像 */}
      <div className="h-48 overflow-hidden">
        <LazyImage
          src={thumbnailUrl}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <time dateTime={article.published_at || article.created_at}>
              {formatDate(article.published_at || article.created_at)}
            </time>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{article.view_count}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{article.like_count}</span>
            </div>
          </div>
        </div>
        
        <Link to={`/blog/${article.id}`} className="block group">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        </Link>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-2">
              {article.category_tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Link
            to={`/blog/${article.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            続きを読む →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard