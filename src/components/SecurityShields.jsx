import React, { useState, useEffect, useRef } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { ShieldAlert, Pause, Lock, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Anti-Inspect / DevTools Shield:
 * 1. Blocks DevTools keyboard shortcuts (Ctrl+Shift+I, F12, Ctrl+U, etc.)
 * 2. Blocks contextmenu (right-click inspect)
 * 3. Suppresses console logs & errors
 * 4. Detects open DevTools (docked or undocked) and pauses the site Netflix-style
 */
export function DevToolsShield() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const checkTimerRef = useRef(null);

  useEffect(() => {
    // 1. Suppress console logs and errors completely
    try {
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
      console.debug = noop;
    } catch (e) {}

    // 2. Block keyboard shortcuts for Inspect / View Source
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
      // Ctrl+Shift+J / Cmd+Opt+J (Console)
      // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element)
      if (isCtrlOrMeta && e.shiftKey) {
        const key = (e.key || '').toUpperCase();
        if (key === 'I' || key === 'J' || key === 'C') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Ctrl+U / Cmd+Opt+U (View Source)
      // Ctrl+S (Save Page)
      if (isCtrlOrMeta) {
        const key = (e.key || '').toUpperCase();
        if (key === 'U' || key === 'S') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 3. Block right-click context menu
    const handleContextMenu = (e) => {
      // Allow right-click only inside normal input/textarea fields if user is typing
      const tag = (e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '');
      if (tag === 'input' || tag === 'textarea') {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);

    // 4. Continuous DevTools Detection Loop (Netflix-style Pause)
    const checkDevTools = () => {
      // Skip check if user is authenticated admin
      try {
        const adminKey = localStorage.getItem('propagandus_admin_key') || localStorage.getItem('admin_token');
        if (adminKey && adminKey.length > 5) {
          setIsDevToolsOpen(false);
          return;
        }
      } catch (e) {}

      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const isDocked = widthThreshold || heightThreshold;

      // Timing check for undocked devtools
      let isTimingOpen = false;
      try {
        const start = performance.now();
        // debugger statement takes significant execution time when devtools is active
        // eslint-disable-next-line no-debugger
        debugger;
        const elapsed = performance.now() - start;
        if (elapsed > 100) {
          isTimingOpen = true;
        }
      } catch (e) {}

      const detected = isDocked || isTimingOpen;

      if (detected) {
        // Pause all media elements
        try {
          document.querySelectorAll('video, audio').forEach((media) => {
            if (!media.paused) media.pause();
          });
        } catch (e) {}
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    checkTimerRef.current = setInterval(checkDevTools, 600);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    };
  }, []);

  if (!isDevToolsOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999999] bg-[#0c0c0c] text-white flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-3xl animate-in fade-in duration-200">
      <div className="max-w-lg w-full p-8 bg-[#181818] border-3 border-red-600 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.5)] flex flex-col items-center space-y-5">
        
        <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center">
          <Pause className="w-10 h-10 text-red-500 fill-red-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950 border border-red-800 rounded-full text-[11px] font-black uppercase text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Developer Tools Detected</span>
          </div>

          <h2 className="font-comic text-2xl sm:text-3xl tracking-wide text-white">
            WEBSITE PAUSED &amp; PROTECTED
          </h2>

          <p className="font-display text-xs sm:text-sm text-gray-300 leading-relaxed font-bold">
            Inspecting, debugging, or automated scraping of Exposed Propagandus is restricted to protect national intelligence archives, user privacy, and system integrity.
          </p>
        </div>

        <div className="p-3 bg-black/60 border border-gray-800 rounded-xl text-xs font-mono text-gray-400 w-full text-center">
          👉 Please <strong className="text-white">close Inspect / Developer Tools</strong> to resume viewing website content immediately.
        </div>

        <IndianFlagLogo size="sm" />
      </div>
    </div>
  );
}

/**
 * India-Only Geofencing Shield:
 * Restricts platform access exclusively to visitors from the Republic of Bharat (India).
 * Authenticated admins and localhost/dev environments are strictly exempt.
 */
export function GeoRestrictionShield() {
  const [geoStatus, setGeoStatus] = useState({
    checking: true,
    allowed: true,
    country: 'IN'
  });

  useEffect(() => {
    // 1. Check if admin or localhost
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '::1';

    let isAdmin = false;
    try {
      const key = localStorage.getItem('propagandus_admin_key') || localStorage.getItem('admin_token');
      if (key && key.length > 5) isAdmin = true;
    } catch (e) {}

    if (isLocalhost || isAdmin) {
      setGeoStatus({ checking: false, allowed: true, country: 'IN' });
      return;
    }

    // 2. Query geo endpoint from server
    fetch('/api/geo-check')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.allowed === false) {
          setGeoStatus({
            checking: false,
            allowed: false,
            country: data.country || 'UNKNOWN'
          });
        } else {
          setGeoStatus({
            checking: false,
            allowed: true,
            country: data?.country || 'IN'
          });
        }
      })
      .catch(() => {
        // Fallback: check browser timezone
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Asia/')) {
            setGeoStatus({ checking: false, allowed: true, country: 'IN' });
          } else {
            // Check public fast geo lookup
            fetch('https://api.country.is/')
              .then((r) => r.json())
              .then((c) => {
                if (c && c.country && c.country !== 'IN') {
                  setGeoStatus({ checking: false, allowed: false, country: c.country });
                } else {
                  setGeoStatus({ checking: false, allowed: true, country: 'IN' });
                }
              })
              .catch(() => {
                setGeoStatus({ checking: false, allowed: true, country: 'IN' });
              });
          }
        } catch (e) {
          setGeoStatus({ checking: false, allowed: true, country: 'IN' });
        }
      });
  }, []);

  if (geoStatus.checking || geoStatus.allowed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999999] bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-2xl">
      <div className="max-w-md w-full p-8 bg-[#141414] border-3 border-saffron rounded-3xl shadow-[0_0_50px_rgba(255,153,51,0.4)] flex flex-col items-center space-y-5">
        
        <IndianFlagLogo size="lg" animated={true} />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950 border border-saffron rounded-full text-[11px] font-black uppercase text-saffron">
            <Lock className="w-3.5 h-3.5" />
            <span>Sovereign Geofence Protection</span>
          </div>

          <h2 className="font-comic text-2xl sm:text-3xl tracking-wide text-white">
            ACCESS RESTRICTED TO BHARAT (INDIA) ONLY
          </h2>

          <p className="font-display text-xs sm:text-sm text-gray-300 leading-relaxed font-bold">
            Exposed Propagandus is exclusively accessible to Indian citizens located within the sovereign territory of the Republic of Bharat.
          </p>
        </div>

        <div className="p-3 bg-black/60 border border-gray-800 rounded-xl text-xs font-mono text-gray-400 w-full text-center">
          Detected Origin: <strong className="text-saffron">{geoStatus.country}</strong>. Foreign access is restricted to prevent cyber interference and preserve sovereign data safety.
        </div>

        <p className="text-[11px] font-bold text-gray-500">
          Bharat Mata ki Jai 🇮🇳
        </p>
      </div>
    </div>
  );
}
