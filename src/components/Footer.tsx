import React from 'react'
import { Heart, Github, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Shiki∞Link</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI生成したアイドルを題材にTypeScriptやWeb技術を学ぶブログサイトです。<br />
              技術を楽しく学んで、一緒に成長していきましょう！
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              コンテンツ
            </h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">技術ブログ</a></li>
              {/* <li><a href="" className="text-gray-600 hover:text-gray-900 transition-colors">ブログ記事</a></li> */}
              <li><a href="/members" className="text-gray-600 hover:text-gray-900 transition-colors">メンバー紹介</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              その他
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">プライバシーポリシー</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">利用規約</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">お問い合わせ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Shiki∞Link. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer