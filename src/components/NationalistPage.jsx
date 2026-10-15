import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import SpotlightSection from './SpotlightSection';
import BulletinBanner from './BulletinBanner';
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
  Heart,
  Users,
  Shield,
  ArrowRight,
  Share2,
  ChevronDown,
  ChevronUp,
  Crown,
  Medal,
  Trophy
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'All',
  'Defence',
  'Geopolitics',
  'Supporter',
  'Journalist',
  'Media',
  'Solo Influencer',
  'Sanatan Dharma',
  'International'
];

export default function NationalistPage({ onOpenSuggest, onNavigatePropagandus, onOpenShareCard, reloadTrigger }) {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [liveCount, setLiveCount] = useState(1);

  // Poll live count
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/live-count');
        if (res.ok) {
          const data = await res.json();
          if (data?.liveCount) setLiveCount(data.liveCount);
        }
      } catch (e) {}
    };

    fetchLive();
    const interval = setInterval(fetchLive, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch dynamic categories
  useEffect(() => {
    fetch('/api/categories?type=nationalist')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map(c => c.name);
          const combined = ['All', ...new Set([...DEFAULT_CATEGORIES.slice(1), ...names])];
          setCategories(combined);
        }
      })
      .catch(() => {});
  }, []);

  // Sync upvoted IDs from localStorage and server
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nationalist_upvoted_ids');
      if (stored) {
        setUpvotedIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {}

    fetch('/api/my-votes')
      .then(res => res.json())
      .then(data => {
        if (data?.nationalistVotes && Array.isArray(data.nationalistVotes)) {
          setUpvotedIds(prev => {
            const merged = new Set([...prev, ...data.nationalistVotes]);
            try {
              localStorage.setItem('nationalist_upvoted_ids', JSON.stringify([...merged]));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchNationalists(search);
    }, 180);
    return () => clearTimeout(handler);
  }, [search, selectedCategory, reloadTrigger]);

  const fetchNationalists = async (searchQuery = search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await fetch(`/api/nationalist-influencers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInfluencers(Array.isArray(data) ? data : []);
      } else {
        setInfluencers([]);
      }
    } catch (e) {
      console.error('Failed to load nationalist influencers', e);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNationalists(search);
  };

  const handleUpvote = async (id) => {
    if (upvotedIds.has(id)) return;
    const nextSet = new Set([...upvotedIds, id]);
    setUpvotedIds(nextSet);
    try {
      localStorage.setItem('nationalist_upvoted_ids', JSON.stringify([...nextSet]));
    } catch (e) {}

    try {
      const res = await fetch(`/api/nationalist-influencers/${id}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.upvotes !== undefined) {
          setInfluencers(prev => prev.map(item => item.id === id ? { ...item, upvotes: data.upvotes } : item));
        }
      }
    } catch (e) {
      console.error('Failed to upvote', e);
    }
  };

  // Sort approved creators by upvotes descending
  const sortedInfluencers = [...influencers].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  // Top 3 for Podium Stairs (1st middle, 2nd left, 3rd right)
  const firstPlace = sortedInfluencers[0] || null;
  const secondPlace = sortedInfluencers[1] || null;
  const thirdPlace = sortedInfluencers[2] || null;

  // Ranks 4 to 10 (or all if expanded)
  const remainingCreators = sortedInfluencers.slice(3);
  const displayedRemaining = showAll ? remainingCreators : remainingCreators.slice(0, 7);

  // Check if actively searching
  const isSearching = search.trim().length > 0;

  // Reusable Stats Boxes JSX (Live viewer box placed at top over approved nationalist voices)
  const StatsBoxes = (
    <>
      {/* Realtime Live Counter at top over Approved Nationalist Voices */}
      <div className="bento-card p-3.5 sm:p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
        {/* Exact design from resources/live.png with animated pulsing green dot */}
        <div className="inline-flex items-center gap-2.5 bg-[#0a0a0a] px-3.5 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] shrink-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e] shadow-[0_0_10px_#22c55e]"></span>
          </span>
          <span className="text-white font-mono font-black text-sm tracking-tight">{liveCount}</span>
          <span className="text-gray-300 font-sans font-medium text-xs">online</span>
        </div>
        <div>
          <div className="font-comic text-xl text-black leading-none">
            LIVE CITIZENS
          </div>
          <div className="text-[11px] font-bold text-gray-600 uppercase font-display">
            Active on Platform
          </div>
        </div>
      </div>

      <div className="bento-card p-3.5 sm:p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 border-2 border-black rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-tirangaGreen" />
        </div>
        <div>
          <div className="font-comic text-2xl text-black leading-none">
            {influencers.length}
          </div>
          <div className="text-[11px] font-bold text-gray-600 uppercase font-display">
            Approved Nationalist Voices
          </div>
        </div>
      </div>

      <div className="bento-card p-3.5 sm:p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 border-2 border-black rounded-xl flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 text-saffron-dark" />
        </div>
        <div>
          <div className="font-comic text-2xl text-black leading-none">
            {influencers.reduce((acc, curr) => acc + (curr.upvotes || 0), 0)}
          </div>
          <div className="text-[11px] font-bold text-gray-600 uppercase font-display">
            Total Patriot Upvotes
          </div>
        </div>
      </div>

      <div className="bento-card p-3.5 sm:p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 border-2 border-black rounded-xl flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-chakraNavy" />
        </div>
        <div>
          <div className="font-comic text-2xl text-black leading-none">
            100%
          </div>
          <div className="text-[11px] font-bold text-gray-600 uppercase font-display">
            Admin Verified &amp; Moderated
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dedicated Hero Banner (Pop Art Graphic Style) with PC layout placement */}
        <div className="bento-card p-6 sm:p-10 bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 text-black border-3 border-black shadow-[6px_6px_0px_#000] relative overflow-hidden">
          
          {/* Halftone graphic background decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-repeat pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '16px 16px' }} />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Pop Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black text-white rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-black shadow-[2px_2px_0px_#fff]">
                <IndianFlagLogo size="xs" />
                <span>RASHTRIYA PRERAK DIRECTORY</span>
                <span className="bg-saffron text-black text-[10px] px-2 py-0.5 rounded-full font-bold">100% PRO-BHARAT</span>
              </div>

              {/* Comic Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-comic tracking-wide text-black leading-tight mb-4 drop-shadow-sm">
                NATIONALIST <span className="bg-white px-2 py-0.5 border-2 border-black inline-block -rotate-1 shadow-[3px_3px_0px_#000]">INFLUENCERS</span> &amp; CREATORS
              </h1>

              {/* Narrative */}
              <p className="font-display font-bold text-sm sm:text-base text-black/90 leading-relaxed max-w-xl mb-6">
                A curated platform celebrating patriotic creators, defence strategists, legal scholars, and independent researchers dedicated to Bharat's resurgence, national security, and civilizational pride.
              </p>

              {/* Pop Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenSuggest}
                  className="bento-btn bg-black text-white hover:bg-gray-900 px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-black flex items-center gap-2 shadow-[4px_4px_0px_#FF9933]"
                >
                  <PlusCircle className="w-4 h-4 text-saffron" />
                  <span>Suggest a Nationalist Creator</span>
                </button>

                <button
                  onClick={onNavigatePropagandus}
                  className="bento-btn bg-white text-black hover:bg-gray-100 px-5 py-3 text-xs sm:text-sm uppercase tracking-wider font-black flex items-center gap-2 shadow-[4px_4px_0px_#000]"
                >
                  <span>View Exposed Propagandus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PC Only Right Side Stats Container */}
            <div className="hidden lg:grid grid-cols-1 gap-3.5 w-full max-w-sm shrink-0">
              {StatsBoxes}
            </div>

          </div>
        </div>

        {/* Live Pop-Art Bulletin Banner (Admin Controlled) */}
        <BulletinBanner />

        {/* Mobile / Tablet Stats Bar (Displayed below hero on smaller screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {StatsBoxes}
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bento-card p-4 sm:p-5 bg-white border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search nationalist creators by name, topic, or social handle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-tirangaGreen"
              />
            </div>
            
            <button
              type="submit"
              className="bento-btn bg-black text-white hover:bg-gray-800 px-6 py-2.5 text-xs uppercase font-black"
            >
              Filter
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-black ${
                  selectedCategory === cat
                    ? 'bg-tirangaGreen text-white shadow-[2px_2px_0px_#000] -translate-y-0.5'
                    : 'bg-gray-50 text-black hover:bg-gray-100 shadow-[2px_2px_0px_#000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CREATORS DIRECTORY DISPLAY                                    */}
        {/* ------------------------------------------------------------- */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-black rounded-2xl text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000]">
              <RefreshCw className="w-4 h-4 animate-spin text-tirangaGreen" />
              <span>Loading Nationalist Directory...</span>
            </div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-16 bento-card p-8 sm:p-12 max-w-lg mx-auto bg-white border-3 border-black shadow-[6px_6px_0px_#000]">
            <div className="w-16 h-16 bg-amber-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#000]">
              <IndianFlagLogo size="sm" />
            </div>
            <h3 className="font-comic text-2xl sm:text-3xl text-black">
              NO CREATORS FOUND YET
            </h3>
            <p className="font-display font-medium text-xs sm:text-sm text-gray-600 mt-2 mb-6">
              Be the first patriotic citizen to suggest a nationalist creator in this category for administrative approval!
            </p>
            <button
              onClick={onOpenSuggest}
              className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-3 text-xs uppercase font-black shadow-[3px_3px_0px_#000]"
            >
              <PlusCircle className="w-4 h-4 inline-block mr-1.5" />
              <span>Suggest First Creator</span>
            </button>
          </div>
        ) : isSearching ? (
          /* SEARCH MODE: Inside unified bento-card */
          <div className="bento-card p-4 sm:p-8 bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 border-3 border-black shadow-[6px_6px_0px_#000] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h2 className="font-comic text-xl sm:text-2xl text-black flex items-center gap-2">
                <span>SEARCH RESULTS</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black text-white rounded-lg">
                  {influencers.length} FOUND
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((item) => (
                <CreatorCard
                  key={item.id}
                  item={item}
                  isUpvoted={upvotedIds.has(item.id)}
                  onUpvote={() => handleUpvote(item.id)}
                  onOpenShareCard={onOpenShareCard}
                />
              ))}
            </div>
          </div>
        ) : (
          /* STANDARD MODE: Unified bento-card containing Podium + Remaining Profiles */
          <div className="bento-card p-4 sm:p-8 bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40 border-3 border-black shadow-[6px_6px_0px_#000] space-y-10">
            
            {/* Top 3 Winning Stairs Podium Header */}
            {sortedInfluencers.length > 0 && (
              <div>
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FFE600] border-2 border-black rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#000]">
                    <Trophy className="w-4 h-4 text-black fill-current" />
                    <span>BHARAT'S TOP PATRIOTIC CREATORS</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-comic text-black">
                    Trending Nationalists
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 max-w-xl mx-auto mt-1">
                    Ranked by citizen votes: Top nationalist voices defending Bharat's sovereignty and culture.
                  </p>
                </div>

                {/* Olympic Podium Alignment: [Rank #2 Silver (Left)] [Rank #1 Gold (Center Highest)] [Rank #3 Bronze (Right)] */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-end max-w-5xl mx-auto pt-3">
                  
                  {/* #2 SILVER PODIUM (LEFT - LOWER THAN TOP) */}
                  {secondPlace ? (
                    <div className="flex flex-col items-center order-2 md:order-1">
                      <div className="w-full">
                        <CreatorCard
                          item={secondPlace}
                          rank={2}
                          rankBadge="🥈 #2 SILVER GUARDIAN"
                          rankRingColor="border-slate-400 ring-2 ring-slate-300"
                          isUpvoted={upvotedIds.has(secondPlace.id)}
                          onUpvote={() => handleUpvote(secondPlace.id)}
                          onOpenShareCard={onOpenShareCard}
                        />
                      </div>
                      {/* Step 2 Podium Base Block */}
                      <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-slate-400 via-gray-200 to-white border-3 border-black border-t-0 shadow-[5px_5px_0px_#000] rounded-b-2xl flex flex-col items-center justify-center -mt-1 z-0 relative">
                        <div className="font-comic text-4xl sm:text-5xl text-gray-800 leading-none drop-shadow-sm">
                          #2
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-black bg-white/90 px-3 py-0.5 rounded-full border border-black shadow-xs mt-1.5 flex items-center gap-1">
                          <Medal className="w-3 h-3 text-slate-700" />
                          <span>2nd Place • Silver</span>
                        </div>
                      </div>
                    </div>
                  ) : <div className="hidden md:block order-2 md:order-1" />}

                  {/* #1 GOLD CHAMPION PODIUM (CENTER - HIGHEST ELEVATION) */}
                  {firstPlace && (
                    <div className="flex flex-col items-center order-1 md:order-2 -mt-4 md:-mt-8">
                      <div className="w-full relative">
                        <CreatorCard
                          item={firstPlace}
                          rank={1}
                          rankBadge="🥇 #1 GOLD CHAMPION"
                          rankRingColor="border-[#FFD700] ring-4 ring-amber-400 shadow-[0_0_12px_rgba(255,215,0,0.6)]"
                          isUpvoted={upvotedIds.has(firstPlace.id)}
                          onUpvote={() => handleUpvote(firstPlace.id)}
                          onOpenShareCard={onOpenShareCard}
                          isTop
                        />
                      </div>
                      {/* Step 1 Podium Base Block (Tallest) */}
                      <div className="w-full h-28 sm:h-40 bg-gradient-to-t from-amber-500 via-yellow-300 to-[#FFE600] border-3 border-black border-t-0 shadow-[8px_8px_0px_#000] rounded-b-3xl flex flex-col items-center justify-center -mt-1 z-0 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-repeat pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
                        <div className="relative font-comic text-5xl sm:text-7xl text-black leading-none drop-shadow-md">
                          #1
                        </div>
                        <div className="relative text-[11px] font-black uppercase tracking-wider text-black bg-white px-3.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] mt-2 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span>1st Place • Gold Champion</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* #3 BRONZE PODIUM (RIGHT - LOWER THAN TOP) */}
                  {thirdPlace ? (
                    <div className="flex flex-col items-center order-3 md:order-3">
                      <div className="w-full">
                        <CreatorCard
                          item={thirdPlace}
                          rank={3}
                          rankBadge="🥉 #3 BRONZE VANGUARD"
                          rankRingColor="border-[#CD7F32] ring-2 ring-amber-300"
                          isUpvoted={upvotedIds.has(thirdPlace.id)}
                          onUpvote={() => handleUpvote(thirdPlace.id)}
                          onOpenShareCard={onOpenShareCard}
                        />
                      </div>
                      {/* Step 3 Podium Base Block (Lowest) */}
                      <div className="w-full h-14 sm:h-20 bg-gradient-to-t from-[#8C4A1E] via-[#CD7F32] to-[#FDE68A] border-3 border-black border-t-0 shadow-[4px_4px_0px_#000] rounded-b-2xl flex flex-col items-center justify-center -mt-1 z-0 relative">
                        <div className="font-comic text-3xl sm:text-4xl text-amber-950 leading-none drop-shadow-sm">
                          #3
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-white bg-black/85 px-3 py-0.5 rounded-full border border-black shadow-xs mt-1 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-300" />
                          <span>3rd Place • Bronze</span>
                        </div>
                      </div>
                    </div>
                  ) : <div className="hidden md:block order-3 md:order-3" />}

                </div>
              </div>
            )}

            {/* Ranks 4 to 10 (and beyond) Grid INSIDE the same unified bento container */}
            {remainingCreators.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedRemaining.map((item, idx) => (
                    <CreatorCard
                      key={item.id}
                      item={item}
                      rank={idx + 4}
                      rankBadge={`#${idx + 4} RANKED`}
                      isUpvoted={upvotedIds.has(item.id)}
                      onUpvote={() => handleUpvote(item.id)}
                      onOpenShareCard={onOpenShareCard}
                    />
                  ))}
                </div>

                {/* "View More" Button if more than 10 creators exist */}
                {remainingCreators.length > 7 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="bento-btn px-8 py-3 bg-[#FFE600] hover:bg-yellow-400 text-black border-3 border-black shadow-[4px_4px_0px_#000] font-black text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2"
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Show Top 10 Creators Only</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>View More Nationalist Creators ({remainingCreators.length - 7} More)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SPOTLIGHT SECTION: VIDEO OF THE DAY / IMPORTANT IMAGE         */}
        {/* Placed DIRECTLY BELOW Nationalist Creators Section            */}
        {/* ------------------------------------------------------------- */}
        <SpotlightSection reloadTrigger={reloadTrigger} />



      </div>
    </div>
  );
}

// Reusable Nationalist Creator Card with Pop Art Styling
function CreatorCard({ item, rank, rankBadge, rankRingColor, isUpvoted, onUpvote, onOpenShareCard, isTop }) {
  const hasX = !!item.handle_x;
  const hasYt = !!item.handle_yt;
  const hasInsta = !!item.handle_insta;

  const categoryList = (item.category || 'Nationalist Creator')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  return (
    <div
      className={`bento-card overflow-hidden flex flex-col justify-between bg-white border-3 border-black transition-all relative ${
        isTop
          ? 'shadow-[8px_8px_0px_#000] ring-3 ring-amber-400'
          : rank === 2
          ? 'shadow-[6px_6px_0px_#000] ring-2 ring-slate-300'
          : rank === 3
          ? 'shadow-[5px_5px_0px_#000] ring-2 ring-amber-600'
          : 'shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000]'
      }`}
    >
      <div>
        <div className={`p-4 border-b-2 border-black ${
          rank === 1 ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-orange-100' :
          rank === 2 ? 'bg-gradient-to-r from-gray-100 via-slate-100 to-zinc-100' :
          rank === 3 ? 'bg-gradient-to-r from-orange-50 via-amber-50 to-stone-100' :
          'bg-gradient-to-r from-orange-50 via-amber-50 to-green-50'
        }`}>
          
          {/* Rank Badge if on podium or top list */}
          {rankBadge && (
            <div className="flex justify-between items-center mb-2.5">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-black shadow-sm ${
                rank === 1 ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border-2' :
                rank === 2 ? 'bg-slate-200 text-black' :
                rank === 3 ? 'bg-amber-200 text-amber-950' :
                'bg-black text-white'
              }`}>
                {rankBadge}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-500">
                PRO-BHARAT
              </span>
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  className={`w-14 h-14 rounded-2xl border-2 border-black object-cover shadow-[2px_2px_0px_#000] bg-white shrink-0 ${rankRingColor || ''}`}
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`;
                  }}
                />
                {rank === 1 && (
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 p-0.5 rounded-full border border-black shadow-xs">
                    <Crown className="w-3.5 h-3.5 fill-black text-black" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-display font-black text-base text-black leading-tight">
                    {item.name}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-tirangaGreen shrink-0" title="Verified Nationalist Creator" />
                </div>
                {/* Multi-category chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {categoryList.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-0.5 bg-green-100 text-green-900 border border-green-800 rounded-full text-[9px] font-black uppercase tracking-wide shadow-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Social Media Accounts */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-black/15">
            {hasYt && (
              <a
                href={`https://youtube.com/@${item.handle_yt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 border border-black shadow-[1px_1px_0px_#000]"
                title="YouTube Channel"
              >
                <YoutubeIcon className="w-3.5 h-3.5 fill-current" />
                <span>{item.handle_yt}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            )}

            {hasX && (
              <a
                href={`https://x.com/${item.handle_x}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-black text-white hover:bg-gray-800 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 border border-black shadow-[1px_1px_0px_#000]"
                title="X (Twitter) Profile"
              >
                <TwitterIcon className="w-3.5 h-3.5 fill-current" />
                <span>@{item.handle_x}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            )}

            {hasInsta && (
              <a
                href={`https://instagram.com/${item.handle_insta}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 border border-black shadow-[1px_1px_0px_#000]"
                title="Instagram Account"
              >
                <InstagramIcon className="w-3.5 h-3.5 fill-current" />
                <span>@{item.handle_insta}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
              </a>
            )}
          </div>
        </div>

        {/* Description Body */}
        <div className="p-4 space-y-2">
          <p className="font-display text-xs text-gray-800 leading-relaxed font-semibold">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Footer: Upvote Button & Counter */}
      <div className="px-4 py-3 bg-gray-50 border-t-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700">
          <Flame className="w-4 h-4 text-saffron-dark animate-pulse" />
          <span>{item.upvotes || 0} Upvotes</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenShareCard && (
            <button
              onClick={() => onOpenShareCard({
                title: item.name,
                badge: '100% PRO-BHARAT CREATOR',
                truth: item.description,
                details: [
                  `Category: ${categoryList.join(', ')}`,
                  `Upvotes: ${item.upvotes || 0}`,
                  item.handle_x ? `X: @${item.handle_x}` : null,
                  item.handle_yt ? `YouTube: ${item.handle_yt}` : null
                ].filter(Boolean),
                source: 'Exposed Propagandus Nationalist Directory'
              })}
              className="bento-btn px-2.5 py-1 text-xs bg-[#FFE600] text-black hover:bg-yellow-400 flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_#000]"
              title="Share Creator Fact Card"
            >
              <Share2 className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase">Share</span>
            </button>
          )}

          <button
            onClick={onUpvote}
            disabled={isUpvoted}
            className={`bento-btn px-3 py-1.5 text-xs uppercase flex items-center gap-1.5 font-black border-2 border-black ${
              isUpvoted
                ? 'bg-tirangaGreen text-white shadow-none cursor-default'
                : 'bg-white hover:bg-saffron text-black shadow-[2px_2px_0px_#000]'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
            <span>{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
