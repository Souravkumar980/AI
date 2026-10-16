import React, { useState } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { Lightbulb, Send, CheckCircle2, AlertCircle, MessageSquarePlus, Sparkles, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

export default function SuggestFeaturePage({ onNavigateHome }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('New Feature');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setError('Please describe your feature suggestion or update (minimum 5 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feature-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          message: message.trim()
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success || data.id)) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        setCategory('New Feature');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FF9933', '#138808', '#000080', '#FFE600']
          });
        } catch (e) {}
      } else {
        setError(data.error || 'Failed to submit suggestion. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-12 bg-[#FDFBF7] relative overflow-hidden">
      {/* Halftone graphic background decoration */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="bento-btn bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Vault</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 border-2 border-black rounded-full text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
            <IndianFlagLogo size="xs" />
            <span>Citizen Feedback Desk</span>
          </div>
        </div>

        {/* Hero Header Banner */}
        <div className="bento-card p-6 sm:p-8 bg-white border-3 border-black shadow-[6px_6px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-popYellow text-black border border-black rounded-lg text-xs font-black uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Direct Transmission to Admin</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-comic tracking-tight text-black flex items-center gap-2">
              <span>SUGGEST UPDATES &amp; FEATURES</span>
              <Sparkles className="w-6 h-6 text-saffron hidden sm:inline" />
            </h1>
            <p className="font-display text-xs sm:text-sm text-gray-700 font-bold max-w-xl leading-relaxed">
              Have an idea to improve Exposed Propagandus? Want new features, data filters, database corrections, or UI enhancements? Fill out the details below to transmit your feedback directly into the Admin Panel.
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-saffron border-3 border-black shadow-[4px_4px_0px_#000] shrink-0">
            <MessageSquarePlus className="w-10 h-10 text-black" />
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bento-card p-6 sm:p-10 bg-[#FFFDF9] border-3 border-black shadow-[8px_8px_0px_#000]">
          
          {success ? (
            /* Success Confirmation Screen */
            <div className="p-8 bg-emerald-50 border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000] text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-tirangaGreen mx-auto animate-bounce" />
              <h2 className="font-comic text-2xl sm:text-3xl text-black">Dhanyawad, Patriot! 🇮🇳</h2>
              <p className="font-display font-bold text-sm sm:text-base text-gray-800 max-w-lg mx-auto leading-relaxed">
                Your suggestion has been securely dispatched directly to Administrator Om Kumar's desk in the Admin Panel. Thank you for contributing your ideas to make Bharat's digital watchdog stronger!
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bento-btn bg-white hover:bg-gray-100 text-black border-2 border-black px-6 py-2.5 text-xs sm:text-sm uppercase font-black shadow-[3px_3px_0px_#000] w-full sm:w-auto"
                >
                  Send Another Suggestion
                </button>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="bento-btn bg-saffron hover:bg-saffron-dark text-black border-2 border-black px-6 py-2.5 text-xs sm:text-sm uppercase font-black shadow-[3px_3px_0px_#000] w-full sm:w-auto"
                >
                  Return to Propagandus Vault
                </button>
              </div>
            </div>
          ) : (
            /* Suggestion Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-100 border-2 border-red-600 rounded-xl text-xs font-black text-red-900 flex items-center gap-2 shadow-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name or patriot handle"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-saffron shadow-xs"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                    Your Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-saffron shadow-xs"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  Suggestion Type / Topic
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-saffron shadow-xs"
                >
                  <option value="New Feature">🚀 New Feature Idea</option>
                  <option value="Database Update">🗂️ Database / Profile Correction</option>
                  <option value="UI & Design">🎨 UI / Mobile Design Improvement</option>
                  <option value="Bug Report">🐛 Bug Report / Error</option>
                  <option value="Nationalist Content">🇮🇳 Suggest Nationalist Content</option>
                  <option value="General Suggestion">💡 General Feedback / Idea</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-black">
                    Detailed Suggestion / Message <span className="text-red-600">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-gray-500 font-bold">
                    {message.length} chars
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Explain your suggested update or feature in detail. Be as clear and constructive as possible..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-saffron shadow-xs resize-y"
                />
              </div>

              {/* Security & Encrypted Transmission Note */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center gap-2.5 text-xs font-display text-amber-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-saffron-dark shrink-0" />
                <span>Your message is transmitted securely and encrypted directly into the Admin Panel.</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] font-bold text-gray-500 text-center sm:text-left">
                  Dhanyawad for supporting the digital defense of Bharat! 🇮🇳
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-8 py-3.5 text-xs sm:text-sm uppercase tracking-wider font-black flex items-center gap-2 shadow-[4px_4px_0px_#000] w-full sm:w-auto justify-center cursor-pointer active:translate-y-0.5"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending to Admin...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Suggestion to Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
