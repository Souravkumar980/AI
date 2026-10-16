import React, { useState, useEffect, useRef } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import {
  Home,
  MessageSquare,
  Send,
  Database,
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  Users,
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  CheckCircle,
  Check,
  X,
  Plus,
  Phone,
  User,
  Trash2,
  Ban,
  Share2,
  Copy,
  Bell,
  Paperclip,
  Award,
  LogOut,
  ArrowLeft,
  Download,
  Eye,
  RefreshCw,
  Play,
  Smile,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Pause,
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  CheckCheck
} from 'lucide-react';
import DonateModal from './DonateModal';

// Disallowed & Protected Username Keywords (BJP politicians, Hindu deities, pro-influencers/admin keywords)
const PROTECTED_USERNAMES_REGEX = /^(modi|narendra_modi|namo|bjp|amit_shah|yogi|adityanath|rss|ram|rama|shiva|shiv|krishna|hanuman|vishnu|ganesh|ganpati|mahadev|durga|kali|sita|radha|laxmi|lakshmi|saraswati|bholenath|shanker|shankar|bajrangbali|brahma|admin|official|owner|moderator|propagandus)/i;

// Abusive words / Slurs filter targeting leaders or deities
const ABUSIVE_WORDS = [
  'godi', 'bhakt', 'chaddi', 'sanghi kutta', 'modi kutta', 'hindutva terrorist',
  'mutra', 'cow urine', 'pappu kutta', 'fake hindu'
];

function containsAbusiveContent(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  for (const word of ABUSIVE_WORDS) {
    if (lower.includes(word)) return true;
  }
  return false;
}

// Helper to auto-generate username like rahulXXXX (allowed chars: a-z, 0-9, ., _)
function generateUsernameFromName(name) {
  if (!name) name = 'citizen';
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'user';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789._';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${clean}_${rand}`;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// Helper to reliably construct community API URLs
export function getCommunityApiUrl(endpoint) {
  const base = (typeof window !== 'undefined' && window.__API_BASE_URL__ !== undefined)
    ? window.__API_BASE_URL__
    : '';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanBase = base ? base.replace(/\/+$/, '') : '';
  return `${cleanBase}${cleanEndpoint}`;
}

// Helper to resolve media URLs (handles relative /api/community/files/... for static hosting)
export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/api')) {
    const base = (typeof window !== 'undefined' && window.__API_BASE_URL__ !== undefined)
      ? window.__API_BASE_URL__
      : '';
    const key = (typeof window !== 'undefined' && window.__EP_CLIENT_KEY__) || 'ep-client-v1-bharat-first-2024';
    const separator = url.includes('?') ? '&' : '?';
    const cleanBase = base ? base.replace(/\/+$/, '') : '';
    return `${cleanBase}${url}${url.includes('key=') ? '' : `${separator}key=${key}`}`;
  }
  return url;
}

