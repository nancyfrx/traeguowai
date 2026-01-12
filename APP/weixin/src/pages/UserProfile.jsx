import React from 'react';
import { ChevronLeft, MoreHorizontal, Camera } from 'lucide-react';

const UserProfile = ({ user, onBack }) => {
  // Mock data for user's posts
  const posts = [
    { id: 101, day: '今天', content: '', image: 'https://picsum.photos/seed/p1/400/400', isImage: true },
    { id: 102, day: '05', month: '1月', content: '纵有疾风起，人生不言弃。', image: 'https://picsum.photos/seed/p2/400/400', isImage: true },
    { id: 103, day: '01', month: '1月', content: '今天的阳光格外温柔，适合发呆。', image: 'https://picsum.photos/seed/p3/400/400', isImage: true },
  ];

  return (
    <div className="flex flex-col h-full bg-white absolute inset-0 z-[120] overflow-y-auto">
      {/* Header Image Section */}
      <div className="relative h-[300px]">
        <img 
          src="https://picsum.photos/seed/dogs/800/600" 
          className="w-full h-full object-cover" 
          alt="Background" 
        />
        <div className="absolute top-12 left-4 z-50">
          <button onClick={onBack} className="text-white drop-shadow-md">
            <ChevronLeft size={28} />
          </button>
        </div>
        <div className="absolute top-12 right-4 z-50">
          <button className="text-white drop-shadow-md">
            <MoreHorizontal size={28} />
          </button>
        </div>
        
        {/* User Info Overlay */}
        <div className="absolute -bottom-6 right-4 flex items-end gap-3">
          <span className="text-white font-bold text-[20px] mb-8 drop-shadow-lg">{user.name || 'fengruxue'}</span>
          <img 
            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/png?seed=shiba'} 
            className="w-[72px] h-[72px] rounded-lg border-2 border-white shadow-sm" 
            alt="Avatar" 
          />
        </div>
      </div>

      {/* Signature */}
      <div className="mt-8 px-6 text-right">
        <p className="text-[#b2b2b2] text-[14px]">心之所向，素履以往。</p>
      </div>

      {/* Timeline */}
      <div className="mt-12 px-4 space-y-10 pb-20">
        <div className="flex gap-4">
          <div className="w-16 shrink-0">
            <span className="text-[24px] font-bold">今天</span>
          </div>
          <div className="flex-1">
            <div className="w-20 h-20 bg-[#f7f7f7] flex items-center justify-center rounded-sm">
              <Camera size={32} className="text-[#b2b2b2]" />
            </div>
          </div>
        </div>

        {posts.filter(p => p.day !== '今天').map(post => (
          <div key={post.id} className="flex gap-4">
            <div className="w-16 shrink-0 flex items-baseline gap-0.5">
              <span className="text-[24px] font-bold">{post.day}</span>
              <span className="text-[13px] font-bold">{post.month}</span>
            </div>
            <div className="flex-1 flex gap-3">
              {post.image && (
                <img src={post.image} className="w-20 h-20 object-cover rounded-sm" alt="" />
              )}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[15px] line-clamp-2 leading-relaxed">{post.content}</p>
                {post.id === 102 && (
                  <div className="mt-1">
                    <img src="https://img.icons8.com/ios-filled/24/b2b2b2/lock.png" className="w-3 h-3" alt="private" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-8">
          <span className="text-[24px] font-bold">2025年</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
