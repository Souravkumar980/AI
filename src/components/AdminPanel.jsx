import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { OPPOSITION_PARTIES } from '../data/partiesAndInstitutions';
import {
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Database,
  Download,
  Upload,
  Trash2,
  Edit,
  CheckCircle,
  MessageSquare,
  Ban,
  RefreshCw,
  X,
  AlertTriangle,
  Search,
  ExternalLink,
  Save,
  Activity,
  PlusCircle,
  Flame,
  Award,
  Loader2,
  Sparkles,
  Radio,
  FileText,
  Image as ImageIcon,
  Key,
  Globe,
  Pin,
  Tv,
  Video,
  Music,
  ListMusic,
  Disc3,
  Users,
  Smartphone,
  Monitor,
  Tablet,
  Clock
} from 'lucide-react';

// Helper to resolve any handle or input string to a direct clickable URL
function resolveSocialUrl(handle, platform) {
  if (!handle) return null;
  const str = String(handle).trim();
  if (str.startsWith('http://') || str.startsWith('https://')) return str;
  if (platform === 'yt') return `https://www.youtube.com/@${str.replace(/^@/, '')}`;
  if (platform === 'x') return `https://x.com/${str.replace(/^@/, '')}`;
  if (platform === 'insta') return `https://www.instagram.com/${str.replace(/^@/, '')}`;
  return `https://${str}`;
}

