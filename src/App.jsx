import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropagandusDatabase from './components/PropagandusDatabase';
import NationalistPage from './components/NationalistPage';
import BjpVotePoll from './components/BjpVotePoll';
import AdminPostsFeed from './components/AdminPostsFeed';
import ShareBusterModal from './components/ShareBusterModal';
import SubmitModal from './components/SubmitModal';
import SuggestNationalistModal from './components/SuggestNationalistModal';
import ReportModal from './components/ReportModal';
import AdminPanel from './components/AdminPanel';
import AdminAnnouncementBanner from './components/AdminAnnouncementBanner';
import BulletinBanner from './components/BulletinBanner';
import CommunityPage from './components/CommunityPage';
import DonateModal from './components/DonateModal';
import Footer from './components/Footer';
import SuggestFeaturePage from './components/SuggestFeaturePage';
import { DevToolsShield, GeoRestrictionShield, AuthenticBrowserShield } from './components/SecurityShields';
import { MusicPlayerProvider } from './components/MusicPlayer';
import confetti from 'canvas-confetti';
import { PlusCircle, Award } from 'lucide-react';
import { playRandomPropaganduSound } from './utils/audioPlayer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('propagandus'); // 'propagandus', 'nationalists', 'community'
  const [stats, setStats] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSuggestNatOpen, setIsSuggestNatOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingEntity, setReportingEntity] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Donate / Support Modal (Auto-pops after 6 seconds on first visit, or manually via button)
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const alreadySeen = sessionStorage.getItem('ep_donate_seen');
        if (!alreadySeen) {
          setIsDonateOpen(true);
          sessionStorage.setItem('ep_donate_seen', 'true');
        }
      } catch (e) {
        setIsDonateOpen(true);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // P2: Share Buster Modal
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [shareCardData, setShareCardData] = useState(null);

  const handleOpenShareCard = (data) => {
    setShareCardData(data);
    setIsShareCardOpen(true);
  };

  useEffect(() => {
    fetchStats();
  }, [reloadTrigger]);

  // Route Detection: Handles /the-govt, /nationalists, /v7/admin/om, hashes & query params
  useEffect(() => {
    const checkNavigation = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();

      // 1. Admin route detection
      if (
        path.includes('/v7/admin/om') ||
        hash.includes('/v7/admin/om') ||
        hash.includes('admin') ||
        search.includes('admin=') ||
        search.includes('v7=admin')
      ) {
        setIsAdminOpen(true);
      }

      // 2. Dedicated page route detection
      if (
        path.includes('/community') ||
        hash.includes('community') ||
        search.includes('page=community') ||
        path.includes('join=') ||
        search.includes('join=') ||
        hash.includes('join=')
      ) {
        setCurrentPage('community');
      } else if (
        path.includes('/nationalists') ||
        hash.includes('nationalists') ||
        search.includes('page=nationalists')
      ) {
        setCurrentPage('nationalists');
      } else if (
        hash.includes('propagandus') ||
        search.includes('page=propagandus')
      ) {
        setCurrentPage('propagandus');
      }
    };

    checkNavigation();

    window.addEventListener('popstate', checkNavigation);
    window.addEventListener('hashchange', checkNavigation);

    const handleKeyDown = (e) => {
      const isO = e.key === 'o' || e.key === 'O';
      if (isO && e.ctrlKey && e.altKey) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkNavigation);
      window.removeEventListener('hashchange', checkNavigation);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectPage = (page) => {
    setCurrentPage(page);
    if (page === 'community') {
      window.location.hash = 'community';
    } else if (page === 'nationalists') {
      window.location.hash = 'nationalists';
    } else {
      window.location.hash = 'propagandus';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.toLowerCase().includes('/v7/admin/om')) {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.location.hash = currentPage === 'nationalists' ? 'nationalists' : '';
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      // Quiet failover
    }
  };

  const handleOpenReport = (entity) => {
    setReportingEntity(entity);
    setIsReportOpen(true);
  };

  const handleEntitySubmitted = (newEntity) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF9933', '#138808', '#000080', '#FFE600']
      });
    } catch (e) {}

    setReloadTrigger(prev => prev + 1);
  };

  // Realtime live user & device tracking (Distinct per device / browser session)
  const sendVisitPing = async (isHeartbeat = false) => {
    try {
      let clientId = '';
      const userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
      const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const touchPoints = typeof navigator !== 'undefined' ? (navigator.maxTouchPoints || 0) : 0;
      
      const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent) || (touchPoints > 1 && winW >= 768 && winW <= 1024);
      const isMobile = !isTablet && (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent) || winW < 768);
      const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

      try {
        clientId = localStorage.getItem('ep_device_session_id');
        if (!clientId) {
          const prefix = isTablet ? 'tab_' : (isMobile ? 'mob_' : 'pc_');
          clientId = prefix + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('ep_device_session_id', clientId);
        }
      } catch (e) {
        clientId = (isTablet ? 'tab_' : (isMobile ? 'mob_' : 'pc_')) + Date.now();
      }

      // Proactively resolve real client IP if not yet in session
      let clientIp = '';
      try {
        clientIp = sessionStorage.getItem('ep_real_ip') || '';
        if (!clientIp && !isHeartbeat) {
          fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(data => {
              if (data && data.ip) {
                sessionStorage.setItem('ep_real_ip', data.ip);
              }
            })
            .catch(() => {});
        }
      } catch (e) {}

      const pageName = currentPage === 'nationalists' 
        ? 'Nationalist Creators Page' 
        : currentPage === 'community'
        ? 'Sovereign Community Hub'
        : currentPage === 'suggest-feature'
        ? 'Suggest Updates & Features Page'
        : 'Homepage / Propagandus Directory';

      await fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_ip: clientIp,
          device_type: deviceType,
          page: pageName,
          userAgent: userAgent,
          is_heartbeat: isHeartbeat,
          screenWidth: winW
        })
      });
    } catch (e) {}
  };

  useEffect(() => {
    sendVisitPing(false);
    // Heartbeat every 20 seconds while active
    const timer = setInterval(() => {
      sendVisitPing(true);
    }, 20000);
    return () => clearInterval(timer);
  }, [currentPage]);

  // Tap sound handler: ONLY on tap/click on Propagandu profiles
  const handlePropaganduPageClick = (e) => {
    if (currentPage !== 'propagandus') return;

    // Never play sound if user clicked inside searching area or form inputs or links
    if (
      e.target.closest('#search-area') ||
      e.target.closest('[data-no-sound="true"]') ||
      e.target.closest('input') ||
      e.target.closest('textarea') ||
      e.target.closest('select') ||
      e.target.closest('a')
    ) {
      return;
    }

    // Never play over specific vote buttons or audio elements
    if (
      e.target.closest('button[data-special-sound]') ||
      e.target.closest('#bg-youtube-audio-player')
    ) {
      return;
    }

    // Play only when user taps on a propagandu profile card
    const isPropaganduCard = e.target.closest('[data-propagandu-card="true"]');
    if (isPropaganduCard) {
      playRandomPropaganduSound();
    }
  };

  return (
    <MusicPlayerProvider>
      {/* DevTools Inspect Shield & Sovereign Geofencing Shield & Authentic Browser Shield */}
      <DevToolsShield />
      <AuthenticBrowserShield />
      <GeoRestrictionShield />

      <div className={`${currentPage === 'community' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'} flex flex-col bg-[#FDFBF7] text-black selection:bg-saffron selection:text-black overflow-x-hidden`}>
        {/* Live Admin Broadcast Banner across Visitors Screens */}
        <AdminAnnouncementBanner />

        {/* Sticky Header with Pop Art Navigation & Music Controls */}
        {currentPage !== 'community' && (
          <Header
            activePage={currentPage}
            onSelectPage={handleSelectPage}
            onOpenSubmit={() => setIsSubmitOpen(true)}
            onOpenSuggest={() => setIsSuggestNatOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
            stats={stats}
            onLogoClick={() => setReloadTrigger(prev => prev + 1)}
          />
        )}

      {/* Main Content: Dedicated Page Views */}
      <main className={`flex-1 ${currentPage === 'community' ? 'h-full min-h-0 flex flex-col overflow-hidden' : 'overflow-x-hidden'}`}>
        {currentPage === 'nationalists' ? (
          /* Dedicated Nationalist Influencers Page */
          <NationalistPage
            onOpenSuggest={() => setIsSuggestNatOpen(true)}
            onNavigatePropagandus={() => handleSelectPage('propagandus')}
            reloadTrigger={reloadTrigger}
          />
        ) : currentPage === 'community' ? (
          /* Dedicated Sovereign Community Hub */
          <CommunityPage
            onSelectPage={handleSelectPage}
          />
        ) : currentPage === 'suggest-feature' ? (
          /* Dedicated Suggest Updates & Features Full Page */
          <SuggestFeaturePage
            onNavigateHome={() => handleSelectPage('propagandus')}
          />
        ) : (
          /* Dedicated Exposed Propagandus Homepage with Tap Sound (Excluded on Search) */
          <div onClick={handlePropaganduPageClick} className="flex-1">
            <Hero
              onOpenSubmit={() => setIsSubmitOpen(true)}
              stats={stats}
            />

            {/* Live Pop-Art Bulletin Banner on Main Page */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 mb-2">
              <BulletinBanner />
            </div>

            {/* Dedicated Pop Art BJP Vote Poll on Homepage */}
            <BjpVotePoll />

            {/* Admin Posts & Dispatches Feed */}
            <AdminPostsFeed
              onOpenShareCard={handleOpenShareCard}
              reloadTrigger={reloadTrigger}
            />

            <PropagandusDatabase
              onOpenSubmit={() => setIsSubmitOpen(true)}
              onOpenReport={handleOpenReport}
              onOpenShareCard={handleOpenShareCard}
              reloadTrigger={reloadTrigger}
            />
          </div>
        )}
      </main>

        {/* Footer */}
        {currentPage !== 'community' && (
          <Footer
            onOpenSubmit={() => setIsSubmitOpen(true)}
            onOpenSuggest={() => setIsSuggestNatOpen(true)}
            onSelectPage={handleSelectPage}
            onOpenDonate={() => setIsDonateOpen(true)}
          />
        )}

      {/* Mobile Floating Action Button */}
      {currentPage !== 'community' && (
        <div className="fixed bottom-5 right-5 z-30 sm:hidden flex flex-col gap-2">
          {currentPage === 'nationalists' ? (
            <button
              onClick={() => setIsSuggestNatOpen(true)}
              className="bento-btn bg-tirangaGreen text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[3px_3px_0px_#000] text-xs uppercase tracking-wider font-black border-2 border-black"
            >
              <Award className="w-4 h-4 text-popYellow" />
              <span>Suggest Creator</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="bento-btn bg-saffron text-black px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[3px_3px_0px_#000] text-xs uppercase tracking-wider font-black border-2 border-black"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Expose Propagandu</span>
            </button>
          )}
        </div>
      )}

      {/* Propagandu Submission Modal */}
      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={handleEntitySubmitted}
      />

      {/* Suggest Nationalist Creator Modal */}
      <SuggestNationalistModal
        isOpen={isSuggestNatOpen}
        onClose={() => setIsSuggestNatOpen(false)}
        onSuccess={() => {
          setReloadTrigger(prev => prev + 1);
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setReportingEntity(null);
        }}
        entity={reportingEntity}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onRefreshData={() => setReloadTrigger(prev => prev + 1)}
        onNavigateCommunity={() => {
          handleCloseAdmin();
          handleSelectPage('community');
        }}
      />

      {/* P2: WhatsApp Forward Buster & Shareable Card Modal */}
      <ShareBusterModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
        data={shareCardData}
      />

      {/* UPI Donation & Developer Support Poster Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />
    </div>
    </MusicPlayerProvider>
  );
}
