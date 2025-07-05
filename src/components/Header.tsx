import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, BookOpen, Settings } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Shiki∞Link</h1>
              <p className="text-xs text-gray-600">推しと学ぶWeb技術</p>
            </div>
          </Link>
          
          <nav className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ホーム
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>ブログ</span>
            </Link>
            <Link
              to="/members"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Users className="w-4 h-4" />
              <span>メンバー</span>
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <Settings className="w-4 h-4" />
              <span>管理</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header