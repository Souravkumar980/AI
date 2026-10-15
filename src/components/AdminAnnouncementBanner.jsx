import React, { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Info, X } from 'lucide-react';

export default function AdminAnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissedKey, setDismissedKey] = useState(() => {
    return sessionStorage.getItem('ep_dismissed_announcement') || '';
  });

  const fetchAnnouncement = async () => {
    try {
      const res = await fetch('/api/announcement');
      if (res.ok) {
        const data = await res.json();
        if (data.active && data.announcement && data.announcement.message) {
          setAnnouncement(data.announcement);
        } else {
          setAnnouncement(null);
        }
      }
    } catch (e) {
      // Quiet failover
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    // Poll every 30 seconds to catch live admin updates in real-time
    const interval = setInterval(fetchAnnouncement, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!announcement || !announcement.is_active || !announcement.message) {
    return null;
  }

  // If user dismissed this exact announcement revision
  const currentKey = `${announcement.id}_${announcement.updated_at}`;
  if (dismissedKey === currentKey) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem('ep_dismissed_announcement', currentKey);
    setDismissedKey(currentKey);
  };

  const isAlert = announcement.type === 'alert';
  const isInfo = announcement.type === 'info';

  const bgClass = isAlert
    ? 'bg-popRed text-white border-b-3 border-black'
    : isInfo
    ? 'bg-chakraNavy text-white border-b-3 border-black'
    : 'bg-popYellow text-black border-b-3 border-black';

  return (
    <aside aria-label="Official Announcement" className={`relative z-40 w-full ${bgClass} shadow-[0px_4px_0px_#000] px-3 sm:px-6 py-2.5 sm:py-3 transition-all`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-black bg-white/20 shadow-sm">
            {isAlert ? (
              <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
            ) : isInfo ? (
              <Info className="w-4 h-4 text-white" />
            ) : (
              <Megaphone className="w-4 h-4 text-black animate-pulse" />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2.5 min-w-0 text-left">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-black/40 bg-black/10 shrink-0 w-fit">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>{announcement.title || 'उद्घोषणा / ANNOUNCEMENT'}</span>
            </span>

            <p className="font-display font-black text-xs sm:text-sm tracking-wide leading-tight truncate-multiline">
              {announcement.message}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 hover:bg-black/10 rounded-lg border border-black/20 transition-all text-current"
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
