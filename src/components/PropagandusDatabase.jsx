import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { OPPOSITION_PARTIES, OPPOSITION_INSTITUTIONS, ENTITY_CATEGORIES } from '../data/partiesAndInstitutions';
import { TwitterIcon, YoutubeIcon, InstagramIcon, getSocialPlatformInfo } from './SocialIcons';
import {
  Search,
  Filter,
  ThumbsUp,
  ExternalLink,
  ShieldAlert,
  Building,
  Vote,
  Share2,
  Newspaper,
  Briefcase,
  PlusCircle,
  RefreshCw,
  X,
  LayoutGrid,
  ListFilter,
  AlertTriangle
} from 'lucide-react';
import { playRandomPropaganduSound } from '../utils/audioPlayer';
import { useLanguage } from '../context/LanguageContext';
import WantedRatingModal from './WantedRatingModal';

// Wanted Level Rating Widget with button to open Wanted Rating pop-up menu
function WantedRatingWidget({ entity, myRating, onOpenRatingModal }) {
  const currentAvg = entity?.rating_avg !== undefined && entity?.rating_avg !== null ? Number(entity.rating_avg) : 5.0;
  const totalCount = Number(entity?.rating_count) || 0;
  const userScore = myRating !== undefined && myRating !== null ? Number(myRating) : null;

  return (
    <div
      className="flex flex-col items-start gap-1 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-popRed bg-red-100 border border-red-300 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
          <span>🚨</span> WANTED LEVEL
        </span>
        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <span>★</span> {currentAvg.toFixed(1)}
        </span>
        <span className="text-[10px] text-gray-500 font-bold">
          👥 {totalCount} {totalCount === 1 ? 'user rated' : 'users rated'}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
        <button
          type="button"
          onClick={() => onOpenRatingModal(entity)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-amber-500 hover:to-red-600 text-white font-sans font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:scale-95 transition-all cursor-pointer"
          title={`Rate Wanted Level for ${entity?.name || 'Propagandu'}`}
        >
          <span>⭐</span>
          <span>{userScore ? `Wanted Rating: ${userScore}★ (Update)` : 'Give Wanted Rating'}</span>
        </button>
        {userScore && (
          <span className="text-[11px] text-tirangaGreen font-mono font-black">
            (Your Vote: {userScore}★)
          </span>
        )}
      </div>
    </div>
  );
}

export default function PropagandusDatabase({ onOpenSubmit, onOpenReport, onOpenShareCard, reloadTrigger }) {
  const { t } = useLanguage();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(ENTITY_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const defaultIds = new Set(ENTITY_CATEGORIES.map(c => c.id));
          const dynamic = data
            .filter(d => (d.type === 'propagandist' || d.type === 'propagandu' || d.type === 'entity' || !d.type) && d.name && !defaultIds.has(d.name))
            .map(d => ({ id: d.name, label: d.name, icon: 'Share2' }));
          setCategories([...ENTITY_CATEGORIES, ...dynamic]);
        }
      })
      .catch(() => {});
  }, [reloadTrigger]);
  const [selectedParty, setSelectedParty] = useState('All');
  const [selectedInstitution, setSelectedInstitution] = useState('All');
  const [sortBy, setSortBy] = useState('wanted');
  const [ratingModalEntity, setRatingModalEntity] = useState(null);
  // View mode: 'profile' (default, icons only) vs 'detailed'
  const [viewMode, setViewMode] = useState('profile');
  const [userRatings, setUserRatings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('propagandus_user_ratings') || '{}');
      return (stored && typeof stored === 'object') ? stored : {};
    } catch (e) {
      return {};
    }
  });

  // Sync ratings from server for caller IP
  useEffect(() => {
    fetch('/api/my-ratings')
      .then(res => res.json())
      .then(data => {
        if (data?.ratings && typeof data.ratings === 'object') {
          setUserRatings(prev => {
            const next = { ...prev, ...data.ratings };
            try {
              localStorage.setItem('propagandus_user_ratings', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEntities(search);
    }, 180);
    return () => clearTimeout(handler);
  }, [search, selectedCategory, selectedParty, selectedInstitution, sortBy, reloadTrigger]);

  // Real-time silent background polling (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedParty !== 'All') params.append('party', selectedParty);
      if (selectedInstitution !== 'All') params.append('institution', selectedInstitution);
      if (sortBy) params.append('sort', sortBy);

      fetch(`/api/entities?${params.toString()}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setEntities(prev => {
              const prevStr = JSON.stringify(prev.map(e => `${e.id}_${e.rating_avg}_${e.rating_count}_${e.upvotes}_${e.is_verified}`));
              const newStr = JSON.stringify(data.map(e => `${e.id}_${e.rating_avg}_${e.rating_count}_${e.upvotes}_${e.is_verified}`));
              return prevStr !== newStr ? data : prev;
            });
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(timer);
  }, [search, selectedCategory, selectedParty, selectedInstitution, sortBy]);

  const fetchEntities = async (searchQuery = search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedParty !== 'All') params.append('party', selectedParty);
      if (selectedInstitution !== 'All') params.append('institution', selectedInstitution);
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`/api/entities?${params.toString()}`);
      const data = await res.json();
      setEntities(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load profiles', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEntities(search);
  };

  const handleRateEntity = async (id, ratingValue) => {
    playRandomPropaganduSound();
    setUserRatings(prev => {
      const next = { ...prev, [id]: ratingValue };
      try {
        localStorage.setItem('propagandus_user_ratings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      const res = await fetch(`/api/propagandus/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue })
      });
      const data = await res.json();
      if (data.success) {
        const newAvg = data.rating_avg !== undefined ? data.rating_avg : undefined;
        const newCount = data.rating_count !== undefined ? data.rating_count : undefined;

        setEntities(prev => prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              rating_avg: newAvg !== undefined ? newAvg : item.rating_avg,
              rating_count: newCount !== undefined ? newCount : item.rating_count
            };
          }
          return item;
        }));

        setRatingModalEntity(prev => (prev && prev.id === id ? {
          ...prev,
          rating_avg: newAvg !== undefined ? newAvg : prev.rating_avg,
          rating_count: newCount !== undefined ? newCount : prev.rating_count
        } : prev));
      }
    } catch (e) {
      console.error('Rating error', e);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedParty('All');
    setSelectedInstitution('All');
    setSortBy('trending');
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Social Media': return <Share2 className="w-3 h-3" />;
      case 'Political Party': return <Vote className="w-3 h-3" />;
      case 'Institutions': return <Building className="w-3 h-3" />;
      case 'Company': return <Briefcase className="w-3 h-3" />;
      case 'Press (Media)': return <Newspaper className="w-3 h-3" />;
      default: return null;
    }
  };

  const parseOtherLinks = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        return [raw];
      } catch (e) {
        return raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const ensureUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  return (
    <section id="database-section" className="py-12 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-900 border border-red-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <span>{t('database_title', 'Public Directory')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-comic tracking-tight text-black">
              TRACKED <span className="text-red-600">PROPAGANDUS</span>
            </h2>
            <p className="font-display text-sm text-gray-600 mt-1 max-w-xl">
              {t('database_subtitle', 'List of influencers, political figures, and media portals documented for spreading anti-India narratives.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {/* View Mode Toggle Switch (Profile vs Detailed) */}
            <div className="inline-flex p-1 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
              <button
                type="button"
                onClick={() => setViewMode('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  viewMode === 'profile'
                    ? 'bg-saffron text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                title="Profile View (Profile Pic, Name & Social Icons Only)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-saffron text-black border border-black shadow-[1px_1px_0px_#000]'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                title="Detailed View (Narratives, Badges & Expose Data)"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Detailed</span>
              </button>
            </div>

            <button
              onClick={onOpenSubmit}
              className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>{t('submit_propagandu', 'Add to Directory')}</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Bento Style) */}
        <div id="search-area" data-no-sound="true" className="bento-card p-4 sm:p-5 bg-white mb-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_placeholder', 'Search by name, handle, party, or keyword...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>
            
            <button
              type="submit"
              className="bento-btn bg-black text-white px-5 py-2 text-xs uppercase font-bold"
            >
              Search
            </button>
          </form>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
            </div>

            {/* Opposition Party Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                Opposition Party
              </label>
              <select
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Opposition Parties</option>
                {OPPOSITION_PARTIES.map(p => (
                  <option key={p} value={p}>{p.split('–')[0].trim()}</option>
                ))}
              </select>
            </div>

            {/* Institutions Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                Institution
              </label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Institutions</option>
                {OPPOSITION_INSTITUTIONS.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="wanted">🔥 Most Wanted (Highest Rating)</option>
                <option value="trending">Most Upvoted</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warning Banner Below Search Area */}
        <div className="bento-card p-3.5 sm:p-4 bg-red-50 border-3 border-black shadow-[4px_4px_0px_#000] mb-8 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-popRed border-2 border-black rounded-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <p className="font-display font-black text-xs sm:text-sm text-red-900 leading-snug">
            {t('propagandus_report_msg', 'Report These People from social Media to Remove these Anti-Bharat Forces Outside and Protect Bharat')}
          </p>
        </div>

        {/* Entities Cards Grid (Bento Style) */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-600 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-saffron" />
              <span>Loading profiles...</span>
            </div>
          </div>
        ) : entities.length === 0 ? (
          <div className="text-center py-12 bento-card p-8 max-w-md mx-auto bg-white">
            <ShieldAlert className="w-10 h-10 mx-auto text-gray-400 mb-2" />
            <h3 className="font-comic text-xl text-black">No Profiles Found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              No matching profiles found with current search or filters.
            </p>
            <button
              onClick={resetFilters}
              className="bento-btn bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'profile' ? (
          /* ========================================================= */
          /* PROFILE VIEW (DEFAULT): Profile Pic, Name & Social Icons Only */
          /* ========================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {entities.map((item) => {
              const hasX = !!item.handle_x;
              const hasYt = !!item.handle_yt;
              const hasInsta = !!item.handle_insta;
              const extraLinks = parseOtherLinks(item.other_links);
              const myRating = userRatings[item.id];

              return (
                <div
                  key={item.id}
                  data-propagandu-card="true"
                  onClick={(e) => {
                    if (!e.target.closest('a, button')) {
                      e.stopPropagation();
                      playRandomPropaganduSound();
                    }
                  }}
                  className="bento-card p-3.5 sm:p-4 bg-white border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 transition-all flex flex-row items-center gap-3.5 sm:gap-4 cursor-pointer"
                >
                  {/* Left: Avatar with Pop Art 3D Border like Screenshot */}
                  <div className="relative shrink-0">
                    <img
                      src={item.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Propagandu')}&background=E1306C&color=ffffff&size=256&bold=true`}
                      alt={item.name}
                      className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-3 border-black shadow-[3px_3px_0px_#000] object-cover bg-white"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Propagandu')}&background=E1306C&color=ffffff&size=256&bold=true`;
                      }}
                    />
                  </div>

                  {/* Right: Readable Pop Art Name, Social Icons & Wanted Rating */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5">
                    <div>
                      <h3
                        className="font-comic font-black text-black text-sm sm:text-base uppercase tracking-wide leading-tight truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      {item.party && (
                        <div className="text-[10px] text-gray-500 font-bold truncate">
                          {item.party.split('–')[0]}
                        </div>
                      )}
                    </div>

                    {/* Social Icons (Rounded squircle icons with black border like screenshot) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {hasX && (
                        <a
                          href={`https://x.com/${item.handle_x}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-black text-white hover:bg-gray-800 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] transition-transform active:scale-95"
                          title={`X: @${item.handle_x}`}
                        >
                          <TwitterIcon className="w-3.5 h-3.5 fill-current" />
                        </a>
                      )}
                      {hasYt && (
                        <a
                          href={`https://youtube.com/@${item.handle_yt}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-[#FF0000] text-white hover:bg-red-700 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] transition-transform active:scale-95"
                          title={`YouTube: @${item.handle_yt}`}
                        >
                          <YoutubeIcon className="w-3.5 h-3.5 fill-current" />
                        </a>
                      )}
                      {hasInsta && (
                        <a
                          href={`https://instagram.com/${item.handle_insta}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] text-white border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] transition-transform active:scale-95"
                          title={`Instagram: @${item.handle_insta}`}
                        >
                          <InstagramIcon className="w-3.5 h-3.5 fill-current" />
                        </a>
                      )}
                      {extraLinks.map((link, lIdx) => {
                        const info = getSocialPlatformInfo(link);
                        const Icon = info.icon;
                        return (
                          <a
                            key={lIdx}
                            href={ensureUrl(link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-7 h-7 rounded-lg ${info.bgClass} border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] transition-transform active:scale-95`}
                            title={`${info.name}: ${link}`}
                          >
                            <Icon className="w-3.5 h-3.5 fill-current" />
                          </a>
                        );
                      })}
                    </div>

                    {/* Wanted Rating Widget */}
                    <div className="pt-0.5">
                      <WantedRatingWidget
                        entity={item}
                        myRating={myRating}
                        onOpenRatingModal={setRatingModalEntity}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================= */
          /* DETAILED VIEW: Full Narrative, Expose Upvote, Evidence    */
          /* ========================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {entities.map((item) => {
              const hasX = !!item.handle_x;
              const hasYt = !!item.handle_yt;
              const hasInsta = !!item.handle_insta;
              const extraLinks = parseOtherLinks(item.other_links);
              const myRating = userRatings[item.id];

              return (
                <div
                  key={item.id}
                  data-propagandu-card="true"
                  onClick={(e) => {
                    if (!e.target.closest('a, button, input')) {
                      e.stopPropagation();
                      playRandomPropaganduSound();
                    }
                  }}
                  className="bento-card overflow-hidden flex flex-col justify-between bg-white cursor-pointer hover:shadow-[6px_6px_0px_#000] transition-all"
                >
                  {/* Top Bar: Profile & Report */}
                  <div>
                    <div className="p-4 border-b border-gray-200 bg-gray-50/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Propagandu')}&background=E1306C&color=ffffff&size=256&bold=true`}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl border border-black/30 object-cover shadow-sm bg-white shrink-0"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Propagandu')}&background=E1306C&color=ffffff&size=256&bold=true`;
                            }}
                          />
                          <div>
                            <h3 className="font-display font-black text-base text-black leading-tight">
                              {item.name}
                            </h3>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                              Added: {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* ⚠️ Report Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenReport(item);
                          }}
                          title="Report this entry"
                          className="p-1.5 bg-white hover:bg-amber-50 border border-gray-300 rounded-lg text-xs"
                          aria-label="Report entry"
                        >
                          <span className="text-sm select-none">⚠️</span>
                        </button>
                      </div>

                      {/* Direct Social Media Links with Extra Platforms */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-200">
                        {hasX && (
                          <a
                            href={`https://x.com/${item.handle_x}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-0.5 bg-black text-white hover:bg-gray-800 rounded-md text-[11px] font-mono flex items-center gap-1"
                          >
                            <TwitterIcon className="w-3 h-3 fill-current" />
                            <span>@{item.handle_x}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}

                        {hasYt && (
                          <a
                            href={`https://youtube.com/@${item.handle_yt}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-0.5 bg-red-600 text-white hover:bg-red-700 rounded-md text-[11px] font-mono flex items-center gap-1"
                          >
                            <YoutubeIcon className="w-3 h-3 fill-current" />
                            <span>{item.handle_yt}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}

                        {hasInsta && (
                          <a
                            href={`https://instagram.com/${item.handle_insta}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-[11px] font-mono flex items-center gap-1"
                          >
                            <InstagramIcon className="w-3 h-3 fill-current" />
                            <span>@{item.handle_insta}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}

                        {extraLinks.map((link, lIdx) => {
                          const info = getSocialPlatformInfo(link);
                          const Icon = info.icon;
                          return (
                            <a
                              key={lIdx}
                              href={ensureUrl(link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`px-2 py-0.5 ${info.bgClass} rounded-md text-[11px] font-mono flex items-center gap-1`}
                              title={link}
                            >
                              <Icon className="w-3 h-3 fill-current" />
                              <span>{info.name}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category & Party Badges */}
                    <div className="px-4 py-2 bg-white border-b border-gray-100 flex flex-wrap gap-1">
                      {Array.isArray(item.categories) && item.categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold"
                        >
                          {getCategoryIcon(cat)}
                          <span>{cat}</span>
                        </span>
                      ))}

                      {item.party && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[10px] font-bold">
                          <Vote className="w-3 h-3" />
                          <span>{item.party.split('–')[0].trim()}</span>
                        </span>
                      )}

                      {item.institution && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
                          <Building className="w-3 h-3" />
                          <span>{item.institution}</span>
                        </span>
                      )}
                    </div>

                    {/* Tracked Narrative */}
                    <div className="p-4">
                      <div className="text-[10px] font-black uppercase tracking-wider text-red-700 mb-1">
                        Tracked Anti-India Narrative:
                      </div>
                      <p className="text-xs font-display text-gray-800 leading-relaxed font-medium bg-red-50/40 p-2.5 rounded-lg border-l-2 border-red-500">
                        "{item.narrative}"
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Wanted Level Rating & Evidence Link (Share Option Completely Removed) */}
                  <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2 flex-wrap">
                    <WantedRatingWidget
                      entity={item}
                      myRating={myRating}
                      onOpenRatingModal={setRatingModalEntity}
                    />

                    {item.proof_url && (
                      <a
                        href={ensureUrl(item.proof_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-bold text-chakraNavy hover:underline flex items-center gap-1"
                      >
                        <span>Evidence Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Wanted Rating Modal Popup */}
        <WantedRatingModal
          isOpen={!!ratingModalEntity}
          onClose={() => setRatingModalEntity(null)}
          entity={ratingModalEntity}
          userRating={ratingModalEntity ? userRatings[ratingModalEntity.id] : null}
          onRate={handleRateEntity}
        />

      </div>
    </section>
  );
}
