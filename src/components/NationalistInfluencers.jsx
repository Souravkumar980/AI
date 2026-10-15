import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import {
  Search,
  PlusCircle,
  ThumbsUp,
  ExternalLink,
  Award,
  Sparkles,
  RefreshCw,
  Flame,
  ShieldCheck,
  Heart
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'National Development & Facts',
  'Defence & Geopolitics',
  'Constitutional Law & Civilizational Heritage',
  'Intellectual & Scientific Discourse',
  'Satire & Counter-Narrative'
];

export default function NationalistInfluencers({ onOpenSuggest, reloadTrigger }) {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [upvotedIds, setUpvotedIds] = useState(new Set());

  useEffect(() => {
    fetchNationalists();
  }, [selectedCategory, reloadTrigger]);

  const fetchNationalists = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await fetch(`/api/nationalist-influencers?${params.toString()}`);
      const data = await res.json();
      setInfluencers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load nationalist influencers', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNationalists();
  };

  const handleUpvote = async (id) => {
    if (upvotedIds.has(id)) return;
    try {
      const res = await fetch(`/api/nationalist-influencers/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUpvotedIds(prev => new Set([...prev, id]));
        setInfluencers(prev => prev.map(item => item.id === id ? { ...item, upvotes: data.upvotes } : item));
      }
    } catch (e) {
      console.error('Upvote error', e);
    }
  };

  return (
    <section id="nationalist-section" className="py-12 bg-white relative border-b-2 border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-800 border border-green-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <IndianFlagLogo size="xs" />
              <span>RASHTRIYA PRERAK VAULT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-comic tracking-tight text-black">
              NATIONALIST <span className="text-tirangaGreen">INFLUENCERS</span>
            </h2>
            <p className="font-display text-sm text-gray-600 mt-1 max-w-2xl font-medium">
              Celebrating verified patriotic creators, defence analysts, and researchers debunking anti-India narratives and championing Bharat's progress.
            </p>
          </div>

          <button
            onClick={onOpenSuggest}
            className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-5 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shrink-0 font-black"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Suggest a Creator</span>
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="bento-card p-4 sm:p-5 bg-[#F8F9FA] mb-8 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search nationalist creators by name, topic, or handle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            
            <button
              type="submit"
              className="bento-btn bg-black text-white px-5 py-2 text-xs uppercase font-bold"
            >
              Search
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-tirangaGreen text-white border-green-800 shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Influencers Cards Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-600 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-green-600" />
              <span>Loading nationalist creators...</span>
            </div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-12 bento-card p-8 max-w-md mx-auto bg-white">
            <Award className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <h3 className="font-comic text-xl text-black">No Creators Found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Be the first to suggest a patriotic creator in this category!
            </p>
            <button
              onClick={onOpenSuggest}
              className="bento-btn bg-saffron text-black px-4 py-2 text-xs uppercase font-bold"
            >
              Suggest Creator
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {influencers.map((item) => {
              const hasX = !!item.handle_x;
              const hasYt = !!item.handle_yt;
              const hasInsta = !!item.handle_insta;
              const isUpvoted = upvotedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className="bento-card overflow-hidden flex flex-col justify-between bg-white border-2 border-black hover:border-green-800 transition-all"
                >
                  {/* Top Bar: Profile Details */}
                  <div>
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50/40 via-amber-50/20 to-green-50/40">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`}
                            alt={item.name}
                            className="w-13 h-13 rounded-2xl border-2 border-black object-cover shadow-sm bg-white shrink-0"
                            onError={(e) => {
                              e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`;
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-display font-black text-base text-black leading-tight">
                                {item.name}
                              </h3>
                              <ShieldCheck className="w-4 h-4 text-tirangaGreen shrink-0" title="Verified Nationalist Creator" />
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-900 border border-green-300 rounded text-[10px] font-bold">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Social Handles */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-200">
                        {hasYt && (
                          <a
                            href={`https://youtube.com/@${item.handle_yt}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded-md text-[11px] font-mono flex items-center gap-1 shadow-sm"
                            title="YouTube Channel"
                          >
                            <YoutubeIcon className="w-3 h-3 fill-current" />
                            <span>{item.handle_yt}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        )}

                        {hasX && (
                          <a
                            href={`https://x.com/${item.handle_x}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-black text-white hover:bg-gray-800 rounded-md text-[11px] font-mono flex items-center gap-1 shadow-sm"
                            title="X (Twitter) Profile"
                          >
                            <TwitterIcon className="w-3 h-3 fill-current" />
                            <span>@{item.handle_x}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        )}

                        {hasInsta && (
                          <a
                            href={`https://instagram.com/${item.handle_insta}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-md text-[11px] font-mono flex items-center gap-1 shadow-sm"
                            title="Instagram Profile"
                          >
                            <InstagramIcon className="w-3 h-3 fill-current" />
                            <span>@{item.handle_insta}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Description Body */}
                    <div className="p-4 space-y-2">
                      <p className="font-display text-xs text-gray-800 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer: Upvote Action */}
                  <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span>{item.upvotes || 0} Citizens Approved</span>
                    </div>

                    <button
                      onClick={() => handleUpvote(item.id)}
                      disabled={isUpvoted}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase flex items-center gap-1.5 transition-all ${
                        isUpvoted
                          ? 'bg-green-100 text-green-900 border border-green-400 cursor-default'
                          : 'bento-btn bg-white hover:bg-green-50 text-black border border-black'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'text-green-700 fill-current' : 'text-gray-700'}`} />
                      <span>{isUpvoted ? 'Voted Best' : 'Upvote'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
