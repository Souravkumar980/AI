import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Dynamic Cloudflare / Remote API Base URL Interceptor & App Key Protection
export const EP_CLIENT_KEY = 'ep-client-v1-bharat-first-2024';
export const DEFAULT_API_BASE_URL = 'https://exposed-api.exposedpropagandu.workers.dev';

const rawApiBase = (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  import.meta.env?.VITE_API_BASE_URL ||
  (typeof localStorage !== 'undefined' ? localStorage.getItem('ep_api_base_url') : '') ||
  DEFAULT_API_BASE_URL;

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
        // Append client key query param (?key=...) to ensure seamless access without CORS preflight failures
        if (!urlStr.includes('key=')) {
          const separator = urlStr.includes('?') ? '&' : '?';
          urlStr = `${urlStr}${separator}key=${encodeURIComponent(EP_CLIENT_KEY)}`;
          if (typeof finalInput === 'string') {
            finalInput = urlStr;
          } else if (finalInput instanceof Request) {
            finalInput = new Request(urlStr, finalInit);
          }
        }

        const headers = new Headers(finalInit.headers || (input instanceof Request ? input.headers : {}));
        if (!headers.has('X-App-Key')) {
          headers.set('X-App-Key', EP_CLIENT_KEY);
        }
        finalInit.headers = headers;
      }

      return originalFetch.call(this, finalInput, finalInit);
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
