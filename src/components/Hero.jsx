import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { PlusCircle, Search, ArrowDown, Users, Flame } from 'lucide-react';

export default function Hero({ onOpenSubmit, stats }) {
  const [liveCount, setLiveCount] = useState(stats?.liveCount || 1);

  useEffect(() => {
    if (stats?.liveCount) {
      setLiveCount(stats.liveCount);
    }
  }, [stats?.liveCount]);

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

  return (
    <section className="pt-8 pb-10 bg-bento-grid border-b-2 border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Header Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Bento Box 1: Primary Hero Headline (8 cols) */}
          <div className="lg:col-span-8 bento-card p-6 sm:p-8 bg-white flex flex-col justify-between">
            <div>
              {/* Slogan Pill from Screenshot */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] -rotate-1 mb-5 text-[11px] sm:text-xs font-black tracking-widest uppercase text-black">
                <span className="text-red-600 font-black text-sm">✹</span>
                <span>NATION FIRST • SANATAN PRIDE • UNSTOPPABLE BHARAT</span>
              </div>

              {/* Title from Screenshot */}
              <div className="mb-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-comic tracking-wide text-black uppercase leading-tight">
                  DEFENDING <span className="text-[#FF9933] underline decoration-black decoration-wavy decoration-3">BHARAT</span> AGAINST
                </h1>
                <div className="inline-block mt-2 bg-[#FF2A2A] text-white border-3 border-black px-4 py-1.5 shadow-[4px_4px_0px_#000] rotate-1">
                  <span className="font-comic text-2xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-white">
                    LEFTIST PROPAGANDA
                  </span>
                </div>
              </div>

              {/* Description Card from Screenshot */}
              <div className="p-4 sm:p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] mb-6">
                <p className="font-display text-sm sm:text-base text-gray-800 leading-relaxed font-semibold">
                  The ultimate crowdsourced repository tracking anti-India and anti-Hindu narratives funded by opposition political entities and foreign-interest groups, and unveiling verified influencers spreading falsehoods across YouTube, Instagram, and X.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenSubmit}
                className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-5 py-3 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span>Submit a Propagandu Profile</span>
              </button>

              <a
                href="#database-section"
                className="bento-btn bg-white hover:bg-gray-50 text-black px-5 py-3 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-gray-600" />
                <span>Search Directory</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Bento Box 2: Stats & Key Metrics (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Stat Card 1: Realtime Live Counter (TOP over Profiles Tracked) */}
            <div className="bento-card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-600 mb-2">
                <span className="text-xs font-black uppercase tracking-wider">Live Viewers</span>
                <span className="text-[10px] font-mono font-bold bg-chakraNavy/10 text-chakraNavy px-2 py-0.5 rounded-full">REALTIME RADAR</span>
              </div>
              
              {/* Exact design from resources/live.png with animated green dot */}
              <div className="py-2 flex items-center">
                <div className="inline-flex items-center gap-2.5 bg-[#0a0a0a] px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e] shadow-[0_0_10px_#22c55e]"></span>
                  </span>
                  <span className="text-white font-mono font-black text-base tracking-tight">{liveCount}</span>
                  <span className="text-gray-300 font-sans font-medium text-xs">online</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 font-bold mt-1">
                Citizens currently exploring Exposed Propagandus
              </div>
            </div>

            {/* Stat Card 2: Profiles Tracked (Total people traced) */}
            <div className="bento-card p-5 bg-gradient-to-br from-amber-50 to-orange-50 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-600 mb-2">
                <span className="text-xs font-black uppercase tracking-wider">Profiles Tracked</span>
                <Users className="w-4 h-4 text-saffron-dark" />
              </div>
              <div className="font-comic text-4xl sm:text-5xl text-black">
                {stats?.totalEntities ?? 0}
              </div>
              <div className="text-[11px] text-gray-500 font-bold mt-1">
                Crowdsourced entries across socials
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bento-card p-4 bg-black text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-gray-400 font-mono uppercase">Public Impact</div>
                <div className="font-comic text-xl text-saffron">{stats?.totalUpvotes || 0} Expose Upvotes</div>
              </div>
              <Flame className="w-6 h-6 text-saffron animate-pulse" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
