import React, { useState, useEffect } from 'react';
import { Star, X, ShieldAlert, Award, CheckCircle2, AlertTriangle } from 'lucide-react';
import IndianFlagLogo from './IndianFlagLogo';

const RATING_LEVELS = [
  { star: 1, title: 'Level 1: Minor Disinformation', desc: 'Occasional bias, casual narrative distortion, or selective context.', badgeColor: 'bg-amber-500 text-black border-amber-600' },
  { star: 2, title: 'Level 2: Narrative Spinner', desc: 'Regularly twists national facts, pushes one-sided selective half-truths.', badgeColor: 'bg-orange-500 text-white border-orange-700' },
  { star: 3, title: 'Level 3: Active Fake News', desc: 'Frequent spreader of fabricated news, coordinated anti-national campaigns.', badgeColor: 'bg-orange-600 text-white border-orange-800' },
  { star: 4, title: 'Level 4: Severe Propagandist', desc: 'Aggressive anti-India narrative pusher, suspected foreign interference nexus.', badgeColor: 'bg-red-600 text-white border-red-800' },
  { star: 5, title: 'Level 5: Top Priority Most Wanted', desc: 'Extreme danger to national discourse — highest public wanted priority!', badgeColor: 'bg-red-700 text-white border-red-950 animate-pulse' }
];

export default function WantedRatingModal({
  isOpen,
  onClose,
  entity,
  userRating,
  onRate
}) {
  // Always start with 0 stars if not rated yet (per user request: no stars pre-filled at 5)
  const [selectedStar, setSelectedStar] = useState(userRating ? Number(userRating) : 0);
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStar(userRating ? Number(userRating) : 0);
      setHoverStar(0);
      setSubmitting(false);
      setSubmittedSuccess(false);
    }
  }, [isOpen, userRating]);

  if (!isOpen || !entity) return null;

  const activeStarCount = hoverStar || selectedStar;
  const currentLevel = activeStarCount > 0
    ? (RATING_LEVELS.find(l => l.star === activeStarCount) || RATING_LEVELS[4])
    : null;

  const handleSubmit = async () => {
    if (submitting || selectedStar === 0) return;
    setSubmitting(true);
    try {
      await onRate(entity.id, selectedStar);
      setSubmittedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (e) {
      console.error('Rating failed', e);
      setSubmitting(false);
    }
  };

  const avgRating = entity.rating_avg !== undefined && entity.rating_avg !== null
    ? Number(entity.rating_avg).toFixed(1)
    : '0.0';
  const totalCount = Number(entity.rating_count) || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FFFDF9] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl overflow-hidden p-5 sm:p-6 text-black font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b-2 border-black/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white font-mono text-[11px] font-black uppercase tracking-wider rounded border border-black shadow-[1px_1px_0px_#000]">
              <ShieldAlert className="w-3.5 h-3.5" />
              WANTED LEVEL ASSESSOR
            </span>
            <IndianFlagLogo size="xs" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] active:scale-95 transition-transform cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Target Profile Card Summary */}
        <div className="flex items-center gap-3.5 p-3.5 bg-red-50/70 border-2 border-red-300 rounded-xl mb-4">
          <img
            src={entity.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entity.name)}&background=ef4444&color=fff&size=128&bold=true`}
            alt={entity.name}
            className="w-14 h-14 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] object-cover bg-white shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entity.name)}&background=ef4444&color=fff&size=128&bold=true`;
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-sans font-black text-base text-black uppercase tracking-wide truncate">
              {entity.name}
            </h3>
            {entity.party && (
              <p className="text-[12px] font-semibold text-gray-700 truncate mb-1">
                {entity.party}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-800">
              <span className="text-amber-700 font-black">★ {avgRating} avg</span>
              <span>•</span>
              <span>👥 {totalCount} {totalCount === 1 ? 'rating' : 'ratings'}</span>
            </div>
          </div>
        </div>

        {/* Star Rating Section */}
        <div className="text-center my-3">
          <label className="block font-sans text-xs sm:text-sm font-black uppercase text-gray-800 tracking-wider mb-2">
            Select Wanted Rating (1 to 5 Stars)
          </label>

          {/* Interactive Star Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= activeStarCount;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setSelectedStar(star)}
                  className="p-1 sm:p-2 cursor-pointer transition-all duration-150 transform hover:scale-125 active:scale-95 focus:outline-none"
                  title={`Set ${star} Star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-150 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_6px_rgba(245,158,11,0.6)]'
                        : 'fill-transparent text-gray-300 hover:text-amber-300 stroke-[1.75]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Current Level Description Box */}
          <div className="mt-3 p-3.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] min-h-[76px] flex flex-col justify-center">
            {currentLevel ? (
              <>
                <div className="font-sans font-black text-sm uppercase text-red-600 flex items-center justify-center gap-1.5">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-black rounded border ${currentLevel.badgeColor}`}>
                    ★ {activeStarCount} STAR{activeStarCount > 1 ? 'S' : ''}
                  </span>
                  <span>{currentLevel.title}</span>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1 leading-snug">
                  {currentLevel.desc}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-xs font-semibold flex items-center justify-center gap-1.5 py-1">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tap a star above to set this profile&apos;s Wanted Level (1 to 5)</span>
              </div>
            )}
          </div>

          <p className="text-[11px] font-semibold text-gray-600 mt-3">
            ℹ️ Higher Wanted Rating ranks this profile higher on the public database leaderboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-xl font-sans font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] active:scale-95 transition-transform cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || submittedSuccess || selectedStar === 0}
            className={`flex-2 py-2.5 px-4 border-2 border-black rounded-xl font-sans font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
              selectedStar === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none'
                : 'bg-gradient-to-r from-saffron to-amber-400 hover:from-amber-400 hover:to-saffron text-black cursor-pointer'
            } disabled:opacity-75`}
          >
            {submittedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-800" />
                <span>Rating Recorded!</span>
              </>
            ) : submitting ? (
              <span>Submitting...</span>
            ) : selectedStar === 0 ? (
              <span>Select Stars to Rate</span>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Submit Wanted Rating ({selectedStar}★)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
