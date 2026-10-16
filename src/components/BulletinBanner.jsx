import React, { useState, useEffect } from 'react';

export default function BulletinBanner() {
  const [bulletin, setBulletin] = useState({
    is_active: 0,
    title: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBulletin = async () => {
    try {
      const res = await fetch('/api/bulletin');
      if (res.ok) {
        const data = await res.json();
        if (data && data.message) {
          setBulletin(data);
        }
      }
    } catch (e) {
      // Quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletin();
    // Poll every 30 seconds for live admin broadcasts
    const timer = setInterval(fetchBulletin, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading || !bulletin || !bulletin.is_active || !bulletin.message?.trim()) {
    return null;
  }

  const messageText = bulletin.message.trim();

  return (
    <div className="bento-card bg-[#FFE600] border-3 border-black shadow-[5px_5px_0px_#000] rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 relative overflow-hidden flex items-center gap-3 select-none">
      {/* Halftone graphic background decoration */}
      <div
        className="absolute inset-0 opacity-10 bg-repeat pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px'
        }}
      />

      {/* Center: Infinite Seamless Ticker with Clean Readable Typography */}
      <div className="relative z-10 flex-1 overflow-hidden min-w-0">
        <div className="animate-bulletin-marquee flex items-center gap-10 py-0.5 cursor-default">
          <span className="font-display font-black text-xs sm:text-sm text-black uppercase tracking-wide">
            {messageText}
          </span>
          <span className="text-red-600 font-black text-sm">✦</span>
          <span className="font-display font-black text-xs sm:text-sm text-black uppercase tracking-wide">
            {messageText}
          </span>
          <span className="text-red-600 font-black text-sm">✦</span>
          <span className="font-display font-black text-xs sm:text-sm text-black uppercase tracking-wide">
            {messageText}
          </span>
          <span className="text-red-600 font-black text-sm">✦</span>
          <span className="font-display font-black text-xs sm:text-sm text-black uppercase tracking-wide">
            {messageText}
          </span>
        </div>
      </div>
    </div>
  );
}
