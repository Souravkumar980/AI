import React from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound({ onGoHome }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bento-card max-w-md w-full p-8 text-center bg-white space-y-4">
        <div className="inline-flex items-center gap-2 mb-2">
          <IndianFlagLogo className="w-8 h-5" />
          <span className="font-comic text-xl text-saffron">BHARAT MATA KI JAI</span>
        </div>

        <div className="font-comic text-6xl text-black leading-none">404</div>
        <h2 className="font-display font-black text-xl text-gray-800">Page Not Found</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          The page or route you are looking for does not exist in the Exposed Propagandus directory.
        </p>

        <div className="pt-2">
          <button
            onClick={onGoHome || (() => window.location.href = '/')}
            className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-5 py-2.5 text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
}
