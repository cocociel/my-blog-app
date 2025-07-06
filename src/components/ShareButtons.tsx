import React, { useState } from 'react'
import { Share2, Twitter, Facebook, Link, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, description }) => {
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description || '')
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
    line: `https://social-plugins.line.me/lineit/share?url=${shareData.url}`,
    hatena: `https://b.hatena.ne.jp/entry/${shareData.url}`,
    pocket: `https://getpocket.com/edit?url=${shareData.url}&title=${shareData.title}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('リンクのコピーに失敗しました:', error)
    }
  }

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    setShowDropdown(false)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
        setShowDropdown(false)
      } catch (error) {
        console.error('ネイティブシェアに失敗しました:', error)
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>シェア</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">この記事をシェア</h4>
            
            <div className="space-y-2">
              {/* ネイティブシェア（対応ブラウザのみ） */}
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">デバイスでシェア</span>
                </button>
              )}

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-700">Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Facebook</span>
              </button>

              {/* LINE */}
              <button
                onClick={() => handleShare('line')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="text-sm text-gray-700">LINE</span>
              </button>

              {/* はてなブックマーク */}
              <button
                onClick={() => handleShare('hatena')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-5 h-5 bg-blue-700 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">B!</span>
                </div>
                <span className="text-sm text-gray-700">はてなブックマーク</span>
              </button>

              {/* Pocket */}
              <button
                onClick={() => handleShare('pocket')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="text-sm text-gray-700">Pocket</span>
              </button>

              {/* リンクコピー */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Link className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-sm text-gray-700">
                  {copied ? 'コピーしました！' : 'リンクをコピー'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* オーバーレイ */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default ShareButtons