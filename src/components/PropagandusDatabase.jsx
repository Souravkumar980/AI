import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { OPPOSITION_PARTIES, OPPOSITION_INSTITUTIONS, ENTITY_CATEGORIES } from '../data/partiesAndInstitutions';
import { TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import {
  Search,
  Filter,
  AlertTriangle,
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
  X
} from 'lucide-react';
import { playRandomPropaganduSound } from '../utils/audioPlayer';

export default function PropagandusDatabase({ onOpenSubmit, onOpenReport, onOpenShareCard, reloadTrigger }) {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedParty, setSelectedParty] = useState('All');
  const [selectedInstitution, setSelectedInstitution] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [upvotedIds, setUpvotedIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('propagandus_upvoted_ids') || '[]');
      return new Set(Array.isArray(stored) ? stored : []);
    } catch (e) {
      return new Set();
    }
  });

  // Sync upvoted IDs from server for caller IP
  useEffect(() => {
    fetch('/api/my-votes')
      .then(res => res.json())
      .then(data => {
        if (data?.entityVotes && Array.isArray(data.entityVotes)) {
          setUpvotedIds(prev => {
            const next = new Set([...prev, ...data.entityVotes]);
            try {
              localStorage.setItem('propagandus_upvoted_ids', JSON.stringify([...next]));
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

  const handleUpvote = async (id) => {
    if (upvotedIds.has(id)) return;
    // Play random audio on propagandu like/upvote (stops on screen tap)
    playRandomPropaganduSound();
    try {
      const res = await fetch(`/api/entities/${id}/upvote`, { method: 'POST' });
      const data = await res.json();
      if (data.success || data.alreadyVoted) {
        setUpvotedIds(prev => {
          const next = new Set([...prev, id]);
          try {
            localStorage.setItem('propagandus_upvoted_ids', JSON.stringify([...next]));
          } catch (e) {}
          return next;
        });
        if (data.upvotes !== undefined) {
          setEntities(prev => prev.map(item => item.id === id ? { ...item, upvotes: data.upvotes } : item));
        }
      }
    } catch (e) {
      console.error('Upvote error', e);
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

  return (
    <section id="database-section" className="py-12 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-900 border border-red-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <span>Public Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-comic tracking-tight text-black">
              TRACKED <span className="text-red-600">PROPAGANDUS</span>
            </h2>
            <p className="font-display text-sm text-gray-600 mt-1 max-w-xl">
              List of influencers, political figures, and media portals documented for spreading anti-India narratives.
            </p>
          </div>

          <button
            onClick={onOpenSubmit}
            className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-5 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Add to Directory</span>
          </button>
        </div>

        {/* Filter Toolbar (Bento Style) */}
        <div id="search-area" data-no-sound="true" className="bento-card p-4 sm:p-5 bg-white mb-8 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, handle, party, or keyword..."
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
                {ENTITY_CATEGORIES.map(c => (
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
                <option value="trending">Most Upvoted</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {entities.map((item) => {
              const hasX = !!item.handle_x;
              const hasYt = !!item.handle_yt;
              const hasInsta = !!item.handle_insta;
              const isUpvoted = upvotedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => playRandomPropaganduSound()}
                  className="bento-card overflow-hidden flex flex-col justify-between bg-white cursor-pointer hover:shadow-[6px_6px_0px_#000] transition-all"
                >
                  {/* Top Bar: Profile & Report */}
                  <div>
                    <div className="p-4 border-b border-gray-200 bg-gray-50/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl border border-black/30 object-cover shadow-sm bg-white shrink-0"
                            onError={(e) => {
                              e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`;
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
                          onClick={() => onOpenReport(item)}
                          title="Report this entry"
                          className="p-1.5 bg-white hover:bg-amber-50 border border-gray-300 rounded-lg text-xs"
                          aria-label="Report entry"
                        >
                          <span className="text-sm select-none">⚠️</span>
                        </button>
                      </div>

                      {/* Direct Social Media Links */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-200">
                        {hasX && (
                          <a
                            href={`https://x.com/${item.handle_x}`}
                            target="_blank"
                            rel="noopener noreferrer"
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
                            className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-[11px] font-mono flex items-center gap-1"
                          >
                            <InstagramIcon className="w-3 h-3 fill-current" />
                            <span>@{item.handle_insta}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
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

                  {/* Card Bottom: Upvote & Source Link */}
                  <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => handleUpvote(item.id)}
                      disabled={isUpvoted}
                      className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isUpvoted
                          ? 'bg-tirangaGreen text-white border-tirangaGreen-dark shadow-none cursor-default'
                          : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.upvotes || 0}</span>
                      <span className="text-[10px]">{isUpvoted ? 'Exposed' : 'Expose'}</span>
                    </button>

                    {onOpenShareCard && (
                      <button
                        onClick={() => onOpenShareCard({
                          title: item.name,
                          badge: 'PROPAGANDU EXPOSED',
                          claim: item.narrative,
                          truth: item.fact_check || 'Documented anti-national narrative tracked by community watchdog.',
                          details: [
                            `Category: ${Array.isArray(item.categories) ? item.categories.join(', ') : item.categories}`,
                            item.party ? `Affiliation: ${item.party}` : null,
                            `Expose Upvotes: ${item.upvotes || 1}`
                          ].filter(Boolean),
                          source: item.proof_url || 'Exposed Propagandus Intelligence Vault'
                        })}
                        title="Share Fact Card on WhatsApp / X"
                        className="bento-btn px-2.5 py-1 text-xs bg-[#FFE600] text-black hover:bg-yellow-400 flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_#000]"
                      >
                        <Share2 className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase">Share</span>
                      </button>
                    )}

                    {item.proof_url && (
                      <a
                        href={item.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
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

      </div>
    </section>
  );
}
