import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import { detectPlatformFromUrl, cleanHandle, autoFetchSocialProfile } from '../utils/socialExtractor';
import { X, PlusCircle, Check, AlertCircle, Loader2, Heart, Globe, Trash2 } from 'lucide-react';

export default function SuggestNationalistModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [handleX, setHandleX] = useState('');
  const [handleYt, setHandleYt] = useState('');
  const [handleInsta, setHandleInsta] = useState('');
  const [accountUrls, setAccountUrls] = useState([
    { id: 1, url: '', platform: 'auto', handle: '', reach: '' }
  ]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const DEFAULT_NAT_CATEGORIES = [
    'Defence',
    'Geopolitics',
    'Supporter',
    'Journalist',
    'Media',
    'Solo Influencer',
    'Sanatan Dharma',
    'International'
  ];
  const [availableCategories, setAvailableCategories] = useState(DEFAULT_NAT_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState(['Defence']);
  const [description, setDescription] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fetchingSocial, setFetchingSocial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/categories?type=nationalist')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map(d => d.name);
          const combined = Array.from(new Set([...DEFAULT_NAT_CATEGORIES, ...names]));
          setAvailableCategories(combined);
        }
      })
      .catch(() => {});
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const syncHandlesFromAccounts = (urlsList) => {
    let yt = '';
    let x = '';
    let insta = '';

    urlsList.forEach(item => {
      if (!item.url || !item.url.trim()) return;
      const plat = item.platform || detectPlatformFromUrl(item.url);
      const h = item.handle || cleanHandle(item.url, plat);
      if (plat === 'yt' && !yt) yt = h;
      else if (plat === 'x' && !x) x = h;
      else if (plat === 'insta' && !insta) insta = h;
    });

    setHandleYt(yt);
    setHandleX(x);
    setHandleInsta(insta);
  };

  const resetForm = () => {
    setName('');
    setHandleX('');
    setHandleYt('');
    setHandleInsta('');
    setAccountUrls([{ id: Date.now(), url: '', platform: 'auto', handle: '', reach: '' }]);
    setAvatarUrl('');
    setSelectedCategories(['Defence']);
    setDescription('');
    setHoneypot('');
    setError('');
    setSuccessMsg('');
    setFetchingSocial(false);
    setSubmitting(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Real Profile Fetcher with client-side fallback (works on static hosting & dist)
  const handleAccountUrlChange = (index, value) => {
    const newUrls = [...accountUrls];
    const detectedPlatform = detectPlatformFromUrl(value);
    const clean = cleanHandle(value, detectedPlatform);
    newUrls[index] = {
      ...newUrls[index],
      url: value,
      platform: detectedPlatform,
      handle: clean
    };
    setAccountUrls(newUrls);
    syncHandlesFromAccounts(newUrls);
  };

  const handleAccountUrlBlur = async (index) => {
    const item = accountUrls[index];
    if (!item || !item.url || item.url.trim().length < 2) return;
    try {
      setFetchingSocial(true);
      setError('');
      const data = await autoFetchSocialProfile(item.url, item.platform);
      if (data && data.success) {
        if (data.name && (!name || name === item.handle || name.trim().length === 0)) {
          setName(data.name);
        }
        if (data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
        const newUrls = [...accountUrls];
        newUrls[index] = {
          ...newUrls[index],
          platform: data.platform || item.platform,
          handle: data.handle || item.handle,
          reach: data.followers || data.subscribers || ''
        };
        setAccountUrls(newUrls);
        syncHandlesFromAccounts(newUrls);
      }
    } catch (e) {
      // Quiet failover
    } finally {
      setFetchingSocial(false);
    }
  };

  const addAccountUrlField = () => {
    setAccountUrls([
      ...accountUrls,
      { id: Date.now(), url: '', platform: 'auto', handle: '', reach: '' }
    ]);
  };

  const removeAccountUrlField = (index) => {
    if (accountUrls.length <= 1) {
      const reset = [{ id: Date.now(), url: '', platform: 'auto', handle: '', reach: '' }];
      setAccountUrls(reset);
      syncHandlesFromAccounts(reset);
      return;
    }
    const newUrls = accountUrls.filter((_, i) => i !== index);
    setAccountUrls(newUrls);
    syncHandlesFromAccounts(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name || name.trim().length < 2) {
      setError('Please provide the creator or channel title.');
      return;
    }

    if (!handleX.trim() && !handleYt.trim() && !handleInsta.trim()) {
      setError('Please provide at least one social handle or URL (X, YouTube, or Instagram).');
      return;
    }

    if (!description || description.trim().length < 10) {
      setError('Please describe the creator’s nationalist contributions (min 10 characters).');
      return;
    }

    try {
      setSubmitting(true);
      const otherSocialLinks = accountUrls
        .map(a => a.url.trim())
        .filter(u => u.length > 0 && !u.includes(handleYt) && !u.includes(handleX) && !u.includes(handleInsta));

      const payload = {
        name: name.trim(),
        handle_x: handleX.trim(),
        handle_yt: handleYt.trim(),
        handle_insta: handleInsta.trim(),
        other_links: otherSocialLinks.length > 0 ? otherSocialLinks : null,
        avatar_url: avatarUrl.trim(),
        categories: selectedCategories,
        category: selectedCategories.join(', '),
        description: description.trim(),
        _hp_security_check: honeypot
      };

      const res = await fetch('/api/nationalist-influencers/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit suggestion.');
        return;
      }

      setSuccessMsg(data.message || 'Suggestion submitted for review!');
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
        handleModalClose();
      }, 1600);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-white bento-card shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 text-white p-4 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <IndianFlagLogo size="sm" />
            <div>
              <h3 className="font-comic text-xl text-black">
                SUGGEST NATIONALIST CREATOR
              </h3>
              <p className="text-[11px] font-bold text-black/80 font-mono">
                Rashtriya Prerak Directory • Admin Moderated
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-1.5 bg-white text-black hover:bg-gray-100 rounded-lg border border-black"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 bg-green-50 border-2 border-green-500 rounded-xl text-xs font-bold text-green-900 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-300 rounded-xl text-xs font-bold text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-display">
          {/* Honeypot */}
          <input
            type="text"
            name="_hp_security_check"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Social Media Multi-Account Section with Auto-Detection & Live Reach */}
          <div className="p-4 bg-gray-50 border-2 border-black rounded-2xl shadow-pop space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <span>🔗 Profile &amp; Channel URLs (Multiple Accounts)</span>
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                  Paste 1, 2, 3 or more account links. Platform (YouTube, X, Instagram, Web) is auto-detected!
                </p>
              </div>
              {fetchingSocial && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-black rounded-lg text-[10px] text-black font-black animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-saffron-dark" />
                  <span>Fetching creator info...</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {accountUrls.map((acc, index) => {
                const plat = acc.platform || detectPlatformFromUrl(acc.url);
                return (
                  <div key={acc.id || index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {/* Auto-detected platform badge / icon */}
                      <div className={`px-2.5 py-1.5 rounded-xl border border-black font-black text-[10px] uppercase flex items-center gap-1.5 shrink-0 shadow-sm ${
                        plat === 'yt' ? 'bg-red-600 text-white' :
                        plat === 'x' ? 'bg-black text-white' :
                        plat === 'insta' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                        plat === 'facebook' ? 'bg-blue-600 text-white' :
                        plat === 'linkedin' ? 'bg-sky-700 text-white' :
                        plat === 'telegram' ? 'bg-sky-500 text-white' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {plat === 'yt' && <YoutubeIcon className="w-3.5 h-3.5 fill-current" />}
                        {plat === 'x' && <TwitterIcon className="w-3.5 h-3.5 fill-current" />}
                        {plat === 'insta' && <InstagramIcon className="w-3.5 h-3.5 fill-current" />}
                        {plat !== 'yt' && plat !== 'x' && plat !== 'insta' && <Globe className="w-3.5 h-3.5" />}
                        <span>
                          {plat === 'yt' ? 'YouTube' :
                           plat === 'x' ? 'X / Twitter' :
                           plat === 'insta' ? 'Instagram' :
                           plat === 'facebook' ? 'Facebook' :
                           plat === 'linkedin' ? 'LinkedIn' :
                           plat === 'telegram' ? 'Telegram' : 'Web Link'}
                        </span>
                      </div>

                      {/* URL input */}
                      <input
                        type="text"
                        placeholder={`Account #${index + 1} URL (e.g. https://youtube.com/@channel or @handle)`}
                        value={acc.url}
                        onChange={(e) => handleAccountUrlChange(index, e.target.value)}
                        onBlur={() => handleAccountUrlBlur(index)}
                        className="flex-1 px-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                      />

                      {/* Remove Button */}
                      {accountUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAccountUrlField(index)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-400 rounded-xl transition-all"
                          title="Remove account link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Live Reach Badge if extracted */}
                    {acc.reach && (
                      <div className="ml-24 flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Verified Live Reach: {acc.reach}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Another Account Button */}
            <button
              type="button"
              onClick={addAccountUrlField}
              className="mt-1 px-3 py-1.5 bg-white hover:bg-amber-50 text-black border-2 border-dashed border-black rounded-xl font-comic text-xs font-bold flex items-center gap-1.5 shadow-sm active:translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-saffron-dark" />
              <span>+ Add Another Account / URL (Same Creator)</span>
            </button>
          </div>

          {/* Name & Avatar Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-9">
              <label className="block font-black uppercase text-gray-800 tracking-wider mb-1">
                Creator / Channel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Major Gaurav Arya, Abhi and Niyu..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-black/20 rounded-xl font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <img
                src={avatarUrl || (name ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}` : 'https://api.dicebear.com/7.x/bottts/svg?seed=nationalist')}
                alt="Preview"
                className="w-11 h-11 rounded-xl border border-black object-cover bg-white shrink-0 shadow-sm"
              />
              <span className="text-[10px] text-gray-500 font-mono">Avatar Preview</span>
            </div>
          </div>

          {/* Multi-Select Categories */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-black uppercase text-gray-800 tracking-wider text-xs">
                Categories (Select 1 or more) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-gray-500">
                {selectedCategories.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-2.5 bg-gray-50 border-2 border-black rounded-xl">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-tirangaGreen text-white shadow-[2px_2px_0px_#000] -translate-y-0.5'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-black uppercase text-gray-800 tracking-wider mb-1">
              Nationalist Contributions & Impact <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Describe their patriotic advocacy, fact-checking anti-India narratives, or coverage of Indian development..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 bg-gray-50 border border-black/20 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron"
            ></textarea>
          </div>

          {/* Moderation notice */}
          <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-[11px] text-amber-900 font-medium">
            🛡️ <strong>Note:</strong> To maintain directory credibility, suggestions go directly to the Admin Command Center for verification before appearing live.
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bento-btn bg-saffron hover:bg-saffron-dark text-black px-5 py-2.5 text-xs uppercase tracking-wider flex items-center gap-2 font-black"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current text-red-600" />
                  <span>Submit Suggestion</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
