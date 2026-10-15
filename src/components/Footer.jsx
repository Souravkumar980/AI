import React from 'react';
import IndianFlagLogo from './IndianFlagLogo';

export default function Footer({ onOpenSubmit, onOpenSuggest, onSelectPage, onOpenDonate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white border-t-3 border-black pt-10 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <IndianFlagLogo className="w-10 h-6" animated={true} />
              <span className="font-comic text-2xl tracking-wide text-white">
                EXPOSED <span className="text-saffron">PROPAGANDUS</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <IndianFlagLogo className="w-4 h-3" />
              <span className="font-comic text-base text-saffron tracking-wider">
                BHARAT MATA KI JAI
              </span>
            </div>

            <p className="font-display text-xs text-gray-400 leading-relaxed max-w-sm">
              Public crowdsourced watchdog tracking leftist influencers, political workers, and media entities who spread anti-India narratives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 font-display">
            <h4 className="font-comic text-base text-saffron tracking-wide uppercase">
              Navigation &amp; Directory
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-300 font-semibold">
              <li>
                <button
                  onClick={() => {
                    if (onSelectPage) onSelectPage('propagandus');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-saffron transition-colors text-left"
                >
                  → Exposed Propagandus Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectPage) onSelectPage('nationalists');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-tirangaGreen transition-colors text-left text-green-400 font-bold"
                >
                  → Nationalist Influencers Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectPage) onSelectPage('community');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-popYellow transition-colors text-left text-amber-300 font-bold"
                >
                  → Sovereign Community Hub (Public Chat &amp; Private Channels)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSubmit}
                  className="hover:text-saffron transition-colors text-left"
                >
                  → Submit a Propagandu Profile
                </button>
              </li>
              {onOpenSuggest && (
                <li>
                  <button
                    onClick={onOpenSuggest}
                    className="hover:text-saffron transition-colors text-left"
                  >
                    → Suggest Nationalist Creator
                  </button>
                </li>
              )}
              {onOpenDonate && (
                <li>
                  <button
                    onClick={onOpenDonate}
                    className="hover:text-popYellow transition-colors text-left text-popYellow font-bold flex items-center gap-1.5"
                  >
                    <span>❤️ Donate &amp; Support Digital Bharat</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Community Standards */}
          <div className="space-y-2 font-display">
            <h4 className="font-comic text-base text-saffron tracking-wide uppercase">
              Community Standards
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Profiles are contributed by vigilant citizens and verified with public record citations to safeguard truth.
            </p>
            <div className="pt-2 text-[11px] font-mono text-gray-400">
              Anti-Propaganda Citizens Network • Bharat
            </div>
            {onOpenDonate && (
              <div className="pt-3">
                <button
                  onClick={onOpenDonate}
                  className="px-3.5 py-1.5 bg-popYellow hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
                >
                  <span>❤️ Donate (UPI)</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-mono gap-2">
          <div className="flex items-center gap-2">
            <IndianFlagLogo className="w-4 h-3" />
            <span>Exposed Propagandus &copy; {currentYear} Made with 💖 in INDIA by Nationalist GenZ 🔥</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenDonate && (
              <button
                onClick={onOpenDonate}
                className="text-popYellow font-bold hover:underline"
              >
                ❤️ Support the Devs
              </button>
            )}
            <span>Bharat Mata ki Jai <IndianFlagLogo className="w-4 h-3" /> </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

