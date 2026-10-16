import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Dynamic Cloudflare / Remote API Base URL Interceptor & Sovereign Shield Protection
export const EP_CLIENT_KEY = 'ep-client-v1-bharat-first-2024';
export const EP_SHIELD_SALT = 'BharatSovereignShield2026!Protected@Edge';
export const DEFAULT_API_BASE_URL = '';

// High-speed non-blocking synchronous cryptographic rolling hash
export function generateShieldHash(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

const rawApiBase = (typeof window !== 'undefined' && typeof window.__API_BASE_URL__ === 'string')
  ? window.__API_BASE_URL__
  : ((import.meta.env?.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== '')
    ? import.meta.env.VITE_API_BASE_URL
    : (typeof localStorage !== 'undefined' ? localStorage.getItem('ep_api_base_url') : '') || DEFAULT_API_BASE_URL);

const cleanApiBase = rawApiBase ? rawApiBase.replace(/\/+$/, '') : '';

if (typeof window !== 'undefined') {
  window.__API_BASE_URL__ = cleanApiBase;
  window.__EP_CLIENT_KEY__ = EP_CLIENT_KEY;

  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      let finalInput = input;
      const finalInit = init ? { ...init } : {};

      // Determine if this is an API call
      let urlStr = '';
      if (typeof input === 'string') {
        urlStr = input;
        if (cleanApiBase && urlStr.startsWith('/api')) {
          finalInput = cleanApiBase + urlStr;
          urlStr = finalInput;
        }
      } else if (input instanceof Request) {
        urlStr = input.url;
        try {
          const parsed = new URL(input.url, window.location.href);
          if (cleanApiBase && parsed.pathname.startsWith('/api')) {
            const newUrl = cleanApiBase + parsed.pathname + parsed.search;
            finalInput = new Request(newUrl, input);
            urlStr = newUrl;
          }
        } catch (e) {}
      }

      if (urlStr && urlStr.includes('/api')) {
        let pathname = '/api';
        try {
          const parsed = new URL(urlStr, window.location.href);
          pathname = parsed.pathname;
        } catch (e) {}

        const timestamp = Date.now().toString();
        const fastSig = generateShieldHash(`${timestamp}:${pathname}:${EP_SHIELD_SALT}`);
        const adminKey = (typeof localStorage !== 'undefined')
          ? (localStorage.getItem('propagandus_admin_key') || localStorage.getItem('admin_token') || '')
          : '';

        // Set security query parameters
        try {
          const parsed = new URL(urlStr, window.location.href);
          parsed.searchParams.set('key', EP_CLIENT_KEY);
          parsed.searchParams.set('ep_t', timestamp);
          parsed.searchParams.set('ep_sig', fastSig);
          if (adminKey && pathname.includes('/api/admin')) {
            parsed.searchParams.set('adminKey', adminKey);
          }
          urlStr = parsed.toString();
        } catch (e) {
          const sep = urlStr.includes('?') ? '&' : '?';
          urlStr = `${urlStr}${sep}key=${encodeURIComponent(EP_CLIENT_KEY)}&ep_t=${timestamp}&ep_sig=${fastSig}`;
          if (adminKey && urlStr.includes('/api/admin')) {
            urlStr += `&adminKey=${encodeURIComponent(adminKey)}`;
          }
        }

        if (typeof finalInput === 'string') {
          finalInput = urlStr;
        } else if (finalInput instanceof Request) {
          finalInput = new Request(urlStr, finalInit);
        }

        const headers = new Headers(finalInit.headers || (input instanceof Request ? input.headers : {}));
        headers.set('X-App-Key', EP_CLIENT_KEY);
        headers.set('X-Client-Key', EP_CLIENT_KEY);
        headers.set('X-EP-Timestamp', timestamp);
        headers.set('X-EP-Signature', fastSig);
        if (adminKey) {
          headers.set('X-Admin-Key', adminKey);
          if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${adminKey}`);
          }
        }
        finalInit.headers = headers;
      }

      return originalFetch.call(this, finalInput, finalInit);
    };
  }

  // Intercept EventSource to inject handshake query tokens
  if (window.EventSource) {
    const OriginalEventSource = window.EventSource;
    window.EventSource = function(url, eventSourceInitDict) {
      let finalUrl = url;
      try {
        if (cleanApiBase && typeof url === 'string' && url.startsWith('/api')) {
          finalUrl = cleanApiBase + url;
        }
        const fullParsed = new URL(finalUrl, window.location.href);
        if (fullParsed.pathname.startsWith('/api')) {
          const timestamp = Date.now().toString();
          const fastSig = generateShieldHash(`${timestamp}:${fullParsed.pathname}:${EP_SHIELD_SALT}`);
          fullParsed.searchParams.set('key', EP_CLIENT_KEY);
          fullParsed.searchParams.set('ep_t', timestamp);
          fullParsed.searchParams.set('ep_sig', fastSig);
          finalUrl = fullParsed.toString();
        }
      } catch (e) {}
      return new OriginalEventSource(finalUrl, eventSourceInitDict);
    };
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bento-card p-8 max-w-lg bg-white border-2 border-black shadow-2xl">
            <div className="text-4xl mb-3">🇮🇳</div>
            <h1 className="text-2xl font-black text-black mb-2 uppercase">
              Exposed Propagandus
            </h1>
            <p className="text-sm text-gray-700 mb-4">
              A temporary render error occurred. Click below to reload the platform.
            </p>
            <div className="p-3 bg-red-50 text-red-700 font-mono text-xs rounded-lg border border-red-200 mb-5 text-left overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown Application Error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bento-btn bg-saffron text-black px-6 py-2.5 rounded-xl uppercase font-bold text-xs shadow-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
