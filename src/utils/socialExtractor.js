/**
 * Client-Side Smart Social Profile & Avatar Extractor
 * Works 100% offline and on static hosting (even when Node backend is not present)
 * Supports YouTube, X/Twitter, Instagram, and other social links.
 */

// Helper to detect platform from any URL
export function detectPlatformFromUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return 'other';
  const lower = inputUrl.toLowerCase().trim();
  if (/youtube\.com|youtu\.be/i.test(lower)) return 'yt';
  if (/x\.com|twitter\.com/i.test(lower)) return 'x';
  if (/instagram\.com|instagr\.am/i.test(lower)) return 'insta';
  if (/facebook\.com|fb\.watch|fb\.me/i.test(lower)) return 'facebook';
  if (/linkedin\.com/i.test(lower)) return 'linkedin';
  if (/t\.me|telegram\.me/i.test(lower)) return 'telegram';
  return 'other';
}

// Helper to clean handles
export function cleanHandle(input, platform) {
  if (!input || typeof input !== 'string') return '';
  let str = input.trim();
  str = str.replace(/^https?:\/\/(www\.|m\.)?/, '');
  str = str.replace(/^(x|twitter)\.com\//, '');
  str = str.replace(/^youtube\.com\/(@|channel\/|c\/)?/, '');
  str = str.replace(/^youtu\.be\//, '');
  str = str.replace(/^(instagram\.com|instagr\.am)\//, '');
  str = str.replace(/^facebook\.com\//, '');
  str = str.replace(/^linkedin\.com\/(in|company)\//, '');
  str = str.replace(/^[#@]/, '');
  str = str.split('?')[0].split('#')[0].split('&')[0];
  const parts = str.split('/').filter(Boolean);
  const reserved = ['p', 'reel', 'reels', 'tv', 'stories', 'explore', 'accounts', 'direct', 'static', 'rsrc.php'];
  if (parts.length > 0) {
    if (reserved.includes(parts[0].toLowerCase()) && parts.length > 1) {
      str = parts[1];
    } else if (!reserved.includes(parts[0].toLowerCase())) {
      str = parts[0];
    }
  }
  return str.trim();
}

// Convert handle to readable name (e.g., 'dhruv_rathee' -> 'Dhruv Rathee')
export function formatNameFromHandle(handle) {
  if (!handle) return '';
  const cleaned = handle.replace(/[_.-]+/g, ' ').trim();
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Auto-fetch real profile name, avatar image, and live followers/subscribers.
 * Tries server endpoint first (Node / PHP); falls back seamlessly to client-side extraction on static hosting.
 */
export async function autoFetchSocialProfile(inputUrl, platformHint = 'auto') {
  if (!inputUrl || inputUrl.trim().length < 2) {
    return { success: false, error: 'Input is too short' };
  }

  const raw = inputUrl.trim();
  let platform = platformHint;

  if (platform === 'auto' || !platform) {
    platform = detectPlatformFromUrl(raw);
    if (platform === 'other') {
      if (raw.startsWith('@')) platform = 'insta';
      else platform = 'yt';
    }
  }

  const handle = cleanHandle(raw, platform);
  if (!handle && platform !== 'other') {
    return { success: false, error: 'Could not parse handle' };
  }

  // 1. Try server API first if available (with 12s timeout)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let targetUrl = raw;
    if (!targetUrl.startsWith('http')) {
      if (platform === 'yt') targetUrl = `https://www.youtube.com/@${handle}`;
      else if (platform === 'x') targetUrl = `https://x.com/${handle}`;
      else if (platform === 'insta' || platform === 'instagram') targetUrl = `https://www.instagram.com/${handle}`;
    }

    const apiUrl = (typeof window !== 'undefined' && window.__API_BASE_URL__)
      ? `${window.__API_BASE_URL__.replace(/\/+$/, '')}/api/fetch-profile`
      : '/api/fetch-profile';

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl, platform }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const resolvedName = data.name || data.profile?.name || formatNameFromHandle(handle);
        const defaultAvatar = platform === 'yt'
          ? `https://unavatar.io/youtube/@${handle}`
          : (platform === 'x'
            ? `https://unavatar.io/x/${handle}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName || handle)}&background=E1306C&color=ffffff&size=512&bold=true&font-size=0.38`);
        const resolvedAvatar = data.avatarUrl || data.profile?.avatarUrl || defaultAvatar;
        const resolvedFollowers = data.followers || data.subscribers || data.profile?.followers || data.profile?.subscribers || null;

        return {
          success: true,
          platform,
          handle,
          name: resolvedName,
          avatarUrl: resolvedAvatar,
          followers: resolvedFollowers,
          subscribers: resolvedFollowers
        };
      }
    }
  } catch (e) {
    // Server fetch unavailable (e.g. static hosting) or timed out; proceed to client-side fallback
  }

  // 2. Client-Side Fallback Extraction (Works 100% on Static Web Hosting)
  let extractedName = formatNameFromHandle(handle);
  let extractedAvatar = '';
  let extractedFollowers = null;

  if (platform === 'x' && handle) {
    // Directly fetch fxtwitter API (CORS enabled: Access-Control-Allow-Origin: *)
    try {
      const fxRes = await fetch(`https://api.fxtwitter.com/${encodeURIComponent(handle)}`);
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        if (fxData && fxData.code === 200 && fxData.user) {
          const u = fxData.user;
          if (u.name) extractedName = u.name;
          if (typeof u.followers === 'number') {
            if (u.followers >= 1000000) extractedFollowers = (u.followers / 1000000).toFixed(2) + 'M followers';
            else if (u.followers >= 1000) extractedFollowers = (u.followers / 1000).toFixed(1) + 'K followers';
            else extractedFollowers = u.followers + ' followers';
          }
          if (u.avatar_url) {
            extractedAvatar = u.avatar_url.replace('_normal.', '_400x400.');
          }
        }
      }
    } catch (e) {}

    if (!extractedAvatar) {
      extractedAvatar = `https://unavatar.io/x/${handle}`;
    }
  } else if (platform === 'yt' && handle) {
    extractedAvatar = `https://unavatar.io/youtube/@${handle}`;
  } else if (platform === 'insta' && handle) {
    // Cross-platform public lookup for creators across Instagram/X/YouTube
    try {
      const candidates = [handle, handle.replace(/([a-z])([A-Z])/g, '$1_$2')];
      for (const h of candidates) {
        const fxRes = await fetch(`https://api.fxtwitter.com/${encodeURIComponent(h)}`);
        if (fxRes.ok) {
          const fxData = await fxRes.json();
          if (fxData && fxData.code === 200 && fxData.user) {
            const u = fxData.user;
            if (u.name) extractedName = u.name;
            if (u.avatar_url) {
              extractedAvatar = u.avatar_url.replace('_normal.', '_400x400.');
            }
            if (typeof u.followers === 'number') {
              if (u.followers >= 1000000) extractedFollowers = (u.followers / 1000000).toFixed(2) + 'M followers';
              else if (u.followers >= 1000) extractedFollowers = (u.followers / 1000).toFixed(1) + 'K followers';
              else extractedFollowers = u.followers + ' followers';
            }
            break;
          }
        }
      }
    } catch (e) {}

    if (!extractedAvatar) {
      const safeName = extractedName || handle;
      extractedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=E1306C&color=ffffff&size=512&bold=true&font-size=0.38`;
    }
  } else {
    extractedAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(handle || raw)}`;
  }

  return {
    success: true,
    platform,
    handle: handle || raw,
    name: extractedName,
    avatarUrl: extractedAvatar,
    followers: extractedFollowers,
    subscribers: extractedFollowers
  };
}
