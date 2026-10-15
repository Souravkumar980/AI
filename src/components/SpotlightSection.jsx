import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ExternalLink,
  Tv,
  Image as ImageIcon,
  CheckCircle,
  ZoomIn,
  X
} from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';

// Helper to extract YouTube video ID from various URL formats
export function extractYoutubeId(url) {
  if (!url) return null;
  const clean = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/;
  const match = clean.match(regExp);
  return match ? match[1] : null;
}

// Format seconds into mm:ss
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function SpotlightSection({ reloadTrigger }) {
  const [spotlight, setSpotlight] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Image Lightbox State
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const hideControlsTimerRef = useRef(null);
  const videoId = spotlight?.type === 'video' ? extractYoutubeId(spotlight?.videoUrl) : null;

  // Auto-hide controls when user is inactive during video playback
  const handleUserActivity = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
        hideControlsTimerRef.current = null;
      }
    } else {
      handleUserActivity();
    }
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [isPlaying]);

  // Fetch Spotlight data
  useEffect(() => {
    fetchSpotlight();
  }, [reloadTrigger]);

  const fetchSpotlight = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/spotlight');
      if (res.ok) {
        const data = await res.json();
        setSpotlight(data);
      }
    } catch (e) {
      console.error('Failed to fetch spotlight media', e);
    } finally {
      setLoading(false);
    }
  };

  // Load YouTube Iframe API dynamically
  useEffect(() => {
    if (spotlight?.type !== 'video' || !videoId) return;

    let destroyed = false;

    const initPlayer = () => {
      if (destroyed || !window.YT || !window.YT.Player) return;

      const iframeElement = document.getElementById('custom-yt-iframe');
      if (!iframeElement) return;

      try {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player('custom-yt-iframe', {
          videoId: videoId,
          playerVars: {
            controls: 0,          // HIDE YouTube native controls & watermark
            modestbranding: 1,    // Remove YouTube logo
            rel: 0,               // Do not show unrelated recommended videos
            iv_load_policy: 3,    // Hide annotations
            fs: 0,                // Hide default fullscreen button
            disablekb: 1,         // Disable default key listeners
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              if (destroyed) return;
              setIsPlayerReady(true);
              const dur = event.target.getDuration();
              setDuration(dur || 0);
              // Smart Adaptive Quality: 720p on mobile / low bandwidth, 1080p max
              try {
                if (typeof event.target.setPlaybackQuality === 'function') {
                  const isMobile = window.innerWidth < 768;
                  event.target.setPlaybackQuality(isMobile ? 'hd720' : 'hd1080');
                }
              } catch (_) {}
            },
            onStateChange: (event) => {
              if (destroyed) return;
              // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
              if (event.data === 1) {
                setIsPlaying(true);
                startTracking();
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
                stopTracking();
              }
            }
          }
        });
      } catch (err) {
        console.warn('YT Player init error', err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      destroyed = true;
      stopTracking();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (_) {}
      }
    };
  }, [spotlight?.type, videoId]);

  const startTracking = () => {
    stopTracking();
    timerRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const cur = playerRef.current.getCurrentTime();
        setCurrentTime(cur);
        const dur = playerRef.current.getDuration();
        if (dur && dur !== duration) setDuration(dur);
      }
    }, 400);
  };

  const stopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (_) {}
  };

  // Duration seeker change (change video duration position)
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(newTime, true);
    }
  };

  // Volume & Mute Toggle
  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (_) {}
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (!playerRef.current) return;
    try {
      playerRef.current.setVolume(val);
      if (val === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    } catch (_) {}
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // If loading or admin turned OFF spotlight, render nothing!
  if (loading || !spotlight || spotlight.type === 'off') {
    return null;
  }

  // Construct dynamic section title
  const isVideo = spotlight.type === 'video';
  const customTitle = (spotlight.title || '').trim();
  const displayTitle = isVideo
    ? `Video of the Day${customTitle ? ` - ${customTitle}` : ''}`
    : `Important Image${customTitle ? ` - ${customTitle}` : ''}`;

  return (
    <section id="spotlight-section" className="pt-6 pb-10">
      <div className="bento-card p-5 sm:p-8 bg-white border-3 border-black shadow-[6px_6px_0px_#000] relative overflow-hidden">
        
        {/* Decorative Pop Halftone Pattern */}
        <div
          className="absolute -right-8 -top-8 w-40 h-40 opacity-15 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '12px 12px' }}
        />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000] ${
              isVideo ? 'bg-red-600 text-white' : 'bg-chakraNavy text-white'
            }`}>
              {isVideo ? <Tv className="w-6 h-6 animate-pulse" /> : <ImageIcon className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-black ${
                  isVideo ? 'bg-[#FFE600] text-black' : 'bg-tirangaGreen text-white'
                }`}>
                  {isVideo ? 'DAILY MUST-WATCH' : 'CURATED INTEL GRAPHIC'}
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
                  LIVE NOW
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-comic tracking-wide text-black mt-1 leading-tight">
                {displayTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-3 py-1 bg-gray-100 border border-black rounded-lg">
              ADMIN VERIFIED
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CASE 1: VIDEO OF THE DAY (CUSTOM NO-CLUTTER VIDEO PLAYER)     */}
        {/* ------------------------------------------------------------- */}
        {isVideo && videoId && (
          <div className="space-y-4">
            
            {/* Custom Pop Art Player Container */}
            <div
              ref={containerRef}
              className={`relative w-full rounded-2xl overflow-hidden border-3 border-black shadow-[6px_6px_0px_#000] bg-black group transition-all ${
                !showControls && isPlaying ? 'cursor-none' : ''
              }`}
              style={{ aspectRatio: '16/9' }}
              onMouseEnter={handleUserActivity}
              onMouseMove={handleUserActivity}
              onTouchStart={handleUserActivity}
              onMouseLeave={() => {
                if (isPlaying) setShowControls(false);
              }}
            >
              {/* YouTube IFrame Mount Target with Oversized Vertical Crop (-70px top, +140px height) */}
              <div
                className="absolute overflow-hidden pointer-events-none select-none"
                style={{
                  top: '-70px',
                  left: '-3%',
                  width: '106%',
                  height: 'calc(100% + 140px)'
                }}
              >
                <div id="custom-yt-iframe" className="w-full h-full pointer-events-none" />
              </div>

              {/* Permanent Solid Top & Bottom Occlusion Shields (Completely eliminates YT title & watermark) */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-black pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black pointer-events-none z-10" />

              {/* Full Player Click Surface (Directly toggles play/pause without passing clicks to YouTube) */}
              <div
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full cursor-pointer z-10"
                title={isPlaying ? 'Click to pause' : 'Click to play'}
              />

              {/* Big Initial Play Button Overlay (when video hasn't started) */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-20 transition-all hover:bg-black/40"
                >
                  <div className="w-20 h-20 rounded-full bg-saffron text-black border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center transform transition-transform group-hover:scale-110 active:scale-95">
                    <Play className="w-9 h-9 fill-current ml-1" />
                  </div>
                  <div className="mt-3 px-4 py-1.5 bg-black text-white text-xs font-black uppercase rounded-lg border border-white tracking-wider shadow-sm">
                    Click to Play Spotlight Video
                  </div>
                </div>
              )}

              {/* Top Banner Mask (Hides YT Title/Share Clutter, auto-hides with controls) */}
              <div className={`absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none z-20 flex items-center justify-between text-white transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-comic text-sm tracking-wide drop-shadow">
                    {spotlight.title || 'Spotlight Video'}
                  </span>
                </div>
                <div className="px-2 py-0.5 bg-black/70 border border-white/30 rounded text-[10px] font-mono font-bold">
                  Adaptive HD 720p - 1080p
                </div>
              </div>

              {/* Custom Bottom Pop Art Control Bar */}
              <div className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-20 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Duration Seek Slider / Scrubber */}
                <div className="relative mb-2.5 flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.5"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF9933] focus:outline-none"
                    title="Change video duration / seek position"
                  />
                </div>

                <div className="flex items-center justify-between text-white gap-2">
                  {/* Left: Play/Pause & Time */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-2 bg-white text-black hover:bg-saffron rounded-xl border border-black shadow-[2px_2px_0px_#FF9933] font-bold transition-all active:scale-95"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="text-xs font-mono font-bold tracking-wider text-gray-200">
                      <span>{formatTime(currentTime)}</span>
                      <span className="mx-1 text-gray-500">/</span>
                      <span className="text-gray-400">{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Right: Audio Volume & Fullscreen */}
                  <div className="flex items-center gap-2.5">
                    {/* Volume Mute Toggle */}
                    <button
                      onClick={toggleMute}
                      className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Volume Slider (hidden on extra small screens) */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="hidden sm:inline-block w-16 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                      title="Adjust Volume"
                    />

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTuber Channel Info & Direct Support Bar (As Requested by User) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-red-600 border-2 border-black rounded-xl flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_#000]">
                  <YoutubeIcon className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">
                    Featured YouTube Creator
                  </div>
                  <h3 className="font-display font-black text-lg text-black leading-tight flex items-center gap-1.5">
                    <span>{spotlight.channelName || 'Featured Nationalist YouTuber'}</span>
                    <CheckCircle className="w-4 h-4 text-tirangaGreen shrink-0" />
                  </h3>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">
                    Watch official broadcasts, subscribe, and support pro-national independent journalism.
                  </p>
                </div>
              </div>

              {spotlight.channelUrl && (
                <a
                  href={spotlight.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bento-btn bg-red-600 text-white hover:bg-red-700 px-5 py-2.5 text-xs uppercase font-black flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] shrink-0"
                >
                  <YoutubeIcon className="w-4 h-4 fill-current" />
                  <span>Support on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                </a>
              )}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 2: IMPORTANT IMAGE VIEWER                                */}
        {/* ------------------------------------------------------------- */}
        {!isVideo && spotlight.imageUrl && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-3 border-black shadow-[6px_6px_0px_#000] bg-gray-100 group">
              <img
                src={spotlight.imageUrl}
                alt={spotlight.title || 'Important Graphic'}
                className="w-full max-h-[550px] object-contain mx-auto bg-black/5"
              />

              {/* Zoom Trigger Button Overlay */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/85 text-white hover:bg-black rounded-xl text-xs font-black uppercase flex items-center gap-1.5 border border-white/30 shadow-md backdrop-blur-sm"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Full View</span>
              </button>
            </div>

            {spotlight.imageCaption && (
              <div className="p-4 bg-gray-50 border-2 border-black rounded-xl font-display font-semibold text-xs sm:text-sm text-gray-800 leading-relaxed shadow-[2px_2px_0px_#000]">
                {spotlight.imageCaption}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Zoom Modal for Important Image */}
      {isZoomOpen && spotlight?.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-white border-4 border-black rounded-2xl p-2 shadow-[8px_8px_0px_#FFE600] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 bg-black text-white hover:bg-red-600 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={spotlight.imageUrl}
              alt={spotlight.title}
              className="max-h-[82vh] w-auto mx-auto object-contain rounded-xl"
            />
            {spotlight.title && (
              <div className="p-2 text-center font-comic text-base text-black font-bold">
                {spotlight.title}
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
