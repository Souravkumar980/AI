import React, { useState } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { X, Send, CheckCircle2 } from 'lucide-react';

const REPORT_OPTIONS = [
  { id: 'Delete Request', label: 'Delete Request', desc: 'Request removal of this profile' },
  { id: 'Wrong Information', label: 'Wrong Information', desc: 'Report inaccurate handles, wrong names, or incorrect statements' },
  { id: 'Edit', label: 'Edit / Update Details', desc: 'Provide updated links, handles, or corrections' }
];

export default function ReportModal({ isOpen, onClose, entity }) {
  const [reportType, setReportType] = useState('Wrong Information');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !entity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!message || message.trim().length < 5) {
      setError('Please provide details for this report (min 5 characters).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: entity.id,
          entity_name: entity.name,
          report_type: reportType,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit report');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 2000);
    } catch (err) {
      setError('Network error while filing report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white bento-card shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b-2 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">⚠️</span>
            <h3 className="font-comic text-lg text-black">
              REPORT / EDIT REQUEST
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-tirangaGreen mx-auto animate-bounce" />
            <h4 className="font-comic text-xl text-black">Report Received</h4>
            <p className="text-xs font-display text-gray-600">
              Your feedback for <strong>{entity.name}</strong> has been logged for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Target Entity */}
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2.5">
              <img
                src={entity.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(entity.name)}`}
                alt={entity.name}
                className="w-9 h-9 rounded-lg border border-black/20 object-cover"
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Target:</span>
                <div className="font-display font-black text-xs text-black truncate">{entity.name}</div>
              </div>
            </div>

            {error && (
              <div className="p-2 bg-red-50 border border-red-300 rounded-lg text-xs font-bold text-red-700">
                {error}
              </div>
            )}

            {/* Select Reason */}
            <div>
              <label className="block text-xs font-black uppercase text-gray-700 mb-1.5">
                Request Type:
              </label>

              <div className="space-y-1.5">
                {REPORT_OPTIONS.map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setReportType(opt.id)}
                    className={`block p-2.5 border rounded-xl cursor-pointer transition-all ${
                      reportType === opt.id
                        ? 'bg-amber-50 border-black font-bold shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>{opt.label}</span>
                      <input
                        type="radio"
                        name="report_type"
                        checked={reportType === opt.id}
                        onChange={() => setReportType(opt.id)}
                        className="accent-saffron"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                Details:
              </label>
              <textarea
                rows="3"
                placeholder="Explain the correction or reason..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-saffron"
                required
              ></textarea>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bento-btn bg-saffron hover:bg-saffron-dark text-black py-2.5 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
