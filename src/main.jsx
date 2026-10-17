import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';

// Dynamic Cloudflare / Remote API Base URL Interceptor & Sovereign Shield Protection
export const EP_CLIENT_KEY = 'ep-client-v1-bharat-first-2024';
export const EP_SHIELD_SALT = 'BharatSovereignShield2026!Protected@Edge';
export const DEFAULT_API_BASE_URL = 'https://exposed-api.exposedpropagandu.workers.dev';

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

      // Determine if this is an internal API call (strictly exclude third-party APIs like api.giphy.com)
      let rawUrl = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
      const isThirdParty = rawUrl && (rawUrl.includes('giphy.com') || rawUrl.includes('youtube.com/oembed') || rawUrl.includes('dicebear.com') || rawUrl.includes('ui-avatars.com') || rawUrl.includes('country.is'));
      const isApiCall = !isThirdParty && rawUrl && (
        rawUrl.startsWith('/api') ||
        rawUrl.startsWith('api/') ||
        rawUrl.includes('/api/') ||
        rawUrl.includes('api.php') ||
        (cleanApiBase && rawUrl.startsWith(cleanApiBase))
      );

      if (isApiCall) {
        let parsedUrl;
        try {
          parsedUrl = new URL(rawUrl, window.location.href);
        } catch (e) {
          return originalFetch.call(this, input, init);
        }

        // Apply cleanApiBase if specified and URL is relative
        if (cleanApiBase && (rawUrl.startsWith('/api') || parsedUrl.origin === window.location.origin)) {
          try {
            const apiBaseUrl = new URL(cleanApiBase, window.location.href);
            parsedUrl.protocol = apiBaseUrl.protocol;
            parsedUrl.host = apiBaseUrl.host;
            parsedUrl.port = apiBaseUrl.port;
          } catch (e) {}
        }

        // NATIVE PHP API ROUTING:
        // Rewrite /api/<endpoint> directly to /api.php?endpoint=<endpoint> to ensure 100% reliability
        // on Apache/FastCGI/InfinityFree even if .htaccess mod_rewrite is inactive or missing.
        const pathname = parsedUrl.pathname;
        if (pathname.includes('/api/')) {
          const endpoint = pathname.substring(pathname.indexOf('/api/') + 5);
          parsedUrl.pathname = '/api.php';
          if (endpoint) {
            parsedUrl.searchParams.set('endpoint', endpoint);
          }
        } else if (pathname.endsWith('/api') || pathname === '/api') {
          parsedUrl.pathname = '/api.php';
        }

        // Always include same-origin credentials so the InfinityFree __test cookie is preserved
        if (!finalInit.credentials) {
          finalInit.credentials = 'same-origin';
        }

        // Method override for shared web hosts (InfinityFree / FastCGI block PUT, PATCH, DELETE with 405 Method Not Allowed)
        let originalMethod = (finalInit.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
        if (['PUT', 'PATCH', 'DELETE'].includes(originalMethod)) {
          finalInit.method = 'POST';
          parsedUrl.searchParams.set('_method', originalMethod);
        }

        const timestamp = Date.now().toString();
        const fastSig = generateShieldHash(`${timestamp}:${parsedUrl.pathname}:${EP_SHIELD_SALT}`);
        const adminKey = (typeof localStorage !== 'undefined')
          ? (localStorage.getItem('propagandus_admin_key') || localStorage.getItem('admin_token') || '')
          : '';

        // Query parameters
        if (!parsedUrl.searchParams.has('key')) {
          parsedUrl.searchParams.set('key', EP_CLIENT_KEY);
        }
        parsedUrl.searchParams.set('ep_t', timestamp);
        parsedUrl.searchParams.set('ep_sig', fastSig);

        const currentEndpoint = parsedUrl.searchParams.get('endpoint') || '';
        if (adminKey && currentEndpoint.startsWith('admin')) {
          parsedUrl.searchParams.set('adminKey', adminKey);
        }

        const headers = new Headers(finalInit.headers || (input instanceof Request ? input.headers : {}));
        headers.set('X-App-Key', EP_CLIENT_KEY);
        headers.set('X-Client-Key', EP_CLIENT_KEY);
        headers.set('X-EP-Timestamp', timestamp);
        headers.set('X-EP-Signature', fastSig);
        if (['PUT', 'PATCH', 'DELETE'].includes(originalMethod)) {
          headers.set('X-HTTP-Method-Override', originalMethod);
        }
        if (adminKey) {
          headers.set('X-Admin-Key', adminKey);
          if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${adminKey}`);
          }
        }
        finalInit.headers = headers;
        finalInput = parsedUrl.toString();
      }

      return originalFetch.call(this, finalInput, finalInit);
    };
  }

  // Intercept EventSource to inject handshake query tokens and route to api.php
  if (window.EventSource) {
    const OriginalEventSource = window.EventSource;
    window.EventSource = function(url, eventSourceInitDict) {
      let finalUrl = url;
      try {
        const parsed = new URL(url, window.location.href);
        if (cleanApiBase && (url.startsWith('/api') || parsed.origin === window.location.origin)) {
          const apiBaseUrl = new URL(cleanApiBase, window.location.href);
          parsed.protocol = apiBaseUrl.protocol;
          parsed.host = apiBaseUrl.host;
          parsed.port = apiBaseUrl.port;
        }
        if (parsed.pathname.includes('/api/')) {
          const endpoint = parsed.pathname.substring(parsed.pathname.indexOf('/api/') + 5);
          parsed.pathname = '/api.php';
          if (endpoint) {
            parsed.searchParams.set('endpoint', endpoint);
          }
        } else if (parsed.pathname.endsWith('/api') || parsed.pathname === '/api') {
          parsed.pathname = '/api.php';
        }
        const timestamp = Date.now().toString();
        const fastSig = generateShieldHash(`${timestamp}:${parsed.pathname}:${EP_SHIELD_SALT}`);
        parsed.searchParams.set('key', EP_CLIENT_KEY);
        parsed.searchParams.set('ep_t', timestamp);
        parsed.searchParams.set('ep_sig', fastSig);
        finalUrl = parsed.toString();
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
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
