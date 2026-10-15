import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { Flame, ThumbsUp, Share2, Sparkles, Pin, Clock, ShieldAlert, Newspaper, MessageSquare, Download } from 'lucide-react';

export default function AdminPostsFeed({ onOpenShareCard, reloadTrigger }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    fetchPosts();
  }, [reloadTrigger]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load admin posts', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    if (likedIds.has(id)) return;
    try {
      const res = await fetch(`/api/posts/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLikedIds(prev => new Set([...prev, id]));
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: data.likes } : p));
      }
    } catch (e) {
      console.error('Like error', e);
    }
  };

  if (loading && posts.length === 0) return null;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-8 bg-white border-b-2 border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-saffron border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
              <Flame className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-comic text-2xl sm:text-3xl text-black uppercase tracking-wide">
                  ADMIN GROUND DISPATCHES &amp; BULLETINS
                </h2>
                <IndianFlagLogo size="xs" />
              </div>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Direct Intel, Official Debunks &amp; Sovereign National Updates
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] text-xs font-black uppercase text-black">
            <span className="text-red-600 font-bold">✹</span>
            <span>LIVE BHARAT WATCHDOG</span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bento-card p-5 bg-pop-halftone border-3 border-black rounded-2xl shadow-[5px_5px_0px_#000] flex flex-col justify-between transition-transform hover:-translate-y-0.5 ${
                post.is_pinned ? 'ring-2 ring-saffron' : ''
              }`}
            >
              <div>
                {/* Post Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#FF2A2A] text-white border-2 border-black rounded text-[10px] font-comic uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                      {post.badge || 'DISPATCH'}
                    </span>
                    {post.is_pinned === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFE600] text-black border border-black rounded text-[9px] font-black uppercase shadow-[1px_1px_0px_#000]">
                        <Pin className="w-2.5 h-2.5 fill-black" />
                        <span>Pinned Intel</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Post Image (if uploaded) */}
                {post.image_url && (
                  <div className="relative mb-3.5 rounded-xl overflow-hidden border-2 border-black shadow-[3px_3px_0px_#000] max-h-60 bg-black">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover max-h-56 hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="font-comic text-xl sm:text-2xl text-black leading-tight uppercase mb-2.5">
                  {post.title}
                </h3>

                {/* Content */}
                <div className="p-3.5 bg-white/90 border-2 border-black/80 rounded-xl mb-4 font-display text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  {post.content}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`bento-btn px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000] transition-all ${
                    likedIds.has(post.id)
                      ? 'bg-tirangaGreen text-white'
                      : 'bg-white hover:bg-gray-100 text-black'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${likedIds.has(post.id) ? 'fill-white' : ''}`} />
                  <span>{post.likes || 0} Jai Hind</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenShareCard) {
                      onOpenShareCard({
                        title: post.title,
                        badge: post.badge || 'ADMIN DISPATCH',
                        truth: post.content,
                        details: ['Verified Ground Dispatch', 'Published by Admin Intelligence Unit'],
                        source: 'Exposed Propagandus Sovereign Editorial'
                      });
                    }
                  }}
                  className="bento-btn bg-[#FFE600] hover:bg-yellow-400 text-black px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Card</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