export default function AdminPanel({ isOpen, onClose, onRefreshData, onNavigateCommunity }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('propagandus_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // IP Subnet Restriction state (152.59.XXX.XXX)
  const [isIpAllowed, setIsIpAllowed] = useState(true);
  const [clientIpDisplay, setClientIpDisplay] = useState('');
  const [ipChecked, setIpChecked] = useState(false);

  // Admin Views: 'overview', 'nationalists', 'entities', 'shield', 'reports', 'security', 'backup'
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [stats, setStats] = useState(null);
  const [entities, setEntities] = useState([]);
  const [reports, setReports] = useState([]);
  const [nationalists, setNationalists] = useState([]);
  const [shieldData, setShieldData] = useState({ attempts: [], blockedIps: [] });
  const [securityData, setSecurityData] = useState({ blockedIps: [], logs: [] });
  const [loading, setLoading] = useState(false);

  // Edit / Modal States
  const [editingEntity, setEditingEntity] = useState(null);
  const [editingNationalist, setEditingNationalist] = useState(null);
  const [isDirectAddNatOpen, setIsDirectAddNatOpen] = useState(false);
  const [isDirectAddPropOpen, setIsDirectAddPropOpen] = useState(false);

  // Direct Add Form States (Default upvotes 0 across the entire system)
  const [directNatForm, setDirectNatForm] = useState({
    name: '',
    handle_x: '',
    handle_yt: '',
    handle_insta: '',
    avatar_url: '',
    categories: ['Defence'],
    category: 'Defence',
    description: '',
    upvotes: 0
  });

  const [directPropForm, setDirectPropForm] = useState({
    name: '',
    handle_x: '',
    handle_yt: '',
    handle_insta: '',
    avatar_url: '',
    categories: ['Social Media'],
    party: OPPOSITION_PARTIES[0],
    institution: '',
    narrative: '',
    fact_check: '',
    proof_url: '',
    upvotes: 0,
    is_verified: 1
  });

  // Dynamic Categories Management State
  const [categoriesList, setCategoriesList] = useState([]);
  const [newCategoryType, setNewCategoryType] = useState('nationalist');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // IP block form state
  const [blockIpInput, setBlockIpInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');

  // Live Broadcast Announcement on Visitor Screens
  const [broadcastTitle, setBroadcastTitle] = useState('🔴 LIVE ALERT / व्यवस्थापक सूचना');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState('warning');
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [savingBroadcast, setSavingBroadcast] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState('');

  // Admin Posts & Bulletins State
  const [adminPosts, setAdminPosts] = useState([]);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image_url: '',
    badge: '🚨 BREAKING ALERT',
    is_pinned: false
  });
  const [savingPost, setSavingPost] = useState(false);

  // User IPs & Activity State
  const [usersIpsData, setUsersIpsData] = useState({
    uniqueIps: [],
    blockedIps: [],
    recentActivity: []
  });

  // Community Moderation State
  const [communityData, setCommunityData] = useState({
    users: [],
    messages: [],
    channels: [],
    adminQueries: [],
    influencerQueries: [],
    contactQueries: []
  });
  const [commSearch, setCommSearch] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [commSection, setCommSection] = useState('queries'); // 'queries', 'users', 'channels'

  // The Govt: 2029 Mega Poll State
  const [govtPoll, setGovtPoll] = useState(null);
  const [pollYesInput, setPollYesInput] = useState(0);
  const [pollNoInput, setPollNoInput] = useState(0);
  const [savingGovtPoll, setSavingGovtPoll] = useState(false);

  // Spotlight Media State (Video of the Day / Important Image / Off)
  const [spotlightForm, setSpotlightForm] = useState({
    type: 'off',
    title: '',
    videoUrl: '',
    channelName: '',
    channelUrl: '',
    imageUrl: '',
    imageCaption: ''
  });
  const [savingSpotlight, setSavingSpotlight] = useState(false);
  const [fetchingYtInfo, setFetchingYtInfo] = useState(false);

  // Music Playlist & Invidious Search States
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [invidiousSearchQuery, setInvidiousSearchQuery] = useState('');
  const [invidiousResults, setInvidiousResults] = useState([]);
  const [isSearchingInvidious, setIsSearchingInvidious] = useState(false);
  const [directMusicUrl, setDirectMusicUrl] = useState('');
  const [isFetchingDirectMusic, setIsFetchingDirectMusic] = useState(false);
  const [directMusicPreview, setDirectMusicPreview] = useState(null);
  const [addingMusicId, setAddingMusicId] = useState(null);

  // Admin Credentials Change State
  const [adminCredForm, setAdminCredForm] = useState({ new_email: '', new_password: '' });
  const [updatingCreds, setUpdatingCreds] = useState(false);

  // Live Bulletin State
  const [bulletinConfig, setBulletinConfig] = useState({
    is_active: 1,
    title: '⚡ RASHTRIYA FLASH BULLETIN',
    message: '',
    link: ''
  });
  const [isSavingBulletin, setIsSavingBulletin] = useState(false);

  // Realtime Live Users & Device Tracking State
  const [liveTrafficData, setLiveTrafficData] = useState({
    liveCount: 0,
    totalUniqueVisitors: 0,
    totalVisits: 0,
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
    visitors: [],
    recentLogs: []
  });
  const [loadingLiveTraffic, setLoadingLiveTraffic] = useState(false);

  // Check IP Subnet Restriction on Open (strictly 152.59.XXX.XXX)
  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/check-access')
        .then(res => res.json())
        .then(data => {
          setIsIpAllowed(data.allowed !== false);
          setClientIpDisplay(data.ip || '');
          setIpChecked(true);
        })
        .catch(() => {
          setIsIpAllowed(true);
          setIpChecked(true);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (adminToken) {
      verifyToken(adminToken);
    }
  }, [adminToken]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllAdminData();
    }
  }, [isOpen, isAuthenticated, activeTab]);

  // Realtime Live Traffic Polling (Every 6 seconds)
  useEffect(() => {
    if (isOpen && isAuthenticated && adminToken) {
      fetchLiveTraffic();
      const interval = setInterval(fetchLiveTraffic, 6000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAuthenticated, adminToken]);

  // Realtime Community Moderation Live Sync (Every 2.5s & Cross-tab instant sync)
  const refreshCommunityData = async () => {
    try {
      const commRes = await fetch('/api/community/sync', {
        headers: adminToken ? { 'x-admin-key': adminToken } : {}
      });
      if (commRes.ok) {
        const commD = await commRes.json();
        const allQueries = commD.adminQueries || [];
        const influencerQueries = commD.influencerQueries || allQueries.filter(q => q.type === 'creator');
        const contactQueries = commD.contactQueries || allQueries.filter(q => q.type !== 'creator');
        setCommunityData(prev => ({
          ...prev,
          ...commD,
          influencerQueries,
          contactQueries
        }));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshCommunityData();
      const commInterval = setInterval(refreshCommunityData, 2500);
      let bc = null;
      try {
        bc = new BroadcastChannel('ep_community_realtime');
        bc.onmessage = () => {
          refreshCommunityData();
        };
      } catch (e) {}

      return () => {
        clearInterval(commInterval);
        if (bc) bc.close();
      };
    }
  }, [isOpen, isAuthenticated]);

  const fetchLiveTraffic = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/live-traffic', {
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setLiveTrafficData(data);
      }
    } catch (e) {
      console.error('Failed to fetch live traffic', e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const verifyToken = async (token) => {
    if (!token) return;
    if (token.startsWith('ep-adm-')) {
      setIsAuthenticated(true);
      return;
    }
    try {
      const res = await fetch('/api/admin/reports', {
        headers: { 'x-admin-key': token }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('propagandus_admin_key', token);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      if (token.startsWith('ep-adm-')) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      if (res.ok) {
        const data = await res.json();
        setAdminToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('propagandus_admin_key', data.token);
        setLoginEmail('');
        setLoginPassword('');
        return;
      } else {
        const errData = await res.json().catch(() => ({}));
        setLoginError(errData.error || 'Incorrect Administrator Email or Password.');
        return;
      }
    } catch (e) {
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    localStorage.removeItem('propagandus_admin_key');
  };

  const loadAllAdminData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      // 1. Stats
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (e) {}

      // 2. Entities
      try {
        const entRes = await fetch('/api/entities');
        if (entRes.ok) {
          const entData = await entRes.json();
          setEntities(Array.isArray(entData) ? entData : []);
        }
      } catch (e) {}

      // 3. Reports
      try {
        const repRes = await fetch('/api/admin/reports', {
          headers: { 'x-admin-key': adminToken }
        });
        if (repRes.ok) {
          const repData = await repRes.json();
          setReports(Array.isArray(repData) ? repData : []);
        }
      } catch (e) {}

      // 4. Nationalist Influencers
      try {
        const natRes = await fetch('/api/admin/nationalist-influencers', {
          headers: { 'x-admin-key': adminToken }
        });
        if (natRes.ok) {
          const natData = await natRes.json();
          setNationalists(Array.isArray(natData) ? natData : []);
        }
      } catch (e) {}

      // 5. Shield Attempts & Interceptions
      try {
        const shRes = await fetch('/api/admin/shield-attempts', {
          headers: { 'x-admin-key': adminToken }
        });
        if (shRes.ok) {
          const shData = await shRes.json();
          setShieldData({
            attempts: Array.isArray(shData?.attempts) ? shData.attempts : [],
            blockedIps: Array.isArray(shData?.blockedIps) ? shData.blockedIps : []
          });
        } else {
          setShieldData({ attempts: [], blockedIps: [] });
        }
      } catch (e) {
        setShieldData({ attempts: [], blockedIps: [] });
      }

      // 6. Security Center & Blocked IPs
      try {
        const secRes = await fetch('/api/admin/security', {
          headers: { 'x-admin-key': adminToken }
        });
        if (secRes.ok) {
          const secData = await secRes.json();
          setSecurityData({
            blockedIps: Array.isArray(secData?.blockedIps) ? secData.blockedIps : [],
            logs: Array.isArray(secData?.logs) ? secData.logs : []
          });
        } else {
          setSecurityData({ blockedIps: [], logs: [] });
        }
      } catch (e) {
        setSecurityData({ blockedIps: [], logs: [] });
      }

      // 7. Announcement Broadcast
      try {
        const annRes = await fetch('/api/announcement');
        if (annRes.ok) {
          const annData = await annRes.json();
          if (annData?.announcement) {
            setBroadcastTitle(annData.announcement.title || '🔴 LIVE ALERT / व्यवस्थापक सूचना');
            setBroadcastMessage(annData.announcement.message || '');
            setBroadcastType(annData.announcement.type || 'warning');
            setBroadcastActive(Boolean(annData.announcement.is_active));
          }
        }
      } catch (e) {}

      // 8. Admin Posts & Bulletins
      try {
        const postsRes = await fetch('/api/admin/posts', {
          headers: { 'x-admin-key': adminToken }
        });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setAdminPosts(Array.isArray(postsData) ? postsData : []);
        }
      } catch (e) {}

      // 9. User IPs & Live Traffic
      try {
        const ipsRes = await fetch('/api/admin/users-ips', {
          headers: { 'x-admin-key': adminToken }
        });
        if (ipsRes.ok) {
          const ipsData = await ipsRes.json();
          setUsersIpsData({
            uniqueIps: Array.isArray(ipsData?.uniqueIps) ? ipsData.uniqueIps : [],
            blockedIps: Array.isArray(ipsData?.blockedIps) ? ipsData.blockedIps : [],
            recentActivity: Array.isArray(ipsData?.recentActivity) ? ipsData.recentActivity : []
          });
        }
      } catch (e) {}

      // 10. The Govt 2029 Mega Poll
      try {
        const pollRes = await fetch('/api/govt-poll');
        if (pollRes.ok) {
          const pData = await pollRes.json();
          setGovtPoll(pData);
          setPollYesInput(pData.yesVotes ?? 0);
          setPollNoInput(pData.noVotes ?? 0);
        }
      } catch (e) {}

      // 11. Media Spotlight (Video of the Day / Important Image / Off)
      try {
        const spotRes = await fetch('/api/spotlight');
        if (spotRes.ok) {
          const spotData = await spotRes.json();
          if (spotData && spotData.type) {
            setSpotlightForm({
              type: spotData.type || 'off',
              title: spotData.title || '',
              videoUrl: spotData.videoUrl || '',
              channelName: spotData.channelName || '',
              channelUrl: spotData.channelUrl || '',
              imageUrl: spotData.imageUrl || '',
              imageCaption: spotData.imageCaption || ''
            });
          }
        }
      } catch (e) {}

      // 12. Music Playlist Tracks
      try {
        const plRes = await fetch('/api/admin/playlist', {
          headers: { 'x-admin-key': adminToken }
        });
        if (plRes.ok) {
          const plData = await plRes.json();
          setPlaylistTracks(Array.isArray(plData) ? plData : []);
        }
      } catch (e) {}

      // 13. Bulletin Configuration
      loadBulletinConfig();

      // 14. Realtime Live Traffic
      fetchLiveTraffic();

      // 15. Dynamic Categories
      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategoriesList(Array.isArray(catData) ? catData : []);
        }
      } catch (e) {}

      // 16. Community Data & Influencer Verification Proofs
      try {
        const commRes = await fetch('/api/community/sync', {
          headers: adminToken ? { 'x-admin-key': adminToken } : {}
        });
        if (commRes.ok) {
          const commD = await commRes.json();
          const allQueries = commD.adminQueries || [];
          const influencerQueries = commD.influencerQueries || allQueries.filter(q => q.type === 'creator');
          const contactQueries = commD.contactQueries || allQueries.filter(q => q.type !== 'creator');
          setCommunityData({
            ...commD,
            influencerQueries,
            contactQueries
          });
        }
      } catch (e) {}
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityToggleBadge = async (userId, badgeType) => {
    try {
      const res = await fetch('/api/community/admin/verify-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          user_id: userId,
          badge_type: badgeType,
          admin_token: adminToken
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCommunityData(prev => ({
          ...prev,
          users: (prev.users || []).map(u => u.id === userId ? { ...u, verified_type: data.verified_type } : u)
        }));
        showToast('✓ Verification Badge updated successfully!');
      }
    } catch (e) {
      showToast('Failed to update badge.');
    }
  };

  const handleCommunityBanUser = async (userId, targetUsername) => {
    if (!confirm(`Are you sure you want to PERMANENTLY BAN user @${targetUsername} and blacklist their IP address?`)) return;
    try {
      const res = await fetch('/api/community/admin/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          user_id: userId,
          target_username: targetUsername,
          admin_token: adminToken
        })
      });
      if (res.ok) {
        setCommunityData(prev => ({
          ...prev,
          users: (prev.users || []).map(u => u.id === userId ? { ...u, is_banned: 1 } : u)
        }));
        showToast(`✓ User @${targetUsername} and IP blacklisted permanently.`);
      }
    } catch (e) {
      showToast('Failed to ban user.');
    }
  };

  const handleCommunityApproveInfluencer = async (query) => {
    if (query.user_id && query.user_id !== 'guest') {
      await handleCommunityToggleBadge(query.user_id, 'influencer');
    }
    showToast(`✓ Influencer proof approved & Golden Tick granted!`);
  };

  const handleAdminImpersonate = (u) => {
    if (!u) return;
    try {
      localStorage.setItem('ep_community_user', JSON.stringify(u));
      localStorage.setItem('ep_admin_impersonating', JSON.stringify({
        originalAdmin: 'omkumar.working@gmail.com',
        impersonatedUser: u,
        startedAt: Date.now()
      }));
      showToast(`✓ Impersonating @${u.username}. Switching to Community...`);
      if (onNavigateCommunity) {
        onNavigateCommunity();
      } else {
        window.location.hash = '#community';
        if (onClose) onClose();
      }
    } catch (e) {
      console.error('Failed to switch to user account:', e);
      showToast('Failed to switch to user account.');
    }
  };

  const loadCategories = async () => {
    try {
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategoriesList(Array.isArray(catData) ? catData : []);
      }
    } catch (e) {}
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ type: newCategoryType, name: newCategoryName.trim() })
      });
      if (res.ok) {
        showToast(`Created ${newCategoryType} category: "${newCategoryName.trim()}"`);
        setNewCategoryName('');
        await loadCategories();
        if (onRefreshData) onRefreshData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create category');
      }
    } catch (e) {
      alert('Error creating category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        showToast(`Deleted category: "${name}"`);
        await loadCategories();
        if (onRefreshData) onRefreshData();
      } else {
        alert('Failed to delete category');
      }
    } catch (e) {
      alert('Error deleting category');
    }
  };

  const BASE_NAT_CATEGORIES = [
    'Defence',
    'Geopolitics',
    'Supporter',
    'Journalist',
    'Media',
    'Solo Influencer',
    'Sanatan Dharma',
    'International'
  ];

  const allNatCategoryOptions = [
    ...new Set([
      ...BASE_NAT_CATEGORIES,
      ...categoriesList.filter(c => c.type === 'nationalist').map(c => c.name)
    ])
  ];

  const allPropCategoryOptions = [
    ...new Set([
      'Social Media',
      'Political Party',
      'Institutions',
      'Journalist',
      'YouTuber',
      'Academic',
      'Media House',
      'Foreign Entity',
      'Bureaucrat',
      'Activist',
      'NGO / Think Tank',
      ...categoriesList.filter(c => c.type === 'propagandist').map(c => c.name)
    ])
  ];

  const loadPlaylistTracks = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/playlist', {
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setPlaylistTracks(Array.isArray(data) ? data : []);
      }
    } catch (e) {}
  };

  const handleSearchInvidious = async (e) => {
    if (e) e.preventDefault();
    if (!invidiousSearchQuery.trim()) return;
    setIsSearchingInvidious(true);
    try {
      const res = await fetch(`/api/admin/playlist/search?q=${encodeURIComponent(invidiousSearchQuery.trim())}`, {
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setInvidiousResults(Array.isArray(data) ? data : []);
        if (data.length === 0) showToast('No songs found on Invidious. Try different keywords.');
      } else {
        showToast('Invidious search error.');
      }
    } catch (e) {
      showToast('Search request failed.');
    } finally {
      setIsSearchingInvidious(false);
    }
  };

  const handleFetchDirectMusicUrl = async (e) => {
    if (e) e.preventDefault();
    if (!directMusicUrl.trim()) return;
    setIsFetchingDirectMusic(true);
    setDirectMusicPreview(null);
    try {
      const res = await fetch('/api/admin/playlist/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken },
        body: JSON.stringify({ url: directMusicUrl.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setDirectMusicPreview(data);
        showToast('✅ Fetched media info successfully!');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Could not fetch video/playlist from URL');
      }
    } catch (e) {
      showToast('Fetch failed.');
    } finally {
      setIsFetchingDirectMusic(false);
    }
  };

  const handleAddSingleTrack = async (track) => {
    setAddingMusicId(track.videoId);
    try {
      const res = await fetch('/api/admin/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken },
        body: JSON.stringify(track)
      });
      if (res.ok) {
        showToast(`Added "${track.title.slice(0, 25)}..." to site playlist!`);
        loadPlaylistTracks();
        window.dispatchEvent(new CustomEvent('playlist-updated'));
        localStorage.setItem('propagandus_playlist_version', Date.now().toString());
      } else {
        showToast('Failed to add track.');
      }
    } catch (e) {
      showToast('Network error.');
    } finally {
      setAddingMusicId(null);
    }
  };

  const handleAddPlaylistBulk = async (tracks) => {
    if (!Array.isArray(tracks) || tracks.length === 0) return;
    setIsFetchingDirectMusic(true);
    try {
      const res = await fetch('/api/admin/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken },
        body: JSON.stringify({ tracks })
      });
      if (res.ok) {
        showToast(`Imported ${tracks.length} songs into site playlist!`);
        setDirectMusicPreview(null);
        setDirectMusicUrl('');
        loadPlaylistTracks();
        window.dispatchEvent(new CustomEvent('playlist-updated'));
        localStorage.setItem('propagandus_playlist_version', Date.now().toString());
      } else {
        showToast('Failed to import playlist.');
      }
    } catch (e) {
      showToast('Network error.');
    } finally {
      setIsFetchingDirectMusic(false);
    }
  };

  const handleDeletePlaylistTrack = async (trackId) => {
    if (!window.confirm('Delete this track from the playlist?')) return;
    try {
      const res = await fetch(`/api/admin/playlist/${trackId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        showToast('Track removed from playlist.');
        loadPlaylistTracks();
        window.dispatchEvent(new CustomEvent('playlist-updated'));
        localStorage.setItem('propagandus_playlist_version', Date.now().toString());
      }
    } catch (e) {}
  };

  const handleToggleTrackActive = async (trackId) => {
    try {
      const res = await fetch(`/api/admin/playlist/${trackId}/toggle`, {
        method: 'PATCH',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        loadPlaylistTracks();
        window.dispatchEvent(new CustomEvent('playlist-updated'));
        localStorage.setItem('propagandus_playlist_version', Date.now().toString());
        showToast('Song status updated!');
      }
    } catch (e) {}
  };

  const handleUpdateAdminCreds = async (e) => {
    e.preventDefault();
    if (!adminCredForm.new_email || !adminCredForm.new_password || adminCredForm.new_password.length < 6) {
      alert('Please enter a valid email and minimum 6-character password.');
      return;
    }
    setUpdatingCreds(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken },
        body: JSON.stringify(adminCredForm)
      });
      if (res.ok) {
        showToast('✅ Admin credentials updated in database!');
        setAdminCredForm({ new_email: '', new_password: '' });
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to update credentials.');
      }
    } catch (e) {
      showToast('Error updating credentials.');
    } finally {
      setUpdatingCreds(false);
    }
  };

  const loadBulletinConfig = async () => {
    try {
      const res = await fetch('/api/bulletin');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setBulletinConfig(data);
        }
      }
    } catch (e) {}
  };

  const handleSaveBulletin = async (e) => {
    e.preventDefault();
    setIsSavingBulletin(true);
    try {
      const res = await fetch('/api/admin/bulletin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(bulletinConfig)
      });
      if (res.ok) {
        showToast('✅ Live Bulletin updated & broadcasted!');
      } else {
        showToast('❌ Failed to update bulletin.');
      }
    } catch (e) {
      showToast('❌ Error saving bulletin.');
    } finally {
      setIsSavingBulletin(false);
    }
  };

  const handleFetchYoutubeInfo = async () => {
    if (!spotlightForm.videoUrl) {
      alert('Please enter a YouTube video URL first.');
      return;
    }
    setFetchingYtInfo(true);
    try {
      const res = await fetch('/api/admin/youtube-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ url: spotlightForm.videoUrl })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSpotlightForm(prev => ({
          ...prev,
          title: prev.title || data.title || '',
          channelName: data.channelName || prev.channelName || '',
          channelUrl: data.channelUrl || prev.channelUrl || ''
        }));
        showToast('✅ Fetched YouTube details: ' + (data.channelName || 'Success'));
      } else {
        alert(data.error || 'Could not fetch details from YouTube. Please fill manually.');
      }
    } catch (err) {
      alert('Failed to connect to YouTube service: ' + err.message);
    } finally {
      setFetchingYtInfo(false);
    }
  };

  const handleSpotlightImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be under 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setSpotlightForm(prev => ({
        ...prev,
        imageUrl: uploadEvent.target.result
      }));
      showToast('✅ Image loaded for preview. Click Save to publish.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSpotlight = async (e) => {
    if (e) e.preventDefault();
    setSavingSpotlight(true);
    try {
      const res = await fetch('/api/admin/spotlight', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(spotlightForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ Media Spotlight updated: ${spotlightForm.type.toUpperCase()}`);
        if (onRefreshData) onRefreshData();
      } else {
        alert(data.error || 'Failed to update spotlight media.');
      }
    } catch (err) {
      alert('Error updating spotlight: ' + err.message);
    } finally {
      setSavingSpotlight(false);
    }
  };

  const handleSaveGovtPoll = async (e) => {
    e.preventDefault();
    setSavingGovtPoll(true);
    try {
      const res = await fetch('/api/admin/govt-poll', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          yes_votes: parseInt(pollYesInput, 10),
          no_votes: parseInt(pollNoInput, 10)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('✅ The Govt 2029 Poll tallies updated successfully!');
        if (data.poll) {
          setGovtPoll(data.poll);
          setPollYesInput(data.poll.yesVotes);
          setPollNoInput(data.poll.noVotes);
        }
      } else {
        alert(data.error || 'Failed to update poll tallies');
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    } finally {
      setSavingGovtPoll(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      alert('Title and content are required.');
      return;
    }
    try {
      setSavingPost(true);
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(postForm)
      });
      if (res.ok) {
        showToast('Post published successfully to the website!');
        setPostForm({
          title: '',
          content: '',
          image_url: '',
          badge: '🚨 BREAKING ALERT',
          is_pinned: false
        });
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create post');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingPost(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        showToast('Post deleted');
        setAdminPosts(prev => prev.filter(p => p.id !== id));
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUnblockIpAddress = async (ip) => {
    if (!confirm(`Unblock IP ${ip}?`)) return;
    try {
      const res = await fetch(`/api/admin/block-ip/${encodeURIComponent(ip)}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        showToast(`IP ${ip} unblocked`);
        loadAllAdminData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDirectBlockIp = async (ip, defaultReason = 'Administrative block from IP console') => {
    const reason = prompt(`Enter reason to block IP ${ip}:`, defaultReason);
    if (reason === null) return;
    try {
      const res = await fetch('/api/admin/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ ip, reason: reason || defaultReason })
      });
      if (res.ok) {
        showToast(`IP ${ip} blocked`);
        fetchLiveTraffic();
        loadAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to block IP');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSaveBroadcast = async (e) => {
    if (e) e.preventDefault();
    if (!broadcastMessage.trim()) {
      alert('Broadcast message cannot be empty.');
      return;
    }
    setSavingBroadcast(true);
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          message: broadcastMessage.trim(),
          type: broadcastType,
          is_active: broadcastActive ? 1 : 0
        })
      });
      if (res.ok) {
        showToast('📢 Broadcast banner updated on visitors screens!');
        if (onRefreshData) onRefreshData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to update broadcast');
      }
    } catch (err) {
      alert('Network error while updating broadcast');
    } finally {
      setSavingBroadcast(false);
    }
  };

  const handleDeactivateBroadcast = async () => {
    if (!confirm('Are you sure you want to deactivate and remove this broadcast from users screens?')) return;
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        setBroadcastActive(false);
        showToast('Broadcast banner deactivated.');
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      alert('Failed to deactivate broadcast');
    }
  };

  // ---------------- Entity Actions ----------------
  const handleDeleteEntity = async (id, name) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from the database?`)) return;
    try {
      const res = await fetch(`/api/admin/entities/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        showToast(`Entity "${name}" deleted.`);
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      const res = await fetch(`/api/admin/entities/${id}/verify`, {
        method: 'PATCH',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Verify toggle failed');
    }
  };

  const handleSaveEntityEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/entities/${editingEntity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(editingEntity)
      });
      if (res.ok) {
        showToast('Entity successfully updated!');
        setEditingEntity(null);
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Failed to save entity');
    }
  };

  const handleDirectAddPropagandusSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(directPropForm)
      });
      if (res.ok) {
        showToast('Propagandu profile directly created & saved!');
        setIsDirectAddPropOpen(false);
        setDirectPropForm({
          name: '',
          handle_x: '',
          handle_yt: '',
          handle_insta: '',
          avatar_url: '',
          categories: ['Social Media'],
          party: OPPOSITION_PARTIES[0],
          institution: '',
          narrative: '',
          fact_check: '',
          proof_url: '',
          upvotes: 0,
          is_verified: 1
        });
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Failed to add profile');
    }
  };

  // ---------------- Nationalist Influencer Actions ----------------
  const handleApproveNationalist = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/nationalist-influencers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        showToast(`Approved "${name}"! Now live for public voting.`);
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Approve failed');
    }
  };

  const handleRejectNationalist = async (id, name) => {
    try {
      const res = await fetch(`/api/admin/nationalist-influencers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        showToast(`Suggestion for "${name}" marked as rejected.`);
        loadAllAdminData();
      }
    } catch (e) {
      alert('Reject failed');
    }
  };

  const handleDeleteNationalist = async (id, name) => {
    if (!confirm(`Permanently delete nationalist creator "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/nationalist-influencers/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminToken }
      });
      if (res.ok) {
        showToast(`Deleted "${name}".`);
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  const handleSaveNationalistEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/nationalist-influencers/${editingNationalist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(editingNationalist)
      });
      if (res.ok) {
        showToast('Nationalist creator updated!');
        setEditingNationalist(null);
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Save failed');
    }
  };

  const handleDirectAddNationalistSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/nationalist-influencers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify(directNatForm)
      });
      if (res.ok) {
        showToast('Nationalist creator directly added & live!');
        setIsDirectAddNatOpen(false);
        setDirectNatForm({
          name: '',
          handle_x: '',
          handle_yt: '',
          handle_insta: '',
          avatar_url: '',
          categories: ['Defence'],
          category: 'Defence',
          description: '',
          upvotes: 0
        });
        loadAllAdminData();
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      alert('Failed to add creator');
    }
  };

  // ---------------- Report Actions ----------------
  const handleUpdateReport = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Report marked as ${status}`);
        loadAllAdminData();
      }
    } catch (e) {
      alert('Report update failed');
    }
  };

  // ---------------- IP Security Actions ----------------
  const handleBlockIp = async (e) => {
    e.preventDefault();
    if (!blockIpInput) return;
    try {
      const res = await fetch('/api/admin/security/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          ip: blockIpInput.trim(),
          reason: blockReasonInput.trim() || 'Blocked by Administrator'
        })
      });
      if (res.ok) {
        showToast(`IP ${blockIpInput} blacklisted!`);
        setBlockIpInput('');
        setBlockReasonInput('');
        loadAllAdminData();
      }
    } catch (e) {
      alert('Block IP failed');
    }
  };


  const handleUnblockIp = async (ip) => {
    try {
      const res = await fetch('/api/admin/security/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ ip })
      });
      if (res.ok) {
        showToast(`IP ${ip} unblocked`);
        fetchLiveTraffic();
        loadAllAdminData();
      }
    } catch (e) {
      alert('Unblock IP failed');
    }
  };

  // ---------------- Backup & Restore ----------------
  const handleDownloadBackup = () => {
    window.open(`/api/admin/backup?adminKey=${encodeURIComponent(adminToken)}`, '_blank');
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupJson = JSON.parse(event.target?.result);
        const res = await fetch('/api/admin/restore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminToken
          },
          body: JSON.stringify({ backup: backupJson })
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message || 'Database restored successfully!');
          loadAllAdminData();
          if (onRefreshData) onRefreshData();
        } else {
          alert(data.error || 'Restore failed');
        }
      } catch (err) {
        alert('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-7xl bg-[#f8fafc] text-slate-800 rounded-none sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden h-full sm:h-auto sm:max-h-[94vh] flex flex-col font-sans">
        
        {/* Top Header */}
        <div className="bg-white text-slate-900 px-5 sm:px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5a5eff] to-[#3db5ff] flex items-center justify-center text-white shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Admin Command &amp; Intelligence Console
                </h2>
                <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-[#5a5eff] border border-indigo-200">
                  v7.4 Root
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>Exposed Propagandus • Bharat Mata ki Jai</span>
                <IndianFlagLogo size="xs" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 font-display text-xs font-semibold text-center border-b border-emerald-700 animate-pulse">
            ✓ {toastMessage}
          </div>
        )}

        {/* Authentication View or IP Restriction */}
        {!isAuthenticated ? (
          !isIpAllowed ? (
            <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto text-red-600">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">ACCESS RESTRICTED</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  This Administrative Command Console is strictly restricted to authorized network subnet <span className="font-mono font-bold text-slate-800">152.59.XXX.XXX</span>.
                </p>
                <div className="mt-3 inline-block px-3 py-1 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-600">
                  Your IP: {clientIpDisplay || 'Unauthorized'} (Access Denied)
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-10 text-center max-w-md mx-auto my-auto space-y-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto text-[#5a5eff]">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Administrator Authentication</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your authorized credentials to manage the platform and approve nationalist creators.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium text-left">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5 text-left text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5a5eff]/20 focus:border-[#5a5eff] transition-all"
                    required
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5a5eff]/20 focus:border-[#5a5eff] transition-all"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5a5eff] hover:bg-[#494cff] text-white py-2.5 rounded-xl font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify &amp; Enter Console</span>
                </button>
              </form>
            </div>
          )
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f5f7]">
            
            {/* Mobile Tab Dropdown for Phones */}
            <div className="md:hidden bg-white border-b border-slate-200 p-2.5 flex items-center gap-2 shrink-0">
              <label htmlFor="admin-mobile-tab-select" className="text-xs font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1">
                <Activity className="w-4 h-4 text-[#5a5eff]" />
                <span>Section:</span>
              </label>
              <select
                id="admin-mobile-tab-select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5a5eff]"
              >
                <option value="live_traffic">🟢 Realtime Live Users ({liveTrafficData.liveCount} Online)</option>
                <option value="overview">📊 Stats &amp; Overview</option>
                <option value="nationalists">🇮🇳 Nationalist Creators ({nationalists.length})</option>
                <option value="spotlight">🎬 Media Spotlight</option>
                <option value="entities">🗂️ Manage Propagandus ({entities.length})</option>
                <option value="shield">⚔️ Patriot Shield ({shieldData.attempts?.length || 0})</option>
                <option value="reports">⚠️ User Reports Queue ({reports.filter(r => r.status === 'pending').length})</option>
                <option value="security">🛡️ Anti-DDoS &amp; IP Bans ({securityData.blockedIps?.length || 0})</option>
                <option value="backup">💾 Safe Backup &amp; Restore</option>
                <option value="broadcast">📢 Screen Broadcast</option>
                <option value="posts">📝 Bulletins &amp; Posts ({adminPosts.length})</option>
                <option value="users_ips">🌐 User IPs &amp; Defense ({usersIpsData.uniqueIps?.length || 0})</option>
                <option value="govt_poll">🗳️ The Govt 2029 Poll ({govtPoll?.totalVotes || 0})</option>
                <option value="playlist">🎵 Songs Playlist ({playlistTracks.length})</option>
                <option value="community">💬 Community &amp; Influencer Review ({communityData?.influencerQueries?.length || 0} Requests)</option>
                <option value="bulletin">📢 Live Bulletin</option>
                <option value="credentials">🔒 Admin Credentials</option>
              </select>
            </div>

            {/* Desktop / Tablet Tab Buttons (Smooth Dribbble Pill Style) */}
            <div className="hidden md:flex bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 py-2.5 flex-wrap gap-1.5 text-xs font-medium shrink-0 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('live_traffic')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'live_traffic'
                    ? 'bg-[#5a5eff] text-white shadow-sm font-semibold'
                    : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>🟢 Live Users ({liveTrafficData.liveCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-[#5a5eff] text-white shadow-sm font-semibold'
                    : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                📊 Stats &amp; Overview
              </button>

              <button
                onClick={() => setActiveTab('nationalists')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 relative ${
                  activeTab === 'nationalists'
                    ? 'bg-[#5a5eff] text-white shadow-sm font-semibold'
                    : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🇮🇳 Nationalist Creators ({nationalists.length})
                {nationalists.filter(n => n.status === 'pending').length > 0 && (
                  <span className="ml-1 bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                    {nationalists.filter(n => n.status === 'pending').length} New
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('spotlight')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'spotlight' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span>🎬 Media Spotlight</span>
                {spotlightForm.type !== 'off' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('entities')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'entities' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🗂️ Manage Propagandus ({entities.length})
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'categories' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🏷️ Categories ({categoriesList.length})
              </button>

              <button
                onClick={() => setActiveTab('shield')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'shield' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                ⚔️ Patriot Shield &amp; Violations ({shieldData.attempts?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 relative ${
                  activeTab === 'reports' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                ⚠️ User Reports Queue
                {reports.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-1 bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                    {reports.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'security' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🛡️ Anti-DDoS &amp; IP Bans ({securityData.blockedIps?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'backup' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                💾 Safe Backup &amp; Restore
              </button>

              <button
                onClick={() => setActiveTab('broadcast')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'broadcast' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span>📢 Screen Broadcast</span>
                {broadcastActive && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('posts')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'posts' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                📝 Bulletins &amp; Posts ({adminPosts.length})
              </button>

              <button
                onClick={() => setActiveTab('users_ips')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'users_ips' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🌐 User IPs &amp; Defense ({usersIpsData.uniqueIps?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('govt_poll')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'govt_poll' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🗳️ The Govt 2029 Poll ({govtPoll?.totalVotes || 0})
              </button>

              <button
                onClick={() => setActiveTab('playlist')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'playlist' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🎵 Songs Playlist ({playlistTracks.length})
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'community' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                💬 Community &amp; Influencers
                {(communityData?.influencerQueries?.filter(q => q.status !== 'approved').length > 0) && (
                  <span className="ml-1 bg-amber-500 text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {communityData.influencerQueries.filter(q => q.status !== 'approved').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('bulletin')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'bulletin' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                📢 Live Bulletin
              </button>

              <button
                onClick={() => setActiveTab('credentials')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'credentials' ? 'bg-[#5a5eff] text-white shadow-sm font-semibold' : 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                🔒 Admin Credentials
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50">
              
              {/* TAB 0: REALTIME LIVE USERS & VISITOR TRAFFIC */}
              {activeTab === 'live_traffic' && (
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-3 border-black p-4 sm:p-5 rounded-2xl shadow-pop flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-600 border-2 border-black rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                        <Activity className="w-7 h-7 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-comic text-xl sm:text-2xl text-black">
                            REALTIME LIVE USERS &amp; VISITOR RADAR
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Live
                          </span>
                        </div>
                        <p className="text-xs font-display text-gray-700 mt-0.5">
                          Instant tracking of online users, device types, operating systems, browsers, and detailed visit frequencies.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={fetchLiveTraffic}
                        className="px-3 py-1.5 bg-white hover:bg-gray-100 border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm active:translate-y-0.5"
                        title="Refresh live traffic data"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Live Data</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Live Online Users */}
                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Live Online Now</span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                      </div>
                      <div className="mt-2 font-comic text-3xl sm:text-4xl text-emerald-700 font-black flex items-baseline gap-2">
                        <span>{liveTrafficData.liveCount}</span>
                        <span className="text-xs font-mono font-bold text-gray-500 uppercase">Users</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-600 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>Active within last 3 mins</span>
                      </div>
                    </div>

                    {/* Total Unique Visitors */}
                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-chakraNavy tracking-wider">Unique Visitors</span>
                        <Users className="w-4 h-4 text-chakraNavy" />
                      </div>
                      <div className="mt-2 font-comic text-3xl sm:text-4xl text-chakraNavy font-black flex items-baseline gap-2">
                        <span>{liveTrafficData.totalUniqueVisitors}</span>
                        <span className="text-xs font-mono font-bold text-gray-500 uppercase">IPs</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-600 mt-1">
                        <span>Distinct visitors (1 per IP)</span>
                      </div>
                    </div>

                    {/* Total Site Visits */}
                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-saffron-dark tracking-wider">Total Site Visits</span>
                        <Activity className="w-4 h-4 text-saffron-dark" />
                      </div>
                      <div className="mt-2 font-comic text-3xl sm:text-4xl text-saffron-dark font-black flex items-baseline gap-2">
                        <span>{liveTrafficData.totalVisits}</span>
                        <span className="text-xs font-mono font-bold text-gray-500 uppercase">Hits</span>
                      </div>
                      <div className="text-[11px] font-bold text-gray-600 mt-1">
                        <span>All visits across all users</span>
                      </div>
                    </div>

                    {/* Devices Breakdown */}
                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop">
                      <div className="text-[10px] font-black uppercase text-gray-700 tracking-wider mb-2">Device Breakdown</div>
                      <div className="space-y-1.5 text-xs font-mono font-bold">
                        <div className="flex items-center justify-between text-gray-800">
                          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-blue-600" /> Mobile:</span>
                          <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-black">{liveTrafficData.deviceBreakdown?.mobile || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-800">
                          <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5 text-purple-600" /> Desktop:</span>
                          <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-black">{liveTrafficData.deviceBreakdown?.desktop || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-800">
                          <span className="flex items-center gap-1"><Tablet className="w-3.5 h-3.5 text-amber-600" /> Tablet:</span>
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">{liveTrafficData.deviceBreakdown?.tablet || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visitors Detailed List */}
                  <div className="bg-white border-3 border-black p-4 sm:p-5 rounded-2xl shadow-pop">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h4 className="font-comic text-lg sm:text-xl text-black uppercase flex items-center gap-2">
                          <span>Detailed Visitor Directory</span>
                          <span className="bg-gray-100 border border-black text-xs font-mono px-2 py-0.5 rounded-full">
                            {liveTrafficData.visitors?.length || 0} Records
                          </span>
                        </h4>
                        <p className="text-xs font-display text-gray-600">
                          Live status, device info, visit frequency per IP, and anti-tamper blocking controls.
                        </p>
                      </div>
                    </div>

                    {/* Mobile Card View (hidden on md and larger) */}
                    <div className="md:hidden space-y-3">
                      {liveTrafficData.visitors?.length === 0 ? (
                        <div className="p-6 text-center text-xs font-mono text-gray-500">
                          No visitor traffic recorded yet.
                        </div>
                      ) : (
                        liveTrafficData.visitors?.map((v, idx) => (
                          <div
                            key={idx}
                            className={`border-2 border-black rounded-xl p-3 space-y-2 ${
                              v.is_online ? 'bg-emerald-50/60' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {v.is_online ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> ONLINE
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded">
                                    OFFLINE
                                  </span>
                                )}
                                <span className="font-mono font-bold text-xs text-black">{v.ip}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-yellow-100 border border-black text-black text-[10px] font-black rounded-full">
                                {v.visit_count} {v.visit_count === 1 ? 'Visit' : 'Visits'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-gray-700">
                              <div>
                                <span className="font-bold text-gray-500">Device: </span>
                                <span className="font-black text-black">{v.device_type || 'Unknown'}</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-500">OS/Browser: </span>
                                <span className="font-semibold text-black">{v.os || 'OS'} / {v.browser || 'Browser'}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="font-bold text-gray-500">Page: </span>
                                <span className="font-semibold text-chakraNavy">{v.current_page || 'Homepage'}</span>
                              </div>
                              <div className="col-span-2 text-[10px] text-gray-500">
                                <span>Last seen: {new Date(v.last_seen).toLocaleTimeString()} ({new Date(v.last_seen).toLocaleDateString()})</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                              {v.is_blocked ? (
                                <button
                                  onClick={() => handleUnblockIp(v.ip)}
                                  className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-black border border-black rounded text-[10px] font-black uppercase"
                                >
                                  Unblock IP
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDirectBlockIp(v.ip)}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white border border-black rounded text-[10px] font-black uppercase"
                                >
                                  Block IP
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Desktop Table View (hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs font-display">
                        <thead className="bg-gray-100 border-b-2 border-black text-gray-700 font-black uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Status</th>
                            <th className="p-3">Client IP Address</th>
                            <th className="p-3">Device / OS / Browser</th>
                            <th className="p-3 text-center">Visit Count</th>
                            <th className="p-3">Current Page</th>
                            <th className="p-3">Last Seen</th>
                            <th className="p-3 text-right">Defense Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 font-mono text-xs">
                          {liveTrafficData.visitors?.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="p-6 text-center text-gray-500 font-mono">
                                No visitor traffic recorded yet.
                              </td>
                            </tr>
                          ) : (
                            liveTrafficData.visitors?.map((v, idx) => (
                              <tr key={idx} className={`hover:bg-gray-50 ${v.is_online ? 'bg-emerald-50/40' : ''}`}>
                                <td className="p-3">
                                  {v.is_online ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                      ONLINE
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded">
                                      OFFLINE
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 font-bold text-black flex items-center gap-2">
                                  <span>{v.ip}</span>
                                  {v.is_blocked && (
                                    <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase">
                                      BLOCKED
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1.5 text-xs">
                                    {v.device_type === 'Mobile' ? (
                                      <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    ) : v.device_type === 'Tablet' ? (
                                      <Tablet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    ) : (
                                      <Monitor className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                    )}
                                    <span className="font-bold text-black">{v.device_type}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-700">{v.os}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600">{v.browser}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="inline-block px-2.5 py-0.5 bg-yellow-100 border border-black font-black text-black rounded-full text-xs">
                                    {v.visit_count} {v.visit_count === 1 ? 'time' : 'times'}
                                  </span>
                                </td>
                                <td className="p-3 font-sans font-bold text-chakraNavy text-xs">
                                  {v.current_page || 'Homepage'}
                                </td>
                                <td className="p-3 text-[11px] text-gray-600">
                                  {new Date(v.last_seen).toLocaleTimeString()} ({new Date(v.last_seen).toLocaleDateString()})
                                </td>
                                <td className="p-3 text-right">
                                  {v.is_blocked ? (
                                    <button
                                      onClick={() => handleUnblockIp(v.ip)}
                                      className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-black border border-black rounded text-[10px] font-black uppercase shadow-sm"
                                    >
                                      Unblock
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleDirectBlockIp(v.ip)}
                                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white border border-black rounded text-[10px] font-black uppercase shadow-sm"
                                    >
                                      Block IP
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Realtime Access Traffic Logs Stream */}
                  <div className="bg-white border-3 border-black p-4 sm:p-5 rounded-2xl shadow-pop">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-comic text-lg sm:text-xl text-black uppercase">
                          Recent Traffic Access Logs
                        </h4>
                        <p className="text-xs font-display text-gray-600">
                          Complete recorded history of every page hit and visitor request.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-gray-100 border border-black rounded-lg text-xs font-mono font-bold">
                        Last {liveTrafficData.recentLogs?.length || 0} Hits
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto border-2 border-black rounded-xl divide-y divide-gray-200">
                      {liveTrafficData.recentLogs?.length === 0 ? (
                        <div className="p-4 text-center text-xs font-mono text-gray-500">
                          No access logs recorded yet.
                        </div>
                      ) : (
                        liveTrafficData.recentLogs?.map((log) => (
                          <div key={log.id} className="p-2.5 sm:p-3 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded font-bold">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </span>
                              <span className="font-bold text-black">{log.ip}</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-900 rounded font-black">
                                {log.device_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-gray-600">
                              <span>Page: <strong className="text-chakraNavy">{log.page || 'Home'}</strong></span>
                              <span>{log.os} / {log.browser}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracked Propagandus</span>
                        <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                          <Ban className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{stats.totalEntities}</div>
                      <div className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                        <span>✓ {stats.verifiedEntities} Verified</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nationalist Creators</span>
                        <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          <Award className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{stats.totalNationalists || nationalists.filter(n => n.status === 'approved').length}</div>
                      <div className="text-[11px] font-semibold text-amber-600 mt-2 flex items-center gap-1">
                        <span>⏳ {nationalists.filter(n => n.status === 'pending').length} Pending Approval</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Citizen Reports</span>
                        <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{stats.totalReports}</div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-2">Pending moderation queue</div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blacklisted IPs</span>
                        <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          <ShieldAlert className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-slate-900">{stats.blockedIps}</div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-2">Protected by Shield</div>
                    </div>
                  </div>

                  {/* Quick Action Banner */}
                  <div className="bg-white border border-slate-200/80 p-5 sm:p-6 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Admin Master Actions</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quickly add verified entries or review community submissions in real-time.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => setIsDirectAddNatOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Direct Add Nationalist</span>
                      </button>
                      <button
                        onClick={() => setIsDirectAddPropOpen(true)}
                        className="bg-[#5a5eff] hover:bg-[#494cff] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Direct Add Propagandu</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity Mini-Feed */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-chakraNavy" />
                      <h4 className="font-display font-black text-sm uppercase text-black">
                        Recent System & Security Logs
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-56 overflow-y-auto text-xs font-mono">
                      {(securityData?.logs || []).slice(0, 8).map(log => (
                        <div key={log.id} className="py-2 flex items-center justify-between">
                          <span className="font-bold text-gray-800">[{log.action}] {log.details}</span>
                          <span className="text-[10px] text-gray-500">{new Date(log.created_at).toLocaleTimeString()} ({log.ip})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NATIONALIST INFLUENCERS (REVIEW & APPROVE QUEUE) */}
              {activeTab === 'nationalists' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-comic text-2xl text-black">NATIONALIST CREATORS DIRECTORY & QUEUE</h3>
                      <p className="text-xs text-gray-600 font-display">
                        Review community suggestions, approve them to go live, edit votes, or directly add creators.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsDirectAddNatOpen(true)}
                        className="px-4 py-2 bg-tirangaGreen text-white border-2 border-black rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-pop-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Direct Add Creator</span>
                      </button>
                      <button
                        onClick={loadAllAdminData}
                        className="px-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-bold flex items-center gap-1 shadow-pop-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                          <tr>
                            <th className="p-3.5">Avatar</th>
                            <th className="p-3.5">Creator Name</th>
                            <th className="p-3.5">Attached Social Profiles (Click to Inspect)</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Votes</th>
                            <th className="p-3.5 text-right">Moderation Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(nationalists || []).length === 0 ? (
                            <tr>
                              <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                                No nationalist creators found. Use "Direct Add Creator" above.
                              </td>
                            </tr>
                          ) : (
                            (nationalists || []).map(item => {
                            const isPending = item.status === 'pending';
                            const ytUrl = resolveSocialUrl(item.handle_yt, 'yt');
                            const xUrl = resolveSocialUrl(item.handle_x, 'x');
                            const instaUrl = resolveSocialUrl(item.handle_insta, 'insta');
                            const otherUrl = item.other_links ? resolveSocialUrl(item.other_links, 'other') : null;
                            const primaryUrl = ytUrl || xUrl || instaUrl || otherUrl;

                            return (
                              <tr key={item.id} className={isPending ? 'bg-amber-50/50 font-medium' : 'hover:bg-slate-50/60 transition-colors'}>
                                <td className="p-3.5">
                                  <img
                                    src={item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name)}`}
                                    alt=""
                                    className="w-10 h-10 rounded-xl border border-slate-200 object-cover bg-white shadow-xs"
                                  />
                                </td>
                                <td className="p-3.5">
                                  <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                                </td>
                                <td className="p-3.5">
                                  <div className="flex flex-col gap-1.5">
                                    {ytUrl && (
                                      <a
                                        href={ytUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-medium transition-all w-fit group"
                                        title="Click to open YouTube Channel in new tab"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                        <span>YouTube: {item.handle_yt}</span>
                                        <ExternalLink className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                      </a>
                                    )}
                                    {xUrl && (
                                      <a
                                        href={xUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-medium transition-all w-fit group"
                                        title="Click to open X Profile in new tab"
                                      >
                                        <span className="font-bold text-[10px]">𝕏</span>
                                        <span>@{item.handle_x.replace(/^@/, '')}</span>
                                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                      </a>
                                    )}
                                    {instaUrl && (
                                      <a
                                        href={instaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-lg text-[11px] font-medium transition-all w-fit group"
                                        title="Click to open Instagram Profile in new tab"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]"></span>
                                        <span>IG: @{item.handle_insta.replace(/^@/, '')}</span>
                                        <ExternalLink className="w-3 h-3 text-pink-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                      </a>
                                    )}
                                    {otherUrl && (
                                      <a
                                        href={otherUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-[11px] font-medium transition-all w-fit group"
                                        title="Click to open attached URL"
                                      >
                                        <Globe className="w-3 h-3 text-sky-600" />
                                        <span className="truncate max-w-[150px]">{item.other_links}</span>
                                        <ExternalLink className="w-3 h-3 text-sky-500" />
                                      </a>
                                    )}
                                    {primaryUrl && (
                                      <a
                                        href={primaryUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#5a5eff] hover:bg-[#494cff] text-white rounded-lg text-[11px] font-semibold shadow-xs transition-all w-fit mt-0.5"
                                        title="Direct click to inspect user attached profile"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>🌐 Direct Check Page</span>
                                      </a>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium text-[11px]">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase border ${
                                    item.status === 'approved'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : item.status === 'rejected'
                                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                  }`}>
                                    {item.status === 'approved' ? '✓ Approved' : item.status === 'rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                                  </span>
                                </td>
                                <td className="p-3.5 font-mono font-medium">
                                  <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200 text-xs">
                                    ▲ {item.upvotes || 0}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                  {isPending && (
                                    <>
                                      <button
                                        onClick={() => handleApproveNationalist(item.id, item.name)}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-all"
                                        title="Approve to make live"
                                      >
                                        ✓ Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectNationalist(item.id, item.name)}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-all"
                                        title="Reject suggestion"
                                      >
                                        ✕ Discard
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => setEditingNationalist({ ...item })}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 transition-all"
                                    title="Edit Details & Votes"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteNationalist(item.id, item.name)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 transition-all"
                                    title="Delete Entry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          }))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGE PROPAGANDUS */}
              {activeTab === 'entities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-comic text-2xl text-black">ALL TRACKED PROPAGANDUS</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsDirectAddPropOpen(true)}
                        className="px-4 py-2 bg-popRed text-white border-2 border-black rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-pop-sm"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Direct Add Profile</span>
                      </button>
                      <button
                        onClick={loadAllAdminData}
                        className="px-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-bold flex items-center gap-1 shadow-pop-sm"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border-3 border-black rounded-2xl overflow-hidden shadow-pop">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-display">
                        <thead className="bg-popYellow border-b-2 border-black text-black font-black uppercase text-[11px]">
                          <tr>
                            <th className="p-3">Profile</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Social Handles</th>
                            <th className="p-3">Party / Inst</th>
                            <th className="p-3">Votes</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                          {(entities || []).length === 0 ? (
                            <tr>
                              <td colSpan="7" className="p-8 text-center text-gray-500 font-bold">
                                No propagandus entities registered. System database is clean.
                              </td>
                            </tr>
                          ) : (
                            (entities || []).map(ent => (
                            <tr key={ent.id} className="hover:bg-orange-50/50">
                              <td className="p-3">
                                <img
                                  src={ent.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(ent.name)}`}
                                  alt=""
                                  className="w-9 h-9 rounded-lg border border-black object-cover bg-white"
                                />
                              </td>
                              <td className="p-3 font-bold text-black max-w-[150px] truncate">
                                {ent.name}
                                <div className="text-[10px] text-gray-500 font-mono truncate">{ent.id}</div>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-gray-700">
                                {ent.handle_x && <div>X: @{ent.handle_x}</div>}
                                {ent.handle_yt && <div>YT: {ent.handle_yt}</div>}
                                {ent.handle_insta && <div>IG: @{ent.handle_insta}</div>}
                              </td>
                              <td className="p-3 text-[11px]">
                                {ent.party && <div className="text-red-700 font-bold truncate max-w-[150px]">{ent.party.split('–')[0]}</div>}
                                {ent.institution && <div className="text-amber-700 font-medium">{ent.institution}</div>}
                              </td>
                              <td className="p-3 font-mono font-bold">
                                <span className="bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full text-[11px]">
                                  ▲ {ent.upvotes || 0}
                                </span>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleVerify(ent.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${
                                    ent.is_verified === 1
                                      ? 'bg-green-100 text-green-900 border-green-700'
                                      : 'bg-gray-100 text-gray-700 border-gray-400'
                                  }`}
                                >
                                  {ent.is_verified === 1 ? '✓ Verified' : 'Unverified'}
                                </button>
                              </td>
                              <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setEditingEntity({ ...ent })}
                                  className="p-1.5 bg-yellow-100 hover:bg-yellow-200 border border-black rounded"
                                  title="Edit Entity & Votes"
                                >
                                  <Edit className="w-3.5 h-3.5 text-black" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEntity(ent.id, ent.name)}
                                  className="p-1.5 bg-red-100 hover:bg-red-200 border border-black rounded text-red-700"
                                  title="Delete Entity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          )))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CATEGORY MANAGEMENT */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bento-card p-5 bg-gradient-to-r from-orange-100 via-amber-50 to-green-100 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏷️</span>
                        <h3 className="font-comic text-2xl text-black">CATEGORY MANAGEMENT SYSTEM</h3>
                      </div>
                      <p className="font-display text-xs text-gray-700 font-bold mt-1">
                        Create, view, and manage dynamic categories for Nationalist Creators and Propagandist Profiles.
                      </p>
                    </div>

                    <button
                      onClick={loadCategories}
                      className="px-3.5 py-2 bg-white hover:bg-gray-50 border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Categories</span>
                    </button>
                  </div>

                  {/* Add New Category Form */}
                  <div className="bento-card p-5 bg-white border-2 border-black shadow-[3px_3px_0px_#000]">
                    <h4 className="font-comic text-lg text-black mb-3">➕ CREATE NEW CATEGORY</h4>
                    <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3">
                      <div className="w-full sm:w-56">
                        <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">Target Section</label>
                        <select
                          value={newCategoryType}
                          onChange={(e) => setNewCategoryType(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold"
                        >
                          <option value="nationalist">🇮🇳 Nationalist Creator</option>
                          <option value="propagandist">🚨 Propagandist Profile</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">Category Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Geopolitics, Defence, Satire, Foreign Media..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold"
                          required
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={creatingCategory || !newCategoryName.trim()}
                          className="w-full sm:w-auto px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000] disabled:opacity-50"
                        >
                          {creatingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                          <span>Add Category</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Dual Grid for Nationalist & Propagandist Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nationalist Categories */}
                    <div className="bento-card p-5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🇮🇳</span>
                          <h4 className="font-comic text-base text-black">NATIONALIST CATEGORIES</h4>
                        </div>
                        <span className="px-2 py-0.5 bg-tirangaGreen text-white text-xs font-mono font-bold rounded-md">
                          {categoriesList.filter(c => c.type === 'nationalist').length} Active
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {categoriesList.filter(c => c.type === 'nationalist').map((cat) => (
                          <div
                            key={cat.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border-2 border-black rounded-xl text-xs font-bold text-gray-900 shadow-[2px_2px_0px_#000]"
                          >
                            <span>{cat.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="text-red-600 hover:text-red-800 p-0.5 rounded hover:bg-red-100 transition-colors"
                              title="Delete category"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Propagandist Categories */}
                    <div className="bento-card p-5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🚨</span>
                          <h4 className="font-comic text-base text-black">PROPAGANDIST CATEGORIES</h4>
                        </div>
                        <span className="px-2 py-0.5 bg-popRed text-white text-xs font-mono font-bold rounded-md">
                          {categoriesList.filter(c => c.type === 'propagandist').length} Active
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {categoriesList.filter(c => c.type === 'propagandist').map((cat) => (
                          <div
                            key={cat.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border-2 border-black rounded-xl text-xs font-bold text-gray-900 shadow-[2px_2px_0px_#000]"
                          >
                            <span>{cat.name}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="text-red-600 hover:text-red-800 p-0.5 rounded hover:bg-red-100 transition-colors"
                              title="Delete category"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PATRIOT SHIELD & BLOCKED ATTEMPTS */}
              {activeTab === 'shield' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-comic text-2xl text-black">PATRIOTIC SHIELD AUDIT LOG</h3>
                      <p className="text-xs text-gray-600 font-display">
                        Hostile attempts to add national leadership (Modi Ji, Yogi Ji, Amit Shah, Ajit Doval, BJP) into the propaganda directory.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-700 bg-red-100 border border-red-300 px-3 py-1 rounded-full">
                      Total Intercepted: {(shieldData?.attempts || []).length}
                    </span>
                  </div>

                  <div className="bg-white border-3 border-black rounded-2xl overflow-hidden shadow-pop">
                    {(shieldData?.attempts || []).length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-500 font-bold">
                        No hostile attempts detected. Shield is active and standing guard.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {(shieldData?.attempts || []).map((att) => (
                          <div key={att.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-red-600 text-white px-2 py-0.5 rounded font-mono text-[10px] font-black">
                                  BLOCKED ATTEMPT
                                </span>
                                <span className="font-bold text-black text-sm">
                                  Target: "{att.attempted_name}"
                                </span>
                              </div>
                              <div className="text-gray-500 font-mono text-[11px]">
                                Offending IP: <strong className="text-red-700">{att.ip}</strong> • {new Date(att.created_at).toLocaleString()}
                              </div>
                              <div className="text-gray-600 font-display text-[11px]">
                                Details: {att.details}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setBlockIpInput(att.ip);
                                setBlockReasonInput(`Attempted hostile submission of national figure: ${att.attempted_name}`);
                                setActiveTab('security');
                              }}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-400 rounded-lg text-xs font-bold self-start sm:self-auto"
                            >
                              Manage / Blacklist IP
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: USER REPORTS QUEUE */}
              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-comic text-2xl text-black">USER ⚠️ MODERATION REPORTS</h3>
                    <span className="text-xs font-mono text-gray-500">
                      Total: {(reports || []).length} ({(reports || []).filter(r => r.status === 'pending').length} pending)
                    </span>
                  </div>

                  {(reports || []).length === 0 ? (
                    <div className="text-center py-12 bg-white border-2 border-black rounded-2xl p-6">
                      <CheckCircle className="w-10 h-10 text-tirangaGreen mx-auto mb-2" />
                      <p className="font-bold text-sm">No Pending Reports</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(reports || []).map(rep => (
                        <div
                          key={rep.id}
                          className={`p-4 border-3 border-black rounded-2xl bg-white shadow-pop flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                            rep.status === 'resolved' ? 'opacity-70 bg-gray-50' : ''
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-popRed text-white text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase">
                                {rep.report_type}
                              </span>
                              <span className="font-display font-black text-sm text-black">
                                Target: {rep.entity_name}
                              </span>
                              <span className="text-[10px] font-mono text-gray-500">
                                ({new Date(rep.created_at).toLocaleString()})
                              </span>
                            </div>
                            <p className="text-xs font-display text-gray-800 bg-yellow-50 p-2 border-l-2 border-black rounded">
                              "{rep.message}"
                            </p>
                            <div className="text-[10px] text-gray-500 font-mono">
                              Reported by IP: {rep.reported_by_ip || 'Unknown'} • Status: <strong className="uppercase">{rep.status}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {rep.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateReport(rep.id, 'resolved')}
                                  className="px-3 py-1.5 bg-tirangaGreen text-white text-xs font-bold border-2 border-black rounded-lg shadow-pop-sm"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleUpdateReport(rep.id, 'dismissed')}
                                  className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-bold border-2 border-black rounded-lg"
                                >
                                  Dismiss
                                </button>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-gray-500">
                                Handled ({rep.status})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ANTI-DDOS & IP SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-comic text-2xl text-black mb-1">IP ACCESS & ATTACK PREVENTION</h3>
                    <p className="text-xs font-display text-gray-600">
                      Prevent spam bots, scrapers, and malicious users from overloading the server.
                    </p>
                  </div>

                  {/* Manual IP Ban Box */}
                  <form onSubmit={handleBlockIp} className="p-4 bg-white border-3 border-black rounded-2xl shadow-pop flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="IP Address to ban (e.g. 192.168.1.1)..."
                      value={blockIpInput}
                      onChange={(e) => setBlockIpInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-mono font-bold"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Reason (e.g. Bot attack, spamming)..."
                      value={blockReasonInput}
                      onChange={(e) => setBlockReasonInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold"
                    />
                    <button
                      type="submit"
                      className="pop-btn bg-popRed text-white px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shrink-0"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Blacklist IP</span>
                    </button>
                  </form>

                  {/* Blocked IPs Table */}
                  <div className="bg-white border-3 border-black rounded-2xl overflow-hidden shadow-pop">
                    <div className="bg-popYellow border-b-2 border-black p-3 font-comic text-lg text-black">
                      CURRENTLY BLACKLISTED IPs ({(securityData?.blockedIps || []).length})
                    </div>
                    {(securityData?.blockedIps || []).length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-500 font-bold">
                        No active IP blocks. System operating smoothly.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {(securityData?.blockedIps || []).map(b => (
                          <div key={b.ip} className="p-3 flex items-center justify-between text-xs font-mono">
                            <div>
                              <strong className="text-red-700">{b.ip}</strong>
                              <span className="text-gray-500 ml-2">Reason: {b.reason}</span>
                            </div>
                            <button
                              onClick={() => handleUnblockIp(b.ip)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-black rounded text-[10px] font-bold"
                            >
                              Unblock IP
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-comic text-2xl text-black mb-1">SAFE REAL-TIME BACKUPS & RECOVERY</h3>
                    <p className="text-xs font-display text-gray-600">
                      Even if the database is attacked, all public submissions and nationalist creator data are saved to disk in real-time inside <code>v7/admin/om/backup</code>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 border-2 border-black rounded-xl bg-amber-50 space-y-3">
                      <h4 className="font-display font-black text-sm uppercase text-black">
                        1. Download Complete Database JSON Snapshot
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Instant offline backup containing all propagandus profiles, nationalist creators, and security logs.
                      </p>
                      <button
                        onClick={handleDownloadBackup}
                        className="pop-btn bg-saffron text-black px-4 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-2 w-full justify-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Backup JSON</span>
                      </button>
                    </div>

                    <div className="p-5 border-2 border-black rounded-xl bg-green-50 space-y-3">
                      <h4 className="font-display font-black text-sm uppercase text-black">
                        2. Restore Database from Archive
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Upload a previously saved snapshot to instantly restore all data in milliseconds.
                      </p>
                      <label className="pop-btn bg-tirangaGreen hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-2 w-full justify-center cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Upload & Restore Backup</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleRestoreFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: VISITOR SCREEN BROADCAST BANNER */}
              {activeTab === 'broadcast' && (
                <div className="space-y-6">
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📢</span>
                          <h3 className="font-comic text-2xl text-black">Live Visitor Screen Broadcast</h3>
                        </div>
                        <p className="text-xs text-gray-600 font-display font-bold mt-1">
                          Display custom urgent notices, patriotic alerts, or breaking announcements across the top of all visitors' screens in real-time.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border-2 border-black ${
                          broadcastActive ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {broadcastActive ? '🔴 LIVE ON WEBSITE' : '⚪ INACTIVE / HIDDEN'}
                        </span>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="mb-6">
                      <div className="text-[11px] font-mono font-black uppercase text-gray-500 mb-2 flex items-center gap-1.5">
                        <span>Live Preview (How visitors see this banner on their screens):</span>
                      </div>
                      <div className={`p-4 border-3 border-black rounded-2xl shadow-pop transition-all ${
                        broadcastType === 'alert'
                          ? 'bg-red-600 text-white'
                          : broadcastType === 'info'
                          ? 'bg-blue-600 text-white'
                          : 'bg-yellow-400 text-black'
                      }`}>
                        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl animate-bounce">📢</span>
                            <div>
                              <div className="font-mono text-xs font-black tracking-wider uppercase opacity-90">
                                {broadcastTitle || 'उद्घोषणा / ANNOUNCEMENT'}
                              </div>
                              <div className="font-display font-black text-sm sm:text-base leading-snug mt-0.5">
                                {broadcastMessage || 'Type your announcement message below to publish live...'}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-black/20 border border-black/30">
                            LIVE PREVIEW
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Broadcast Form */}
                    <form onSubmit={handleSaveBroadcast} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono font-black uppercase text-gray-700 mb-1">
                          Broadcast Title / Badge Label:
                        </label>
                        <input
                          type="text"
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          placeholder="e.g. 🔴 BREAKING ALERT / 📢 महत्वपूर्ण सूचना"
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-black uppercase text-gray-700 mb-1">
                          Custom Message for Visitors:
                        </label>
                        <textarea
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          placeholder="Type your message here to display across the website..."
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-black uppercase text-gray-700 mb-1">
                            Banner Color Scheme:
                          </label>
                          <select
                            value={broadcastType}
                            onChange={(e) => setBroadcastType(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                          >
                            <option value="warning">⚡ Pop Yellow (Attention / Official Notice)</option>
                            <option value="alert">🚨 Pop Red (Urgent / Breaking Alert)</option>
                            <option value="info">🇮🇳 Patriotic Blue (Information / General News)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-black uppercase text-gray-700 mb-1">
                            Visibility Status:
                          </label>
                          <div className="flex items-center gap-3 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                              <input
                                type="checkbox"
                                checked={broadcastActive}
                                onChange={(e) => setBroadcastActive(e.target.checked)}
                                className="w-4 h-4 rounded border-2 border-black text-saffron focus:ring-0"
                              />
                              <span>Active (Show banner to all website visitors)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={savingBroadcast}
                          className="pop-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-pop-sm"
                        >
                          {savingBroadcast ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>📢 Publish Broadcast to Users</span>}
                        </button>

                        {broadcastActive && (
                          <button
                            type="button"
                            onClick={handleDeactivateBroadcast}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 border-2 border-red-400 rounded-xl font-bold text-xs transition-all"
                          >
                            Deactivate & Remove from Screen
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 9: ADMIN POSTS & BULLETINS */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* Create New Post Form */}
                  <div className="bg-white border-3 border-black p-5 sm:p-6 rounded-2xl shadow-pop">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black">
                      <div className="w-8 h-8 rounded-lg bg-saffron border border-black flex items-center justify-center">
                        <Flame className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <h3 className="font-comic text-xl text-black uppercase">Publish Ground Intel &amp; Bulletin</h3>
                        <p className="text-[11px] font-bold text-gray-500">
                          Upload text, image, and official notices directly to the public home feed.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-display">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block font-black uppercase text-gray-700 mb-1">
                            Post Title / Headline *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 🚨 Ground Intel: Toolkit Networks Busted"
                            value={postForm.title}
                            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                            className="w-full px-3 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-black uppercase text-gray-700 mb-1">
                            Badge / Category
                          </label>
                          <select
                            value={postForm.badge}
                            onChange={(e) => setPostForm({ ...postForm, badge: e.target.value })}
                            className="w-full px-3 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold"
                          >
                            <option value="🚨 BREAKING ALERT">🚨 BREAKING ALERT</option>
                            <option value="🇮🇳 NATIONAL DISPATCH">🇮🇳 NATIONAL DISPATCH</option>
                            <option value="⚡ DEBUNKED">⚡ DEBUNKED</option>
                            <option value="📢 ANNOUNCEMENT">📢 ANNOUNCEMENT</option>
                            <option value="🔥 VIRAL EXPOSED">🔥 VIRAL EXPOSED</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Upload / URL */}
                      <div>
                        <label className="block font-black uppercase text-gray-700 mb-1">
                          Cover Image (URL or Upload Image File)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg (or upload below)"
                            value={postForm.image_url}
                            onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })}
                            className="flex-1 px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-medium"
                          />
                          <label className="bento-btn bg-white hover:bg-gray-100 text-black px-4 py-2 border-2 border-black rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-pop-sm">
                            <ImageIcon className="w-4 h-4 text-saffron" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 3 * 1024 * 1024) {
                                    alert('Image must be under 3MB');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setPostForm({ ...postForm, image_url: reader.result });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {postForm.image_url && (
                          <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border-2 border-black">
                            <img src={postForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Content Message */}
                      <div>
                        <label className="block font-black uppercase text-gray-700 mb-1">
                          Message / Bulletin Content *
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Write the full message, official evidence, intelligence points, or announcement..."
                          value={postForm.content}
                          onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                          className="w-full p-3 bg-gray-50 border-2 border-black rounded-xl font-medium"
                        />
                      </div>

                      {/* Pin to Top Checkbox */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="pinPost"
                          checked={postForm.is_pinned}
                          onChange={(e) => setPostForm({ ...postForm, is_pinned: e.target.checked })}
                          className="w-4 h-4 accent-saffron border-2 border-black rounded"
                        />
                        <label htmlFor="pinPost" className="font-bold text-gray-800 cursor-pointer flex items-center gap-1">
                          <Pin className="w-3.5 h-3.5" />
                          <span>Pin to top of public homepage feed</span>
                        </label>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={savingPost}
                          className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-pop-sm"
                        >
                          {savingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4 text-black" />}
                          <span>Publish Bulletin to Site</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Posts Management */}
                  <div className="bg-white border-3 border-black p-5 sm:p-6 rounded-2xl shadow-pop">
                    <h3 className="font-comic text-xl text-black uppercase mb-4">
                      Active Bulletins &amp; Posts ({adminPosts.length})
                    </h3>

                    <div className="space-y-3">
                      {adminPosts.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 bg-gray-50 border-2 border-black rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-pop-sm"
                        >
                          <div className="flex items-start gap-3">
                            {p.image_url && (
                              <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover border border-black shrink-0" />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black uppercase">
                                  {p.badge}
                                </span>
                                {p.is_pinned === 1 && (
                                  <span className="px-2 py-0.5 bg-[#FFE600] text-black border border-black rounded text-[9px] font-black uppercase flex items-center gap-1">
                                    <Pin className="w-2.5 h-2.5" /> Pinned
                                  </span>
                                )}
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {new Date(p.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <h4 className="font-comic text-base text-black uppercase">{p.title}</h4>
                              <p className="text-xs text-gray-700 line-clamp-1 mt-0.5">{p.content}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="text-xs font-mono font-bold text-gray-600 px-2 py-1 bg-white border rounded">
                              ❤️ {p.likes || 0}
                            </span>
                            <button
                              onClick={() => handleDeletePost(p.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-800 border-2 border-red-400 rounded-xl transition-all"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


              {/* TAB 11: USER IPS & DEFENSE INTELLIGENCE */}
              {activeTab === 'users_ips' && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop">
                      <div className="text-[10px] uppercase font-black text-gray-500">Tracked Active Visitor IPs</div>
                      <div className="font-comic text-3xl text-chakraNavy">{usersIpsData.uniqueIps?.length || 0}</div>
                      <div className="text-[11px] font-bold text-gray-600 mt-1">Unique IP Addresses</div>
                    </div>

                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop">
                      <div className="text-[10px] uppercase font-black text-gray-500">Blacklisted / Blocked IPs</div>
                      <div className="font-comic text-3xl text-popRed">{usersIpsData.blockedIps?.length || 0}</div>
                      <div className="text-[11px] font-bold text-red-700 mt-1">403 Forbidden Shield</div>
                    </div>

                    <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-pop">
                      <div className="text-[10px] uppercase font-black text-gray-500">Security Events Logged</div>
                      <div className="font-comic text-3xl text-tirangaGreen">{usersIpsData.recentActivity?.length || 0}</div>
                      <div className="text-[11px] font-bold text-gray-600 mt-1">Automated Defense Actions</div>
                    </div>
                  </div>

                  {/* Unique IPs Table */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop">
                    <h3 className="font-comic text-xl text-black uppercase mb-3">
                      Recent Visitor IPs &amp; Status
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-display">
                        <thead className="bg-gray-100 border-b-2 border-black text-gray-700 font-black uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Client IP Address</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Nationalist Suggestions</th>
                            <th className="p-3 text-center">Propagandus Requests</th>
                            <th className="p-3 text-center">Reports</th>
                            <th className="p-3">Last Seen</th>
                            <th className="p-3 text-right">Shield Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {usersIpsData.uniqueIps?.map((u, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-3 font-mono font-bold text-black">{u.ip}</td>
                              <td className="p-3">
                                {u.isBlocked ? (
                                  <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black uppercase">
                                    BLACKLISTED
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400 rounded text-[10px] font-bold">
                                    ACTIVE
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <span className="font-mono font-bold px-2.5 py-0.5 bg-orange-100 text-tirangaOrange rounded text-[11px] border border-orange-200">
                                  {u.nationalistSuggestions || 0}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="font-mono font-bold px-2.5 py-0.5 bg-red-100 text-red-700 rounded text-[11px] border border-red-200">
                                  {u.propagandusSubmissions || 0}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="font-mono font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[11px] border border-amber-200">
                                  {u.reportsCount || 0}
                                </span>
                              </td>
                              <td className="p-3 text-gray-600 font-mono text-[11px]">
                                {u.lastSeen ? (u.lastSeen === 'Recent' ? 'Recent' : new Date(u.lastSeen).toLocaleString()) : 'Recent'}
                              </td>
                              <td className="p-3 text-right space-x-1">
                                {u.isBlocked ? (
                                  <button
                                    onClick={() => handleUnblockIpAddress(u.ip)}
                                    className="px-2.5 py-1 bg-green-100 hover:bg-green-200 text-tirangaGreen border border-tirangaGreen rounded font-bold text-[11px] transition-all"
                                  >
                                    Unblock IP
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDirectBlockIp(u.ip)}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded font-black text-[11px] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                                    title="Block IP permanently"
                                  >
                                    🛡️ Block IP
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Security Activity Logs */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop">
                    <h3 className="font-comic text-xl text-black uppercase mb-3">
                      Real-Time Security Activity Stream
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {usersIpsData.recentActivity?.map((act, i) => (
                        <div key={i} className="p-2.5 bg-gray-50 border border-black/20 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-chakraNavy mr-2">[{act.action}]</span>
                            <span className="text-gray-800 font-medium">{act.details}</span>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <span className="font-mono text-[10px] text-gray-500 block">{act.ip}</span>
                            <span className="text-[10px] text-gray-400">{new Date(act.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 12: THE GOVT 2029 POLL CONTROLS */}
              {activeTab === 'govt_poll' && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop bg-gradient-to-br from-orange-50 to-white">
                      <div className="text-[10px] uppercase font-black text-gray-500">YES 👍 (Want BJP Back in 2029)</div>
                      <div className="font-comic text-4xl text-[#FF9933]">{govtPoll?.yesVotes?.toLocaleString() || 0}</div>
                      <div className="text-xs font-bold text-gray-600 mt-1">
                        {govtPoll?.totalVotes ? Math.round((govtPoll.yesVotes / govtPoll.totalVotes) * 100) : 0}% of all votes
                      </div>
                    </div>

                    <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop bg-gradient-to-br from-red-50 to-white">
                      <div className="text-[10px] uppercase font-black text-gray-500">NO 👎 (Do Not Want)</div>
                      <div className="font-comic text-4xl text-[#FF2A2A]">{govtPoll?.noVotes?.toLocaleString() || 0}</div>
                      <div className="text-xs font-bold text-gray-600 mt-1">
                        {govtPoll?.totalVotes ? Math.round((govtPoll.noVotes / govtPoll.totalVotes) * 100) : 0}% of all votes
                      </div>
                    </div>

                    <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop bg-gradient-to-br from-blue-50 to-white">
                      <div className="text-[10px] uppercase font-black text-gray-500">Total Mandate Votes Cast</div>
                      <div className="font-comic text-4xl text-chakraNavy">{govtPoll?.totalVotes?.toLocaleString() || 0}</div>
                      <div className="text-xs font-bold text-gray-600 mt-1">
                        Strict 1-Vote-Per-IP Enforced
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-pop">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-black">
                      <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-xl shadow-pop-sm">
                        🗳️
                      </div>
                      <div>
                        <h3 className="font-comic text-2xl text-black uppercase">
                          The Govt: 2029 Mega Mandate Poll Manager
                        </h3>
                        <p className="text-xs font-bold text-gray-600">
                          Question: <span className="font-black text-black">"Do you want BJP / NDA back in 2029?"</span>
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveGovtPoll} className="space-y-5 text-xs font-display">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-orange-50 border-2 border-black rounded-xl">
                          <label className="block font-black uppercase text-gray-800 mb-1 flex items-center justify-between">
                            <span>YES Votes (👍 Up)</span>
                            <span className="text-[10px] font-bold text-saffron-dark">Option 1</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={pollYesInput}
                            onChange={(e) => setPollYesInput(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-xl font-comic text-xl text-black font-black"
                            required
                          />
                          <div className="flex gap-2 mt-2">
                            {[100, 500, 1000].map(amt => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setPollYesInput(prev => (parseInt(prev, 10) || 0) + amt)}
                                className="px-2 py-1 bg-white hover:bg-orange-100 border border-black rounded text-[10px] font-black"
                              >
                                +{amt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-red-50 border-2 border-black rounded-xl">
                          <label className="block font-black uppercase text-gray-800 mb-1 flex items-center justify-between">
                            <span>NO Votes (👎 Down)</span>
                            <span className="text-[10px] font-bold text-red-700">Option 2</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={pollNoInput}
                            onChange={(e) => setPollNoInput(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-xl font-comic text-xl text-black font-black"
                            required
                          />
                          <div className="flex gap-2 mt-2">
                            {[50, 100, 500].map(amt => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setPollNoInput(prev => (parseInt(prev, 10) || 0) + amt)}
                                className="px-2 py-1 bg-white hover:bg-red-100 border border-black rounded text-[10px] font-black"
                              >
                                +{amt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 border-2 border-black rounded-xl text-xs text-gray-700">
                        <span className="font-black text-black uppercase">🛡️ Anti-Tamper Note:</span> You can override the public vote tallies here as Administrator. Visitor IP addresses will still be restricted from casting multiple votes from the frontend.
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={savingGovtPoll}
                          className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-pop-sm"
                        >
                          {savingGovtPoll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>Save &amp; Update Vote Tallies</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 13: MEDIA SPOTLIGHT CONTROLLER (VIDEO OF THE DAY / IMPORTANT IMAGE / OFF) */}
              {activeTab === 'spotlight' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center font-black text-2xl shadow-pop-sm ${
                        spotlightForm.type === 'video' ? 'bg-red-600 text-white' :
                        spotlightForm.type === 'image' ? 'bg-chakraNavy text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {spotlightForm.type === 'video' ? '🎬' : spotlightForm.type === 'image' ? '🖼️' : '⚪'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-black ${
                            spotlightForm.type === 'video' ? 'bg-red-600 text-white' :
                            spotlightForm.type === 'image' ? 'bg-chakraNavy text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            CURRENT STATUS: {spotlightForm.type.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-comic text-2xl text-black mt-0.5">
                          Media Spotlight Controller
                        </h3>
                        <p className="text-xs font-bold text-gray-600">
                          Controls the featured section displayed directly below Nationalist Creators on the Nationalist page.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveSpotlight}
                        disabled={savingSpotlight}
                        className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-pop-sm"
                      >
                        {savingSpotlight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Spotlight</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode Selector Radio Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Option 1: Turn OFF */}
                    <div
                      onClick={() => setSpotlightForm(prev => ({ ...prev, type: 'off' }))}
                      className={`p-4 rounded-2xl border-3 border-black cursor-pointer transition-all ${
                        spotlightForm.type === 'off'
                          ? 'bg-gray-200 shadow-pop ring-2 ring-black -translate-y-1'
                          : 'bg-white hover:bg-gray-50 shadow-pop-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-comic text-lg text-black">⚪ TURN OFF</span>
                        <input
                          type="radio"
                          name="spotlight_type"
                          checked={spotlightForm.type === 'off'}
                          onChange={() => setSpotlightForm(prev => ({ ...prev, type: 'off' }))}
                          className="accent-black w-4 h-4"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-600">
                        Section is completely hidden from the Nationalist Page. Nothing is displayed.
                      </p>
                    </div>

                    {/* Option 2: Video of the Day */}
                    <div
                      onClick={() => setSpotlightForm(prev => ({ ...prev, type: 'video' }))}
                      className={`p-4 rounded-2xl border-3 border-black cursor-pointer transition-all ${
                        spotlightForm.type === 'video'
                          ? 'bg-red-50 border-red-950 shadow-pop ring-2 ring-red-600 -translate-y-1'
                          : 'bg-white hover:bg-red-50/40 shadow-pop-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-comic text-lg text-red-700 flex items-center gap-1.5">
                          <Tv className="w-5 h-5 text-red-600" />
                          <span>VIDEO OF THE DAY</span>
                        </span>
                        <input
                          type="radio"
                          name="spotlight_type"
                          checked={spotlightForm.type === 'video'}
                          onChange={() => setSpotlightForm(prev => ({ ...prev, type: 'video' }))}
                          className="accent-red-600 w-4 h-4"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">
                        Plays YouTube video in custom clean player (720p/1080p, no clutter) + links creator channel.
                      </p>
                    </div>

                    {/* Option 3: Important Image */}
                    <div
                      onClick={() => setSpotlightForm(prev => ({ ...prev, type: 'image' }))}
                      className={`p-4 rounded-2xl border-3 border-black cursor-pointer transition-all ${
                        spotlightForm.type === 'image'
                          ? 'bg-blue-50 border-blue-950 shadow-pop ring-2 ring-chakraNavy -translate-y-1'
                          : 'bg-white hover:bg-blue-50/40 shadow-pop-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-comic text-lg text-chakraNavy flex items-center gap-1.5">
                          <ImageIcon className="w-5 h-5 text-chakraNavy" />
                          <span>IMPORTANT IMAGE</span>
                        </span>
                        <input
                          type="radio"
                          name="spotlight_type"
                          checked={spotlightForm.type === 'image'}
                          onChange={() => setSpotlightForm(prev => ({ ...prev, type: 'image' }))}
                          className="accent-chakraNavy w-4 h-4"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">
                        Displays an intelligence infographic, fact-check image, or critical photo notice with lightbox zoom.
                      </p>
                    </div>
                  </div>

                  {/* Form Fields: Only shown when video or image is selected */}
                  {spotlightForm.type !== 'off' && (
                    <form onSubmit={handleSaveSpotlight} className="bg-white border-3 border-black p-6 rounded-2xl shadow-pop space-y-5 text-xs font-display">
                      
                      {/* Section Title Configuration */}
                      <div className="p-4 bg-amber-50 border-2 border-black rounded-xl space-y-2">
                        <label className="block font-black uppercase text-gray-800">
                          Custom Title Suffix (Displayed after section name)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Exposing Deep Fake Propaganda on India's Borders"
                          value={spotlightForm.title}
                          onChange={(e) => setSpotlightForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-xl font-bold text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-saffron"
                        />
                        <div className="text-[11px] text-gray-600 font-semibold">
                          Preview on page: <span className="font-black text-black">
                            {spotlightForm.type === 'video' ? 'Video of the Day' : 'Important Image'} - {spotlightForm.title || '(Your Title)'}
                          </span>
                        </div>
                      </div>

                      {/* VIDEO MODE FIELDS */}
                      {spotlightForm.type === 'video' && (
                        <div className="space-y-4">
                          {/* YouTube URL with Auto-Fetch button */}
                          <div>
                            <label className="block font-black uppercase text-gray-800 mb-1 flex items-center justify-between">
                              <span>YouTube Video URL</span>
                              <span className="text-[10px] text-gray-500 font-mono">Any watch/shorts/youtu.be link</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                                value={spotlightForm.videoUrl}
                                onChange={(e) => setSpotlightForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                                className="flex-1 px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:bg-white focus:outline-none"
                                required
                              />
                              <button
                                type="button"
                                onClick={handleFetchYoutubeInfo}
                                disabled={fetchingYtInfo}
                                className="bento-btn bg-red-600 text-white hover:bg-red-700 px-4 py-2 text-xs uppercase font-black flex items-center justify-center gap-1.5 shadow-pop-sm shrink-0"
                              >
                                {fetchingYtInfo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                <span>Auto-Fetch Channel Info</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-black uppercase text-gray-800 mb-1">
                                YouTuber / Channel Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. The Sham Sharma Show, String, Open Letter"
                                value={spotlightForm.channelName}
                                onChange={(e) => setSpotlightForm(prev => ({ ...prev, channelName: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold focus:bg-white"
                                required
                              />
                            </div>

                            <div>
                              <label className="block font-black uppercase text-gray-800 mb-1">
                                YouTube Channel URL (for user support)
                              </label>
                              <input
                                type="url"
                                placeholder="https://youtube.com/@ChannelName"
                                value={spotlightForm.channelUrl}
                                onChange={(e) => setSpotlightForm(prev => ({ ...prev, channelUrl: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:bg-white"
                                required
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-red-50 border-2 border-black rounded-xl text-xs text-gray-700">
                            <span className="font-black text-black">🎥 Player Features:</span> The video player on the Nationalist Page will automatically play in adaptive HD (720p - 1080p max), hiding standard YouTube watermark clutter and settings menus, while providing custom duration scrubbing and direct support links for the YouTuber.
                          </div>
                        </div>
                      )}

                      {/* IMAGE MODE FIELDS */}
                      {spotlightForm.type === 'image' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block font-black uppercase text-gray-800 mb-1">
                              Image URL or Direct Link
                            </label>
                            <input
                              type="url"
                              placeholder="https://example.com/infographic.jpg or upload below"
                              value={spotlightForm.imageUrl}
                              onChange={(e) => setSpotlightForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-black uppercase text-gray-800 mb-1">
                              Or Upload Image from Computer / Phone
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSpotlightImageUpload}
                              className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold focus:bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-2 file:border-black file:bg-[#FFE600] file:text-xs file:font-black"
                            />
                          </div>

                          <div>
                            <label className="block font-black uppercase text-gray-800 mb-1">
                              Image Caption / Context Notes (Optional)
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Add explanation or fact-check context to display beneath the image..."
                              value={spotlightForm.imageCaption}
                              onChange={(e) => setSpotlightForm(prev => ({ ...prev, imageCaption: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold focus:bg-white"
                            />
                          </div>

                          {spotlightForm.imageUrl && (
                            <div className="p-3 border-2 border-black rounded-xl bg-gray-50">
                              <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Preview:</div>
                              <img
                                src={spotlightForm.imageUrl}
                                alt="Preview"
                                className="max-h-48 rounded-lg object-contain border border-black/30"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-3 border-t-2 border-black">
                        <button
                          type="submit"
                          disabled={savingSpotlight}
                          className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-pop-sm"
                        >
                          {savingSpotlight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span>Save &amp; Publish to Nationalist Page</span>
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              )}

              {/* TAB 14: MUSIC PLAYLIST & INVIDIOUS SEARCH */}
              {activeTab === 'playlist' && (
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-green-600 text-black border-3 border-black p-5 rounded-2xl shadow-pop flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl border-2 border-black shadow-pop-sm">
                        <Disc3 className="w-8 h-8 text-black animate-spin" />
                      </div>
                      <div>
                        <h4 className="font-comic text-2xl text-black">
                          NATIONALIST PLAYLIST &amp; INVIDIOUS ENGINE
                        </h4>
                        <p className="text-xs font-black text-black/80 font-mono">
                          Search YouTube via Invidious API • Auto-plays songs for site visitors
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-black text-white font-mono font-black text-xs rounded-xl border border-black">
                        Total Songs: {playlistTracks.length}
                      </span>
                      <span className="px-3 py-1 bg-tirangaGreen text-white font-mono font-black text-xs rounded-xl border border-black">
                        Active: {playlistTracks.filter(t => t.is_active).length}
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Grid: Search Invidious vs Direct URL / Playlist Import */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Column 1: Invidious YouTube Search */}
                    <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-black pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔍</span>
                          <h5 className="font-comic text-lg uppercase text-black">
                            Search Songs (Invidious API)
                          </h5>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-black">
                          invidious.f5.si &amp; flokinet.to
                        </span>
                      </div>

                      <form onSubmit={handleSearchInvidious} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Aarambh Hai Prachand, Teri Mitti, Vande Mataram..."
                          value={invidiousSearchQuery}
                          onChange={(e) => setInvidiousSearchQuery(e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isSearchingInvidious}
                          className="bento-btn bg-saffron hover:bg-orange-400 text-black px-4 py-2 rounded-xl font-comic text-xs font-black uppercase flex items-center gap-1.5 shadow-pop-sm"
                        >
                          {isSearchingInvidious ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                          <span>Search</span>
                        </button>
                      </form>

                      {/* Invidious Search Results */}
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {invidiousResults.length === 0 && !isSearchingInvidious && (
                          <div className="p-6 text-center text-xs font-mono text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            Enter any song name, patriot track, or keyword above to search YouTube without API keys.
                          </div>
                        )}

                        {isSearchingInvidious && (
                          <div className="p-8 text-center text-xs font-mono font-bold text-gray-600 flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-saffron-dark" />
                            <span>Querying Invidious nodes...</span>
                          </div>
                        )}

                        {invidiousResults.map((v) => (
                          <div
                            key={v.videoId}
                            className="p-2.5 bg-gray-50 hover:bg-amber-50/70 border-2 border-black rounded-xl flex items-center justify-between gap-3 transition-all"
                          >
                            <img
                              src={v.thumbnailUrl || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                              alt={v.title}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
                              }}
                              className="w-14 h-10 object-cover rounded-lg border border-black bg-black shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-comic text-xs text-black truncate leading-tight">
                                {v.title}
                              </p>
                              <p className="text-[10px] text-gray-600 font-mono truncate">
                                {v.author} • {v.duration}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddSingleTrack(v)}
                              disabled={addingMusicId === v.videoId}
                              className="px-2.5 py-1.5 bg-white hover:bg-saffron text-black border-2 border-black rounded-lg font-comic text-xs font-black uppercase shrink-0 flex items-center gap-1 shadow-sm active:translate-y-0.5"
                            >
                              {addingMusicId === v.videoId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <PlusCircle className="w-3.5 h-3.5 text-saffron-dark" />
                              )}
                              <span>+ Add</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Direct Video / Playlist URL Import */}
                    <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-black pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔗</span>
                          <h5 className="font-comic text-lg uppercase text-black">
                            Direct Video or Playlist Import
                          </h5>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-black">
                          Bulk Playlist Support
                        </span>
                      </div>

                      <form onSubmit={handleFetchDirectMusicUrl} className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste YouTube video or playlist URL (e.g. list=PL...)"
                          value={directMusicUrl}
                          onChange={(e) => setDirectMusicUrl(e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isFetchingDirectMusic}
                          className="bento-btn bg-[#FFE600] hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-comic text-xs font-black uppercase flex items-center gap-1.5 shadow-pop-sm"
                        >
                          {isFetchingDirectMusic ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          <span>Fetch</span>
                        </button>
                      </form>

                      {/* Preview Box for Playlist / Single Video */}
                      {directMusicPreview && (
                        <div className="p-4 bg-amber-50 border-2 border-black rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs uppercase text-black">
                              {directMusicPreview.type === 'playlist' ? '📋 Playlist Detected' : '🎬 Single Video Detected'}
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-black">
                              {directMusicPreview.tracks?.length || 0} song(s)
                            </span>
                          </div>

                          {directMusicPreview.title && (
                            <h6 className="font-comic text-sm text-black">
                              {directMusicPreview.title}
                            </h6>
                          )}

                          {directMusicPreview.type === 'playlist' && (
                            <button
                              type="button"
                              onClick={() => handleAddPlaylistBulk(directMusicPreview.tracks)}
                              disabled={isFetchingDirectMusic}
                              className="w-full bento-btn bg-tirangaGreen hover:bg-green-700 text-white py-2.5 rounded-xl font-comic text-xs font-black uppercase flex items-center justify-center gap-2 shadow-pop-sm"
                            >
                              <Download className="w-4 h-4 text-popYellow" />
                              <span>📥 Import All {directMusicPreview.tracks.length} Songs to Site Playlist</span>
                            </button>
                          )}

                          {directMusicPreview.type === 'video' && directMusicPreview.tracks?.[0] && (
                            <button
                              type="button"
                              onClick={() => handleAddSingleTrack(directMusicPreview.tracks[0])}
                              className="w-full bento-btn bg-saffron hover:bg-orange-400 text-black py-2 rounded-xl font-comic text-xs font-black uppercase flex items-center justify-center gap-2 shadow-pop-sm"
                            >
                              <PlusCircle className="w-4 h-4" />
                              <span>Add Song to Site Playlist</span>
                            </button>
                          )}
                        </div>
                      )}

                      {!directMusicPreview && !isFetchingDirectMusic && (
                        <div className="p-6 text-center text-xs font-mono text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                          Paste a single video URL (`watch?v=...`) or full YouTube playlist URL (`playlist?list=...`) to import directly.
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Section 2: Current Active Website Playlist */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-black pb-3">
                      <div className="flex items-center gap-2">
                        <ListMusic className="w-5 h-5 text-saffron-dark" />
                        <h5 className="font-comic text-lg uppercase text-black">
                          Current Site Playlist ({playlistTracks.length} Songs)
                        </h5>
                      </div>
                      <button
                        onClick={loadPlaylistTracks}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-black rounded-lg font-mono text-xs font-bold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                    </div>

                    <div className="divide-y divide-gray-200 overflow-x-auto">
                      {playlistTracks.length === 0 ? (
                        <p className="py-8 text-center text-xs font-mono text-gray-500">
                          No songs in playlist. Add songs using Invidious search or playlist link above!
                        </p>
                      ) : (
                        playlistTracks.map((trk, i) => (
                          <div
                            key={trk.id}
                            className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors rounded-lg"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-6 font-mono font-black text-xs text-gray-500 text-center shrink-0">
                                #{i + 1}
                              </span>
                              <img
                                src={trk.thumbnail_url || `https://i.ytimg.com/vi/${trk.video_id}/hqdefault.jpg`}
                                alt={trk.title}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = `https://i.ytimg.com/vi/${trk.video_id}/hqdefault.jpg`;
                                }}
                                className="w-14 h-10 object-cover rounded-lg border border-black shrink-0 bg-black"
                              />
                              <div className="min-w-0">
                                <h6 className="font-comic text-xs text-black truncate leading-tight">
                                  {trk.title}
                                </h6>
                                <p className="text-[10px] text-gray-500 font-mono truncate">
                                  {trk.author || 'Artist'} • {trk.duration || '3:30'} • ID: {trk.video_id}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Toggle Active status */}
                              <button
                                onClick={() => handleToggleTrackActive(trk.id)}
                                className={`px-2.5 py-1 rounded-lg border border-black font-mono text-[10px] font-black uppercase transition-all ${
                                  trk.is_active ? 'bg-green-100 text-green-900 border-green-600' : 'bg-gray-200 text-gray-600'
                                }`}
                                title="Toggle Active / Inactive"
                              >
                                {trk.is_active ? 'Active' : 'Disabled'}
                              </button>

                              {/* External link preview */}
                              <a
                                href={`https://www.youtube.com/watch?v=${trk.video_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-black text-gray-700"
                                title="Open on YouTube"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeletePlaylistTrack(trk.id)}
                                className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-400 rounded-lg transition-all"
                                title="Delete Track"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 15: DATABASE-DRIVEN ADMIN CREDENTIALS */}
              {activeTab === 'credentials' && (
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-pop space-y-4">
                    <div className="flex items-center gap-3 border-b-2 border-black pb-3">
                      <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-black shadow-pop-sm">
                        <Key className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h4 className="font-comic text-xl text-black">
                          ADMIN CREDENTIALS (DATABASE-DRIVEN)
                        </h4>
                        <p className="text-xs text-gray-600 font-display">
                          Stored in MySQL / SQLite `admin_users` table • Zero static code credentials
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border-2 border-black rounded-xl text-xs font-mono text-gray-700">
                      <span className="font-black text-black uppercase">🔐 Security Policy:</span> Static passwords have been wiped from client source files and frontend code. Admin authentication runs entirely against the database table.
                    </div>

                    <form onSubmit={handleUpdateAdminCreds} className="space-y-4 font-display text-xs">
                      <div>
                        <label className="block font-black uppercase text-gray-800 mb-1">
                          New Administrator Email
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. example@gmail.com"
                          value={adminCredForm.new_email}
                          onChange={(e) => setAdminCredForm({ ...adminCredForm, new_email: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-black uppercase text-gray-800 mb-1">
                          New Administrator Password (min 6 characters)
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={adminCredForm.new_password}
                          onChange={(e) => setAdminCredForm({ ...adminCredForm, new_password: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:bg-white"
                          minLength={6}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={updatingCreds}
                        className="w-full bento-btn bg-saffron hover:bg-orange-400 text-black py-2.5 rounded-xl font-comic text-xs font-black uppercase flex items-center justify-center gap-2 shadow-pop-sm"
                      >
                        {updatingCreds ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Update Admin Credentials in Database</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 16: LIVE POP-ART BULLETIN BANNER */}
              {activeTab === 'bulletin' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-pop space-y-5">
                    <div className="flex items-center justify-between border-b-2 border-black pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center font-black shadow-pop-sm">
                          <Radio className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h4 className="font-comic text-xl text-black">
                            LIVE POP-ART BULLETIN BANNER
                          </h4>
                          <p className="text-xs text-gray-600 font-display">
                            Broadcasts live across the Main Homepage and Nationalist Page
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-600">Status:</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black border border-black ${
                            bulletinConfig.is_active ? 'bg-green-100 text-green-900' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {bulletinConfig.is_active ? '● LIVE' : '○ HIDDEN'}
                        </span>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono font-black uppercase text-gray-700">
                        👀 Live Banner Preview on Site:
                      </label>
                      <div className="bento-card bg-[#FFE600] border-3 border-black shadow-[4px_4px_0px_#000] p-3 rounded-xl relative overflow-hidden flex items-center gap-3">
                        <div className="overflow-hidden flex-1 font-display font-black text-xs text-black uppercase truncate tracking-wide">
                          {bulletinConfig.message || 'Enter your custom message below to preview live...'}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSaveBulletin} className="space-y-4 font-display text-xs">
                      {/* Toggle Active */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50 border-2 border-black rounded-xl">
                        <div>
                          <label className="font-comic text-sm font-black text-black block">
                            Enable Bulletin on Website
                          </label>
                          <p className="text-[11px] text-gray-600 font-mono">
                            When checked, this animated marquee bulletin broadcasts live on the Homepage.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!bulletinConfig.is_active}
                          onChange={(e) =>
                            setBulletinConfig({ ...bulletinConfig, is_active: e.target.checked ? 1 : 0 })
                          }
                          className="w-5 h-5 accent-saffron cursor-pointer"
                        />
                      </div>

                      {/* Custom Message */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-black uppercase text-gray-800">
                            Custom Bulletin Message (Broadcasts as seamless live ticker)
                          </label>
                          <span className="text-[10px] font-mono text-gray-500">
                            {bulletinConfig.message?.length || 0} characters
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Write the message that will scroll across the bulletin ticker..."
                          value={bulletinConfig.message || ''}
                          onChange={(e) => setBulletinConfig({ ...bulletinConfig, message: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl font-display font-bold text-xs focus:bg-white resize-y leading-relaxed"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingBulletin}
                        className="w-full bento-btn bg-[#FFE600] hover:bg-yellow-400 text-black py-2.5 rounded-xl font-comic text-xs font-black uppercase flex items-center justify-center gap-2 shadow-pop-sm"
                      >
                        {isSavingBulletin ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save &amp; Broadcast Bulletin Live</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 17: COMMUNITY & INFLUENCER MANAGEMENT */}
              {activeTab === 'community' && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  {/* Header Banner */}
                  <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-3 border-black p-5 rounded-2xl shadow-pop flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black text-[#FFE600] border-2 border-black flex items-center justify-center font-black shadow-pop-sm">
                        <MessageSquare className="w-6 h-6 text-[#FFE600]" />
                      </div>
                      <div>
                        <h3 className="font-comic text-xl text-black">COMMUNITY &amp; INFLUENCER VERIFICATION</h3>
                        <p className="text-xs text-gray-700 font-display">
                          Review submitted influencer proofs, grant official Golden / Blue ticks, audit users, and manage IP bans
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={loadAllAdminData}
                        className="bento-btn bg-white hover:bg-gray-100 text-black px-3.5 py-2 rounded-xl border-2 border-black shadow-pop-sm text-xs font-black flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Data</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border-2 border-black p-3.5 rounded-xl shadow-pop-sm">
                      <span className="text-[11px] font-black uppercase text-gray-500 block">Total Users</span>
                      <span className="font-comic text-2xl text-black">{communityData?.users?.length || 0}</span>
                    </div>
                    <div className="bg-amber-50 border-2 border-black p-3.5 rounded-xl shadow-pop-sm">
                      <span className="text-[11px] font-black uppercase text-amber-700 flex items-center gap-1">
                        <img src="/golden.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>Golden Ticks</span>
                      </span>
                      <span className="font-comic text-2xl text-amber-900">
                        {communityData?.users?.filter(u => u.verified_type === 'influencer').length || 0}
                      </span>
                    </div>
                    <div className="bg-sky-50 border-2 border-black p-3.5 rounded-xl shadow-pop-sm">
                      <span className="text-[11px] font-black uppercase text-sky-700 flex items-center gap-1">
                        <img src="/blue.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>Blue Ticks</span>
                      </span>
                      <span className="font-comic text-2xl text-sky-900">
                        {communityData?.users?.filter(u => u.verified_type === 'citizen' || u.verified_type === 'daily').length || 0}
                      </span>
                    </div>
                    <div className="bg-rose-50 border-2 border-black p-3.5 rounded-xl shadow-pop-sm">
                      <span className="text-[11px] font-black uppercase text-rose-700 block">Verification Proofs</span>
                      <span className="font-comic text-2xl text-rose-900">
                        {communityData?.influencerQueries?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Section 1: Influencer Verification Proof Submissions */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-black pb-3">
                      <div className="flex items-center gap-2">
                        <img src="/golden.png" alt="" className="w-6 h-6 object-contain" />
                        <div>
                          <h4 className="font-comic text-lg text-black">INFLUENCER VERIFICATION PROOF REQUESTS</h4>
                          <p className="text-[11px] text-gray-500 font-display">
                            Mandatory proof files (&lt;10MB image/video) submitted by creators requesting official Golden Tick
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#FFE600] text-black font-mono font-black text-xs px-2.5 py-1 rounded-full border border-black shadow-pop-sm">
                        {communityData?.influencerQueries?.length || 0} Submissions
                      </span>
                    </div>

                    {(!communityData?.influencerQueries || communityData.influencerQueries.length === 0) ? (
                      <div className="text-center py-8 text-gray-500 font-display text-xs bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No pending influencer verification requests at this moment.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {communityData.influencerQueries.map((q) => (
                          <div key={q.id} className="p-4 bg-amber-50/60 border-2 border-black rounded-xl shadow-pop-sm space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                              <div>
                                <span className="font-comic text-sm text-black uppercase">{q.name}</span>
                                <span className="ml-2 font-mono text-xs text-amber-800 font-bold">@{q.social_account_id || q.username || 'unknown'}</span>
                                {q.email && <span className="ml-2 text-[11px] text-gray-600">({q.email})</span>}
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">
                                {new Date(q.created_at).toLocaleString()} • IP: {q.ip || 'Recorded'}
                              </span>
                            </div>

                            <p className="text-xs text-gray-800 font-display whitespace-pre-wrap bg-white/80 p-2.5 rounded-lg border border-amber-200">
                              {q.message}
                            </p>

                            {/* Proof Preview */}
                            {q.proof_file && (
                              <div className="p-3 bg-white border border-black rounded-xl space-y-2">
                                <span className="text-[11px] font-black uppercase text-gray-700 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Attached Proof: {q.proof_file_name || 'Verification Document'}</span>
                                </span>
                                <div>
                                  {q.proof_file.startsWith('data:image') || q.proof_file.match(/\.(png|jpe?g|webp|gif)/i) ? (
                                    <div className="inline-block relative group">
                                      <img
                                        src={q.proof_file}
                                        alt="Proof attachment"
                                        className="max-h-48 rounded-lg border-2 border-black shadow-sm object-contain bg-slate-900"
                                      />
                                      <a
                                        href={q.proof_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1.5 text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" /> View full image in new tab
                                      </a>
                                    </div>
                                  ) : q.proof_file.startsWith('data:video') || q.proof_file.match(/\.(mp4|webm|mov)/i) ? (
                                    <video
                                      src={q.proof_file}
                                      controls
                                      className="max-h-56 rounded-lg border-2 border-black bg-black"
                                    />
                                  ) : (
                                    <a
                                      href={q.proof_file}
                                      download={q.proof_file_name || 'proof-file'}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-black rounded-lg text-xs font-bold text-black"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      Download Submitted Proof File
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                onClick={() => handleCommunityApproveInfluencer(q)}
                                className="bento-btn bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-1.5 rounded-lg border-2 border-black shadow-pop-sm text-xs font-black flex items-center gap-1.5"
                              >
                                <img src="/golden.png" alt="" className="w-4 h-4 object-contain" />
                                <span>Approve Golden Tick</span>
                              </button>

                              <button
                                onClick={() => handleCommunityToggleBadge(q.user_id, 'citizen')}
                                className="bento-btn bg-sky-400 hover:bg-sky-300 text-black px-3.5 py-1.5 rounded-lg border-2 border-black shadow-pop-sm text-xs font-black flex items-center gap-1.5"
                              >
                                <img src="/blue.png" alt="" className="w-4 h-4 object-contain" />
                                <span>Grant Blue Tick</span>
                              </button>

                              <button
                                onClick={() => handleCommunityBanUser(q.user_id, q.username || q.name)}
                                className="bento-btn bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-lg border-2 border-black shadow-pop-sm text-xs font-black flex items-center gap-1.5 ml-auto"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Ban Fake Profile &amp; Blacklist IP</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: User Directory & Badge Assignment */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
                      <div>
                        <h4 className="font-comic text-lg text-black">COMMUNITY USER DIRECTORY &amp; BADGE ASSIGNMENT</h4>
                        <p className="text-[11px] text-gray-500 font-display">
                          Assign Golden Tick, Blue Tick, or No Badge. Search by name, @username, or email to find and moderate or ban any user.
                        </p>
                      </div>
                      <div className="relative min-w-[240px] sm:min-w-[280px]">
                        <input
                          type="text"
                          placeholder="Search name, @username, email..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="w-full px-3 py-1.5 pl-8 border-2 border-black rounded-xl text-xs font-bold outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_#000]"
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                        {userSearchTerm && (
                          <button
                            type="button"
                            onClick={() => setUserSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-black"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b-2 border-black bg-gray-50 font-comic uppercase text-gray-700">
                            <th className="p-2.5">User</th>
                            <th className="p-2.5">Email &amp; Phone</th>
                            <th className="p-2.5">Current Badge</th>
                            <th className="p-2.5">Assign Badge</th>
                            <th className="p-2.5 text-right">Moderation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 font-display">
                          {(() => {
                            const filteredUsers = (communityData?.users || []).filter(u => {
                              if (!userSearchTerm) return true;
                              const term = userSearchTerm.toLowerCase().trim().replace(/^@/, '');
                              return (
                                (u.name || '').toLowerCase().includes(term) ||
                                (u.username || '').toLowerCase().includes(term) ||
                                (u.email || '').toLowerCase().includes(term) ||
                                (u.phone || '').toLowerCase().includes(term)
                              );
                            });

                            if (filteredUsers.length === 0) {
                              return (
                                <tr>
                                  <td colSpan="5" className="p-4 text-center text-gray-500 font-bold">
                                    {userSearchTerm ? `No community users matching "${userSearchTerm}".` : 'No registered community users found.'}
                                  </td>
                                </tr>
                              );
                            }

                            return filteredUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-gray-50/80">
                                <td className="p-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username)}`}
                                      alt=""
                                      className="w-9 h-9 rounded-full border border-black object-cover bg-gray-100"
                                    />
                                    <div>
                                      <div className="font-bold text-gray-900 flex items-center gap-1">
                                        <span>{u.name}</span>
                                        {u.verified_type === 'influencer' && (
                                          <img src="/golden.png" alt="Golden" title="Verified Influencer" className="w-3.5 h-3.5 object-contain inline" />
                                        )}
                                        {(u.verified_type === 'citizen' || u.verified_type === 'daily') && (
                                          <img src="/blue.png" alt="Blue" title="Verified Citizen" className="w-3.5 h-3.5 object-contain inline" />
                                        )}
                                      </div>
                                      <span className="text-[11px] font-mono text-gray-500">@{u.username}</span>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-2.5">
                                  <div className="font-mono text-[11px] text-gray-700">{u.email || '—'}</div>
                                  <div className="font-mono text-[10px] text-gray-500">{u.phone || '—'}</div>
                                </td>

                                <td className="p-2.5">
                                  {u.is_banned ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                                      🚫 BANNED
                                    </span>
                                  ) : u.verified_type === 'influencer' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300">
                                      <img src="/golden.png" alt="" className="w-3.5 h-3.5 object-contain" />
                                      Golden Tick
                                    </span>
                                  ) : (u.verified_type === 'citizen' || u.verified_type === 'daily') ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-black text-[10px] border border-sky-300">
                                      <img src="/blue.png" alt="" className="w-3.5 h-3.5 object-contain" />
                                      Blue Tick
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 font-medium text-[11px]">No Badge (Normal ID)</span>
                                  )}
                                </td>

                                <td className="p-2.5">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleCommunityToggleBadge(u.id, 'none')}
                                      title="Remove Badge"
                                      className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                        u.verified_type === 'none' || !u.verified_type
                                          ? 'bg-black text-white border-black'
                                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                      }`}
                                    >
                                      None
                                    </button>
                                    <button
                                      onClick={() => handleCommunityToggleBadge(u.id, 'citizen')}
                                      title="Grant Blue Tick"
                                      className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 ${
                                        u.verified_type === 'citizen' || u.verified_type === 'daily'
                                          ? 'bg-sky-400 text-black border-black font-black'
                                          : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                                      }`}
                                    >
                                      <img src="/blue.png" alt="" className="w-3 h-3 object-contain" />
                                      Blue
                                    </button>
                                    <button
                                      onClick={() => handleCommunityToggleBadge(u.id, 'influencer')}
                                      title="Grant Golden Tick"
                                      className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 ${
                                        u.verified_type === 'influencer'
                                          ? 'bg-amber-400 text-black border-black font-black'
                                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                      }`}
                                    >
                                      <img src="/golden.png" alt="" className="w-3 h-3 object-contain" />
                                      Golden
                                    </button>
                                  </div>
                                </td>

                                <td className="p-2.5 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleAdminImpersonate(u)}
                                    className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-black inline-flex items-center gap-1 shadow-xs mr-1 transition-colors"
                                    title={`Directly login as @${u.username} to view private channels, DMs, and chats`}
                                  >
                                    <Key className="w-3 h-3 text-indigo-600" />
                                    <span>Login as User</span>
                                  </button>
                                  {!u.is_admin && (
                                    <button
                                      onClick={() => handleCommunityBanUser(u.id, u.username)}
                                      className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[10px] font-bold inline-flex items-center gap-1"
                                    >
                                      <Ban className="w-3 h-3" />
                                      <span>Ban IP</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 3: Citizen Queries & Feedback */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-black pb-3">
                      <div>
                        <h4 className="font-comic text-lg text-black">CITIZEN QUERIES &amp; FEEDBACK</h4>
                        <p className="text-[11px] text-gray-500 font-display">
                          Direct inquiries submitted by users through the Support &amp; Contact modal
                        </p>
                      </div>
                      <span className="font-mono text-xs text-gray-500">
                        {communityData?.contactQueries?.length || 0} Inquiries
                      </span>
                    </div>

                    {(!communityData?.contactQueries || communityData.contactQueries.length === 0) ? (
                      <div className="text-center py-6 text-gray-500 font-display text-xs bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No user inquiries submitted yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {communityData.contactQueries.map((item) => (
                          <div key={item.id} className="p-3.5 bg-gray-50 border border-black rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-black">{item.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {new Date(item.created_at).toLocaleString()} • IP: {item.ip || 'Recorded'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 font-display whitespace-pre-wrap">{item.message}</p>
                            {item.proof_file && (
                              <div className="pt-1">
                                <a
                                  href={item.proof_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-blue-600 underline font-bold flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" /> View attached file
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 4: Channels Overview */}
                  <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-pop space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-black pb-3">
                      <div>
                        <h4 className="font-comic text-lg text-black">COMMUNITY CHANNELS</h4>
                        <p className="text-[11px] text-gray-500 font-display">
                          Active private and public channels created by users
                        </p>
                      </div>
                      <span className="font-mono text-xs text-gray-500">
                        {communityData?.channels?.length || 0} Channels
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(communityData?.channels || []).map((ch) => (
                        <div key={ch.id} className="p-3.5 bg-gray-50 border border-black rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-comic text-sm text-black">{ch.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                              {ch.is_private ? '🔒 Private' : '🌐 Public'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-display line-clamp-2">{ch.description}</p>
                          <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between pt-1 border-t border-gray-200">
                            <span>Created by: {ch.creator_name}</span>
                            <span>Members: {Array.isArray(ch.members) ? ch.members.length : 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal: Edit Propagandu Entity */}
        {editingEntity && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-pop-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h4 className="font-comic text-xl text-black">EDIT PROPAGANDU RECORD</h4>
                <button
                  onClick={() => setEditingEntity(null)}
                  className="p-1 border border-black rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEntityEdit} className="space-y-3 text-xs font-display">
                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingEntity.name}
                    onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">X Handle</label>
                    <input
                      type="text"
                      value={editingEntity.handle_x || ''}
                      onChange={(e) => setEditingEntity({ ...editingEntity, handle_x: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">YT Handle</label>
                    <input
                      type="text"
                      value={editingEntity.handle_yt || ''}
                      onChange={(e) => setEditingEntity({ ...editingEntity, handle_yt: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">IG Handle</label>
                    <input
                      type="text"
                      value={editingEntity.handle_insta || ''}
                      onChange={(e) => setEditingEntity({ ...editingEntity, handle_insta: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">
                    Public Upvotes (Votes Count)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingEntity.upvotes !== undefined ? editingEntity.upvotes : 0}
                    onChange={(e) => setEditingEntity({ ...editingEntity, upvotes: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Tracked Narrative</label>
                  <textarea
                    rows="3"
                    value={editingEntity.narrative}
                    onChange={(e) => setEditingEntity({ ...editingEntity, narrative: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-black rounded"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 pop-btn bg-saffron text-black py-2 rounded-lg font-black uppercase"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEntity(null)}
                    className="px-4 py-2 bg-gray-200 border border-black rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Nationalist Influencer */}
        {editingNationalist && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-pop-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h4 className="font-comic text-xl text-black">EDIT NATIONALIST CREATOR</h4>
                <button
                  onClick={() => setEditingNationalist(null)}
                  className="p-1 border border-black rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNationalistEdit} className="space-y-3 text-xs font-display">
                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Creator Name</label>
                  <input
                    type="text"
                    value={editingNationalist.name}
                    onChange={(e) => setEditingNationalist({ ...editingNationalist, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">YT Handle</label>
                    <input
                      type="text"
                      value={editingNationalist.handle_yt || ''}
                      onChange={(e) => setEditingNationalist({ ...editingNationalist, handle_yt: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">X Handle</label>
                    <input
                      type="text"
                      value={editingNationalist.handle_x || ''}
                      onChange={(e) => setEditingNationalist({ ...editingNationalist, handle_x: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">IG Handle</label>
                    <input
                      type="text"
                      value={editingNationalist.handle_insta || ''}
                      onChange={(e) => setEditingNationalist({ ...editingNationalist, handle_insta: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black uppercase text-gray-700 mb-1">Status</label>
                    <select
                      value={editingNationalist.status}
                      onChange={(e) => setEditingNationalist({ ...editingNationalist, status: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-bold"
                    >
                      <option value="approved">Approved (Live on Site)</option>
                      <option value="pending">Pending Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black uppercase text-gray-700 mb-1">Upvotes Count</label>
                    <input
                      type="number"
                      min="0"
                      value={editingNationalist.upvotes ?? 0}
                      onChange={(e) => setEditingNationalist({ ...editingNationalist, upvotes: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">
                    Categories (Multi-Select or Custom)
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-black rounded-lg max-h-36 overflow-y-auto mb-2">
                    {allNatCategoryOptions.map(cat => {
                      const cur = (editingNationalist.category || '')
                        .split(',')
                        .map(c => c.trim())
                        .filter(Boolean);
                      const isSelected = cur.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const next = isSelected ? cur.filter(c => c !== cat) : [...cur, cat];
                            setEditingNationalist({
                              ...editingNationalist,
                              category: next.join(', ')
                            });
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-tirangaGreen text-white border-black shadow-[1px_1px_0px_#000]'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-black'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{cat}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={editingNationalist.category || ''}
                    onChange={(e) => setEditingNationalist({ ...editingNationalist, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded text-xs font-bold font-mono"
                    placeholder="e.g. Defence, Geopolitics"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={editingNationalist.description || ''}
                    onChange={(e) => setEditingNationalist({ ...editingNationalist, description: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-black rounded"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 pop-btn bg-tirangaGreen text-white py-2 rounded-lg font-black uppercase"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingNationalist(null)}
                    className="px-4 py-2 bg-gray-200 border border-black rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Direct Add Nationalist Creator */}
        {isDirectAddNatOpen && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-pop-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h4 className="font-comic text-xl text-black">DIRECT ADD NATIONALIST CREATOR</h4>
                <button
                  onClick={() => setIsDirectAddNatOpen(false)}
                  className="p-1 border border-black rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleDirectAddNationalistSubmit} className="space-y-3 text-xs font-display">
                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Creator / Channel Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Major Gaurav Arya..."
                    value={directNatForm.name}
                    onChange={(e) => setDirectNatForm({ ...directNatForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">YT Handle</label>
                    <input
                      type="text"
                      placeholder="@channel"
                      value={directNatForm.handle_yt}
                      onChange={(e) => setDirectNatForm({ ...directNatForm, handle_yt: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">X Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={directNatForm.handle_x}
                      onChange={(e) => setDirectNatForm({ ...directNatForm, handle_x: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">IG Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={directNatForm.handle_insta}
                      onChange={(e) => setDirectNatForm({ ...directNatForm, handle_insta: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">
                    Categories (Multi-Select: 1 or more) *
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-black rounded-lg max-h-36 overflow-y-auto">
                    {allNatCategoryOptions.map(cat => {
                      const isSelected = (directNatForm.categories || []).includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const cur = directNatForm.categories || [];
                            const next = isSelected ? cur.filter(c => c !== cat) : [...cur, cat];
                            setDirectNatForm({
                              ...directNatForm,
                              categories: next.length > 0 ? next : ['Defence'],
                              category: (next.length > 0 ? next : ['Defence']).join(', ')
                            });
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-tirangaGreen text-white border-black shadow-[1px_1px_0px_#000]'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-black'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{cat}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">
                    Selected: {(directNatForm.categories || []).join(', ') || 'Defence'}
                  </p>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Initial Upvotes</label>
                  <input
                    type="number"
                    min="0"
                    value={directNatForm.upvotes ?? 0}
                    onChange={(e) => setDirectNatForm({ ...directNatForm, upvotes: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Description *</label>
                  <textarea
                    rows="3"
                    placeholder="Describe their patriotic advocacy, fact-checking, and coverage..."
                    value={directNatForm.description}
                    onChange={(e) => setDirectNatForm({ ...directNatForm, description: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-black rounded"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 pop-btn bg-tirangaGreen text-white py-2 rounded-lg font-black uppercase"
                  >
                    Add Directly & Make Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDirectAddNatOpen(false)}
                    className="px-4 py-2 bg-gray-200 border border-black rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Direct Add Propagandu Profile */}
        {isDirectAddPropOpen && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-pop-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h4 className="font-comic text-xl text-black">DIRECT ADD PROPAGANDU PROFILE</h4>
                <button
                  onClick={() => setIsDirectAddPropOpen(false)}
                  className="p-1 border border-black rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleDirectAddPropagandusSubmit} className="space-y-3 text-xs font-display">
                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Name / Outlet *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Worker, Outlet..."
                    value={directPropForm.name}
                    onChange={(e) => setDirectPropForm({ ...directPropForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">X Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={directPropForm.handle_x}
                      onChange={(e) => setDirectPropForm({ ...directPropForm, handle_x: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">YT Handle</label>
                    <input
                      type="text"
                      placeholder="@channel"
                      value={directPropForm.handle_yt}
                      onChange={(e) => setDirectPropForm({ ...directPropForm, handle_yt: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">IG Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={directPropForm.handle_insta}
                      onChange={(e) => setDirectPropForm({ ...directPropForm, handle_insta: e.target.value })}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-black rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black uppercase text-gray-700 mb-1">Party</label>
                    <select
                      value={directPropForm.party}
                      onChange={(e) => setDirectPropForm({ ...directPropForm, party: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-black rounded"
                    >
                      {OPPOSITION_PARTIES.map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-black uppercase text-gray-700 mb-1">Initial Upvotes</label>
                    <input
                      type="number"
                      min="0"
                      value={directPropForm.upvotes}
                      onChange={(e) => setDirectPropForm({ ...directPropForm, upvotes: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 bg-gray-50 border border-black rounded font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Documented Narrative *</label>
                  <textarea
                    rows="3"
                    placeholder="Document their anti-India claims..."
                    value={directPropForm.narrative}
                    onChange={(e) => setDirectPropForm({ ...directPropForm, narrative: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-black rounded"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 pop-btn bg-popRed text-white py-2 rounded-lg font-black uppercase"
                  >
                    Add Propagandu Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDirectAddPropOpen(false)}
                    className="px-4 py-2 bg-gray-200 border border-black rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