// Sample GIF library for Pop Art Chat
const CURATED_GIFS = [
  { id: 'g1', title: 'Jai Hind Flag', url: 'https://media.giphy.com/media/3o7btUg31RCoBK2rMQ/giphy.gif' },
  { id: 'g2', title: 'Bharat Mata Pride', url: 'https://media.giphy.com/media/l41lO3n7qW15zN6W4/giphy.gif' },
  { id: 'g3', title: 'Salute Patriot', url: 'https://media.giphy.com/media/26hirEPeos6yugLDO/giphy.gif' },
  { id: 'g4', title: 'Victory Clap', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
  { id: 'g5', title: 'Exposed Truth', url: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif' },
  { id: 'g6', title: 'Fact Checked', url: 'https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif' },
  { id: 'g7', title: 'Namaste Bharat', url: 'https://media.giphy.com/media/3o7TKrEzt9MHDAi16U/giphy.gif' },
  { id: 'g8', title: 'Patriotic Cheers', url: 'https://media.giphy.com/media/xT1R9SzWO4u7a2Y5BS/giphy.gif' }
];

// Verified Badge using official assets from resources: /golden.png and /blue.png
export function VerifiedBadge({ type, size = 'md' }) {
  if (!type || type === 'none') return null;
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  if (type === 'influencer' || type === 'golden') {
    return (
      <img
        src="/golden.png"
        alt="Verified Influencer"
        title="Verified Nationalist Influencer (Golden Tick)"
        className={`${dim} object-contain inline-block shrink-0 align-middle`}
      />
    );
  }
  if (type === 'citizen' || type === 'daily' || type === 'blue') {
    return (
      <img
        src="/blue.png"
        alt="Verified Citizen"
        title="Verified Daily Patriot (Blue Tick)"
        className={`${dim} object-contain inline-block shrink-0 align-middle`}
      />
    );
  }
  return null;
}

// Global cache for WhatsApp link previews
const linkPreviewCache = {};

// Helper to extract distinct URLs from text and combine with media links
function extractAllUrls(content, mediaLinks = []) {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urlsInText = (content && content.match(urlRegex)) || [];
  const combined = [...urlsInText, ...(mediaLinks || [])];
  return Array.from(new Set(combined.map(u => u.trim()))).filter(Boolean);
}

// WhatsApp-style Link Preview Component (Dark Teal WhatsApp Card matching screenshot)
function WhatsAppLinkPreview({ url }) {
  const [data, setData] = useState(() => linkPreviewCache[url] || null);
  const [loading, setLoading] = useState(!linkPreviewCache[url]);

  useEffect(() => {
    if (linkPreviewCache[url]) {
      setData(linkPreviewCache[url]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(getCommunityApiUrl(`/api/link-preview?url=${encodeURIComponent(url)}`))
      .then(res => res.json())
      .then(resData => {
        if (!isMounted) return;
        if (resData.success && resData.preview) {
          linkPreviewCache[url] = resData.preview;
          setData(resData.preview);
        } else {
          let domain = 'link';
          try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch {}
          const fallback = {
            url,
            domain,
            title: domain,
            description: url,
            image: null,
            isVideo: url.includes('youtube.com') || url.includes('youtu.be')
          };
          linkPreviewCache[url] = fallback;
          setData(fallback);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        let domain = 'link';
        try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch {}
        const fallback = {
          url,
          domain,
          title: domain,
          description: url,
          image: null,
          isVideo: url.includes('youtube.com') || url.includes('youtu.be')
        };
        linkPreviewCache[url] = fallback;
        setData(fallback);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [url]);

  if (!url) return null;

  let fallbackDomain = 'link';
  try { fallbackDomain = new URL(url).hostname.replace(/^www\./, ''); } catch {}

  const preview = data || {
    url,
    domain: fallbackDomain,
    title: loading ? 'Loading preview...' : fallbackDomain,
    description: loading ? 'Fetching website data...' : url,
    image: null,
    isVideo: url.includes('youtube.com') || url.includes('youtu.be')
  };

  return (
    <div className="my-2 max-w-sm rounded-xl overflow-hidden bg-[#054740] text-white p-2.5 shadow-md border border-[#065e52] transition-all hover:bg-[#064e46]">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2.5 group"
      >
        {/* Left Thumbnail with video play overlay */}
        {preview.image ? (
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/10">
            <img
              src={preview.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {preview.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <div className="w-6 h-6 rounded-full bg-black/70 flex items-center justify-center border border-white/50 shadow">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-teal-900/80 flex items-center justify-center border border-white/10 text-xl">
            {preview.isVideo ? (
              <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center border border-white/40">
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
            ) : (
              <span>🌐</span>
            )}
          </div>
        )}

        {/* Right Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h5 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-200 transition-colors">
              {preview.title || fallbackDomain}
            </h5>
            <p className="text-[11px] text-teal-100/75 line-clamp-2 mt-0.5 leading-tight">
              {preview.description || url}
            </p>
          </div>
          <span className="text-[10px] text-teal-200/60 font-mono mt-1 block truncate">
            {preview.domain || fallbackDomain}
          </span>
        </div>
      </a>

      {/* Clickable URL in Green below */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 pt-1 border-t border-teal-800/60 text-emerald-300 hover:text-emerald-200 underline text-xs break-all"
      >
        {url}
      </a>
    </div>
  );
}

// Initial Seed Users for Community (Admin credentials only)
const SEED_USERS = [
  {
    id: 'usr_admin',
    name: 'Om Kumar (Admin)',
    username: 'omkumar_admin',
    email: 'omkumar.working@gmail.com',
    phone: '9876543210',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=OmKumarAdmin',
    verified_type: 'influencer',
    is_admin: true,
    created_at: '2026-10-16'
  }
];

// Seed Public Chat Messages - Clean Zero Initial State
const SEED_MESSAGES = [];

// Seed Channels
// Seed Channels - Clean Zero Initial State
const SEED_CHANNELS = [];

export default function CommunityPage({ onSelectPage }) {
  // Current logged in community user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_community_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // All community users
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_community_users');
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  // Channels
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_community_channels');
      return saved ? JSON.parse(saved) : SEED_CHANNELS;
    } catch {
      return SEED_CHANNELS;
    }
  });

  // Active view: 'public_chat', 'channel_chat', 'dm_chat'
  const [activeChatRoom, setActiveChatRoom] = useState('public'); // 'public', channel_id, or dm_user_id
  const [activeChannelObj, setActiveChannelObj] = useState(null);
  const [activeDmUser, setActiveDmUser] = useState(null);

  // Messages list
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_community_messages');
      return saved ? JSON.parse(saved) : SEED_MESSAGES;
    } catch {
      return SEED_MESSAGES;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_community_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Chat input state
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [tagSuggestion, setTagSuggestion] = useState(null);

  // Modals & Navigation
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'register', 'login'
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isUserSearchModalOpen, setIsUserSearchModalOpen] = useState(false);
  const [isContactAdminOpen, setIsContactAdminOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isChannelRequestsModalOpen, setIsChannelRequestsModalOpen] = useState(false);
  const [viewingUserProfile, setViewingUserProfile] = useState(null);
  const [mobileView, setMobileView] = useState('chat'); // 'chat' | 'list'
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Registration Form (Simple regular ID by default, avatar auto-generated / uploaded later)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [regError, setRegError] = useState('');

  // Login Form
  const [loginForm, setLoginForm] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  // Edit Username Form
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [usernameUpdateMsg, setUsernameUpdateMsg] = useState('');

  // New Channel Form
  const [channelForm, setChannelForm] = useState({
    name: '',
    description: ''
  });

  // User Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Admin Form State
  const [contactType, setContactType] = useState('user'); // 'user', 'creator'
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    social_account_id: '',
    message: '',
    proof_file: null,
    proof_file_name: ''
  });
  const [contactStatusMsg, setContactStatusMsg] = useState('');

  // Contact Admin Queries received (Stored for Admin)
  const [adminQueries, setAdminQueries] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_admin_queries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Internal chat messages container ref (prevents window scrolling)
  const messagesContainerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Profile Picture Cropper / Size Selection Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // In-app Media Viewer / Lightbox State (Images, Videos, PDFs)
  const [activeMediaViewer, setActiveMediaViewer] = useState(null); // { type, url, name }

  // GIPHY Search & Trending Integration State
  const [giphyQuery, setGiphyQuery] = useState('');
  const [giphyResults, setGiphyResults] = useState([]);
  const [giphyLoading, setGiphyLoading] = useState(false);

  // WhatsApp-Style Reply Target Bar
  const [replyTarget, setReplyTarget] = useState(null); // { id, user_name, content }

  // Reaction Picker Popover (WhatsApp-Style hover click)
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState(null);

  // Jump to Replied Message Highlight state
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);

  // Direct Chat Partners list
  const [directChatUsers, setDirectChatUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('ep_direct_chat_users_' + (currentUser?.id || 'guest'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem('ep_direct_chat_users_' + currentUser.id);
        if (saved) setDirectChatUsers(JSON.parse(saved));
      } catch {}
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      try {
        localStorage.setItem('ep_direct_chat_users_' + currentUser.id, JSON.stringify(directChatUsers));
      } catch {}
    }
  }, [directChatUsers, currentUser?.id]);

  // Synchronize Direct Chat partners from DM messages
  useEffect(() => {
    if (!currentUser || !messages) return;
    const dmMessages = messages.filter(m => m.channel_id && m.channel_id.startsWith('dm_'));
    const partnerIds = new Set();
    for (const m of dmMessages) {
      const parts = m.channel_id.replace('dm_', '').split('_');
      if (parts.length === 2) {
        if (parts[0] === currentUser.id) partnerIds.add(parts[1]);
        else if (parts[1] === currentUser.id) partnerIds.add(parts[0]);
      }
    }
    if (partnerIds.size > 0) {
      setDirectChatUsers(prev => {
        const existingIds = new Set(prev.map(u => u.id));
        const newUsers = [];
        for (const pid of partnerIds) {
          if (!existingIds.has(pid)) {
            const found = users.find(u => u.id === pid);
            if (found) newUsers.push(found);
          }
        }
        return newUsers.length > 0 ? [...newUsers, ...prev] : prev;
      });
    }
  }, [messages, currentUser, users]);

  // Dedicated In-App Media Viewer Controller States
  const [viewerZoom, setViewerZoom] = useState(1);
  const [viewerRotate, setViewerRotate] = useState(0);
  const [viewerVolume, setViewerVolume] = useState(1);
  const [viewerIsMuted, setViewerIsMuted] = useState(false);
  const [viewerIsPlaying, setViewerIsPlaying] = useState(true);
  const [viewerCurrentTime, setViewerCurrentTime] = useState(0);
  const [viewerDuration, setViewerDuration] = useState(0);
  const [viewerPdfPage, setViewerPdfPage] = useState(1);
  const [viewerCopyFeedback, setViewerCopyFeedback] = useState(false);
  const viewerVideoRef = useRef(null);

  // Reset viewer controls when file changes
  useEffect(() => {
    if (activeMediaViewer) {
      setViewerZoom(1);
      setViewerRotate(0);
      setViewerVolume(1);
      setViewerIsMuted(false);
      setViewerIsPlaying(true);
      setViewerCurrentTime(0);
      setViewerDuration(0);
      setViewerPdfPage(1);
      setViewerCopyFeedback(false);
    }
  }, [activeMediaViewer]);

  // Admin God-Mode Impersonation State
  const [impersonationInfo, setImpersonationInfo] = useState(() => {
    try {
      const data = localStorage.getItem('ep_admin_impersonating');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  const handleExitImpersonation = () => {
    try {
      localStorage.removeItem('ep_admin_impersonating');
      const adminUser = users.find(u => u.email === 'omkumar.working@gmail.com') || {
        id: 'usr_admin',
        name: 'Om Kumar',
        username: 'omkumar',
        email: 'omkumar.working@gmail.com',
        is_admin: 1,
        verified_type: 'influencer'
      };
      localStorage.setItem('ep_community_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setImpersonationInfo(null);
      if (onSelectPage) onSelectPage('admin');
      else window.location.hash = '#admin';
    } catch (e) {
      console.error(e);
    }
  };

  const handleScrollToMessage = (targetMsgId) => {
    if (!targetMsgId) return;
    const el = document.getElementById(`comm_msg_${targetMsgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMsgId(targetMsgId);
      setTimeout(() => setHighlightedMsgId(null), 2500);
    }
  };

  // Save to localStorage
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('ep_community_user', JSON.stringify(currentUser));
      else localStorage.removeItem('ep_community_user');
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('ep_community_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('ep_community_channels', JSON.stringify(channels));
    } catch {}
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem('ep_community_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('ep_community_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('ep_admin_queries', JSON.stringify(adminQueries));
    } catch {}
  }, [adminQueries]);

  const [isBannedByIp, setIsBannedByIp] = useState(false);

  // Helper to broadcast realtime events across tabs in the same browser (0ms latency)
  const broadcastCrossTab = (payload) => {
    try {
      const bc = new BroadcastChannel('ep_community_realtime');
      bc.postMessage(payload);
      bc.close();
    } catch (e) {}
  };

  // Sync state with backend database
  const fetchCommunitySync = async () => {
    try {
      const joinParam = new URLSearchParams(window.location.search).get('join') || '';
      const queryParams = new URLSearchParams();
      if (currentUser?.id) queryParams.set('user_id', currentUser.id);
      if (currentUser?.username) queryParams.set('username', currentUser.username);
      if (joinParam) queryParams.set('join', joinParam);
      const qStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const apiUrl = getCommunityApiUrl(`/api/community/sync${qStr}`);

      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setUsers(prev => prev.length !== data.users.length ? data.users : prev);
        }
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(prev => {
            const uploadingMsgs = prev.filter(m => m.is_uploading);
            const incomingIds = new Set(data.messages.map(m => m.id));
            const merged = [...data.messages, ...uploadingMsgs.filter(m => !incomingIds.has(m.id))];
            if (prev.length !== merged.length) return merged;
            const prevHash = prev.map(m => `${m.id}_${JSON.stringify(m.reactions || {})}_${m.content}_${m.is_deleted}_${m.is_uploading}`).join('|');
            const newHash = merged.map(m => `${m.id}_${JSON.stringify(m.reactions || {})}_${m.content}_${m.is_deleted}_${m.is_uploading}`).join('|');
            if (prevHash !== newHash) return merged;
            return prev;
          });
        }
        if (data.channels && Array.isArray(data.channels)) {
          setChannels(prev => {
            const prevStr = JSON.stringify(prev.map(c => ({ id: c.id, reqs: c.pending_requests?.length, mems: c.members?.length })));
            const newStr = JSON.stringify(data.channels.map(c => ({ id: c.id, reqs: c.pending_requests?.length, mems: c.members?.length })));
            if (prevStr !== newStr) return data.channels;
            return prev;
          });
        }
        if (data.notifications && Array.isArray(data.notifications)) {
          setNotifications(prev => {
            if (prev.length !== data.notifications.length) return data.notifications;
            const prevIds = prev.map(n => n.id).join(',');
            const newIds = data.notifications.map(n => n.id).join(',');
            if (prevIds !== newIds) return data.notifications;
            return prev;
          });
        }
        if (data.adminQueries && Array.isArray(data.adminQueries)) {
          setAdminQueries(prev => prev.length !== data.adminQueries.length ? data.adminQueries : prev);
        }
      } else if (res.status === 403) {
        setIsBannedByIp(true);
      }
    } catch (e) {
      // Offline fallback already loaded from localStorage
    }
  };

  // Real-Time Live SSE Stream + BroadcastChannel (Cross-Tab Instant 0ms Sync) + Fast Polling Fallback
  useEffect(() => {
    let eventSource = null;
    let bc = null;

    // 1. Cross-Tab Real-time BroadcastChannel (Same browser multi-user / multi-tab)
    try {
      bc = new BroadcastChannel('ep_community_realtime');
      bc.onmessage = (event) => {
        try {
          const data = event.data;
          if (data.type === 'NEW_MESSAGE' && data.message) {
            setMessages(prev => {
              // 1. Direct ID deduplication
              if (prev.some(m => m.id === data.message.id)) {
                return prev.map(m => m.id === data.message.id ? { ...data.message, is_uploading: false } : m);
              }
              // 2. Optimistic pending deduplication for current user
              if (currentUser && data.message.user_id === currentUser.id) {
                const optIdx = prev.findIndex(m =>
                  m.user_id === currentUser.id &&
                  m.channel_id === data.message.channel_id &&
                  m.content === data.message.content &&
                  (m.is_uploading || m.id.startsWith('msg_'))
                );
                if (optIdx >= 0) {
                  return prev.map((m, idx) => idx === optIdx ? { ...data.message, is_uploading: false } : m);
                }
              }
              return [...prev, data.message];
            });
            scrollMessagesToBottom('smooth');
          } else if (data.type === 'REACTION_UPDATE') {
            setMessages(prev => prev.map(m => m.id === data.message_id ? { ...m, reactions: data.reactions } : m));
          } else if (data.type === 'DELETE_MESSAGE') {
            setMessages(prev => prev.filter(m => m.id !== data.message_id));
          } else if (data.type === 'NEW_NOTIFICATION' && data.notification) {
            setNotifications(prev => {
              if (prev.some(n => n.id === data.notification.id)) return prev;
              return [data.notification, ...prev];
            });
            fetchCommunitySync();
          } else if (data.type === 'CHANNEL_UPDATE' || data.type === 'USER_BANNED' || data.type === 'BADGE_UPDATE' || data.type === 'SYNC_NOW') {
            fetchCommunitySync();
          }
        } catch (e) {}
      };
    } catch (e) {}

    // 2. Server-Sent Events (SSE) Stream (Cross-Device / Cross-Network instant push)
    const connectSse = () => {
      try {
        const streamUrl = getCommunityApiUrl('/api/community/stream');
        eventSource = new EventSource(streamUrl);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_MESSAGE' && data.message) {
              setMessages(prev => {
                // 1. Direct ID deduplication
                if (prev.some(m => m.id === data.message.id)) {
                  return prev.map(m => m.id === data.message.id ? { ...data.message, is_uploading: false } : m);
                }
                // 2. Optimistic pending deduplication for current user
                if (currentUser && data.message.user_id === currentUser.id) {
                  const optIdx = prev.findIndex(m =>
                    m.user_id === currentUser.id &&
                    m.channel_id === data.message.channel_id &&
                    m.content === data.message.content &&
                    (m.is_uploading || m.id.startsWith('msg_'))
                  );
                  if (optIdx >= 0) {
                    return prev.map((m, idx) => idx === optIdx ? { ...data.message, is_uploading: false } : m);
                  }
                }
                return [...prev, data.message];
              });
              scrollMessagesToBottom('smooth');
            } else if (data.type === 'REACTION_UPDATE') {
              setMessages(prev => prev.map(m => m.id === data.message_id ? { ...m, reactions: data.reactions } : m));
            } else if (data.type === 'DELETE_MESSAGE') {
              setMessages(prev => prev.filter(m => m.id !== data.message_id));
            } else if (data.type === 'NEW_NOTIFICATION' && data.notification) {
              setNotifications(prev => {
                if (prev.some(n => n.id === data.notification.id)) return prev;
                return [data.notification, ...prev];
              });
              fetchCommunitySync();
            } else if (data.type === 'CHANNEL_UPDATE' || data.type === 'USER_BANNED' || data.type === 'BADGE_UPDATE') {
              fetchCommunitySync();
            }
          } catch (e) {}
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          setTimeout(connectSse, 3000);
        };
      } catch (e) {}
    };

    connectSse();

    // 3. Fast polling fallback: 1.5s interval ensures near-instant sync across any hosting environment
    fetchCommunitySync();
    const interval = setInterval(fetchCommunitySync, 1500);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchCommunitySync();
    };
    const handleFocus = () => fetchCommunitySync();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (eventSource) eventSource.close();
      if (bc) bc.close();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Scroll strictly within internal messages container (NEVER scrolls whole browser window)
  const scrollMessagesToBottom = (behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollMessagesToBottom('smooth');
  }, [messages.length, activeChatRoom]);

  // Keep window at top when entering community page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Auto-admit transition: If user is waiting on a private channel gate and gets approved, enter channel immediately in real-time!
  useEffect(() => {
    if (activeChatRoom && activeChatRoom.startsWith('gate_') && currentUser) {
      const realChanId = activeChatRoom.replace('gate_', '');
      const chan = channels.find(c => c.id === realChanId);
      if (chan && (chan.creator_id === currentUser.id || chan.members?.includes(currentUser.id) || currentUser.is_admin)) {
        setActiveChatRoom(realChanId);
        setActiveChannelObj(chan);
      }
    }
  }, [channels, activeChatRoom, currentUser]);

  // Handle URL join token (e.g. #community?join=token or ?join=token)
  useEffect(() => {
    const handleJoinUrl = () => {
      const fullUrl = window.location.href;
      let token = null;
      if (fullUrl.includes('join=')) {
        token = fullUrl.split('join=')[1].split('&')[0].split('#')[0];
      }
      if (token) {
        const found = channels.find(c => c.join_token === token || c.id === token);
        if (found) {
          if (!currentUser) {
            setIsAuthModalOpen(true);
            setAuthMode('register');
            setRegError(`Please register or login first to participate in channel "${found.name}".`);
          } else {
            handleOpenChannel(found);
          }
        }
      }
    };
    handleJoinUrl();
  }, [channels, currentUser]);

  // Auto-scroll mention tag suggestion
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const match = val.match(/@([a-zA-Z0-9_.]*)$/);
    if (match) {
      const q = match[1].toLowerCase();
      const matchedUsers = users.filter(u => u.username.toLowerCase().includes(q) && u.username !== currentUser?.username);
      setTagSuggestion(matchedUsers.slice(0, 5));
    } else {
      setTagSuggestion(null);
    }
  };

  const insertTag = (username) => {
    const updated = inputText.replace(/@([a-zA-Z0-9_.]*)$/, `@${username} `);
    setInputText(updated);
    setTagSuggestion(null);
  };

  // -------------------------------------------------------------
  // REGISTRATION & AUTHENTICATION (INSTAGRAM STYLE)
  // -------------------------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');

    const email = regForm.email.trim().toLowerCase();
    const name = regForm.name.trim();
    const phone = regForm.phone.trim();
    const pass = regForm.password.trim();

    if (!name || !email || !phone || !pass) {
      setRegError('All fields are required.');
      return;
    }

    // STRICT Email Domain Check (@gmail.com or @outlook.com only)
    if (!email.endsWith('@gmail.com') && !email.endsWith('@outlook.com')) {
      setRegError('Invalid Email: Only @gmail.com and @outlook.com addresses are permitted for verified community security.');
      return;
    }

    // Check if email already registered locally
    if (users.some(u => u.email.toLowerCase() === email)) {
      setRegError('An account with this email address is already registered. Please log in.');
      return;
    }

    // Call Backend API
    try {
      const res = await fetch(getCommunityApiUrl('/api/community/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: pass,
          avatar_url: ''
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || 'Registration failed.');
        return;
      }
      const newUser = data.user;
      setUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      setRegForm({ name: '', email: '', phone: '', password: '' });
      alert(`✓ Account created successfully! Your unique community username is: @${newUser.username} (You can change it anytime in your Profile).`);
      return;
    } catch (err) {
      // Local Fallback if server unreachable
      let generatedUsername = generateUsernameFromName(name);
      let attempt = 1;
      while (users.some(u => u.username.toLowerCase() === generatedUsername.toLowerCase())) {
        generatedUsername = generateUsernameFromName(name) + attempt;
        attempt++;
      }
      if (PROTECTED_USERNAMES_REGEX.test(generatedUsername)) {
        generatedUsername = `citizen_${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(generatedUsername)}`;

      const newUser = {
        id: 'usr_' + Date.now(),
        name,
        username: generatedUsername,
        avatar_url: defaultAvatar,
        verified_type: 'none',
        is_admin: false,
        is_banned: 0,
        created_at: new Date().toISOString().split('T')[0]
      };

      setUsers([newUser, ...users]);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      setRegForm({ name: '', email: '', phone: '', password: '' });
      alert(`✓ Account created successfully! Your unique community username is: @${generatedUsername} (You can change it anytime in your Profile).`);
    }
  };

  // Local File Upload for Profile Picture with Interactive Area / Crop Selector
  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Profile picture must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setCropScale(1);
      setCropOffset({ x: 0, y: 0 });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCroppedAvatar = async () => {
    if (!cropImageSrc || !currentUser) return;
    setAvatarUploading(true);

    try {
      const img = new Image();
      img.src = cropImageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      const aspect = img.width / img.height;
      let drawW, drawH;
      if (aspect >= 1) {
        drawH = size * cropScale;
        drawW = drawH * aspect;
      } else {
        drawW = size * cropScale;
        drawH = drawW / aspect;
      }

      const drawX = (size - drawW) / 2 + cropOffset.x;
      const drawY = (size - drawH) / 2 + cropOffset.y;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

      let finalAvatarUrl = dataUrl;
      try {
        const uploadRes = await fetch(getCommunityApiUrl('/api/community/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: `avatar_${currentUser.id}.jpg`, data: dataUrl, mimeType: 'image/jpeg' })
        });
        if (uploadRes.ok) {
          const upData = await uploadRes.json();
          if (upData.url) finalAvatarUrl = upData.url;
        }
      } catch (e) {}

      await fetch(getCommunityApiUrl('/api/community/profile/avatar'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          avatar_url: finalAvatarUrl
        })
      });

      const updatedUser = { ...currentUser, avatar_url: finalAvatarUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('ep_community_user', JSON.stringify(updatedUser));
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, avatar_url: finalAvatarUrl } : u));
      setMessages(prev => prev.map(m => m.user_id === currentUser.id ? { ...m, user_avatar: finalAvatarUrl } : m));
      broadcastCrossTab({ type: 'BADGE_UPDATE', user_id: currentUser.id, avatar_url: finalAvatarUrl });
      setUsernameUpdateMsg('✓ Profile picture adjusted & saved successfully!');
      setCropModalOpen(false);
    } catch (err) {
      alert('Error updating profile photo: ' + err.message);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cred = loginForm.emailOrUsername.trim().toLowerCase();
    const pass = loginForm.password.trim();

    try {
      const res = await fetch(getCommunityApiUrl('/api/community/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: cred, password: pass })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (cred === 'omkumar.working@gmail.com' && pass === 'Q0gng04bk3') {
          const adminUser = users.find(u => u.email?.toLowerCase() === 'omkumar.working@gmail.com') || {
            id: 'usr_admin',
            name: 'Om Kumar (Commander)',
            username: 'omkumar_admin',
            email: 'omkumar.working@gmail.com',
            phone: '9876543210',
            avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=OmKumarAdmin',
            verified_type: 'influencer',
            is_admin: true,
            created_at: '2025-01-01'
          };
          setCurrentUser(adminUser);
          setIsAuthModalOpen(false);
          setLoginForm({ emailOrUsername: '', password: '' });
          alert('✓ Welcome Commander Om Kumar. Full administrative community control active.');
          return;
        }
        setLoginError(data.error || 'Login failed.');
        return;
      }
      setCurrentUser(data.user);
      setIsAuthModalOpen(false);
      setLoginForm({ emailOrUsername: '', password: '' });
      if (data.user?.is_admin) {
        alert('✓ Welcome Commander Om Kumar. Full administrative community control active.');
      }
      return;
    } catch (err) {
      if (cred === 'omkumar.working@gmail.com' && pass === 'Q0gng04bk3') {
        const adminUser = users.find(u => u.email?.toLowerCase() === 'omkumar.working@gmail.com') || {
          id: 'usr_admin',
          name: 'Om Kumar (Commander)',
          username: 'omkumar_admin',
          email: 'omkumar.working@gmail.com',
          phone: '9876543210',
          avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=OmKumarAdmin',
          verified_type: 'influencer',
          is_admin: true,
          created_at: '2025-01-01'
        };
        setCurrentUser(adminUser);
        setIsAuthModalOpen(false);
        setLoginForm({ emailOrUsername: '', password: '' });
        alert('✓ Welcome Commander Om Kumar. Full administrative community control active.');
        return;
      }
      setLoginError('Unable to connect to authentication server. Please check your network.');
      return;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChatRoom('public');
    setActiveChannelObj(null);
    setActiveDmUser(null);
  };

  // -------------------------------------------------------------
  // USERNAME CUSTOMIZATION & BLACKLIST CHECK
  // -------------------------------------------------------------
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameUpdateMsg('');

    if (!currentUser) return;
    const cleanUsername = newUsernameInput.trim().toLowerCase().replace(/[^a-z0-9._]/g, '');

    const isAdmin = currentUser.email === 'omkumar.working@gmail.com' || currentUser.is_admin;

    if (!isAdmin) {
      if (cleanUsername.length < 3 || cleanUsername.length > 25) {
        setUsernameUpdateMsg('Username must be between 3 and 25 characters (only letters, numbers, dot . and underscore _).');
        return;
      }

      // Blacklist check for Modi, BJP, Hindu gods, admin keywords
      if (PROTECTED_USERNAMES_REGEX.test(cleanUsername)) {
        setUsernameUpdateMsg('Error: Usernames containing names of national leaders, BJP, or Hindu deities are strictly prohibited and reserved.');
        return;
      }
    } else {
      if (cleanUsername.length < 2 || cleanUsername.length > 30) {
        setUsernameUpdateMsg('Admin username must be at least 2 characters.');
        return;
      }
    }

    // Check availability
    if (users.some(u => u.username.toLowerCase() === cleanUsername && u.id !== currentUser.id)) {
      setUsernameUpdateMsg('This username is already taken. Please pick another.');
      return;
    }

    try {
      const res = await fetch(getCommunityApiUrl('/api/community/profile/username'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, new_username: cleanUsername })
      });
      const data = await res.json();
      if (!res.ok) {
        setUsernameUpdateMsg('Error: ' + (data.error || 'Username update failed.'));
        return;
      }
    } catch {}

    // Update
    const updatedUser = { ...currentUser, username: cleanUsername };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setNewUsernameInput('');
    setUsernameUpdateMsg('✓ Username successfully changed to @' + cleanUsername);
  };

  // -------------------------------------------------------------
  // SEND MESSAGE (WITH FILE & MENTION DISPATCH)
  // -------------------------------------------------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!inputText.trim() && attachedFiles.length === 0) return;

    // Check abusive content
    if (containsAbusiveContent(inputText)) {
      alert('⚠️ Message Blocked: Disrespectful language targeting national leadership or deities is strictly prohibited in this community.');
      return;
    }

    // Parse link previews (YouTube, GDrive, Instagram, X)
    const urlMatches = inputText.match(/https?:\/\/[^\s]+/g) || [];

    // Parse mentions: @username
    const mentionMatches = inputText.match(/@([a-zA-Z0-9_.]+)/g) || [];
    const mentionedUsernames = mentionMatches.map(m => m.replace('@', '').toLowerCase());

    // Dispatch notifications to mentioned users
    if (mentionedUsernames.length > 0) {
      const newNotifs = [];
      mentionedUsernames.forEach(targetUname => {
        if (targetUname !== currentUser.username.toLowerCase()) {
          newNotifs.push({
            id: 'notif_' + Date.now() + Math.random(),
            recipient_username: targetUname,
            sender_username: currentUser.username,
            sender_name: currentUser.name,
            message: `@${currentUser.username} mentioned you: "${inputText.slice(0, 60)}..."`,
            created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      });
      if (newNotifs.length > 0) {
        setNotifications(prev => [...newNotifs, ...prev]);
      }
    }

    // If chatting in Direct Message, notify recipient
    if (activeDmUser && activeChatRoom.startsWith('dm_')) {
      const dmNotif = {
        id: 'notif_dm_' + Date.now() + Math.random().toString(36).substr(2, 4),
        type: 'direct_message',
        recipient_username: activeDmUser.username.toLowerCase(),
        sender_username: currentUser.username,
        sender_name: currentUser.name,
        message: `@${currentUser.username} sent you a direct message: "${(inputText.trim() || 'Sent attachment').slice(0, 60)}"`,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [dmNotif, ...prev]);
    }

    const filesToUpload = [...attachedFiles];
    const hasUploadingFiles = filesToUpload.length > 0;
    const tempMsgId = 'msg_' + Date.now() + Math.random().toString(36).substr(2, 4);

    const newMessage = {
      id: tempMsgId,
      channel_id: activeChatRoom, // 'public', channel_id, or dm_target_id
      user_id: currentUser.id,
      user_name: currentUser.name,
      username: currentUser.username,
      user_avatar: currentUser.avatar_url,
      verified_type: currentUser.verified_type || 'none',
      content: inputText.trim(),
      attachments: filesToUpload.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        size: f.size,
        url: f.previewUrl || f.url,
        uploadData: f.uploadData,
        mimeType: f.mimeType,
        is_uploading: true
      })),
      media_links: urlMatches,
      gif_url: null,
      reactions: {},
      reply_to: replyTarget ? {
        id: replyTarget.id,
        user_name: replyTarget.user_name || replyTarget.sender,
        content: (replyTarget.content || replyTarget.text || '').slice(0, 100)
      } : null,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_uploading: hasUploadingFiles
    };

    // Optimistically show message immediately in chat feed (WhatsApp feel)
    setMessages(prev => [...prev, newMessage]);
    broadcastCrossTab({ type: 'NEW_MESSAGE', message: newMessage });
    setInputText('');
    setAttachedFiles([]);
    setTagSuggestion(null);
    setReplyTarget(null);

    // Save optimistically to localStorage so it stays live on site
    try {
      const existing = JSON.parse(localStorage.getItem('ep_community_messages') || '[]');
      localStorage.setItem('ep_community_messages', JSON.stringify([...existing, newMessage]));
    } catch (e) {}

    // Background upload & database synchronization
    (async () => {
      try {
        let updatedAttachments = [...newMessage.attachments];

        if (filesToUpload.length > 0) {
          const uploadedList = [];

          for (const item of filesToUpload) {
            let dataPayload = item.uploadData;
            const mime = item.mimeType || 'application/octet-stream';

            // If background compression wasn't ready, finish reading now
            if (!dataPayload && item.rawFile) {
              dataPayload = await new Promise((resolve) => {
                const r = new FileReader();
                r.onload = (ev) => resolve(ev.target.result);
                r.onerror = () => resolve('');
                r.readAsDataURL(item.rawFile);
              });
            }

            if (dataPayload) {
              try {
                const apiUrl = getCommunityApiUrl('/api/community/upload');

                const res = await fetch(apiUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    filename: item.name,
                    data: dataPayload,
                    mimeType: mime
                  })
                });

                if (res.ok) {
                  const uploadRes = await res.json();
                  uploadedList.push({
                    name: item.name,
                    type: item.type,
                    size: uploadRes.size || item.size,
                    url: uploadRes.url || dataPayload,
                    is_uploading: false
                  });
                  continue;
                }
              } catch (uploadErr) {
                console.warn('API upload error, using local data fallback:', uploadErr);
              }
            }

            // Fallback: retain data / blob URL so the user never loses the media
            uploadedList.push({
              name: item.name,
              type: item.type,
              size: item.size,
              url: dataPayload || item.previewUrl || item.url,
              is_uploading: false
            });
          }

          updatedAttachments = uploadedList;
        }

        // Finalized message with upload buffer finished
        const finalizedMessage = {
          ...newMessage,
          attachments: updatedAttachments,
          is_uploading: false
        };

        const apiUrl = getCommunityApiUrl('/api/community/messages');

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalizedMessage)
        });

        if (res.ok) {
          const data = await res.json();
          const serverMsg = data.message ? { ...data.message, is_uploading: false } : finalizedMessage;
          setMessages(prev => {
            const hasServerMsg = prev.some(m => m.id === serverMsg.id && m.id !== tempMsgId);
            if (hasServerMsg) {
              return prev.filter(m => m.id !== tempMsgId);
            }
            return prev.map(m => m.id === tempMsgId ? serverMsg : m);
          });
          broadcastCrossTab({ type: 'MESSAGE_UPDATE', message: serverMsg });
        } else {
          setMessages(prev => prev.map(m => m.id === tempMsgId ? finalizedMessage : m));
          broadcastCrossTab({ type: 'MESSAGE_UPDATE', message: finalizedMessage });
        }
      } catch (syncErr) {
        console.error('Background upload/sync error:', syncErr);
        // Clear uploading buffer even if network failed
        setMessages(prev => prev.map(m => m.id === tempMsgId ? {
          ...m,
          is_uploading: false,
          attachments: (m.attachments || []).map(a => ({ ...a, is_uploading: false }))
        } : m));
      }
    })();
  };

  const handleSendGif = async (gifUrl) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const newMessage = {
      id: 'msg_' + Date.now(),
      channel_id: activeChatRoom,
      user_id: currentUser.id,
      user_name: currentUser.name,
      username: currentUser.username,
      user_avatar: currentUser.avatar_url,
      verified_type: currentUser.verified_type || 'none',
      content: '',
      attachments: [],
      media_links: [],
      gif_url: gifUrl,
      reactions: {},
      reply_to: replyTarget ? {
        id: replyTarget.id,
        user_name: replyTarget.user_name || replyTarget.sender,
        content: (replyTarget.content || replyTarget.text || '').slice(0, 100)
      } : null,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (activeDmUser && activeChatRoom.startsWith('dm_')) {
      const dmNotif = {
        id: 'notif_dm_' + Date.now() + Math.random().toString(36).substr(2, 4),
        type: 'direct_message',
        recipient_username: activeDmUser.username.toLowerCase(),
        sender_username: currentUser.username,
        sender_name: currentUser.name,
        message: `@${currentUser.username} sent you a GIF in direct message`,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [dmNotif, ...prev]);
    }

    setMessages(prev => [...prev, newMessage]);
    broadcastCrossTab({ type: 'NEW_MESSAGE', message: newMessage });
    setShowGifPicker(false);
    setReplyTarget(null);

    try {
      const existing = JSON.parse(localStorage.getItem('ep_community_messages') || '[]');
      localStorage.setItem('ep_community_messages', JSON.stringify([...existing, newMessage]));
    } catch (e) {}

    try {
      const apiUrl = getCommunityApiUrl('/api/community/messages');

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages(prev => {
            const hasServerMsg = prev.some(m => m.id === data.message.id && m.id !== newMessage.id);
            if (hasServerMsg) return prev.filter(m => m.id !== newMessage.id);
            return prev.map(m => m.id === newMessage.id ? data.message : m);
          });
          broadcastCrossTab({ type: 'MESSAGE_UPDATE', message: data.message });
        }
      }
    } catch {}
  };

  // -------------------------------------------------------------
  // WHATSAPP-STYLE EMOJI REACTIONS HANDLER
  // -------------------------------------------------------------
  const handleToggleReaction = async (messageId, emoji) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    let updatedRx = {};

    // Optimistic local update
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      const rx = { ...(m.reactions || {}) };
      const alreadyReactedSame = rx[emoji] && rx[emoji].some(u => u.user_id === currentUser.id);

      for (const k of Object.keys(rx)) {
        if (Array.isArray(rx[k])) {
          rx[k] = rx[k].filter(u => u.user_id !== currentUser.id);
          if (rx[k].length === 0) delete rx[k];
        }
      }

      if (!alreadyReactedSame) {
        if (!rx[emoji]) rx[emoji] = [];
        rx[emoji].push({ user_id: currentUser.id, username: currentUser.username });
      }

      updatedRx = rx;
      return { ...m, reactions: rx };
    }));

    broadcastCrossTab({ type: 'REACTION_UPDATE', message_id: messageId, reactions: updatedRx });

    try {
      const apiUrl = getCommunityApiUrl('/api/community/messages/react');

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          emoji,
          user_id: currentUser.id,
          username: currentUser.username
        })
      });
    } catch (e) {
      console.error('Reaction sync error:', e);
    }
  };

  // -------------------------------------------------------------
  // GIPHY API SEARCH & TRENDING LOADER (DIRECT GIPHY PUBLIC API)
  // -------------------------------------------------------------
  const GIPHY_PUBLIC_KEY = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh';

  const fetchGiphyGifs = async (query = '') => {
    setGiphyLoading(true);
    try {
      const trimmed = query.trim();
      const endpoint = trimmed
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_PUBLIC_KEY}&q=${encodeURIComponent(trimmed)}&limit=24&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_PUBLIC_KEY}&limit=24&rating=g`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('GIPHY API request failed');
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        setGiphyResults(data.data.map(g => ({
          id: g.id,
          title: g.title || 'GIF',
          url: g.images?.fixed_height?.url || g.images?.downsized_medium?.url || g.images?.original?.url || g.images?.fixed_width?.url
        })));
      } else {
        setGiphyResults(CURATED_GIFS);
      }
    } catch (e) {
      console.warn('Direct GIPHY fetch error, using curated fallback:', e);
      setGiphyResults(CURATED_GIFS);
    } finally {
      setGiphyLoading(false);
    }
  };

  useEffect(() => {
    if (showGifPicker && giphyResults.length === 0) {
      fetchGiphyGifs('');
    }
  }, [showGifPicker]);

  // -------------------------------------------------------------
  // FILE ATTACHMENT HANDLER (STRICTLY < 10MB) - WHATSAPP STYLE STAGING
  // -------------------------------------------------------------
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // Reset previous text in chat bar so attachment does not send stale previous message
    setInputText('');

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed file size is 10MB!`);
        continue;
      }

      let type = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type === 'application/pdf') type = 'pdf';
      else if (file.type.startsWith('text/')) type = 'text';

      const tempId = 'f_' + Date.now() + Math.random().toString(36).substr(2, 4);
      const previewUrl = URL.createObjectURL(file);

      // Immediately stage in draft with instant thumbnail preview (WhatsApp feel)
      const stagedItem = {
        id: tempId,
        name: file.name,
        type,
        size: (file.size / 1024).toFixed(0) + ' KB',
        previewUrl,
        url: previewUrl,
        rawFile: file,
        uploadData: '',
        mimeType: file.type || 'application/octet-stream',
        isUploading: false
      };

      setAttachedFiles(prev => [...prev, stagedItem]);

      // Read & compress in background so uploadData is instantly ready when Send is pressed
      const r = new FileReader();
      r.onload = (ev) => {
        if (type === 'image') {
          const img = new Image();
          img.onload = () => {
            const maxDim = 1280;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setAttachedFiles(prev => prev.map(f => f.id === tempId ? {
              ...f,
              uploadData: compressed,
              mimeType: 'image/jpeg'
            } : f));
          };
          img.onerror = () => {
            setAttachedFiles(prev => prev.map(f => f.id === tempId ? {
              ...f,
              uploadData: ev.target.result,
              mimeType: file.type || 'image/jpeg'
            } : f));
          };
          img.src = ev.target.result;
        } else {
          setAttachedFiles(prev => prev.map(f => f.id === tempId ? {
            ...f,
            uploadData: ev.target.result,
            mimeType: file.type || 'application/octet-stream'
          } : f));
        }
      };
      r.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // -------------------------------------------------------------
  // CHANNELS (GOOGLE MEET STYLE ADMIT / DENY SYSTEM)
  // -------------------------------------------------------------
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!channelForm.name.trim()) {
      alert('Please provide a channel name.');
      return;
    }

    const token = 'chn_' + Math.random().toString(36).substr(2, 9);
    const newChan = {
      id: 'chn_' + Date.now(),
      creator_id: currentUser.id,
      creator_name: currentUser.name,
      creator_username: currentUser.username,
      name: channelForm.name.trim(),
      description: channelForm.description.trim(),
      join_token: token,
      is_private: 1,
      members: [currentUser.id],
      pending_requests: []
    };

    setChannels([newChan, ...channels]);
    setChannelForm({ name: '', description: '' });
    setIsCreateChannelModalOpen(false);
    setActiveChatRoom(newChan.id);
    setActiveChannelObj(newChan);

    try {
      const apiUrl = getCommunityApiUrl('/api/community/channels');

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChan)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.channel) {
          const finalChan = data.channel;
          setActiveChannelObj(finalChan);
          setActiveChatRoom(finalChan.id);
          setChannels(prev => [finalChan, ...prev.filter(c => c.id !== newChan.id && c.id !== finalChan.id)]);
          broadcastCrossTab({ type: 'CHANNEL_UPDATE', channel_id: finalChan.id });
        }
      }
    } catch {}

    alert(`✓ Private Channel "${newChan.name}" created! You can now share the access link with friends.`);
  };

  const handleOpenChannel = (chan) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setActiveChannelObj(chan);
    setActiveDmUser(null);
    setMobileView('chat');

    // If creator or admin or approved member: enter channel
    const isMember = chan.members?.includes(currentUser.id);
    const isCreator = chan.creator_id === currentUser.id;
    const isAdmin = currentUser.is_admin;

    if (isMember || isCreator || isAdmin) {
      setActiveChatRoom(chan.id);
    } else {
      // Request access flow
      setActiveChatRoom(`gate_${chan.id}`);
    }
  };

  const handleRequestJoinChannel = async (chanId) => {
    if (!currentUser) return;
    const chan = channels.find(c => c.id === chanId);
    setChannels(channels.map(c => {
      if (c.id === chanId) {
        const existing = c.pending_requests || [];
        if (!existing.some(r => r.user_id === currentUser.id)) {
          return {
            ...c,
            pending_requests: [...existing, {
              user_id: currentUser.id,
              name: currentUser.name,
              username: currentUser.username,
              avatar_url: currentUser.avatar_url,
              requested_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]
          };
        }
      }
      return c;
    }));

    // Dispatch notification to channel creator
    if (chan && chan.creator_username) {
      const notifReq = {
        id: 'notif_chan_' + Date.now() + Math.random().toString(36).substr(2, 4),
        type: 'channel_request',
        channel_id: chanId,
        channel_name: chan.name,
        requester_id: currentUser.id,
        requester_name: currentUser.name,
        requester_username: currentUser.username,
        requester_avatar: currentUser.avatar_url,
        recipient_username: chan.creator_username.toLowerCase(),
        sender_username: currentUser.username,
        sender_name: currentUser.name,
        message: `@${currentUser.username} (${currentUser.name}) requested to participate in your private channel "${chan.name}"`,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [notifReq, ...prev]);
      broadcastCrossTab({ type: 'NEW_NOTIFICATION', notification: notifReq });
    }

    broadcastCrossTab({ type: 'CHANNEL_UPDATE', channel_id: chanId });

    try {
      const apiUrl = getCommunityApiUrl('/api/community/channels/request');

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: chanId,
          user_id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar_url: currentUser.avatar_url
        })
      });
    } catch {}

    alert('✓ Request to participate sent to the channel creator. You will gain access once approved!');
  };

  const handleAdmitParticipant = async (chanId, participantUserId, notifId) => {
    setChannels(channels.map(c => {
      if (c.id === chanId) {
        const updatedMembers = [...new Set([...(c.members || []), participantUserId])];
        const updatedRequests = (c.pending_requests || []).filter(r => r.user_id !== participantUserId);
        return { ...c, members: updatedMembers, pending_requests: updatedRequests };
      }
      return c;
    }));

    if (notifId) {
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, resolved: true, resolvedAction: 'admitted' } : n));
    }

    broadcastCrossTab({ type: 'CHANNEL_UPDATE', channel_id: chanId });

    try {
      const apiUrl = getCommunityApiUrl('/api/community/channels/admit');

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: chanId, participant_user_id: participantUserId })
      });
    } catch {}

    alert('✓ Participant admitted to channel!');
  };

  const handleDenyParticipant = async (chanId, participantUserId, notifId) => {
    setChannels(channels.map(c => {
      if (c.id === chanId) {
        return { ...c, pending_requests: (c.pending_requests || []).filter(r => r.user_id !== participantUserId) };
      }
      return c;
    }));

    if (notifId) {
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, resolved: true, resolvedAction: 'discarded' } : n));
    }

    broadcastCrossTab({ type: 'CHANNEL_UPDATE', channel_id: chanId });

    try {
      const apiUrl = getCommunityApiUrl('/api/community/channels/deny');

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: chanId, participant_user_id: participantUserId })
      });
    } catch {}
  };

  // -------------------------------------------------------------
  // DIRECT USER SEARCH & 1-ON-1 DM
  // -------------------------------------------------------------
  const handleStartDm = (targetUser) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (targetUser.id === currentUser.id) return;

    setActiveDmUser(targetUser);
    setActiveChannelObj(null);
    const dmKey = [currentUser.id, targetUser.id].sort().join('_');
    setActiveChatRoom(`dm_${dmKey}`);
    setIsUserSearchModalOpen(false);
    setMobileView('chat');

    // Add to persistent directChatUsers list
    setDirectChatUsers(prev => {
      if (prev.some(u => u.id === targetUser.id)) {
        return prev.map(u => u.id === targetUser.id ? { ...u, ...targetUser } : u);
      }
      return [targetUser, ...prev];
    });
  };

  // -------------------------------------------------------------
  // CONTACT ADMIN / INFLUENCER PROOF SUBMISSION
  // -------------------------------------------------------------
  const handleContactAdminSubmit = async (e) => {
    e.preventDefault();
    setContactStatusMsg('');

    if (!contactForm.name || !contactForm.message) {
      setContactStatusMsg('Please enter your name and query message.');
      return;
    }

    // Influencer validation: Proof is strictly MANDATORY
    if (contactType === 'creator') {
      if (!contactForm.social_account_id) {
        setContactStatusMsg('Please provide your official social handle (YouTube, X, or Instagram).');
        return;
      }
      if (!contactForm.proof_file) {
        setContactStatusMsg('MANDATORY: You must upload proof of image/video (< 10MB) showing your account dashboard/analytics to verify real influencer ownership.');
        return;
      }
    }

    const newQuery = {
      id: 'query_' + Date.now(),
      type: contactType, // 'user' or 'creator'
      name: contactForm.name,
      email: currentUser?.email || contactForm.email || 'Anonymous Citizen',
      user_id: currentUser?.id || 'guest',
      username: currentUser?.username || 'unregistered',
      social_account_id: contactForm.social_account_id,
      message: contactForm.message,
      proof_file: contactForm.proof_file,
      proof_file_name: contactForm.proof_file_name,
      ip: '152.59.10.42',
      status: 'pending',
      created_at: new Date().toLocaleString()
    };

    setAdminQueries([newQuery, ...adminQueries]);
    broadcastCrossTab({ type: 'NEW_QUERY', query: newQuery });
    try {
      const apiUrl = getCommunityApiUrl('/api/community/contact');

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuery)
      });
    } catch {}

    setContactForm({
      name: '',
      email: '',
      social_account_id: '',
      message: '',
      proof_file: null,
      proof_file_name: ''
    });
    alert('✓ Your message has been directly dispatched to Administrator Om Kumar! Influencer proofs are inspected manually for verified badge activation.');
    setIsContactAdminOpen(false);
  };

  // -------------------------------------------------------------
  // ADMIN SUPERPOWERS (DELETE CHAT, BAN USER & BAN IP, VERIFY TICKS)
  // -------------------------------------------------------------
  const handleDeleteMessage = async (msgId) => {
    if (!currentUser?.is_admin) return;
    if (confirm('Delete this message permanently from the platform?')) {
      setMessages(messages.filter(m => m.id !== msgId));
      broadcastCrossTab({ type: 'DELETE_MESSAGE', message_id: msgId });
      try {
        const apiUrl = getCommunityApiUrl(`/api/community/messages/${msgId}`);
        await fetch(apiUrl, { method: 'DELETE' });
      } catch {}
    }
  };

  const handleBanUserAndIp = async (userId, targetUsername) => {
    if (!currentUser?.is_admin) return;
    if (confirm(`Are you sure you want to PERMANENTLY BAN user @${targetUsername} and blacklist their IP address? They will be logged out and unable to access chats.`)) {
      // Mark user banned
      setUsers(users.map(u => u.id === userId ? { ...u, is_banned: 1 } : u));
      // Remove all their messages
      setMessages(messages.filter(m => m.user_id !== userId));
      broadcastCrossTab({ type: 'USER_BANNED', banned_user_id: userId, target_username: targetUsername });
      const adminToken = localStorage.getItem('propagandus_admin_key') || '';
      try {
        await fetch(getCommunityApiUrl('/api/community/admin/ban'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { 'x-admin-key': adminToken } : {})
          },
          body: JSON.stringify({
            user_id: userId,
            target_username: targetUsername,
            admin_token: adminToken
          })
        });
      } catch {}
      alert(`✓ User @${targetUsername} has been permanently blocked. IP address added to blocked_ips blacklist.`);
    }
  };

  const handleToggleVerifiedBadge = async (userId, badgeType) => {
    if (!currentUser?.is_admin) return;
    const current = users.find(u => u.id === userId)?.verified_type;
    const next = current === badgeType ? 'none' : badgeType;
    setUsers(users.map(u => u.id === userId ? { ...u, verified_type: next } : u));
    const adminToken = localStorage.getItem('propagandus_admin_key') || '';
    try {
      await fetch(getCommunityApiUrl('/api/community/admin/verify-badge'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'x-admin-key': adminToken } : {})
        },
        body: JSON.stringify({
          user_id: userId,
          badge_type: badgeType,
          admin_token: adminToken
        })
      });
    } catch {}
  };

  // Filter messages for current active room
  const activeMessages = messages.filter(m => {
    if (activeChatRoom === 'public') return m.channel_id === 'public';
    return m.channel_id === activeChatRoom;
  });

  // User's unread notifications count:
  // Dynamically match by recipient username, recipient ID, requester ID, or creator ID for channel requests
  const myNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    const curUname = (currentUser.username || '').trim().toLowerCase();
    const notifUname = (n.recipient_username || '').trim().toLowerCase();
    if (notifUname && notifUname === curUname) return true;
    if (n.recipient_id && n.recipient_id === currentUser.id) return true;
    if (n.requester_id && n.requester_id === currentUser.id && n.type === 'channel_admit') return true;
    if (n.type === 'channel_request' && n.channel_id) {
      const chan = channels.find(c => c.id === n.channel_id);
      if (chan && (chan.creator_id === currentUser.id || (chan.creator_username || '').trim().toLowerCase() === curUname)) return true;
    }
    if (currentUser.is_admin && (notifUname === 'admin' || notifUname === 'omkumar' || notifUname === 'omkumar_admin')) {
      return true;
    }
    return false;
  });

  // Filter channels strictly: private channels are HIDDEN unless user is creator, member, or pending requester
  const visibleChannels = channels.filter(chan => {
    if (!currentUser) {
      return activeChatRoom === chan.id || activeChatRoom === `gate_${chan.id}`;
    }
    if (currentUser.is_admin) return true;
    if (chan.creator_id === currentUser.id) return true;
    if (Array.isArray(chan.members) && chan.members.includes(currentUser.id)) return true;
    if (Array.isArray(chan.pending_requests) && chan.pending_requests.some(r => r.user_id === currentUser.id)) return true;
    if (activeChatRoom === chan.id || activeChatRoom === `gate_${chan.id}`) return true;
    return false;
  });

  return (
    <div className="flex-1 min-h-0 h-full w-full bg-[#FFFDF5] text-black font-sans flex flex-col overflow-hidden">
      
      {/* Admin God-Mode Impersonation Sticky Banner */}
      {impersonationInfo && currentUser && (
        <div className="bg-purple-900 text-white px-3 sm:px-6 py-2 border-b-2 border-black flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold shrink-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-yellow-400 text-black rounded text-[10px] font-black uppercase">
              Admin God-Mode Active
            </span>
            <span>
              Directly viewing account of <strong>@{currentUser.username}</strong> ({currentUser.name}). Private channels &amp; DMs accessible.
            </span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="px-3 py-1 bg-popYellow hover:bg-yellow-400 text-black font-black uppercase text-[11px] rounded-xl border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 transition-all"
          >
            <span>Exit God-Mode &amp; Return to Admin</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Top Pop Art Navigation Bar */}
      <header className="shrink-0 z-40 bg-white border-b-2 sm:border-b-3 border-black shadow-[0_3px_0_0_#000]">
        
        {/* Main Bar */}
        <div className="max-w-[1800px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Quick Return to Homepage (Visible on BOTH PC & Phone) */}
            <button
              type="button"
              onClick={() => {
                if (onSelectPage) onSelectPage('propagandus');
                else {
                  window.location.hash = '';
                  window.location.pathname = '/';
                }
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-popYellow hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all active:translate-y-0.5 shrink-0"
              title="Return to Homepage"
            >
              <Home className="w-4 h-4 text-black shrink-0" />
              <span className="font-comic tracking-wider">HOME</span>
            </button>

            <h1 className="hidden md:flex font-comic text-sm sm:text-lg md:text-2xl text-black leading-none items-center gap-1 sm:gap-2 shrink-0">
              <span>COMMUNITY</span>
              <span className="text-saffron-dark hidden xs:inline">CENTRAL</span>
              <IndianFlagLogo size="xs" />
            </h1>

            {/* Quick Directory & Creators Nav Link Buttons */}
            {onSelectPage && (
              <div className="hidden md:flex items-center gap-1.5 ml-2 border-l-2 border-gray-200 pl-3">
                <button
                  type="button"
                  onClick={() => onSelectPage('propagandus')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-black rounded-lg text-[10px] font-black uppercase shadow-xs flex items-center gap-1 transition-all"
                  title="Go to Propagandus Directory"
                >
                  <Database className="w-3 h-3 text-saffron-dark" />
                  <span>Directory</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPage('nationalists')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-black rounded-lg text-[10px] font-black uppercase shadow-xs flex items-center gap-1 transition-all"
                  title="Go to Nationalist Creators"
                >
                  <Award className="w-3 h-3 text-tirangaGreen" />
                  <span>Creators</span>
                </button>
              </div>
            )}
          </div>

          {/* User Account & Actions Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Donate / Support Button (Desktop Only: heart-only) */}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="hidden md:flex p-2 bg-popYellow hover:bg-yellow-400 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] items-center justify-center transition-all active:translate-y-0.5 shrink-0"
              title="Support / Donate to the Developer Team"
            >
              <Heart className="w-4 h-4 text-popRed fill-popRed" />
            </button>

            {/* User Search Button (Desktop Only) */}
            <button
              onClick={() => setIsUserSearchModalOpen(true)}
              className="hidden md:flex p-2 bg-white hover:bg-amber-100 border-2 border-black rounded-xl text-black font-black shadow-[2px_2px_0px_#000] transition-all"
              title="Search Friends & Chat"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            {currentUser && (
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="relative p-2 bg-white hover:bg-amber-100 border-2 border-black rounded-xl text-black font-black shadow-[2px_2px_0px_#000] transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {myNotifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-popRed text-white text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center border border-black animate-bounce">
                    {myNotifications.length}
                  </span>
                )}
              </button>
            )}

            {/* Profile / Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-amber-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] transition-all"
                >
                  <img
                    src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
                    alt=""
                    className="w-6 h-6 rounded-full border border-black object-cover"
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-black flex items-center gap-1">
                      <span>@{currentUser.username}</span>
                      <VerifiedBadge type={currentUser.verified_type} size="sm" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-100 hover:bg-red-200 border-2 border-black rounded-xl text-black font-black shadow-[2px_2px_0px_#000]"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setIsAuthModalOpen(true); setAuthMode('login'); }}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsAuthModalOpen(true); setAuthMode('register'); }}
                  className="px-3 py-1.5 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
                >
                  Create ID
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Sub-Header Division: Title, Search & Heart-Only Donate Icon */}
        <div className="md:hidden border-t-2 border-black bg-[#FFFDF9] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shadow-xs">
          <h1 className="font-comic text-sm sm:text-lg md:text-2xl text-black leading-none flex items-center gap-1 sm:gap-2 shrink-0">
            <span>COMMUNITY</span>
            <span className="text-saffron-dark">CENTRAL</span>
            <IndianFlagLogo size="xs" />
          </h1>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* User Search Button */}
            <button
              type="button"
              onClick={() => setIsUserSearchModalOpen(true)}
              className="p-2 bg-white hover:bg-amber-100 border-2 border-black rounded-xl text-black font-black shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
              title="Search Friends & Chat"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Donate Heart Icon Only */}
            <button
              type="button"
              onClick={() => setIsDonateOpen(true)}
              className="p-2 bg-popYellow hover:bg-yellow-400 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex items-center justify-center transition-all active:translate-y-0.5 shrink-0"
              title="Support / Donate"
            >
              <Heart className="w-4 h-4 text-popRed fill-popRed" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Community Workspace Layout (Enlarged PC Chat Proportions & Responsive Phone Mode) */}
      <div className="max-w-[1800px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 flex-1 min-h-0 flex flex-col md:flex-row gap-3 lg:gap-4 overflow-hidden">
        
        {/* Left Sidebar: Channels & Navigation (Responsive for Mobile) */}
        <aside className={`w-full md:w-72 lg:w-80 shrink-0 h-full min-h-0 flex flex-col gap-3 overflow-y-auto pr-1 pb-1 select-none no-scrollbar ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Public Chat Tab */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3">
            <h3 className="font-comic text-base uppercase text-black flex items-center justify-between">
              <span>Rooms &amp; Theaters</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-black text-white rounded-full">
                {visibleChannels.length + 1} ROOMS
              </span>
            </h3>

            <button
              onClick={() => {
                setActiveChatRoom('public');
                setActiveChannelObj(null);
                setActiveDmUser(null);
                setMobileView('chat');
              }}
              className={`w-full text-left p-3 rounded-xl border-2 border-black font-black text-xs uppercase flex items-center justify-between transition-all ${
                activeChatRoom === 'public'
                  ? 'bg-popYellow text-black shadow-[3px_3px_0px_#000] translate-x-1'
                  : 'bg-white hover:bg-amber-50 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">📢</span>
                <div>
                  <div className="font-black">Public Community</div>
                  <div className="text-[10px] font-normal normal-case text-gray-600">Open citizen discussion</div>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-tirangaGreen animate-pulse"></span>
            </button>
          </div>

          {/* User Channels (Strictly Hidden from Unauthorized Users) */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-comic text-sm uppercase text-black flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-saffron-dark" />
                <span>Private Channels ({visibleChannels.length})</span>
              </h3>
              <button
                onClick={() => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setIsCreateChannelModalOpen(true);
                }}
                className="px-2.5 py-1 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-lg text-[10px] font-black uppercase shadow-[1px_1px_0px_#000] flex items-center gap-1"
                title="Create a Channel & Invite Friends"
              >
                <Plus className="w-3 h-3" />
                <span>New Channel</span>
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {visibleChannels.length === 0 ? (
                <div className="p-3 text-center text-[11px] text-gray-500 font-bold bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  Private channels are hidden. Create your own channel or open a friend's invite link to join!
                </div>
              ) : (
                visibleChannels.map((chan) => {
                  const isSelected = activeChatRoom === chan.id || activeChatRoom === `gate_${chan.id}`;
                  const isCreator = chan.creator_id === currentUser?.id;
                  const hasPendingRequests = isCreator && (chan.pending_requests?.length || 0) > 0;

                  return (
                    <div
                      key={chan.id}
                      onClick={() => handleOpenChannel(chan)}
                      className={`p-2.5 rounded-xl border-2 border-black text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-saffron text-black shadow-[2px_2px_0px_#000] font-black'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[170px]">{chan.name}</span>
                        <div className="flex items-center gap-1">
                          {hasPendingRequests && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveChannelObj(chan);
                                setIsChannelRequestsModalOpen(true);
                              }}
                              className="px-1.5 py-0.5 bg-popRed text-white rounded-full text-[9px] font-mono animate-bounce"
                              title="Pending Join Requests"
                            >
                              {chan.pending_requests.length} Req
                            </span>
                          )}
                          <Lock className="w-3 h-3 text-gray-500" />
                        </div>
                      </div>
                      <div className="text-[10px] font-normal text-gray-600 truncate mt-0.5">
                        By @{chan.creator_username} • {chan.members?.length || 1} members
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Direct Chats Section */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-comic text-sm uppercase text-black flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Direct Chats ({directChatUsers.length})</span>
              </h3>
              <button
                onClick={() => setIsUserSearchModalOpen(true)}
                className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-black rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-xs"
                title="Search members to chat"
              >
                <Plus className="w-3 h-3" />
                <span>Find User</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {directChatUsers.length === 0 ? (
                <div className="p-3 text-center text-[11px] text-gray-500 font-bold bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  No direct chats yet. Tap any member's profile or click Find User to chat!
                </div>
              ) : (
                directChatUsers.map((u) => {
                  const dmKey = currentUser ? [currentUser.id, u.id].sort().join('_') : '';
                  const isSelected = activeChatRoom === `dm_${dmKey}`;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleStartDm(u)}
                      className={`p-2 rounded-xl border-2 border-black text-xs cursor-pointer flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? 'bg-blue-100 text-black shadow-[2px_2px_0px_#000] font-black translate-x-0.5'
                          : 'bg-white hover:bg-blue-50/50 text-gray-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                          alt=""
                          className="w-7 h-7 rounded-full border border-black object-cover shrink-0"
                        />
                        <div className="truncate text-left">
                          <div className="truncate font-black text-[11px] flex items-center gap-1">
                            <span>{u.name}</span>
                            <VerifiedBadge type={u.verified_type} size="sm" />
                          </div>
                          <div className="text-[10px] font-mono text-gray-500 truncate">@{u.username}</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-tirangaGreen shrink-0"></span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Direct Message Box if chatting with a friend */}
          {activeDmUser && (
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-2">
              <div className="text-xs font-black uppercase text-gray-500">Active Direct Chat</div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 border-2 border-black rounded-xl">
                <img
                  src={activeDmUser.avatar_url}
                  alt=""
                  className="w-8 h-8 rounded-full border border-black object-cover"
                />
                <div className="text-xs">
                  <div className="font-bold text-black">{activeDmUser.name}</div>
                  <div className="text-[10px] font-mono text-gray-600">@{activeDmUser.username}</div>
                </div>
              </div>
            </div>
          )}

          {/* Guilt-List / Sovereign Conduct & Anti-Abuse Zero Tolerance Card */}
          <div className="bg-red-50 border-2 border-black rounded-2xl p-3.5 text-xs text-black space-y-2 shadow-[2px_2px_0px_#000]">
            <div className="font-black text-red-700 uppercase flex items-center gap-1.5 text-[11px] tracking-wide">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>GUILT-LIST: ZERO TOLERANCE RULES</span>
            </div>
            <div className="text-[11px] text-gray-800 leading-snug space-y-1.5">
              <p className="flex items-start gap-1.5">
                <span className="text-red-600 font-bold">🚫</span>
                <span><strong>No abuse against Hindu deities &amp; faith:</strong> Strict ban on derogatory remarks on Bhagwan Ram, Shiva, Hanuman, or sacred symbols.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-red-600 font-bold">🚫</span>
                <span><strong>No abusive slurs against BJP leadership:</strong> Harassment or defamatory abuse directed at national leaders will not be tolerated.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-red-600 font-bold">🚫</span>
                <span><strong>No anti-national propaganda:</strong> Coordinated toolkits or abusive spam trigger instant permanent IP ban.</span>
              </p>
            </div>
            <div className="pt-1 text-[10px] font-black uppercase text-red-700 bg-red-100/70 p-1.5 rounded-lg border border-red-300 flex items-center gap-1">
              <span>⚠️ Violation = Instant IP Blacklist &amp; Chat Purge</span>
            </div>
          </div>

          {/* WhatsApp-Style Support Card */}
          <div className="bg-gradient-to-br from-[#075E54] to-[#128C7E] text-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-2.5 transition-all">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
                💬
              </div>
              <div>
                <h4 className="font-comic text-sm text-white leading-tight">COMMUNITY SUPPORT</h4>
                <p className="text-[10px] text-teal-100 font-bold">Admin Help &amp; Creator Queries</p>
              </div>
            </div>

            <p className="text-[11px] text-teal-50/90 leading-relaxed font-sans">
              Have a query, or a creator with proof of your patriotic channel? Submit directly to the admin team.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setContactType('user');
                  setIsContactAdminOpen(true);
                }}
                className="w-full px-3 py-2 bg-white hover:bg-teal-50 text-black border border-black rounded-xl text-xs font-black uppercase shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>💬 Contact Admin / Submit Query</span>
              </button>
            </div>
          </div>

        </aside>

        {/* Center: Main Chat Theater Area (Enlarged for PC & Responsive for Phone) */}
        <main className={`flex-1 min-w-0 h-full min-h-0 flex flex-col bg-white border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_#000] sm:shadow-[6px_6px_0px_#000] overflow-hidden no-scrollbar ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Chat Header */}
          <div className="bg-[#FFE600] border-b-2 sm:border-b-3 border-black p-2.5 sm:p-3.5 md:p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              {/* Mobile Back Button to return to conversations */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 bg-white border-2 border-black rounded-lg shadow-[1px_1px_0px_#000] mr-0.5 active:translate-y-0.5 shrink-0"
                title="Back to conversations"
              >
                <ArrowLeft className="w-4 h-4 text-black" />
              </button>

              {/* Mobile Direct Return to Home */}
              <button
                type="button"
                onClick={() => {
                  if (onSelectPage) onSelectPage('propagandus');
                  else {
                    window.location.hash = '';
                    window.location.pathname = '/';
                  }
                }}
                className="md:hidden p-1.5 bg-white hover:bg-amber-100 border-2 border-black rounded-lg shadow-[1px_1px_0px_#000] mr-1 active:translate-y-0.5 shrink-0"
                title="Return to Homepage"
              >
                <Home className="w-4 h-4 text-black" />
              </button>

              <div className="font-comic text-sm sm:text-base md:text-lg text-black leading-tight flex items-center gap-2 truncate">
                <span className="truncate">
                  {activeChatRoom === 'public'
                    ? 'PUBLIC CITIZEN FORUM'
                    : activeDmUser
                    ? `DIRECT CHAT: ${activeDmUser.name} (@${activeDmUser.username})`
                    : activeChannelObj?.name || 'PRIVATE CHANNEL'}
                </span>
                {activeChannelObj && activeChannelObj.creator_id === currentUser?.id && (
                  <button
                    onClick={() => setIsChannelRequestsModalOpen(true)}
                    className="px-2 py-0.5 bg-white border border-black rounded-lg text-[10px] font-black uppercase shadow-[1px_1px_0px_#000] shrink-0"
                  >
                    Admit ({activeChannelObj.pending_requests?.length || 0})
                  </button>
                )}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-gray-800 truncate">
                {activeChatRoom === 'public'
                  ? 'All registered patriotic voices welcome • Realtime sync'
                  : activeDmUser
                  ? 'End-to-end direct encrypted user session'
                  : `Host: @${activeChannelObj?.creator_username || 'creator'} • Invite-only channel`}
              </div>
            </div>

            {/* Share Channel Link Button */}
            {activeChannelObj && (
              <button
                onClick={() => {
                  const token = activeChannelObj?.join_token || activeChannelObj?.id;
                  if (!token) {
                    alert('Channel invite link is generating. Please wait a moment.');
                    return;
                  }
                  const link = `${window.location.origin}/?page=community&join=${encodeURIComponent(token)}`;
                  navigator.clipboard.writeText(link);
                  alert(`✓ Channel invite link copied to clipboard!\nShare this with friends: ${link}`);
                }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white hover:bg-gray-100 border-2 border-black rounded-xl text-[10px] sm:text-xs font-black uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1 sm:gap-1.5 shrink-0"
                title="Copy Channel Invite Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invite Friends</span>
              </button>
            )}
          </div>

          {/* Gate View if user is NOT yet approved for a Private Channel */}
          {activeChatRoom.startsWith('gate_') ? (
            <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-3 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0px_#000]">
                🔒
              </div>
              <h3 className="font-comic text-2xl text-black uppercase">
                {activeChannelObj?.name}
              </h3>
              <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                This is a private sovereign channel created by <strong>@{activeChannelObj?.creator_username}</strong>. Just like Google Meet, the channel creator must approve your participation request before you can enter.
              </p>

              {activeChannelObj?.pending_requests?.some(r => r.user_id === currentUser?.id) ? (
                <div className="p-3 bg-amber-100 border-2 border-black rounded-xl text-xs font-black text-amber-900 animate-pulse">
                  ⏳ Access Request Pending. Waiting for channel creator to admit you...
                </div>
              ) : (
                <button
                  onClick={() => handleRequestJoinChannel(activeChannelObj?.id)}
                  className="px-6 py-3 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Request to Participate (Join)</span>
                </button>
              )}
            </div>
          ) : (
            /* Active Messages Chat Feed (Internal Container Scroll Only) */
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 p-2.5 sm:p-4 md:p-5 lg:p-6 overflow-y-auto space-y-2.5 sm:space-y-3 bg-white/70 no-scrollbar"
            >
              {activeMessages.length === 0 ? (
                <div className="text-center py-16 text-gray-400 font-bold text-xs space-y-2">
                  <div className="text-3xl">🕊️</div>
                  <div>No messages here yet. Be the first to start the patriotic conversation!</div>
                </div>
              ) : (
                activeMessages.map((msg, idx) => {
                  const isMe = msg.user_id === currentUser?.id;
                  const prevMsg = idx > 0 ? activeMessages[idx - 1] : null;
                  const isSameSenderAsPrev = prevMsg && prevMsg.user_id === msg.user_id;

                  const senderUser = users.find(u => u.id === msg.user_id) || {
                    id: msg.user_id,
                    name: msg.user_name,
                    username: msg.username,
                    avatar_url: msg.user_avatar,
                    verified_type: msg.verified_type,
                    created_at: msg.created_at
                  };

                  return (
                    <div
                      key={msg.id}
                      className={`relative group flex gap-1.5 sm:gap-2.5 max-w-[92%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[68%] xl:max-w-[60%] ${
                        isSameSenderAsPrev ? 'mt-0.5 sm:mt-1' : 'mt-2.5 sm:mt-3.5'
                      } ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {/* Avatar column: ONLY shown on first message in a consecutive group for other users */}
                      {!isMe && (
                        <div className="w-7 sm:w-8 shrink-0">
                          {!isSameSenderAsPrev ? (
                            <button
                              type="button"
                              onClick={() => setViewingUserProfile(senderUser)}
                              className="shrink-0 transition-transform hover:scale-105 focus:outline-none"
                              title={`View ${msg.user_name}'s profile`}
                            >
                              <img
                                src={msg.user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.username}`}
                                alt=""
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border-2 border-black object-cover bg-white shadow-sm"
                              />
                            </button>
                          ) : (
                            <div className="w-7 sm:w-8" />
                          )}
                        </div>
                      )}

                      {/* Message Bubble Column */}
                      <div className={`space-y-1 w-full flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        
                        {/* Sender Info Header: ONLY shown on the FIRST message of consecutive cluster, never repeated! */}
                        {!isSameSenderAsPrev && !isMe && (
                          <div className="flex items-center gap-1.5 text-[11px] pb-0.5">
                            <button
                              type="button"
                              onClick={() => setViewingUserProfile(senderUser)}
                              className="font-black text-black hover:underline cursor-pointer flex items-center gap-1 text-left"
                              title="Click to view user profile & username"
                            >
                              <span>{msg.user_name}</span>
                              <VerifiedBadge type={msg.verified_type} size="sm" />
                            </button>
                          </div>
                        )}

                        {/* WhatsApp-Style Pop Art Message Bubble */}
                        <div
                          id={'comm_msg_' + msg.id}
                          onDoubleClick={() => setReplyTarget({ id: msg.id, user_name: msg.user_name, content: msg.content })}
                          className={`relative p-2.5 sm:p-3 rounded-2xl border-2 border-black text-xs font-semibold leading-relaxed shadow-[2px_2px_0px_#000] break-words transition-all duration-300 ${
                            isMe ? 'bg-[#DCF8C6] text-black rounded-tr-xs' : 'bg-white text-gray-900 rounded-tl-xs'
                          } ${highlightedMsgId === msg.id ? 'ring-4 ring-popYellow bg-yellow-100 scale-[1.01]' : ''}`}
                        >
                          {/* WhatsApp-Style Quoted Reply Box with Jump to Message */}
                          {msg.reply_to && (
                            <div
                              onClick={() => handleScrollToMessage(msg.reply_to.id || msg.reply_to.message_id)}
                              className="mb-2 p-2 bg-black/5 hover:bg-black/10 border-l-4 border-tirangaGreen rounded-r-lg text-[11px] space-y-0.5 cursor-pointer transition-colors select-none group/quote"
                              title="Click to jump to quoted message"
                            >
                              <div className="font-black text-tirangaGreen flex items-center justify-between">
                                <span>{msg.reply_to.user_name || msg.reply_to.sender || 'User'}</span>
                                <span className="text-[9px] text-gray-500 font-mono group-hover/quote:underline">↳ jump</span>
                              </div>
                              <div className="text-gray-600 line-clamp-2 italic font-normal">
                                {msg.reply_to.content || msg.reply_to.text}
                              </div>
                            </div>
                          )}

                          {/* Text Content with highlighted @mentions */}
                          {msg.content && (
                            <div className="whitespace-pre-wrap">
                              {msg.content.split(/(@[a-zA-Z0-9_.]+)/g).map((part, pIdx) => {
                                if (part.startsWith('@')) {
                                  return (
                                    <span
                                      key={pIdx}
                                      className="px-1 py-0.2 bg-black text-popYellow font-mono font-bold rounded mx-0.5"
                                    >
                                      {part}
                                    </span>
                                  );
                                }
                                return part;
                              })}
                            </div>
                          )}

                          {/* File Attachments with In-App Media Lightbox Opener & WhatsApp Buffering */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="space-y-1.5 pt-1.5">
                              {msg.attachments.map((file, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="rounded-xl border-2 border-black overflow-hidden bg-white shadow-sm relative group/attach"
                                >
                                  {file.type === 'image' ? (
                                    <div
                                      onClick={() => !file.is_uploading && setActiveMediaViewer({ type: 'image', url: resolveMediaUrl(file.url), name: file.name, size: file.size })}
                                      className="cursor-pointer relative overflow-hidden max-h-60 sm:max-h-72 md:max-h-80 lg:max-h-96 flex items-center justify-center bg-gray-50"
                                      title={file.is_uploading ? 'Uploading to database...' : 'Tap to open high-res image'}
                                    >
                                      <img
                                        src={resolveMediaUrl(file.url)}
                                        alt={file.name}
                                        className="max-h-60 sm:max-h-72 md:max-h-80 lg:max-h-96 w-auto max-w-full object-cover hover:scale-102 transition-transform"
                                      />

                                      {/* WhatsApp-Style Circular Buffering Animation Overlay */}
                                      {file.is_uploading ? (
                                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 select-none">
                                          <div className="relative w-14 h-14 bg-black/60 rounded-full border-2 border-white/20 flex items-center justify-center shadow-lg">
                                            <div className="w-10 h-10 rounded-full border-3 border-white/20 border-t-white animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <div className="w-2.5 h-2.5 rounded-full bg-white/90 animate-pulse" />
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-black text-white uppercase tracking-wider mt-2 bg-black/70 px-2.5 py-0.5 rounded-full shadow">
                                            Uploading...
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/25 flex items-center justify-center transition-colors">
                                          <Eye className="w-6 h-6 text-white opacity-0 group-hover/attach:opacity-100 transition-opacity drop-shadow" />
                                        </div>
                                      )}
                                    </div>
                                  ) : file.type === 'video' ? (
                                    <div
                                      onClick={() => !file.is_uploading && setActiveMediaViewer({ type: 'video', url: resolveMediaUrl(file.url), name: file.name, size: file.size })}
                                      className="cursor-pointer relative bg-black max-h-56 sm:max-h-68 md:max-h-80 flex items-center justify-center"
                                      title={file.is_uploading ? 'Uploading video...' : 'Tap to open in-app video player'}
                                    >
                                      <video className="max-h-56 sm:max-h-68 md:max-h-80 w-full object-cover opacity-80">
                                        <source src={resolveMediaUrl(file.url)} />
                                      </video>
                                      {file.is_uploading ? (
                                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
                                          <div className="w-12 h-12 rounded-full border-3 border-white/20 border-t-white animate-spin" />
                                          <span className="text-[10px] font-bold text-white uppercase mt-2">Uploading...</span>
                                        </div>
                                      ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors">
                                          <div className="w-12 h-12 rounded-full bg-white/95 border-2 border-black flex items-center justify-center shadow-lg">
                                            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => !file.is_uploading && setActiveMediaViewer({ type: file.type === 'pdf' ? 'pdf' : 'file', url: resolveMediaUrl(file.url), name: file.name, size: file.size })}
                                      className="p-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-amber-50/50"
                                      title={file.is_uploading ? 'Uploading file...' : (file.type === 'pdf' ? 'Tap to view PDF in app' : 'Tap to open file')}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <FileText className="w-4 h-4 text-saffron-dark shrink-0" />
                                        <span className="font-bold truncate">{file.name}</span>
                                        <span className="text-[10px] text-gray-500 font-mono">({file.size})</span>
                                      </div>
                                      {file.is_uploading ? (
                                        <span className="p-1 px-2 text-black font-bold text-[10px] bg-amber-100 rounded border border-black uppercase flex items-center gap-1 animate-pulse">
                                          <div className="w-2.5 h-2.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                                          <span>Uploading</span>
                                        </span>
                                      ) : (
                                        <span className="p-1 text-black font-bold text-[10px] bg-gray-100 rounded border border-black uppercase">
                                          {file.type === 'pdf' ? 'View PDF' : 'Open'}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* GIF Display */}
                          {msg.gif_url && (
                            <div className="rounded-xl border-2 border-black overflow-hidden shadow-sm mt-1.5">
                              <img src={resolveMediaUrl(msg.gif_url)} alt="GIF" className="max-h-52 w-auto object-cover" />
                            </div>
                          )}

                          {/* WhatsApp-Style Full Rich Link Previews */}
                          {(() => {
                            const urls = extractAllUrls(msg.content, msg.media_links);
                            if (urls.length === 0) return null;
                            return (
                              <div className="space-y-1.5 pt-1.5">
                                {urls.map((link, lIdx) => (
                                  <WhatsAppLinkPreview key={lIdx} url={link} />
                                ))}
                              </div>
                            );
                          })()}

                          {/* Bottom Clean Timestamp & Delivery Status (WhatsApp Style) */}
                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] font-mono text-gray-500 select-none">
                            <span>{msg.created_at}</span>
                            {msg.is_uploading ? (
                              <Clock className="w-2.5 h-2.5 text-gray-400 animate-pulse" title="Uploading & sending..." />
                            ) : (
                              <CheckCheck className="w-3 h-3 text-saffron" title="Sent & Synchronized" />
                            )}
                          </div>

                          {/* WhatsApp-Style Reaction Pills Docked at Bottom of Bubble */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`flex flex-wrap items-center gap-1 mt-1.5 -mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              {Object.entries(msg.reactions).map(([emoji, userList]) => {
                                if (!userList || userList.length === 0) return null;
                                const didIReact = userList.some(u => u.user_id === currentUser?.id);
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(msg.id, emoji)}
                                    className={`px-1.5 py-0.5 rounded-full border text-[11px] font-black flex items-center gap-1 shadow-sm transition-transform hover:scale-110 active:scale-95 ${
                                      didIReact
                                        ? 'bg-popYellow text-black border-2 border-black'
                                        : 'bg-white text-gray-800 border-black hover:bg-gray-50'
                                    }`}
                                    title={userList.map(u => u.username).join(', ')}
                                  >
                                    <span>{emoji}</span>
                                    <span className="text-[10px]">{userList.length}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* WhatsApp Action Menu on Hover (Reaction Smiley Trigger, Reply, Admin) */}
                          <div
                            className={`opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3.5 ${
                              isMe ? 'left-2' : 'right-2'
                            } z-20 flex items-center gap-1`}
                          >
                            {/* WhatsApp-Style Hover Smiley Button Trigger */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReactionPickerMsgId(activeReactionPickerMsgId === msg.id ? null : msg.id);
                              }}
                              className="w-7 h-7 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] hover:bg-popYellow transition-transform hover:scale-110 active:scale-95 text-gray-700 hover:text-black"
                              title="React to message"
                            >
                              <Smile className="w-3.5 h-3.5" />
                            </button>

                            {/* Quick Reply Button */}
                            <button
                              type="button"
                              onClick={() => setReplyTarget({ id: msg.id, user_name: msg.user_name, content: msg.content })}
                              className="w-7 h-7 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] hover:bg-popYellow transition-transform hover:scale-110 active:scale-95 text-gray-700 hover:text-black"
                              title="Reply (or double-click bubble)"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            {currentUser?.is_admin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="w-7 h-7 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] text-red-600 hover:bg-red-50"
                                  title="Admin: Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                {!isMe && (
                                  <button
                                    type="button"
                                    onClick={() => handleBanUserAndIp(msg.user_id, msg.username)}
                                    className="w-7 h-7 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] text-black hover:bg-rose-100 hover:text-red-700"
                                    title="Admin: Ban User & Block IP"
                                  >
                                    <Ban className="w-3 h-3" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          {/* WhatsApp Popover: 7 Quick Emojis shown when smiley trigger is clicked */}
                          {activeReactionPickerMsgId === msg.id && (
                            <div
                              className={`absolute -top-12 ${
                                isMe ? 'left-2' : 'right-2'
                              } z-30 flex items-center gap-1 bg-white border-2 border-black rounded-full px-2.5 py-1 shadow-[4px_4px_0px_#000] animate-in fade-in zoom-in-95`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {['👍', '❤️', '😂', '😮', '😢', '🙏', '🇮🇳'].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    handleToggleReaction(msg.id, emoji);
                                    setActiveReactionPickerMsgId(null);
                                  }}
                                  className="p-1 text-base hover:scale-140 transition-transform focus:outline-none"
                                  title={`React ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => setActiveReactionPickerMsgId(null)}
                                className="p-0.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 ml-0.5"
                                title="Close"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>
          )}

          {/* Tag Auto-complete Suggestion Box */}
          {tagSuggestion && tagSuggestion.length > 0 && (
            <div className="bg-white border-t-2 border-black px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs shrink-0">
              <span className="text-[10px] font-black uppercase text-gray-500">Mention User:</span>
              {tagSuggestion.map(u => (
                <button
                  key={u.id}
                  onClick={() => insertTag(u.username)}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-black rounded-lg font-mono font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <span>@{u.username}</span>
                  {u.verified_type === 'influencer' && <span>🌟</span>}
                  {u.verified_type === 'citizen' && <span>🔹</span>}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp-Style Quoted Reply Banner above Input */}
          {replyTarget && (
            <div className="bg-amber-50 border-t-2 border-black px-4 py-2 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-1 self-stretch bg-tirangaGreen rounded"></div>
                <div className="truncate">
                  <div className="font-black text-black">
                    Replying to <strong>{replyTarget.user_name || 'User'}</strong>
                  </div>
                  <div className="text-[11px] text-gray-600 truncate italic">
                    {replyTarget.content || 'Attachment'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="p-1 hover:bg-gray-200 rounded-full font-black text-sm"
                title="Cancel Reply"
              >
                ✕
              </button>
            </div>
          )}

          {/* WhatsApp-Style Staged Media/File Dock */}
          {attachedFiles.length > 0 && (
            <div className="bg-amber-50/80 border-t-2 border-black p-2.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar shrink-0">
              {attachedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border-2 border-black bg-white shadow-[2px_2px_0px_#000] shrink-0"
                >
                  {f.type === 'image' ? (
                    <div className="relative w-20 h-20 bg-gray-100 flex items-center justify-center">
                      <img
                        src={f.previewUrl || f.url}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono px-1 py-0.5 truncate text-center">
                        {f.size}
                      </span>
                    </div>
                  ) : f.type === 'video' ? (
                    <div className="relative w-24 h-20 bg-black flex flex-col items-center justify-center p-1 text-white">
                      <Video className="w-6 h-6 text-saffron mb-1" />
                      <span className="text-[9px] font-bold truncate max-w-full">{f.name}</span>
                      <span className="text-[8px] font-mono text-gray-300">{f.size}</span>
                    </div>
                  ) : (
                    <div className="w-28 h-20 bg-white p-2 flex flex-col items-center justify-center text-center">
                      <FileText className="w-6 h-6 text-saffron mb-1" />
                      <span className="text-[10px] font-black truncate max-w-full text-black">{f.name}</span>
                      <span className="text-[8px] font-mono text-gray-500">{f.size}</span>
                    </div>
                  )}

                  {/* Remove Attachment Button (Top-Right X) */}
                  <button
                    type="button"
                    onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow transition-colors"
                    title="Remove attachment"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add more files shortcut button */}
              <label
                className="w-16 h-20 border-2 border-dashed border-black/40 hover:border-black rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white/70 hover:bg-white text-gray-700 hover:text-black transition-all shrink-0 active:scale-95"
                title="Add another file or photo"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase mt-1">Add</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf,text/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* GIPHY Search & Selection Drawer */}
          {showGifPicker && (
            <div className="bg-white border-t-3 border-black p-3.5 shrink-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-black">GIPHY Sovereign Reactions</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-black text-white rounded">Powered by GIPHY</span>
                </div>
                <button onClick={() => setShowGifPicker(false)} className="text-xs font-bold p-1 hover:bg-gray-100 rounded">✕ Close</button>
              </div>

              {/* Live Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search GIPHY (e.g. salute, namaste, modi, proud, cheer, victory)..."
                  value={giphyQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setGiphyQuery(q);
                    fetchGiphyGifs(q);
                  }}
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:bg-white focus:outline-none shadow-sm"
                />
                {giphyQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setGiphyQuery('');
                      fetchGiphyGifs('');
                    }}
                    className="absolute right-2.5 top-2.5 text-xs text-gray-500 hover:text-black font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Fast Keyword Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                {['Trending', '🇮🇳 Jai Hind', 'Salute', 'Pride', 'Victory', 'Clap', 'Namaste', 'Modi'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      const clean = cat.replace('🇮🇳 ', '');
                      setGiphyQuery(clean);
                      fetchGiphyGifs(clean === 'Trending' ? '' : clean);
                    }}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-popYellow text-black border border-black rounded-lg font-black uppercase whitespace-nowrap text-[10px] shadow-sm transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Results Grid */}
              {giphyLoading ? (
                <div className="py-8 text-center text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-saffron" />
                  <span>Searching GIPHY...</span>
                </div>
              ) : giphyResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-500 font-bold">
                  No GIFs found for "{giphyQuery}". Try another search!
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
                  {giphyResults.map(g => (
                    <img
                      key={g.id}
                      src={g.url}
                      alt={g.title || 'GIF'}
                      onClick={() => handleSendGif(g.url)}
                      className="h-20 w-full object-cover rounded-lg border-2 border-black cursor-pointer hover:scale-105 active:scale-95 transition-transform bg-gray-100 shadow-sm"
                      title={g.title}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Message Input Bar */}
          <div className="bg-white border-t-2 sm:border-t-3 border-black p-2 sm:p-3 md:p-3.5 shrink-0">
            {(isBannedByIp || currentUser?.is_banned) ? (
              <div className="bg-red-600 text-white p-2.5 sm:p-3 rounded-2xl border-2 border-black font-black text-xs text-center uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000]">
                <Ban className="w-4 h-4 text-popYellow shrink-0" />
                <span className="truncate sm:whitespace-normal">Access Blocked: Your account or IP address has been permanently blacklisted.</span>
              </div>
            ) : !currentUser ? (
              <div className="bg-amber-50 border-2 border-black p-2 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="font-black text-black text-center sm:text-left text-[11px] sm:text-xs">
                  🔒 You must have a registered ID to chat, upload files, or create channels.
                </span>
                <button
                  onClick={() => { setIsAuthModalOpen(true); setAuthMode('register'); }}
                  className="px-3.5 py-1.5 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl font-black uppercase text-xs shadow-[2px_2px_0px_#000] shrink-0"
                >
                  Create ID Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
                
                {/* File Attachment Button (< 10MB) */}
                <label
                  className="p-2 sm:p-2.5 bg-white hover:bg-amber-100 border-2 border-black rounded-xl text-black cursor-pointer shadow-[2px_2px_0px_#000] shrink-0 active:translate-y-0.5"
                  title="Upload Image/Video/PDF (<10MB)"
                >
                  <Paperclip className="w-4 h-4" />
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,application/pdf,text/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* GIF Button */}
                <button
                  type="button"
                  onClick={() => setShowGifPicker(prev => !prev)}
                  className="p-2 sm:p-2.5 bg-white hover:bg-amber-100 border-2 border-black rounded-xl text-black font-black text-[11px] sm:text-xs shadow-[2px_2px_0px_#000] shrink-0 active:translate-y-0.5"
                  title="Send GIF"
                >
                  GIF
                </button>

                {/* Main Text Input */}
                <div className="flex-1 min-w-0 relative">
                  <input
                    type="text"
                    placeholder={attachedFiles.length > 0 ? "Add a caption..." : "Type message... (Use @username to tag someone)"}
                    value={inputText}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  className="p-2 sm:px-4 md:px-5 sm:py-2.5 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1.5 active:translate-y-0.5 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>

              </form>
            )}
          </div>

        </main>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: REGISTRATION & LOGIN (INSTAGRAM STYLE) */}
      {/* ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇮🇳</span>
                <h3 className="font-comic text-xl text-black">
                  {authMode === 'register' ? 'CREATE SOVEREIGN ID' : 'COMMUNITY LOGIN'}
                </h3>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-3 text-xs font-sans">
                {regError && (
                  <div className="p-2.5 bg-red-100 border-2 border-black rounded-xl text-red-900 font-bold text-xs">
                    {regError}
                  </div>
                )}

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Your unique username (e.g. <code>rahul89_sd</code>) will be auto-generated from your name. You can customize it in Profile later.
                  </p>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">
                    Email Address (@gmail or @outlook only) *
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-mono font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Security Policy: Only genuine <strong>@gmail.com</strong> and <strong>@outlook.com</strong> IDs permitted.
                  </p>
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Set Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all mt-2"
                >
                  Create My ID &amp; Enter Community
                </button>

                <div className="text-center pt-2 text-xs">
                  Already have an ID?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setRegError(''); }}
                    className="font-black text-saffron-dark hover:underline"
                  >
                    Login here
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3.5 text-xs font-sans">
                {loginError && (
                  <div className="p-2.5 bg-red-100 border-2 border-black rounded-xl text-red-900 font-bold text-xs">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Email or Username</label>
                  <input
                    type="text"
                    placeholder="user@gmail.com or @username"
                    value={loginForm.emailOrUsername}
                    onChange={(e) => setLoginForm({ ...loginForm, emailOrUsername: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-popYellow hover:bg-amber-400 text-black border-2 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all mt-2"
                >
                  Verify &amp; Enter
                </button>

                <div className="text-center pt-2 text-xs">
                  Don't have an ID yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setLoginError(''); }}
                    className="font-black text-saffron-dark hover:underline"
                  >
                    Create an ID
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROFILE & USERNAME CUSTOMIZATION */}
      {/* ========================================================================= */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="font-comic text-xl text-black">MY COMMUNITY PROFILE</h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50 border-2 border-black rounded-2xl">
              <img
                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
                alt=""
                className="w-12 h-12 rounded-xl border-2 border-black object-cover bg-white"
              />
              <div>
                <div className="font-black text-sm flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <VerifiedBadge type={currentUser.verified_type} size="sm" />
                </div>
                <div className="text-xs font-mono text-gray-700">@{currentUser.username}</div>
                <div className="text-[10px] text-gray-500">{currentUser.email}</div>
              </div>
            </div>

            {/* Local Profile Picture Upload from Device (< 10MB) */}
            <div className="p-3 bg-white border-2 border-black rounded-2xl space-y-2">
              <label className="block font-black uppercase text-gray-800 text-xs">
                Profile Picture (Upload from Device &lt; 10MB)
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.username}`}
                  alt=""
                  className="w-11 h-11 rounded-xl border-2 border-black object-cover bg-white shrink-0 shadow-sm"
                />
                <div className="flex-1">
                  <label className="bento-btn bg-black hover:bg-gray-800 text-popYellow px-3.5 py-1.5 rounded-xl text-xs font-black uppercase border border-black shadow-sm cursor-pointer inline-flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-saffron" />
                    <span>{avatarUploading ? 'Uploading...' : 'Choose from Local Folder'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={avatarUploading}
                      onChange={handleAvatarFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Select PNG, JPG, or WEBP from your computer or phone
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateUsername} className="space-y-3 text-xs">
              <div className="font-black uppercase text-gray-800">Customize Your Username</div>
              <p className="text-[11px] text-gray-600">
                You can change your username here. Only letters, numbers, dot (<code>.</code>) and underscore (<code>_</code>) allowed.
              </p>

              {usernameUpdateMsg && (
                <div className={`p-2.5 border-2 border-black rounded-xl font-bold text-xs ${
                  usernameUpdateMsg.startsWith('✓') ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
                }`}>
                  {usernameUpdateMsg}
                </div>
              )}

              <div className="flex gap-2">
                <span className="p-2.5 bg-gray-100 border-2 border-black rounded-xl font-mono font-bold text-xs flex items-center">
                  @
                </span>
                <input
                  type="text"
                  placeholder="new_username"
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-gray-50 border-2 border-black rounded-xl font-mono font-bold text-xs focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl font-black uppercase text-xs shadow-[2px_2px_0px_#000]"
                >
                  Save
                </button>
              </div>

              <div className="p-2.5 bg-red-50 border border-black rounded-xl text-[10px] text-red-800 font-bold">
                🔒 Security Note: Usernames containing names of BJP politicians, Modi, Hindu gods or admin terms are forbidden by system policy.
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW OTHER USER'S PROFILE CARD (ON TAP IN CHAT) */}
      {/* ========================================================================= */}
      {viewingUserProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-sm w-full p-6 shadow-[8px_8px_0px_#000] space-y-4 text-center">
            
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Patriot Profile</span>
              <button
                onClick={() => setViewingUserProfile(null)}
                className="p-1 hover:bg-gray-100 rounded-lg border border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative inline-block mx-auto pt-1">
              <img
                src={viewingUserProfile.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${viewingUserProfile.username}`}
                alt=""
                className="w-20 h-20 rounded-2xl border-3 border-black object-cover bg-white shadow-[3px_3px_0px_#000] mx-auto"
              />
              {viewingUserProfile.verified_type && viewingUserProfile.verified_type !== 'none' && (
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border-2 border-black shadow">
                  <VerifiedBadge type={viewingUserProfile.verified_type} size="md" />
                </div>
              )}
            </div>

            <div>
              <h4 className="font-comic text-xl text-black flex items-center justify-center gap-1.5">
                <span>{viewingUserProfile.name || viewingUserProfile.user_name}</span>
                <VerifiedBadge type={viewingUserProfile.verified_type} size="sm" />
              </h4>
              <span className="font-mono text-sm text-gray-700 font-bold block mt-0.5">
                @{viewingUserProfile.username}
              </span>

              <div className="mt-2.5 inline-block">
                {viewingUserProfile.verified_type === 'influencer' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-black text-amber-900">
                    <img src="/golden.png" alt="" className="w-3.5 h-3.5 object-contain" />
                    <span>Verified Nationalist Influencer</span>
                  </span>
                ) : (viewingUserProfile.verified_type === 'citizen' || viewingUserProfile.verified_type === 'daily') ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 border border-sky-300 rounded-full text-xs font-black text-sky-900">
                    <img src="/blue.png" alt="" className="w-3.5 h-3.5 object-contain" />
                    <span>Verified Daily Citizen</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs font-semibold text-gray-600">
                    Regular Member (No Tick)
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              {currentUser && currentUser.id !== viewingUserProfile.id && (
                <button
                  type="button"
                  onClick={() => {
                    handleStartDm(viewingUserProfile);
                    setViewingUserProfile(null);
                    setMobileView('chat');
                  }}
                  className="w-full bento-btn bg-[#FFE600] hover:bg-yellow-400 text-black py-2.5 rounded-xl font-comic text-xs font-black uppercase flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct Message</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE CHANNEL & INVITE LINK */}
      {/* ========================================================================= */}
      {isCreateChannelModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="font-comic text-xl text-black">CREATE PRIVATE CHANNEL</h3>
              <button onClick={() => setIsCreateChannelModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-semibold text-gray-700 leading-relaxed">
              Create a closed discussion channel with an invite link. Like Google Meet, any friend who taps your link must request access, and only you (the channel creator) can admit them.
            </p>

            <form onSubmit={handleCreateChannel} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Channel Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Geopolitics & Drone Tech Discussions"
                  value={channelForm.name}
                  onChange={(e) => setChannelForm({ ...channelForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Description / Topic</label>
                <textarea
                  rows={3}
                  placeholder="What is this channel about?"
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-tirangaGreen hover:bg-green-700 text-white border-2 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000]"
              >
                Launch Channel &amp; Generate Access Link
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHANNEL JOIN REQUESTS (GOOGLE MEET ADMIT / DENY) */}
      {/* ========================================================================= */}
      {isChannelRequestsModalOpen && activeChannelObj && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="font-comic text-xl text-black">
                PARTICIPANT ADMISSION REQUESTS ({activeChannelObj.pending_requests?.length || 0})
              </h3>
              <button onClick={() => setIsChannelRequestsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Channel: <strong>{activeChannelObj.name}</strong>. Admit or deny people requesting to join.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
              {!activeChannelObj.pending_requests || activeChannelObj.pending_requests.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 font-bold">
                  No pending participation requests right now.
                </div>
              ) : (
                activeChannelObj.pending_requests.map((req) => (
                  <div
                    key={req.user_id}
                    className="p-3 bg-amber-50 border-2 border-black rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img src={req.avatar_url} alt="" className="w-8 h-8 rounded-full border border-black" />
                      <div>
                        <div className="font-bold text-black">{req.name}</div>
                        <div className="text-[10px] font-mono text-gray-600">@{req.username} • {req.requested_at}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAdmitParticipant(activeChannelObj.id, req.user_id)}
                        className="px-3 py-1 bg-tirangaGreen hover:bg-green-700 text-white border border-black rounded-lg font-bold text-xs shadow-sm"
                      >
                        ✓ Admit
                      </button>
                      <button
                        onClick={() => handleDenyParticipant(activeChannelObj.id, req.user_id)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-black rounded-lg font-bold text-xs"
                      >
                        ✕ Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: USER SEARCH & START 1-ON-1 CHAT */}
      {/* ========================================================================= */}
      {isUserSearchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="font-comic text-xl text-black">SEARCH PATRIOT FRIENDS</h3>
              <button onClick={() => setIsUserSearchModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold text-black focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {users
                .filter(u => u.id !== currentUser?.id && (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase())))
                .map(u => (
                  <div
                    key={u.id}
                    className="p-2.5 bg-gray-50 hover:bg-amber-50 border-2 border-black rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full border border-black object-cover" />
                      <div>
                        <div className="font-black text-black flex items-center gap-1">
                          <span>{u.name}</span>
                          {u.verified_type === 'influencer' && <span>🌟</span>}
                          {u.verified_type === 'citizen' && <span>🔹</span>}
                        </div>
                        <div className="text-[10px] font-mono text-gray-600">@{u.username}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartDm(u)}
                      className="px-3 py-1 bg-saffron hover:bg-saffron-dark text-black border border-black rounded-lg font-bold text-xs shadow-sm flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat</span>
                    </button>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONTACT ADMIN (USER & INFLUENCER TABS) */}
      {/* ========================================================================= */}
      {isContactAdminOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-saffron-dark" />
                <h3 className="font-comic text-xl text-black">CONTACT ADMINISTRATOR OM KUMAR</h3>
              </div>
              <button onClick={() => setIsContactAdminOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Tabs: Normal User vs Influencer */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 border-2 border-black rounded-2xl text-xs font-black">
              <button
                type="button"
                onClick={() => setContactType('user')}
                className={`py-2 rounded-xl uppercase transition-all ${
                  contactType === 'user' ? 'bg-black text-white shadow-sm' : 'text-gray-700 hover:bg-white'
                }`}
              >
                👤 Normal Citizen / User
              </button>

              <button
                type="button"
                onClick={() => setContactType('creator')}
                className={`py-2 rounded-xl uppercase transition-all flex items-center justify-center gap-1.5 ${
                  contactType === 'creator' ? 'bg-popYellow text-black shadow-sm font-black' : 'text-gray-700 hover:bg-white'
                }`}
              >
                <span>🌟 Influencer Verification</span>
              </button>
            </div>

            {contactStatusMsg && (
              <div className="p-2.5 bg-red-100 border-2 border-black rounded-xl text-red-900 font-bold text-xs">
                {contactStatusMsg}
              </div>
            )}

            <form onSubmit={handleContactAdminSubmit} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                  required
                />
              </div>

              {contactType === 'creator' && (
                <div>
                  <label className="block font-black uppercase text-gray-700 mb-1">
                    Official Social Media Handle / URL (YouTube, X, or Instagram) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @MajorGauravArya or https://youtube.com/@..."
                    value={contactForm.social_account_id}
                    onChange={(e) => setContactForm({ ...contactForm, social_account_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Message / Details *</label>
                <textarea
                  rows={4}
                  placeholder={
                    contactType === 'creator'
                      ? "Describe your channel, follower count, and request for the Golden Verified Tick..."
                      : "Describe your query, feedback, or report issue to the administrator..."
                  }
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs focus:bg-white focus:outline-none"
                  required
                ></textarea>
              </div>

              {/* File Attachment: Optional for user, strictly MANDATORY for influencer */}
              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">
                  {contactType === 'creator'
                    ? 'MANDATORY PROOF: Upload Screenshot / Video (< 10MB) *'
                    : 'Attach File / Screenshot (< 10MB, Optional)'}
                </label>
                <input
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      if (f.size > 10 * 1024 * 1024) {
                        alert('File too large! Max file size allowed is 10MB.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setContactForm({
                          ...contactForm,
                          proof_file: ev.target.result,
                          proof_file_name: f.name
                        });
                      };
                      reader.readAsDataURL(f);
                    }
                  }}
                  className="w-full text-xs"
                  required={contactType === 'creator'}
                />
                {contactType === 'creator' && (
                  <p className="text-[10px] text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-300 mt-1">
                    ⚠️ Mandatory Rule for Creators: You must upload proof of image or video (&lt; 10MB) showing your account dashboard/analytics to prove you are the real influencer. Admin will verify and assign the Golden Tick.
                  </p>
                )}
                {contactForm.proof_file_name && (
                  <div className="text-[11px] font-bold text-green-700 mt-1">
                    ✓ Attached: {contactForm.proof_file_name}
                  </div>
                )}
              </div>

              <div className="p-2 bg-gray-100 border border-black rounded-xl text-[10px] text-gray-600 font-bold">
                🛡️ Security Warning: Any fake account attempting to spam or misuse this channel will have their IP permanently blacklisted.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000]"
              >
                Send Directly to Admin
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOTIFICATIONS DRAWER */}
      {/* ========================================================================= */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="font-comic text-xl text-black">COMMUNITY NOTIFICATIONS</h3>
              <button onClick={() => setShowNotificationsModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar text-xs">
              {myNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 font-bold">
                  No notifications yet. When someone mentions you (@{currentUser?.username}), you will be notified here!
                </div>
              ) : (
                myNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-2 border-black rounded-xl space-y-1.5 transition-colors ${
                      notif.type === 'channel_request'
                        ? 'bg-amber-50'
                        : notif.type === 'direct_message'
                        ? 'bg-blue-50/80 hover:bg-blue-100 cursor-pointer'
                        : 'bg-yellow-50'
                    }`}
                    onClick={() => {
                      if (notif.type === 'direct_message') {
                        const partner = users.find(u => u.username?.toLowerCase() === notif.sender_username?.toLowerCase()) || {
                          id: notif.dm_user_id || ('usr_' + notif.sender_username),
                          name: notif.sender_name,
                          username: notif.sender_username,
                          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${notif.sender_username}`
                        };
                        handleStartDm(partner);
                        setShowNotificationsModal(false);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between font-black text-black text-xs">
                      <div className="flex items-center gap-1.5">
                        {notif.type === 'channel_request' ? (
                          <span className="flex items-center gap-1 text-saffron-dark font-comic">
                            <Lock className="w-3.5 h-3.5" />
                            <span>CHANNEL REQUEST</span>
                          </span>
                        ) : notif.type === 'direct_message' ? (
                          <span className="flex items-center gap-1 text-blue-700 font-comic">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>DIRECT MESSAGE</span>
                          </span>
                        ) : (
                          <span className="font-bold">@{notif.sender_username}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">{notif.created_at}</span>
                    </div>

                    <p className="text-gray-800 text-xs font-semibold">{notif.message}</p>

                    {/* Join Channel Admit / Discard Action Buttons */}
                    {notif.type === 'channel_request' && (
                      <div className="pt-1 flex items-center gap-2">
                        {notif.resolved ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-black ${
                            notif.resolvedAction === 'admitted' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
                          }`}>
                            {notif.resolvedAction === 'admitted' ? '✓ Friend Admitted' : '✕ Request Discarded'}
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdmitParticipant(notif.channel_id, notif.requester_id, notif.id);
                              }}
                              className="px-3 py-1 bg-tirangaGreen hover:bg-green-700 text-white rounded-lg font-black text-xs border border-black shadow-sm flex items-center gap-1 active:translate-y-0.5"
                            >
                              <Check className="w-3 h-3" />
                              <span>✓ Admit Friend</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDenyParticipant(notif.channel_id, notif.requester_id, notif.id);
                              }}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-black text-xs border border-black shadow-sm flex items-center gap-1 active:translate-y-0.5"
                            >
                              <X className="w-3 h-3" />
                              <span>✕ Discard</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {notif.type === 'direct_message' && (
                      <div className="pt-0.5 text-[10px] font-black text-blue-700 underline flex items-center gap-1">
                        <span>Click to open direct chat →</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROFILE PICTURE AREA / CROP SELECTOR (INSTAGRAM & WHATSAPP STYLE) */}
      {/* ========================================================================= */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border-3 border-black rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-[8px_8px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-comic text-base text-black uppercase">
                Choose Profile Photo Area
              </h3>
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg border border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Drag to reposition and use the zoom slider to select which area appears on your profile (Instagram &amp; WhatsApp style).
            </p>

            {/* Interactive Crop Viewport */}
            <div
              className="w-64 h-64 sm:w-72 sm:h-72 mx-auto relative overflow-hidden bg-black rounded-2xl border-3 border-black select-none cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                setIsDraggingCrop(true);
                setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
              }}
              onMouseMove={(e) => {
                if (!isDraggingCrop) return;
                setCropOffset({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y
                });
              }}
              onMouseUp={() => setIsDraggingCrop(false)}
              onMouseLeave={() => setIsDraggingCrop(false)}
              onTouchStart={(e) => {
                if (e.touches[0]) {
                  setIsDraggingCrop(true);
                  setDragStart({ x: e.touches[0].clientX - cropOffset.x, y: e.touches[0].clientY - cropOffset.y });
                }
              }}
              onTouchMove={(e) => {
                if (!isDraggingCrop || !e.touches[0]) return;
                setCropOffset({
                  x: e.touches[0].clientX - dragStart.x,
                  y: e.touches[0].clientY - dragStart.y
                });
              }}
              onTouchEnd={() => setIsDraggingCrop(false)}
            >
              {cropImageSrc && (
                <img
                  src={cropImageSrc}
                  alt="Crop Preview"
                  draggable={false}
                  className="w-full h-full object-cover transition-transform"
                  style={{
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${cropScale})`,
                    transformOrigin: 'center'
                  }}
                />
              )}
              {/* Circular Overlay Guideline */}
              <div className="pointer-events-none absolute inset-0 rounded-full border-3 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
            </div>

            {/* Zoom Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-black text-black">
                <span>Zoom / Crop Size</span>
                <span className="font-mono">{cropScale.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">1x</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full accent-saffron cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-500">3x</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCropOffset({ x: 0, y: 0 });
                  setCropScale(1);
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-xl text-xs font-black uppercase"
              >
                Reset
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-100 border-2 border-black rounded-xl text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={avatarUploading}
                  onClick={handleApplyCroppedAvatar}
                  className="px-4 py-2 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-y-0.5 flex items-center gap-1.5"
                >
                  {avatarUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>✓ Apply Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DEDICATED IN-APP MEDIA OPENER (IMAGES, VIDEOS, PDFS) */}
      {/* ========================================================================= */}
      {activeMediaViewer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none animate-in fade-in">
          {/* Top Header Bar */}
          <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-white pb-2.5 border-b border-white/20 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-popYellow text-black rounded-lg font-black border border-black shadow-xs">
                {activeMediaViewer.type === 'image'
                  ? '📷 IMAGE VIEWER'
                  : activeMediaViewer.type === 'video'
                  ? '🎥 VIDEO PLAYER'
                  : activeMediaViewer.type === 'pdf'
                  ? '📄 PDF DOCUMENT'
                  : 'ATTACHMENT'}
              </span>
              <span className="text-xs sm:text-sm font-bold truncate max-w-xs sm:max-w-md">
                {activeMediaViewer.name || 'Media File'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={activeMediaViewer.url}
                download={activeMediaViewer.name || 'download'}
                className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-white font-bold flex items-center gap-1.5 text-xs border border-white/20 transition-all"
                title="Download file to device"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveMediaViewer(null)}
                className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                title="Cut / Close Opener"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Center Stage: Dedicated Player / Viewer Display */}
          <div className="flex-1 w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden py-3 relative">
            {activeMediaViewer.type === 'image' ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                <img
                  src={activeMediaViewer.url}
                  alt={activeMediaViewer.name || 'Image Preview'}
                  style={{
                    transform: `scale(${viewerZoom}) rotate(${viewerRotate}deg)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                  className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl border-2 border-white/20 shadow-2xl select-none"
                />
              </div>
            ) : activeMediaViewer.type === 'video' ? (
              <div className="w-full max-w-3xl flex flex-col items-center justify-center">
                <div className="relative w-full max-h-[68vh] bg-black rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl flex items-center justify-center">
                  <video
                    ref={viewerVideoRef}
                    src={activeMediaViewer.url}
                    autoPlay
                    className="max-h-[68vh] w-full object-contain"
                    onTimeUpdate={() => {
                      if (viewerVideoRef.current) {
                        setViewerCurrentTime(viewerVideoRef.current.currentTime);
                        setViewerDuration(viewerVideoRef.current.duration || 0);
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (viewerVideoRef.current) {
                        setViewerDuration(viewerVideoRef.current.duration || 0);
                      }
                    }}
                    onEnded={() => setViewerIsPlaying(false)}
                  />
                </div>

                {/* Video Custom Controller Bar */}
                <div className="w-full mt-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex flex-col gap-2 text-white">
                  {/* Progress Seek Bar */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-10 text-right">{formatTime(viewerCurrentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={viewerDuration || 100}
                      step="0.1"
                      value={viewerCurrentTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setViewerCurrentTime(val);
                        if (viewerVideoRef.current) viewerVideoRef.current.currentTime = val;
                      }}
                      className="flex-1 accent-popYellow cursor-pointer h-1.5 rounded-lg bg-white/30"
                    />
                    <span className="w-10">{formatTime(viewerDuration)}</span>
                  </div>

                  {/* Play/Pause & Volume Increase/Decrease Controls */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (viewerVideoRef.current) {
                            if (viewerVideoRef.current.paused) {
                              viewerVideoRef.current.play();
                              setViewerIsPlaying(true);
                            } else {
                              viewerVideoRef.current.pause();
                              setViewerIsPlaying(false);
                            }
                          }
                        }}
                        className="px-3 py-1.5 bg-popYellow text-black rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md hover:bg-yellow-300"
                      >
                        {viewerIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                        <span>{viewerIsPlaying ? 'Pause' : 'Play'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const nextMute = !viewerIsMuted;
                          setViewerIsMuted(nextMute);
                          if (viewerVideoRef.current) viewerVideoRef.current.muted = nextMute;
                        }}
                        className="p-2 bg-white/15 hover:bg-white/25 rounded-xl text-white text-xs flex items-center gap-1"
                        title={viewerIsMuted ? 'Unmute' : 'Mute'}
                      >
                        {viewerIsMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-popYellow" />}
                      </button>

                      {/* Volume Slider & Controls */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                        <span className="text-[10px] uppercase font-bold text-gray-300">Vol:</span>
                        <button
                          onClick={() => {
                            const newVol = Math.max(0, viewerVolume - 0.1);
                            setViewerVolume(newVol);
                            if (viewerVideoRef.current) viewerVideoRef.current.volume = newVol;
                          }}
                          className="px-1.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs font-bold"
                          title="Decrease Volume (-)"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={viewerVolume}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setViewerVolume(val);
                            if (viewerVideoRef.current) viewerVideoRef.current.volume = val;
                          }}
                          className="w-16 sm:w-20 accent-popYellow cursor-pointer h-1.5 bg-white/30 rounded"
                        />
                        <button
                          onClick={() => {
                            const newVol = Math.min(1, viewerVolume + 0.1);
                            setViewerVolume(newVol);
                            if (viewerVideoRef.current) viewerVideoRef.current.volume = newVol;
                          }}
                          className="px-1.5 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs font-bold"
                          title="Increase Volume (+)"
                        >
                          +
                        </button>
                        <span className="text-[10px] font-mono w-8 text-right">{Math.round(viewerVolume * 100)}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (viewerVideoRef.current) {
                          if (viewerVideoRef.current.requestFullscreen) viewerVideoRef.current.requestFullscreen();
                        }
                      }}
                      className="p-2 bg-white/15 hover:bg-white/25 rounded-xl text-white text-xs flex items-center gap-1"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : activeMediaViewer.type === 'pdf' ? (
              <div className="w-full max-w-4xl h-full flex flex-col items-center justify-center">
                {/* PDF Toolbar */}
                <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 mb-2 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
                  {/* Page Switcher */}
                  <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setViewerPdfPage(prev => Math.max(1, prev - 1))}
                      className="p-1 hover:bg-white/20 rounded text-xs flex items-center gap-0.5 disabled:opacity-40"
                      disabled={viewerPdfPage <= 1}
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <span className="font-mono font-bold px-2 text-popYellow">Page {viewerPdfPage}</span>
                    <button
                      onClick={() => setViewerPdfPage(prev => prev + 1)}
                      className="p-1 hover:bg-white/20 rounded text-xs flex items-center gap-0.5"
                      title="Next Page"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Zoom controls */}
                  <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-gray-300">Zoom:</span>
                    <button
                      onClick={() => setViewerZoom(prev => Math.max(0.6, prev - 0.2))}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Zoom Out (-)"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold w-10 text-center">{Math.round(viewerZoom * 100)}%</span>
                    <button
                      onClick={() => setViewerZoom(prev => Math.min(2.5, prev + 0.2))}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Zoom In (+)"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewerZoom(1)}
                      className="px-1.5 py-0.5 text-[10px] bg-white/20 hover:bg-white/30 rounded font-bold"
                      title="Reset Zoom"
                    >
                      100%
                    </button>
                  </div>

                  {/* Copy Text Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${activeMediaViewer.name}\n${activeMediaViewer.url}`);
                      setViewerCopyFeedback(true);
                      setTimeout(() => setViewerCopyFeedback(false), 2000);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      viewerCopyFeedback ? 'bg-tirangaGreen text-white' : 'bg-popYellow text-black hover:bg-yellow-300'
                    }`}
                    title="Copy PDF Document Link & Info"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{viewerCopyFeedback ? '✓ Copied to Clipboard!' : 'Copy Text'}</span>
                  </button>
                </div>

                {/* PDF Viewer Frame */}
                <div className="w-full flex-1 max-h-[70vh] bg-white rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <iframe
                    src={`${activeMediaViewer.url}#page=${viewerPdfPage}&zoom=${Math.round(viewerZoom * 100)}`}
                    className="w-full h-full border-0"
                    title="PDF Document Viewer"
                  />
                </div>
              </div>
            ) : (
              <div className="text-white text-center p-8 bg-white/10 rounded-2xl border border-white/20">
                <FileText className="w-16 h-16 mx-auto mb-3 text-saffron" />
                <p className="font-bold text-sm mb-2">{activeMediaViewer.name}</p>
                <a
                  href={activeMediaViewer.url}
                  download={activeMediaViewer.name}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-saffron text-black font-black rounded-xl text-xs uppercase shadow-md"
                >
                  <Download className="w-4 h-4" /> Download File
                </a>
              </div>
            )}
          </div>

          {/* Bottom Toolbar for Images */}
          {activeMediaViewer.type === 'image' && (
            <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex items-center justify-center gap-2 sm:gap-3 text-white text-xs shrink-0">
              <button
                onClick={() => setViewerZoom(prev => Math.max(0.5, prev - 0.25))}
                className="p-2 bg-white/15 hover:bg-white/25 rounded-xl flex items-center gap-1 font-bold"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
                <span>Zoom -</span>
              </button>

              <button
                onClick={() => { setViewerZoom(1); setViewerRotate(0); }}
                className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl font-mono font-bold text-xs"
                title="Reset Zoom & Rotation"
              >
                {Math.round(viewerZoom * 100)}%
              </button>

              <button
                onClick={() => setViewerZoom(prev => Math.min(3, prev + 0.25))}
                className="p-2 bg-white/15 hover:bg-white/25 rounded-xl flex items-center gap-1 font-bold"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Zoom +</span>
              </button>

              <button
                onClick={() => setViewerRotate(prev => (prev + 90) % 360)}
                className="p-2 bg-white/15 hover:bg-white/25 rounded-xl flex items-center gap-1 font-bold"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* UPI Donation & Developer Support Poster Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

    </div>
  );
}
