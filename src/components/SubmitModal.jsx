import React, { useState, useEffect, useRef } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { OPPOSITION_PARTIES, OPPOSITION_INSTITUTIONS, ENTITY_CATEGORIES } from '../data/partiesAndInstitutions';
import { TwitterIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import { detectPlatformFromUrl, cleanHandle, autoFetchSocialProfile } from '../utils/socialExtractor';
import {
  X,
  PlusCircle,
  Vote,
  Building,
  Check,
  AlertCircle,
  Loader2,
  Globe,
  Trash2,
  Phone,
  Mail
} from 'lucide-react';

export default function SubmitModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [handleX, setHandleX] = useState('');
  const [handleYt, setHandleYt] = useState('');
  const [handleInsta, setHandleInsta] = useState('');
  const [accountUrls, setAccountUrls] = useState([
    { id: 1, url: '', platform: 'auto', handle: '', reach: '' }
  ]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [availableCategories, setAvailableCategories] = useState(ENTITY_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState(['Social Media']);
  const [party, setParty] = useState(OPPOSITION_PARTIES[0]);
  const [institution, setInstitution] = useState(OPPOSITION_INSTITUTIONS[0]);
  const [narrative, setNarrative] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState(['']);
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [fetchingSocial, setFetchingSocial] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patriotWarning, setPatriotWarning] = useState(null);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const defaultIds = new Set(ENTITY_CATEGORIES.map(c => c.id));
          const dynamic = data
            .filter(d => (d.type === 'propagandist' || d.type === 'propagandu' || d.type === 'entity' || !d.type) && d.name && !defaultIds.has(d.name))
            .map(d => ({ id: d.name, label: d.name, icon: 'Share2' }));
          setAvailableCategories([...ENTITY_CATEGORIES, ...dynamic]);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  const audioRef = useRef(null);
  const speechRef = useRef(null);

  const stopActiveWarningAudio = () => {
    if (audioRef.current) {
      const { osc, gain, ctx, interval } = audioRef.current;
      if (interval) clearInterval(interval);
      try {
        if (ctx && gain) {
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
          setTimeout(() => {
            try {
              if (osc) osc.stop();
              if (ctx) ctx.close();
            } catch (e) {}
          }, 260);
        }
      } catch (e) {}
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Coordinated natural human speech & extended alert tone
  const playSynchronizedWarning = (hindiText) => {
    stopActiveWarningAudio();
    const spokenText = hindiText || 'बेटा गांडमस्ती नहीं वरना तुम्हारे बाप भी पेले गए थे तुम भी पेले जाओगे';

    let ctx = null;
    let osc = null;
    let gain = null;
    let sirenInterval = null;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
        osc = ctx.createOscillator();
        gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(540, ctx.currentTime);

        // Authoritative warning tone - clear, not deafeningly loud
        gain.gain.setValueAtTime(0.18, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        let toggle = false;
        sirenInterval = setInterval(() => {
          if (!ctx || ctx.state === 'closed') return;
          try {
            osc.frequency.setValueAtTime(toggle ? 680 : 540, ctx.currentTime);
            toggle = !toggle;
          } catch (e) {}
        }, 320);

        audioRef.current = { osc, gain, ctx, interval: sirenInterval };
      }
    } catch (e) {
      console.warn('AudioContext init error', e);
    }

    const rampDownAndStop = () => {
      if (audioRef.current) {
        const current = audioRef.current;
        if (current.interval) clearInterval(current.interval);
        try {
          if (current.ctx && current.gain) {
            current.gain.gain.linearRampToValueAtTime(0.0001, current.ctx.currentTime + 0.35);
            setTimeout(() => {
              try {
                if (current.osc) current.osc.stop();
                if (current.ctx) current.ctx.close();
              } catch (e) {}
            }, 360);
          }
        } catch (e) {}
        audioRef.current = null;
      }
    };

    // Hindi text-to-speech with natural human voice selection
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.92; // Natural, clear human cadence
        utterance.pitch = 1.0;

        const selectNaturalVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          const hindiVoice = voices.find(v =>
            (v.lang && (v.lang === 'hi-IN' || v.lang.startsWith('hi'))) ||
            (v.name && v.name.toLowerCase().includes('hindi'))
          );
          if (hindiVoice) {
            utterance.voice = hindiVoice;
          }
        };

        selectNaturalVoice();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = selectNaturalVoice;
        }

        // The tone seamlessly extends and finishes exactly when the whole spoken paragraph ends!
        utterance.onend = () => {
          rampDownAndStop();
        };
        utterance.onerror = () => {
          rampDownAndStop();
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(rampDownAndStop, 8000);
      }
    } catch (e) {
      setTimeout(rampDownAndStop, 8000);
    }
  };

  useEffect(() => {
    let timer;
    if (patriotWarning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (patriotWarning && countdown <= 0) {
      stopActiveWarningAudio();
      setPatriotWarning(null);
      resetForm();
    }
    return () => clearInterval(timer);
  }, [patriotWarning, countdown]);

  useEffect(() => {
    return () => {
      stopActiveWarningAudio();
    };
  }, []);

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
    stopActiveWarningAudio();
    setName('');
    setHandleX('');
    setHandleYt('');
    setHandleInsta('');
    setAccountUrls([{ id: Date.now(), url: '', platform: 'auto', handle: '', reach: '' }]);
    setContactPhone('');
    setContactEmail('');
    setAvatarUrl('');
    setSelectedCategories(['Social Media']);
    setParty(OPPOSITION_PARTIES[0]);
    setInstitution(OPPOSITION_INSTITUTIONS[0]);
    setNarrative('');
    setProofUrl('');
    setHoneypot('');
    setError('');
    setPatriotWarning(null);
    setCountdown(8);
    setFetchingSocial(false);
    setSubmitting(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    } else {
      stopActiveWarningAudio();
    }
  }, [isOpen]);

  const handleModalClose = () => {
    stopActiveWarningAudio();
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

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) return;
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      if (selectedCategories.length >= 4) return;
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || name.trim().length < 2) {
      setError('Please provide the name of the entity or channel.');
      return;
    }

    if (!handleX.trim() && !handleYt.trim() && !handleInsta.trim()) {
      setError('Please provide at least one social handle or URL (X, YouTube, or Instagram).');
      return;
    }

    if (selectedCategories.length < 1) {
      setError('Please select at least 1 category.');
      return;
    }

    if (!narrative || narrative.trim().length < 10) {
      setError('Please provide a description of the anti-India narrative (min 10 characters).');
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
        contact_phone: contactPhone.trim() || null,
        contact_email: contactEmail.trim() || null,
        other_links: otherSocialLinks.length > 0 ? otherSocialLinks : null,
        avatar_url: avatarUrl.trim(),
        categories: selectedCategories,
        party: selectedCategories.includes('Political Party') ? party : null,
        institution: selectedCategories.includes('Institutions') ? institution : null,
        narrative: narrative.trim(),
        proof_url: (evidenceLinks.find(l => l && l.trim()) || proofUrl).trim(),
        other_links: evidenceLinks.map(l => l.trim()).filter(Boolean),
        _hp_security_check: honeypot
      };

      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.isProtectedPatriot) {
          playSynchronizedWarning(data.speechText || data.message);
          setPatriotWarning(data);
          setCountdown(8);
          return;
        }
        setError(data.error || 'Failed to submit profile.');
        return;
      }

      if (onSuccess) onSuccess(data.entity);
      handleModalClose();
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* High-Alert Patriot Shield Warning Modal (Synchronized Natural Hindi Voice & Audio Siren) */}
      {patriotWarning && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-red-600 border-4 border-black rounded-3xl p-6 sm:p-8 text-white text-center shadow-[8px_8px_0px_#000] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-yellow-400 text-black border-3 border-black rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black shadow-lg">
              ⚠️
            </div>

            <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-1 rounded-full text-xs font-mono font-black uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>PATRIOT SHIELD INTERCEPTED</span> • <span>STRIKE {patriotWarning.strike || 1}/2</span>
            </div>

            <h2 className="font-comic text-2xl sm:text-3xl text-white mb-2 leading-tight tracking-wide">
              सख्त चेतावनी!
            </h2>

            {/* Exact Hindi Warning Headline */}
            <div className="font-display text-base sm:text-lg font-black text-yellow-300 leading-snug bg-black/70 p-4 rounded-2xl border-2 border-yellow-400 mb-4 shadow-inner">
              "{patriotWarning.message || 'बेटा गांडमस्ती नहीं वरना तुम्हारे बाप भी पेले गए थे तुम भी पेले जाओगे'}"
            </div>

            <div className="bg-black/90 text-white p-3 rounded-xl border border-white/20 text-xs font-mono mb-4 text-left space-y-1">
              <div>Protected Entity: <strong className="text-yellow-400 font-bold">"{patriotWarning.match || 'National Leadership'}"</strong></div>
              <div className="text-[11px] text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span>Natural Human Hindi Speech Active</span>
              </div>
            </div>

            {patriotWarning.isBlocked ? (
              <div className="bg-white text-red-700 p-3 rounded-xl font-black text-sm uppercase border-2 border-black">
                🚨 STRIKE 2 VIOLATION: YOUR IP HAS BEEN PERMANENTLY BLACKLISTED
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 font-mono text-xs sm:text-sm font-black text-white bg-black/40 py-2.5 rounded-xl border border-white/10">
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></span>
                <span>Voice message in progress... Clears in {countdown}s</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleModalClose();
        }}
      >
        <div className="relative w-full max-w-xl bg-white bento-card shadow-2xl overflow-hidden my-6">
          
          {/* Modal Top Header */}
          <div className="bg-white border-b-2 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IndianFlagLogo size="sm" />
            <h3 className="font-comic text-xl text-black">
              ADD TO PROPAGANDUS VAULT
            </h3>
          </div>

          <button
            onClick={handleModalClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-5 mt-3 p-3 bg-red-50 border border-red-300 rounded-xl text-xs font-bold text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="_hp_security_check"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex="-1"
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
                  <span>Fetching intel...</span>
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
              <span>+ Add Another Account / URL (Same Entity)</span>
            </button>
          </div>

          {/* Contact Intel (Optional / Not Mandatory) */}
          <div className="p-4 bg-amber-50/70 border-2 border-black/40 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <span>📞 Contact Intel</span>
                <span className="text-[10px] font-mono text-gray-500 font-bold lowercase bg-white px-2 py-0.5 rounded border border-black/20">(optional / ऐच्छिक)</span>
              </label>
              <span className="text-[10px] text-gray-500 font-bold">Investigation Lead</span>
            </div>
            <p className="text-[11px] text-gray-600 font-medium">
              Have phone number or business email for this entity? Submit if available (not mandatory).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-700 block mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="contact@entity.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Name & Real Avatar Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            <div className="sm:col-span-3">
              <label className="block text-xs font-black uppercase text-gray-800 mb-1">
                Name / Channel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Real Name (autofilled or manual)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-saffron"
                required
              />
            </div>

            <div className="sm:col-span-1 text-center">
              <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                Profile Pic
              </label>
              <img
                src={avatarUrl || (name ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}` : 'https://api.dicebear.com/7.x/bottts/svg?seed=placeholder')}
                alt="Profile Preview"
                referrerPolicy="no-referrer"
                className="w-12 h-12 mx-auto rounded-xl border border-black/30 object-cover shadow-sm bg-gray-100"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-800 mb-1.5">
              Categories (Choose 1 to 4)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {availableCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-2 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-saffron text-black border-black font-extrabold shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    <span>{cat.id}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional: Opposition Political Party */}
          {selectedCategories.includes('Political Party') && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl">
              <label className="block text-xs font-black uppercase text-red-950 mb-1 flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-red-700" />
                <span>Opposition Party</span>
              </label>
              <select
                value={party}
                onChange={(e) => setParty(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                {OPPOSITION_PARTIES.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional: Institution */}
          {selectedCategories.includes('Institutions') && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl">
              <label className="block text-xs font-black uppercase text-amber-950 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-700" />
                <span>Institution / Union</span>
              </label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                {OPPOSITION_INSTITUTIONS.map((inst, idx) => (
                  <option key={idx} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tracked Narrative */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-800 mb-1">
              Anti-India / Anti-Hindu Narrative Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="What fake claims or propaganda did this profile spread?..."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-saffron"
              required
            ></textarea>
          </div>

          {/* Multi-Source Evidence Links */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-gray-800">
                Multi-Source Evidence Links (Proof / Sources)
              </label>
              <button
                type="button"
                onClick={() => setEvidenceLinks([...evidenceLinks, ''])}
                className="text-[10px] font-black uppercase px-2 py-0.5 bg-yellow-300 hover:bg-yellow-400 text-black rounded border border-black shadow-[1px_1px_0px_#000] active:scale-95 transition-all"
              >
                + Add Evidence Link
              </button>
            </div>
            {evidenceLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="url"
                  placeholder={`https://evidence-source-${idx + 1}.com/...`}
                  value={link}
                  onChange={(e) => {
                    const next = [...evidenceLinks];
                    next[idx] = e.target.value;
                    setEvidenceLinks(next);
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono focus:outline-none"
                />
                {evidenceLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setEvidenceLinks(evidenceLinks.filter((_, i) => i !== idx))}
                    className="p-1.5 rounded-lg border border-black bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs"
                    title="Remove Link"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bento-btn bg-saffron hover:bg-saffron-dark text-black py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Adding Profile...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Profile to Directory</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
    </>
  );
}
