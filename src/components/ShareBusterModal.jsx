import React, { useRef, useState } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { TwitterIcon } from './SocialIcons';
import { X, Check, Copy, Share2, Download, MessageSquare, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ShareBusterModal({ isOpen, onClose, data }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !data) return null;

  const {
    title = 'FACT CHECK & COUNTER NARRATIVE',
    subtitle = 'Nationalist Truth & Development Record',
    badge = 'VERIFIED COUNTER-FACT',
    claim = '',
    truth = '',
    details = [],
    source = 'PIB Fact Check / Official Government Records',
    type = 'comparison' // 'comparison', 'entity', 'ai', 'general'
  } = data;

  const whatsappMessage = `🚨 *EXPOSED PROPAGANDUS: FACT-CHECK COUNTER REPORT* 🇮🇳\n\n` +
    (claim ? `❌ *Claim / Propaganda:* "${claim}"\n\n` : '') +
    `✅ *The Real Truth:* ${truth}\n\n` +
    (details && details.length > 0 ? `📊 *Verified Reality:*\n${details.map(d => `• ${d}`).join('\n')}\n\n` : '') +
    `🏛️ *Official Source:* ${source}\n\n` +
    `*Rashtra Hit Sarvopari 🇮🇳* #NationFirst #BharatMataKiJai #ExposedPropagandus\n` +
    `Check the full record at: https://exposedpropagandus.is-best.net`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const tweetText = `🚨 Exposed Fact-Check: ${title}\n\n✅ Truth: ${truth.slice(0, 160)}...\n\n🏛️ Verified via ${source}\n\n#BharatMataKiJai #NationFirst`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://exposedpropagandus.is-best.net')}`;
    window.open(url, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFDF9',
        logging: false
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `fact-check-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Image generation error', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border-3 border-black rounded-3xl shadow-[8px_8px_0px_#000] p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-5">
          <div className="flex items-center gap-2">
            <IndianFlagLogo size="sm" />
            <div>
              <span className="font-comic text-xl text-black">SHARE FACT-CHECK CARD</span>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                1-Click WhatsApp Forward Buster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] transition-transform active:translate-y-0.5"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* The Graphic Fact Card to Export / Preview */}
        <div
          ref={cardRef}
          className="p-5 sm:p-6 bg-pop-halftone border-3 border-black rounded-2xl shadow-[5px_5px_0px_#000] mb-5 text-black relative overflow-hidden"
        >
          {/* Top Slogan Banner */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFE600] border-2 border-black rounded shadow-[2px_2px_0px_#000] text-[10px] font-black uppercase tracking-wider">
              <span className="text-red-600">✹</span>
              <span>EXPOSED PROPAGANDUS</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-chakraNavy">
              <span>BHARAT MATA KI JAI</span>
              <IndianFlagLogo size="xs" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-block bg-[#FF2A2A] text-white border-2 border-black px-3 py-1 shadow-[3px_3px_0px_#000] rotate-1 text-xs font-comic uppercase tracking-wider mb-3">
            {badge}
          </div>

          {/* Main Title */}
          <h3 className="font-comic text-2xl sm:text-3xl text-black uppercase leading-tight mb-2">
            {title}
          </h3>

          {/* Claim Box if available */}
          {claim && (
            <div className="p-3 bg-red-50 border-2 border-black/80 rounded-xl mb-3">
              <span className="text-[10px] font-black text-red-700 uppercase tracking-widest block mb-0.5">
                ❌ Propaganda / False Claim:
              </span>
              <p className="font-display text-xs text-gray-800 italic">
                "{claim}"
              </p>
            </div>
          )}

          {/* Truth / Fact Box */}
          <div className="p-3.5 bg-emerald-50 border-2 border-black rounded-xl mb-3 shadow-[2px_2px_0px_#000]">
            <span className="text-[10px] font-black text-tirangaGreen-dark uppercase tracking-widest block mb-1">
              ✅ The Real Truth &amp; Verified Data:
            </span>
            <p className="font-display text-xs sm:text-sm font-bold text-gray-900 leading-snug">
              {truth}
            </p>
          </div>

          {/* Detail Points */}
          {details && details.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {details.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-800">
                  <span className="text-[#FF9933] font-black">▸</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}

          {/* Source Footer */}
          <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between text-[10px] font-bold text-gray-600">
            <span>🏛️ Official Source: <strong className="text-black">{source}</strong></span>
            <span className="text-saffron-dark font-mono font-black">exposedpropagandus.is-best.net</span>
          </div>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Copy WhatsApp Message */}
          <button
            onClick={handleCopyText}
            className={`bento-btn px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] font-black transition-all ${
              copied ? 'bg-tirangaGreen text-white' : 'bg-[#FFE600] text-black hover:bg-yellow-400'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied WhatsApp Text!' : 'Copy WhatsApp Forward'}</span>
          </button>

          {/* Send Direct to WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="bento-btn bg-[#25D366] text-white hover:bg-green-600 px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] font-black"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Download Image Card */}
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="bento-btn bg-saffron text-black hover:bg-saffron-dark px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] font-black"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating Image...' : 'Download PNG Card'}</span>
          </button>

          {/* Share on X */}
          <button
            onClick={handleShareTwitter}
            className="bento-btn bg-black text-white hover:bg-gray-800 px-4 py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] font-black"
          >
            <TwitterIcon className="w-4 h-4 fill-white text-white" />
            <span>Share on X</span>
          </button>
        </div>

        {/* Helper Note */}
        <p className="text-[11px] text-center text-gray-500 font-bold mt-4">
          🇮🇳 Share verified counter-facts directly into family and neighborhood WhatsApp groups to bust propaganda.
        </p>

      </div>
    </div>
  );
}
