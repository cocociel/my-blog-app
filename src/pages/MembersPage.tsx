import React, { useState, useEffect } from 'react'
import { supabase, Member } from '../lib/supabase'
import SEOHead from '../components/SEOHead'
import LazyImage from '../components/LazyImage'
import { Users, Heart, Calendar, MapPin, Sparkles, Smile } from 'lucide-react'

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true })

      if (data) {
        setMembers(data)
        setSelectedMember(data[0]) // 最初のメンバーを選択
      }
    } catch (error) {
      console.error('メンバー情報の取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'long',
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
      <SEOHead
        title="Shiki∞Link メンバー"
        description="技術を教えてくれる可愛いメンバーたちの詳細プロフィール。Haru、Natsu、Aki、Fuyuの4人のAIアイドルを紹介します。"
        keywords={['Shiki∞Link', 'メンバー', 'プロフィール', 'AIアイドル', 'Haru', 'Natsu', 'Aki', 'Fuyu']}
      />

      {/* ヘッダー */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shiki∞Link メンバー
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              技術を教えてくれる可愛いメンバーたちの詳細プロフィール
            </p>
          </div>
        </div>
      </section>

      {/* メンバー一覧 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メンバー選択 */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">メンバー選択</h2>
                <div className="space-y-4">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${selectedMember?.id === member.id
                        ? 'bg-white shadow-lg border-2 border-gray-200 transform scale-105'
                        : 'bg-white shadow-md hover:shadow-lg hover:scale-102'
                        }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <LazyImage
                            src={member.profile_image_url}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: member.image_color }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.nickname}</p>
                          <p className="text-xs text-gray-400">{member.position}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 詳細プロフィール */}
            <div className="lg:col-span-2">
              {selectedMember && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* プロフィール画像とヘッダー */}
                  <div
                    className="h-64 bg-gradient-to-br from-opacity-20 to-opacity-40 relative"
                    style={{
                      background: `linear-gradient(135deg, ${selectedMember.image_color}20, ${selectedMember.image_color}40)`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <LazyImage
                          src={selectedMember.profile_image_url}
                          alt={selectedMember.name}
                          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-xl"
                        />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {selectedMember.name}
                        </h1>
                        <p className="text-lg text-gray-700 mb-2">
                          {selectedMember.nickname}
                        </p>
                        <div className="flex items-center justify-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: selectedMember.image_color }}
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {selectedMember.position}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 基本情報 */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">年齢・誕生日</p>
                          <p className="font-semibold text-gray-900">
                            {selectedMember.age}歳 ({formatDate(selectedMember.birthday)})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">ポジション</p>
                          <p className="font-semibold text-gray-900">
                            {selectedMember.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* キャッチフレーズ */}
                    <div className="mb-8">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          キャッチフレーズ
                        </h3>
                      </div>
                      <p className="text-gray-700 text-lg italic bg-gray-50 p-4 rounded-lg">
                        "{selectedMember.catchphrase}"
                      </p>
                    </div>

                    {/* 性格 */}
                    <div className="mb-8">
                      <div className="flex items-center space-x-2 mb-3">
                        <Smile className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          性格
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMember.personality}
                      </p>
                    </div>

                    {/* 趣味 */}
                    <div className="mb-8">
                      <div className="flex items-center space-x-2 mb-3">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          趣味
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMember.hobbies}
                      </p>
                    </div>

                    {/* イメージカラー */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        イメージカラー
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                          style={{ backgroundColor: selectedMember.image_color }}
                        />
                        <div>
                          <p className="font-mono text-sm text-gray-600 uppercase">
                            {selectedMember.image_color}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedMember.name}のメンバーカラー
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MembersPage