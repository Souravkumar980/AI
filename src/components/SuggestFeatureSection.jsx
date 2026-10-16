import React, { useState } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { Lightbulb, Send, CheckCircle2, AlertCircle, MessageSquarePlus, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SuggestFeatureSection() {
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
    <section className="py-12 bg-white border-t-3 border-b-3 border-black relative overflow-hidden">
      {/* Halftone graphic background decoration */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
          backgroundSize: '16px 16px'
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Card Container */}
        <div className="bento-card p-6 sm:p-10 bg-[#FFFDF9] border-3 border-black shadow-[8px_8px_0px_#000]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-6 mb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-saffron-dark" />
                <span>Citizen Feedback Vault</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-comic tracking-tight text-black flex items-center gap-2">
                <span>SUGGEST UPDATES &amp; FEATURES</span>
                <Sparkles className="w-6 h-6 text-saffron hidden sm:inline" />
              </h2>
              <p className="font-display text-xs sm:text-sm text-gray-700 font-bold max-w-xl">
                Have an idea to improve Exposed Propagandus? Want new features, data filters, or bug fixes? Send your direct message to the admin team below.
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron border-2 border-black shadow-[3px_3px_0px_#000] shrink-0">
              <MessageSquarePlus className="w-8 h-8 text-black" />
            </div>
          </div>

          {/* Success Banner */}
          {success ? (
            <div className="p-6 bg-emerald-50 border-3 border-black rounded-2xl shadow-[4px_4px_0px_#000] text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-tirangaGreen mx-auto" />
              <h3 className="font-comic text-2xl text-black">Dhanyawad, Patriot!</h3>
              <p className="font-display font-bold text-sm text-gray-800 max-w-md mx-auto">
                Your suggestion has been securely dispatched directly to the Administrator's desk in the Admin Panel. Thank you for making Bharat's digital watchdog stronger!
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="bento-btn bg-black text-white hover:bg-gray-800 px-6 py-2 text-xs uppercase font-black"
              >
                Send Another Suggestion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border-2 border-red-600 rounded-xl text-xs font-black text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  Detailed Suggestion / Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain your suggested update or feature in detail. Be as clear as possible..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-saffron shadow-xs"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] font-bold text-gray-500">
                  Direct encrypted transmission to Admin Om Kumar.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-black flex items-center gap-2 shadow-[4px_4px_0px_#000] w-full sm:w-auto justify-center"
                >
                  {submitting ? (
                    <span>Sending to Admin...</span>
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
    </section>
  );
}
