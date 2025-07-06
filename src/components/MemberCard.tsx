import React from 'react'
import { Member } from '../lib/supabase'
import { Calendar, MapPin, Heart } from 'lucide-react'
import LazyImage from './LazyImage'
import { getOptimizedImageUrl } from '../utils/performance'

interface MemberCardProps {
  member: Member
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const optimizedImageUrl = getOptimizedImageUrl(member.profile_image_url, 300, 300)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <LazyImage
          src={optimizedImageUrl}
          alt={member.name}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: member.image_color }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {member.nickname}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{member.position}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{member.age}歳</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {member.personality}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            趣味: {member.hobbies}
          </div>
          <Heart className="w-5 h-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  )
}

export default MemberCard