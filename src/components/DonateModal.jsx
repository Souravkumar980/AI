import React, { useState } from 'react';
import { X, Download, Copy, Check, Heart, Shield, QrCode } from 'lucide-react';

export default function DonateModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const upiId = 'exposepropagndu@nyes';
  const bankingName = 'Sanjay Prasad';

  const qrPath = (import.meta.env?.BASE_URL || '/').replace(/\/+$/, '') + '/donate-qr.jpg';

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback copy
      const input = document.createElement('input');
      input.value = upiId;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#FFFDF9] border-3 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="shrink-0 bg-popYellow border-b-3 border-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] text-lg">
              🇮🇳
            </span>
            <div>
              <h3 className="font-comic text-base sm:text-lg text-black leading-tight flex items-center gap-1.5">
                <span>SUPPORT DIGITAL BHARAT</span>
                <Heart className="w-4 h-4 text-popRed fill-popRed inline" />
              </h3>
              <p className="text-[10px] font-mono font-bold text-gray-800 uppercase tracking-wider">
                Patriotic Movement • Community Funded
              </p>
            </div>
          </div>

          {/* Cut / Close Icon */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-white hover:bg-popRed hover:text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] text-black font-black transition-all active:translate-y-0.5"
            title="Close / Cut"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          
          {/* 1. UPI QR Scanner Image */}
          <div className="flex flex-col items-center justify-center bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_#000]">
            <div className="relative group p-2 bg-[#FFFDF9] border-2 border-dashed border-gray-400 rounded-xl">
              <img
                src={qrPath}
                alt="UPI QR Scanner - Sanjay Prasad"
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto rounded-lg"
                onError={(e) => {
                  if (e.target.src !== '/donate-qr.jpg') {
                    e.target.src = '/donate-qr.jpg';
                  }
                }}
              />
              <div className="mt-2 text-center text-[11px] font-bold text-gray-600 flex items-center justify-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-black" />
                <span>Scan with Any UPI App (GPay, PhonePe, Paytm)</span>
              </div>
            </div>

            {/* Download QR Option */}
            <a
              href={qrPath}
              download="ExposedPropagandus-UPI-QR.jpg"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-100 border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all text-black"
            >
              <Download className="w-4 h-4 text-saffron-dark" />
              <span>Download QR Scanner Image</span>
            </a>
          </div>

          {/* 2. UPI ID & Banking Name */}
          <div className="bg-amber-50 border-2 border-black rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0px_#000] space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-600 tracking-wider block">
                  UPI ID (VPA)
                </span>
                <span className="font-mono text-sm sm:text-base font-black text-black select-all">
                  {upiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3 py-1.5 border-2 border-black rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5 ${
                  copied ? 'bg-tirangaGreen text-white' : 'bg-popYellow hover:bg-yellow-400 text-black'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-black/15 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">Banking Name:</span>
              <span className="font-black text-black uppercase font-mono bg-white px-2 py-0.5 rounded border border-black shadow-xs">
                {bankingName}
              </span>
            </div>

            {/* Direct UPI Pay on Mobile */}
            <div className="pt-1">
              <a
                href={`upi://pay?pa=${upiId}&pn=${encodeURIComponent(bankingName)}&cu=INR`}
                className="w-full py-2 bg-tirangaGreen hover:bg-green-700 text-white border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 transition-all active:translate-y-0.5 sm:hidden"
              >
                <span>⚡ Pay Directly via Installed UPI App</span>
              </a>
            </div>
          </div>

          {/* 3. Founder Message */}
          <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000] space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-saffron-dark">
              <Shield className="w-4 h-4" />
              <span>Message From Founder &amp; Dev Team</span>
            </div>
            <p className="text-xs sm:text-[13px] text-gray-800 font-medium leading-relaxed italic bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              &ldquo;Hi I&apos;m OM Solo Developer with fellow Friends Who Always Try to Strengthen Bharat by Digitaly, also I doing part-time stuff to manage Kharcha Paani, Me and My Team decided to enlarge this Digital movement across Bharat for that we Need Your Support so If You&apos;re Able Contribute Minimum 10₹ Then Please do it, Right now we are using Free domains for Host it, also we try to make this App AI INtegrated by AI Fact checker and many more Future Updates, For that we Need Your Support. Thank You Bharat Mata ki Jai, Jai Shri Ram.&rdquo;
            </p>
          </div>

          {/* Quick Contribution Note */}
          <div className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Every 10₹ Contribution Helps Keep Servers Online 🇮🇳
          </div>

        </div>

        {/* Footer Dismiss Button */}
        <div className="shrink-0 bg-gray-50 border-t-2 border-black p-3 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-white hover:bg-gray-100 border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all"
          >
            I&apos;ve Noted the UPI / Continue to Site
          </button>
        </div>
      </div>
    </div>
  );
}
