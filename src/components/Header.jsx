import React, { useState } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { Database, PlusCircle, Menu, X, Award, Sparkles, Play, Pause, ListMusic, Users, Heart } from 'lucide-react';
import { useMusicPlayer } from './MusicPlayer';

export default function Header({
  activePage = 'propagandus',
  onSelectPage,
  onOpenSubmit,
  onOpenSuggest,
  onOpenDonate,
  stats,
  onLogoClick
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const music = useMusicPlayer();
  const isPlaying = music?.isPlaying;
  const togglePlay = music?.togglePlay;
  const setIsPlaylistOpen = music?.setIsPlaylistOpen;
  const playlist = music?.playlist || [];
  const currentTrack = music?.currentTrack;

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onSelectPage) onSelectPage('propagandus');
    if (onLogoClick) onLogoClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-3 border-black shadow-[0_4px_0_0_#000]">
      {/* Top Nationalist Slogan Bar with Music Player Controls */}
      <div className="bg-[#FF9933] py-1 px-3 sm:px-4 border-b-2 border-black flex items-center justify-between text-xs font-black text-black gap-2">
        <div className="flex items-center gap-2 min-w-0">


            <span className="font-extrabold flex items-center gap-1.5 text-[11px] sm:text-xs">
          <span>Bharat Mata ki Jai</span>
            <IndianFlagLogo size="xs" />
          </span>


          {/* Music Play/Pause & Playlist Buttons */}
          <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
            <button
              onClick={togglePlay}
              className={`px-2 py-0.5 rounded-lg border border-black flex items-center gap-1 font-comic text-[10px] uppercase shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-all ${
                isPlaying ? 'bg-black text-saffron' : 'bg-white text-black hover:bg-amber-100'
              }`}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 fill-current" />
              ) : (
                <Play className="w-3 h-3 fill-current ml-0.5" />
              )}
              <span className="font-black">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => setIsPlaylistOpen && setIsPlaylistOpen(true)}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 text-black rounded-lg border border-black flex items-center gap-1 font-comic text-[10px] uppercase shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-all"
              title="Open Nationalist Songs Playlist"
            >
              <ListMusic className="w-3 h-3" />
              <span className="hidden xs:inline font-black">SONGS</span>
              <span className="bg-black text-white px-1.5 py-0.2 rounded-full text-[9px] font-mono">
                {playlist.length}
              </span>
            </button>

            {/* Discrete Audio Indicator (No song name shown, audio only) */}
            {isPlaying && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/15 rounded-lg text-black font-mono font-black text-[10px]">
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-black rounded-full animate-pulse h-2"></span>
                  <span className="w-0.5 bg-black rounded-full animate-pulse h-3 delay-75"></span>
                  <span className="w-0.5 bg-black rounded-full animate-pulse h-1.5 delay-150"></span>
                  <span className="w-0.5 bg-black rounded-full animate-pulse h-2.5 delay-100"></span>
                </span>
                <span className="uppercase tracking-wider">MUSIC ON</span>
              </span>
            )}
          </div>
        </div>

        {/* Donate Option Button in Top Right Corner */}
        {onOpenDonate && (
          <button
            onClick={onOpenDonate}
            className="px-2 sm:px-2.5 py-0.5 bg-popYellow hover:bg-yellow-400 text-black border border-black rounded-lg text-[10px] font-black uppercase shadow-[1px_1px_0px_#000] flex items-center gap-1 active:translate-y-0.5 transition-all shrink-0"
            title="Support / Donate to Developer Team"
          >
            <Heart className="w-3 h-3 text-popRed fill-popRed" />
            <span>Donate</span>
          </button>
        )}
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Clickable Brand & Logo */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
          title="Exposed Propagandus — Home"
        >
          <IndianFlagLogo className="w-10 h-7 sm:w-13 sm:h-9" animated={true} />
          <div>
            <div className="flex items-center gap-1 leading-none">
              <span className="font-comic text-2xl sm:text-3xl tracking-wide text-black">
                EXPOSED
              </span>
              <span className="font-comic text-2xl sm:text-3xl tracking-wide text-saffron-dark">
                PROPAGANDUS
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-gray-700 uppercase tracking-widest hidden sm:block mt-0.5">
              Public Watchdog &amp; Nationalist Directory
            </p>
          </div>
        </a>

        {/* Dedicated Page Toggle Tabs (Desktop Pop Art Style) */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-gray-100 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
          <button
            onClick={() => onSelectPage && onSelectPage('propagandus')}
            className={`px-3 py-1.5 rounded-xl text-xs uppercase font-black transition-all flex items-center gap-1.5 border-2 ${
              activePage === 'propagandus'
                ? 'bg-saffron text-black border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                : 'bg-transparent text-gray-700 border-transparent hover:bg-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-black" />
            <span>Exposed Propagandus</span>
            {stats && (
              <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                {stats.totalEntities || 0}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectPage && onSelectPage('nationalists')}
            className={`px-3 py-1.5 rounded-xl text-xs uppercase font-black transition-all flex items-center gap-1.5 border-2 ${
              activePage === 'nationalists'
                ? 'bg-tirangaGreen text-white border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                : 'bg-transparent text-gray-700 border-transparent hover:bg-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-white" />
            <span>Nationalists</span>
          </button>

          <button
            onClick={() => onSelectPage && onSelectPage('community')}
            className={`px-3 py-1.5 rounded-xl text-xs uppercase font-black transition-all flex items-center gap-1.5 border-2 ${
              activePage === 'community'
                ? 'bg-chakraNavy text-white border-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                : 'bg-transparent text-gray-700 border-transparent hover:bg-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-popYellow" />
            <span>Community</span>
            <span className="bg-popYellow text-black text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              LIVE
            </span>
          </button>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2 font-display">
          {/* Donate / Support Button */}
          <button
            onClick={onOpenDonate}
            className="bento-btn bg-popYellow hover:bg-yellow-400 text-black px-3 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-[3px_3px_0px_#000] font-black"
            title="Support / Donate to Developer Team"
          >
            <Heart className="w-4 h-4 text-popRed fill-popRed" />
            <span>Donate</span>
          </button>

          {activePage === 'nationalists' ? (
            <button
              onClick={onOpenSuggest}
              className="bento-btn bg-tirangaGreen hover:bg-green-700 text-white px-3.5 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-[3px_3px_0px_#000]"
            >
              <Sparkles className="w-4 h-4 text-popYellow" />
              <span>Suggest Creator</span>
            </button>
          ) : (
            <button
              onClick={onOpenSubmit}
              className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-3.5 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-[3px_3px_0px_#000]"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Submit Propagandu</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 py-4 space-y-3 text-sm font-bold">
          
          {/* Page Switch Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectPage) onSelectPage('propagandus');
              }}
              className={`p-2 rounded-xl text-[11px] font-black uppercase text-center border-2 border-black flex flex-col items-center gap-1 ${
                activePage === 'propagandus'
                  ? 'bg-saffron text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-gray-50 text-gray-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Propagandus</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectPage) onSelectPage('nationalists');
              }}
              className={`p-2 rounded-xl text-[11px] font-black uppercase text-center border-2 border-black flex flex-col items-center gap-1 ${
                activePage === 'nationalists'
                  ? 'bg-tirangaGreen text-white shadow-[2px_2px_0px_#000]'
                  : 'bg-gray-50 text-gray-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Nationalists</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectPage) onSelectPage('community');
              }}
              className={`p-2 rounded-xl text-[11px] font-black uppercase text-center border-2 border-black flex flex-col items-center gap-1 ${
                activePage === 'community'
                  ? 'bg-chakraNavy text-white shadow-[2px_2px_0px_#000]'
                  : 'bg-gray-50 text-gray-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-popYellow" />
              <span>Community</span>
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSubmit();
            }}
            className="w-full text-left p-3 bg-saffron text-black border-2 border-black rounded-xl text-xs uppercase font-black flex items-center gap-2 shadow-[3px_3px_0px_#000]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a Propagandu Profile</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenDonate) onOpenDonate();
            }}
            className="w-full text-left p-3 bg-popYellow text-black border-2 border-black rounded-xl text-xs uppercase font-black flex items-center gap-2 shadow-[3px_3px_0px_#000]"
          >
            <Heart className="w-4 h-4 text-popRed fill-popRed" />
            <span>Donate / Support Digital Bharat</span>
          </button>
        </div>
      )}
    </header>
  );
}

