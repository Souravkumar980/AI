import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import {
  TrendingUp,
  Milestone,
  Hospital,
  GraduationCap,
  Flame,
  ShieldCheck,
  Shield,
  Smartphone,
  Droplet,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Economy & Global Stature',
  'Infrastructure & Connectivity',
  'Hindutva Growth & Cultural Renaissance',
  'Healthcare & Higher Education',
  'Defence & National Security',
  'Governance & Welfare'
];

export default function ComparisonSection() {
  const [comparisons, setComparisons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, [selectedCategory]);

  const fetchComparisons = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'All' 
        ? '/api/comparisons' 
        : `/api/comparisons?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      setComparisons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load comparisons', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = comparisons.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nda_details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upa_details?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="comparison-section" className="py-16 bg-popCream border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="comic-badge bg-saffron text-black text-xs font-black py-1 px-3">
              BEFORE VS AFTER 2014
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-comic tracking-tight text-black mb-3">
            THE REAL FACTS: <span className="text-saffron-dark underline decoration-black decoration-wavy">NDA</span> VS <span className="text-gray-600">UPA</span>
          </h2>
          
          <p className="font-display font-medium text-gray-700 text-sm sm:text-base leading-relaxed">
            See the unfiltered transformation of Bharat. Contrast 10 years of UPA policy paralysis and stagnation (2004–2014) with a decade of resolute nationalist governance, exponential infrastructure, and Hindutva civilizational resurgence under the NDA government.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search facts (e.g. AIIMS, Highways, Ram Mandir, GDP)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-2 border-black rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>

            {/* Category Badges / Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 border-black transition-all ${
                    selectedCategory === cat
                      ? 'bg-saffron text-black shadow-pop -translate-y-0.5'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-white border-3 border-black rounded-2xl shadow-pop animate-bounce">
              <span className="font-comic text-xl text-saffron-dark">Fetching Verified Facts...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white border-3 border-black rounded-2xl p-8 max-w-md mx-auto shadow-pop">
            <Layers className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="font-comic text-2xl">No Comparisons Found</h3>
            <p className="text-sm text-gray-600 font-display mt-1">Try searching for different terms or reset category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="pop-card rounded-2xl overflow-hidden border-4 border-black"
              >
                {/* Card Top Banner */}
                <div className="bg-popYellow border-b-3 border-black px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white font-mono text-xs px-2.5 py-0.5 rounded font-black uppercase">
                      {item.category}
                    </span>
                    <h3 className="font-display font-black text-base sm:text-lg text-black">
                      {item.title}
                    </h3>
                  </div>

                  {item.growth_badge && (
                    <span className="bg-tirangaGreen text-white text-xs font-black px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0_#000] uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 inline" />
                      {item.growth_badge}
                    </span>
                  )}
                </div>

                {/* Side-by-Side Comparison Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                  
                  {/* UPA Side (Pre-2014) */}
                  <div className="p-6 bg-[#FFF5F5] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-comic text-sm uppercase px-2.5 py-1 bg-red-100 text-red-800 border-2 border-red-800 rounded font-black tracking-wider flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-red-600" />
                          {item.upa_period || '2004 - 2014 (UPA)'}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Policy Paralysis Era
                        </span>
                      </div>

                      <div className="text-xl sm:text-2xl font-comic text-red-700 mb-3 tracking-wide">
                        {item.upa_value}
                      </div>

                      <p className="font-display text-sm text-gray-800 leading-relaxed font-medium">
                        {item.upa_details}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-red-200 text-xs text-red-700 font-bold flex items-center gap-1">
                      <span>Status: Under-developed / Stalled</span>
                    </div>
                  </div>

                  {/* NDA Side (Post-2014) */}
                  <div className="p-6 bg-[#F0FDF4] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-comic text-sm uppercase px-2.5 py-1 bg-tirangaGreen text-white border-2 border-black rounded shadow-[2px_2px_0_#000] font-black tracking-wider flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-white" />
                          {item.nda_period || '2014 - Present (NDA)'}
                        </span>
                        <div className="flex items-center gap-1">
                          <IndianFlagLogo className="w-5 h-3.5" />
                          <span className="text-[11px] font-extrabold text-chakraNavy uppercase tracking-wider">
                            Viksit Bharat
                          </span>
                        </div>
                      </div>

                      <div className="text-xl sm:text-2xl font-comic text-tirangaGreen-dark mb-3 tracking-wide">
                        {item.nda_value}
                      </div>

                      <p className="font-display text-sm text-gray-900 leading-relaxed font-semibold">
                        {item.nda_details}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-green-200 text-xs text-tirangaGreen-dark font-black flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-tirangaGreen" />
                        Status: Exponential Growth Achieved
                      </span>
                      {item.source && (
                        <span className="text-[10px] text-gray-600 font-mono bg-white px-2 py-0.5 border border-gray-400 rounded">
                          Source: {item.source}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
