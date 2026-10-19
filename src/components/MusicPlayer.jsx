import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, Disc3, Shuffle } from 'lucide-react';

const MusicPlayerContext = createContext(null);

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}

// Clean thumbnail resolver that guarantees high-resolution SD/HQ (480x360) without 144p or broken invidious proxies
export function getSafeThumbnail(thumbnailUrl, videoId) {
  if (
    !thumbnailUrl ||
    thumbnailUrl.includes('invidious.') ||
    thumbnailUrl.includes('inv.') ||
    thumbnailUrl.includes('/default.jpg') ||
    thumbnailUrl.startsWith('/vi/')
  ) {
    if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }
  return thumbnailUrl;
}

// Robust YouTube Video ID extractor
export function getVideoId(track) {
  if (!track) return '';
  if (track.video_id) return track.video_id;
  if (track.videoId) return track.videoId;
  const raw = track.url || track.audio_url || track.audioUrl || '';
  if (typeof raw === 'string') {
    const clean = raw.trim();
    if (/^[\w-]{11}$/.test(clean)) return clean;
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    if (match) return match[1];
  }
  return '';
}

export function MusicPlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isYtReady, setIsYtReady] = useState(false);

  const playerRef = useRef(null);
  const playedTrackIdsRef = useRef(new Set());
  const playHistoryRef = useRef([]);

  // Live refs to prevent stale closure state
  const currentIndexRef = useRef(0);
  const currentVideoIdRef = useRef('');
  const isPlayingRef = useRef(false);
  const playlistRef = useRef([]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  // Synchronize incoming active playlist from backend
  const syncPlaylist = (incomingTracks) => {
    if (!Array.isArray(incomingTracks)) return;

    // Filter to only active tracks (is_active !== 0)
    const activeList = incomingTracks.filter(t => t.is_active !== 0 && t.is_active !== false && t.is_active !== '0');

    setPlaylist(prevPlaylist => {
      if (activeList.length === 0) {
        // No active songs available
        if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
          try { playerRef.current.pauseVideo(); } catch (e) {}
        }
        setIsPlaying(false);
        isPlayingRef.current = false;
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        currentVideoIdRef.current = '';
        playedTrackIdsRef.current.clear();
        playHistoryRef.current = [];
        return [];
      }

      const curTrack = prevPlaylist[currentIndexRef.current];
      const curVideoId = currentVideoIdRef.current;

      // Check if the song that is currently playing or loaded is STILL in the active playlist
      const activeIdx = activeList.findIndex(t =>
        (curTrack && t.id && t.id === curTrack.id) ||
        (curVideoId && t.video_id === curVideoId)
      );

      if (activeIdx !== -1) {
        // Current song is still active!
        setCurrentIndex(activeIdx);
        currentIndexRef.current = activeIdx;
        currentVideoIdRef.current = activeList[activeIdx].video_id;

        // Clean up played trackers to keep only valid active IDs
        const activeKeys = new Set(activeList.map(t => t.id || t.video_id));
        const filteredPlayed = new Set();
        playedTrackIdsRef.current.forEach(k => {
          if (activeKeys.has(k)) filteredPlayed.add(k);
        });
        playedTrackIdsRef.current = filteredPlayed;

        return activeList;
      } else {
        // CRITICAL BUG FIX: The song currently playing was DISABLED or DELETED by admin!
        // Immediately STOP the disabled song from continuing to play!
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.pauseVideo === 'function') {
              playerRef.current.pauseVideo();
            }
          } catch (e) {}
        }

        // Pick the first available active song
        const newTrack = activeList[0];
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        currentVideoIdRef.current = newTrack.video_id;

        // Reset play tracking for the new active playlist
        playedTrackIdsRef.current.clear();
        playHistoryRef.current = [];
        playedTrackIdsRef.current.add(newTrack.id || newTrack.video_id || 'idx-0');

        // If music was actively playing, immediately switch audio to the new active song!
        if (playerRef.current) {
          try {
            if (isPlayingRef.current) {
              if (typeof playerRef.current.loadVideoById === 'function') {
                playerRef.current.loadVideoById(newTrack.video_id);
                playerRef.current.playVideo();
                setIsPlaying(true);
              }
            } else {
              if (typeof playerRef.current.cueVideoById === 'function') {
                playerRef.current.cueVideoById(newTrack.video_id);
              }
            }
          } catch (e) {
            console.warn('Switch to active track error:', e);
          }
        }

        return activeList;
      }
    });
  };

  // Fetch playlist from backend
  const fetchPlaylist = async () => {
    try {
      const res = await fetch('/api/playlist');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          syncPlaylist(data);
        }
      }
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchPlaylist();

    // Listen for custom event dispatched by Admin Panel or storage changes across tabs
    const handleSyncEvent = () => {
      fetchPlaylist();
    };

    window.addEventListener('playlist-updated', handleSyncEvent);

    const handleStorageEvent = (e) => {
      if (e.key === 'propagandus_playlist_version') {
        fetchPlaylist();
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // Periodic sync polling every 8 seconds so visitors stay in sync with admin changes
    const timer = setInterval(fetchPlaylist, 8000);

    return () => {
      window.removeEventListener('playlist-updated', handleSyncEvent);
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(timer);
    };
  }, []);

  // Initialize YouTube Iframe API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };
  }, []);

  const initPlayer = () => {
    if (playerRef.current) return;
    const initialTrack = playlistRef.current[0];
    const initialVideoId = getVideoId(initialTrack) || currentVideoIdRef.current || '';
    if (!initialVideoId) return;
    currentVideoIdRef.current = initialVideoId;

    try {
      playerRef.current = new window.YT.Player('bg-youtube-audio-player', {
        height: '10',
        width: '10',
        videoId: initialVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: () => {
            setIsYtReady(true);
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING = 1
            if (event.data === 1) {
              setIsPlaying(true);
              isPlayingRef.current = true;
            }
            // YT.PlayerState.PAUSED = 2
            else if (event.data === 2) {
              setIsPlaying(false);
              isPlayingRef.current = false;
            }
            // YT.PlayerState.ENDED = 0 -> Auto-advance with non-repeating random shuffle
            else if (event.data === 0) {
              handleNextTrack();
            }
          },
          onError: (event) => {
            console.warn('YouTube Player playback warning:', event.data);
            handleNextTrack();
          }
        }
      });
    } catch (e) {
      console.warn('YouTube audio player init error:', e);
    }
  };

  const currentTrack = playlist[currentIndex] || playlist[0] || null;

  // Helper to pick next random track without repeating until the entire playlist has ended
  const pickNextRandomIndex = (currentList, currentIdx) => {
    if (!currentList || currentList.length === 0) return 0;
    if (currentList.length === 1) return 0;

    // Mark current song as completed in cycle
    const curTrack = currentList[currentIdx];
    const curKey = curTrack?.id || curTrack?.video_id || `idx-${currentIdx}`;
    playedTrackIdsRef.current.add(curKey);

    // Filter unplayed songs in this cycle
    const unplayedIndices = [];
    currentList.forEach((t, i) => {
      const key = t?.id || t?.video_id || `idx-${i}`;
      if (!playedTrackIdsRef.current.has(key) && i !== currentIdx) {
        unplayedIndices.push(i);
      }
    });

    // If all songs have played, the whole playlist cycle has finished! Reset for new cycle.
    if (unplayedIndices.length === 0) {
      playedTrackIdsRef.current.clear();
      // Candidates for the new round (avoid repeating the song that just ended if possible)
      const resetCandidates = [];
      currentList.forEach((_, i) => {
        if (i !== currentIdx) resetCandidates.push(i);
      });
      const pool = resetCandidates.length > 0 ? resetCandidates : [0];
      const chosenIdx = pool[Math.floor(Math.random() * pool.length)];
      const chosenTrack = currentList[chosenIdx];
      playedTrackIdsRef.current.add(chosenTrack?.id || chosenTrack?.video_id || `idx-${chosenIdx}`);
      return chosenIdx;
    }

    // Pick random song among unplayed tracks
    const chosenIdx = unplayedIndices[Math.floor(Math.random() * unplayedIndices.length)];
    const chosenTrack = currentList[chosenIdx];
    playedTrackIdsRef.current.add(chosenTrack?.id || chosenTrack?.video_id || `idx-${chosenIdx}`);
    return chosenIdx;
  };

  const playTrack = (index, recordHistory = true) => {
    if (index < 0 || index >= playlist.length) return;
    if (recordHistory && index !== currentIndex) {
      playHistoryRef.current.push(currentIndex);
    }

    const track = playlist[index];
    if (!track) return;
    const vId = getVideoId(track);
    if (!vId) return;

    const key = track?.id || vId || `idx-${index}`;
    playedTrackIdsRef.current.add(key);

    setCurrentIndex(index);
    currentIndexRef.current = index;
    currentVideoIdRef.current = vId;

    if (!playerRef.current) {
      initPlayer();
      return;
    }

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById(vId);
        playerRef.current.playVideo();
        setIsPlaying(true);
        isPlayingRef.current = true;
      } catch (e) {}
    }
  };

  const togglePlay = () => {
    if (playlist.length === 0) return;
    const curTrack = playlist[currentIndex] || playlist[0];
    const vId = getVideoId(curTrack);
    if (!vId) return;

    if (!playerRef.current) {
      initPlayer();
      return;
    }

    try {
      if (isPlaying) {
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
        setIsPlaying(false);
      } else {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('Playback error', e);
    }
  };

  // Next Track: Random selection without repeating until whole playlist ends
  const handleNextTrack = () => {
    if (playlist.length === 0) return;
    playHistoryRef.current.push(currentIndex);
    const nextIdx = pickNextRandomIndex(playlist, currentIndex);
    playTrack(nextIdx, false);
  };

  // Previous Track: Go back in history
  const handlePrevTrack = () => {
    if (playHistoryRef.current.length > 0) {
      const prevIdx = playHistoryRef.current.pop();
      playTrack(prevIdx, false);
    } else {
      const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
      playTrack(prevIdx, false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
        setIsMuted(false);
      } else {
        if (typeof playerRef.current.mute === 'function') playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {}
  };

  const contextValue = {
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    isMuted,
    isPlaylistOpen,
    setIsPlaylistOpen,
    playTrack,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    toggleMute,
    reloadPlaylist: fetchPlaylist
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}

      {/* Hidden off-screen YouTube Player container */}
      <div
        style={{
          position: 'fixed',
          top: '-200px',
          left: '-200px',
          width: '10px',
          height: '10px',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: -9999
        }}
      >
        <div id="bg-youtube-audio-player"></div>
      </div>

      {/* Pop Art Nationalist Music Playlist Drawer / Modal */}
      {isPlaylistOpen && (
        <PlaylistModal
          playlist={playlist}
          currentIndex={currentIndex}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onClose={() => setIsPlaylistOpen(false)}
          onPlayTrack={playTrack}
          onTogglePlay={togglePlay}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onToggleMute={toggleMute}
        />
      )}
    </MusicPlayerContext.Provider>
  );
}

// Pop Art Playlist Modal / Drawer
function PlaylistModal({
  playlist,
  currentIndex,
  currentTrack,
  isPlaying,
  isMuted,
  onClose,
  onPlayTrack,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleMute
}) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white bento-card shadow-[8px_8px_0px_#000] border-3 border-black overflow-hidden my-6 animate-scaleUp">
        
        {/* Header Bar */}
        <div className="bg-[#FF9933] text-black px-4 py-3 flex items-center justify-between border-b-3 border-black">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 bg-black text-white rounded-xl border border-black shadow-sm ${isPlaying ? 'animate-spin' : ''}`}>
              <Disc3 className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-comic text-lg uppercase tracking-wide text-black">
                  RASHTRIYA DHUN &amp; SONGS
                </h3>
                <span className="bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-black">
                  {playlist.length}
                </span>
              </div>
              <p className="text-[10px] font-black text-black/80 font-mono flex items-center gap-1">
                <Shuffle className="w-3 h-3 text-black" />
                <span>Smart Non-Repeating Shuffle • Plays All Before Any Repeat</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-gray-100 text-black rounded-xl border-2 border-black transition-all shadow-sm active:translate-y-0.5"
            title="Close Playlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Now Playing Banner (Discrete audio stream indicator, no oversized titles) */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b-2 border-black p-4 flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={getSafeThumbnail(currentTrack?.thumbnail_url, getVideoId(currentTrack))}
              alt="Track thumbnail"
              onError={(e) => {
                e.currentTarget.onerror = null;
                const vId = getVideoId(currentTrack);
                if (vId) e.currentTarget.src = `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
              }}
              className="w-16 h-12 object-cover rounded-xl border-2 border-black shadow-sm bg-black"
            />
            {isPlaying && (
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-mono font-black uppercase text-saffron-dark">
              <span>{isPlaying ? '▶ AUDIO STREAMING (SHUFFLE ON)' : '⏸ AUDIO PAUSED'}</span>
              {isPlaying && (
                <span className="flex items-end gap-0.5 h-3 ml-1">
                  <span className="w-0.5 bg-saffron-dark rounded-full animate-bounce h-2"></span>
                  <span className="w-0.5 bg-saffron-dark rounded-full animate-bounce h-3 delay-100"></span>
                  <span className="w-0.5 bg-saffron-dark rounded-full animate-bounce h-1.5 delay-200"></span>
                </span>
              )}
            </div>
            <h4 className="font-comic text-sm text-black truncate leading-tight">
              {currentTrack?.title ? currentTrack.title : (isPlaying ? `DHUN #${currentIndex + 1} • PATRIOTIC MUSIC` : 'PATRIOTIC MUSIC STREAM')}
            </h4>
            <p className="text-[11px] text-gray-600 font-mono truncate">
              {currentTrack?.author || 'Continuous background audio • Auto-advances across pages'}
            </p>
          </div>

          {/* Quick Controls in Now Playing */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onPrev}
              className="p-1.5 bg-white hover:bg-gray-100 rounded-lg border border-black transition-all"
              title="Previous Track in History"
            >
              <SkipBack className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={onTogglePlay}
              className="p-2 bg-saffron hover:bg-orange-400 text-black rounded-xl border-2 border-black font-black transition-all shadow-sm active:translate-y-0.5"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={onNext}
              className="p-1.5 bg-white hover:bg-gray-100 rounded-lg border border-black transition-all"
              title="Next Random Song"
            >
              <SkipForward className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={onToggleMute}
              className={`p-1.5 rounded-lg border border-black transition-all ${isMuted ? 'bg-red-100 text-red-700' : 'bg-white text-black'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Playlist Scrollable Items */}
        <div className="max-h-[360px] overflow-y-auto p-3 space-y-2 font-display divide-y divide-gray-100">
          {playlist.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-gray-500">
              No active songs in playlist. Admin can add songs via Admin Panel.
            </div>
          ) : (
            playlist.map((track, idx) => {
              const isCurrent = idx === currentIndex;
              const vId = getVideoId(track);
              return (
                <div
                  key={track.id || vId || idx}
                  onClick={() => onPlayTrack(idx)}
                  className={`pt-2 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-50 border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                      : 'bg-white border-transparent hover:border-black/30 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Track Number / Playing indicator */}
                    <div className="w-6 text-center font-mono font-black text-xs shrink-0">
                      {isCurrent && isPlaying ? (
                        <span className="text-saffron-dark font-black">▶</span>
                      ) : (
                        <span className="text-gray-400">#{idx + 1}</span>
                      )}
                    </div>

                    {/* High Quality Thumbnail with Fallback */}
                    <img
                      src={getSafeThumbnail(track.thumbnail_url, vId)}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (vId) e.currentTarget.src = `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
                      }}
                      className="w-12 h-9 object-cover rounded-lg border border-black/40 bg-black shrink-0"
                    />

                    {/* Title & Artist */}
                    <div className="min-w-0">
                      <p className={`font-comic text-xs truncate ${isCurrent ? 'text-black font-black' : 'text-gray-800'}`}>
                        {track.title}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono truncate">
                        {track.author || 'Nationalist Track'}
                      </p>
                    </div>
                  </div>

                {/* Duration & Play button */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono text-gray-500 font-bold">
                    {track.duration || '3:30'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) onTogglePlay();
                      else onPlayTrack(idx);
                    }}
                    className={`p-1.5 rounded-lg border border-black transition-all ${
                      isCurrent && isPlaying
                        ? 'bg-saffron text-black shadow-sm'
                        : 'bg-gray-100 hover:bg-saffron text-black'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

        {/* Footer info note */}
        <div className="bg-gray-50 px-4 py-2 border-t-2 border-black flex items-center justify-between text-[10px] font-mono font-bold text-gray-600">
          <span>Plays continuously while you browse • Random no-repeat order</span>
          <span className="text-saffron-dark">🇮🇳 Vande Mataram</span>
        </div>

      </div>
    </div>
  );
}
