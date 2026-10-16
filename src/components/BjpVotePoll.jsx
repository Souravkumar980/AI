import React, { useState, useEffect } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import { Vote, ThumbsUp, ThumbsDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playModiSound, playRagaSound } from '../utils/audioPlayer';

export default function BjpVotePoll() {
  const [pollData, setPollData] = useState({
    pollId: 'bjp_2029',
    question: 'Do you want BJP / NDA back in 2029?',
    yesVotes: 0,
    noVotes: 0,
    totalVotes: 0,
    yesPercent: 0,
    noPercent: 0,
    userVoted: null,
    votedAt: null
  });
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteToast, setVoteToast] = useState('');

  const fetchPoll = async () => {
    try {
      const baseUrl = (typeof window !== 'undefined' && window.__API_BASE_URL__) ? window.__API_BASE_URL__.replace(/\/+$/, '') : '';
      const res = await fetch(`${baseUrl}/api/govt-poll`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          setPollData(prev => ({
            ...prev,
            ...data,
            // Keep user choice if already voted locally
            userVoted: data.userVoted !== undefined ? data.userVoted : prev.userVoted
          }));
        }
      }
    } catch (err) {
      // Quiet failover
    }
  };

  useEffect(() => {
    fetchPoll();
    const interval = setInterval(fetchPoll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (choice) => {
    if (voting) return;

    // Play dedicated sounds immediately on click (stops on screen tap)
    if (choice === 'yes') {
      playModiSound();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF9933', '#FFFFFF', '#138808', '#FFE600']
        });
      } catch (e) {}
    } else {
      playRagaSound();
    }

    setVoting(true);

    try {
      const baseUrl = (typeof window !== 'undefined' && window.__API_BASE_URL__) ? window.__API_BASE_URL__.replace(/\/+$/, '') : '';
      const res = await fetch(`${baseUrl}/api/govt-poll/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice })
      });

      const data = await res.json();

      if (res.ok && data) {
        setPollData(prev => ({ ...prev, ...data, userVoted: choice }));
        if (choice === 'yes') {
          setVoteToast('🚩 BHARAT MATA KI JAI! Your vote for BJP / NDA (2029) is recorded!');
        } else {
          setVoteToast('⚠️ Your vote has been recorded as NO.');
        }
        setTimeout(() => setVoteToast(''), 4500);
      } else {
        // Optimistic local state update
        setPollData(prev => ({ ...prev, userVoted: choice }));
      }
    } catch (err) {
      console.error(err);
      // Optimistic local state update
      setPollData(prev => ({ ...prev, userVoted: choice }));
    } finally {
      setVoting(false);
    }
  };

  return (
    <section className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Pop Art Container */}
      <div className="relative overflow-hidden bg-white border-3 sm:border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_#000]">
        
        {/* Pop-art Halftone & Decorative Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tirangaGreen/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Top Pop Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE600] border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] -rotate-1 mb-4 text-xs font-black uppercase tracking-wider text-black">
            <span className="text-red-600 text-sm">✹</span>
            <span>CITIZEN PULSE 2029 • LIVE PUBLIC REFERENDUM</span>
            <span className="text-red-600 text-sm">✹</span>
          </div>

          {/* Main Question Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-comic font-black uppercase text-black tracking-wide leading-tight max-w-3xl mb-3">
            DO YOU WANT <span className="text-saffron-dark underline decoration-black decoration-wavy decoration-3">BJP / NDA</span> BACK IN 2029?
          </h2>

          <p className="text-xs sm:text-sm font-display text-gray-700 font-bold max-w-2xl mb-6">
            Tap to vote or freely switch your stance (1 vote per verified IP). Transparent real-time pulse of citizen mandate.
          </p>

          {/* Toast Notification */}
          {voteToast && (
            <div className="mb-4 px-4 py-2.5 bg-[#FFE600] text-black border-2 border-black rounded-xl font-comic font-black text-sm uppercase shadow-[3px_3px_0px_#000] animate-bounce">
              {voteToast}
            </div>
          )}

          {/* Vote Action Buttons (Switchable Yes/No) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-xl mb-6">
            
            {/* YES Button */}
            <button
              onClick={() => handleVote('yes')}
              disabled={voting}
              data-special-sound="true"
              className={`w-full sm:flex-1 min-h-[56px] py-3.5 px-6 rounded-2xl font-comic text-base sm:text-lg uppercase font-black tracking-wider flex items-center justify-center gap-2.5 border-3 border-black transition-all cursor-pointer ${
                pollData.userVoted === 'yes'
                  ? 'bg-tirangaGreen text-white shadow-[6px_6px_0px_#000] ring-4 ring-[#FFE600] -translate-y-1'
                  : 'bg-tirangaGreen/90 hover:bg-tirangaGreen text-white shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5'
              }`}
            >
              <ThumbsUp className="w-5 h-5 text-popYellow shrink-0" />
              <span>YES! BJP / NDA</span>
              {pollData.userVoted === 'yes' && (
                <span className="text-xs bg-black text-[#FFE600] px-2.5 py-0.5 rounded-full font-mono font-black ml-1.5 border border-white">
                  ✓ YOUR VOTE
                </span>
              )}
            </button>

            {/* NO Button */}
            <button
              onClick={() => handleVote('no')}
              disabled={voting}
              data-special-sound="true"
              className={`w-full sm:w-48 min-h-[56px] py-3.5 px-6 rounded-2xl font-comic text-base sm:text-lg uppercase font-black tracking-wider flex items-center justify-center gap-2 border-3 border-black transition-all cursor-pointer ${
                pollData.userVoted === 'no'
                  ? 'bg-red-600 text-white shadow-[6px_6px_0px_#000] ring-4 ring-black -translate-y-1'
                  : 'bg-white hover:bg-red-50 text-black shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5'
              }`}
            >
              <ThumbsDown className="w-5 h-5 text-red-600 shrink-0" />
              <span>NO</span>
              {pollData.userVoted === 'no' && (
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-mono font-black ml-1 border border-white">
                  ✓ VOTED
                </span>
              )}
            </button>
          </div>

          {/* Real-time Progress Bar & Percentage Pill */}
          <div className="w-full max-w-xl">
            {(!pollData.totalVotes || pollData.totalVotes === 0) ? (
              /* Neutral Gray Bar when 0 votes */
              <div className="w-full bg-gray-200 border-3 border-black rounded-full h-8 overflow-hidden flex items-center justify-center shadow-[3px_3px_0px_#000] mb-2.5 px-3">
                <span className="text-xs font-mono font-black text-gray-500 uppercase tracking-wider">
                  0 Citizen Votes • Cast the first vote!
                </span>
              </div>
            ) : (
              <div className="w-full bg-gray-200 border-3 border-black rounded-full h-8 overflow-hidden flex shadow-[3px_3px_0px_#000] mb-2.5">
                <div
                  className="bg-tirangaGreen h-full transition-all duration-700 flex items-center justify-center text-xs font-mono font-black text-white px-2 truncate"
                  style={{ width: `${pollData.yesPercent}%` }}
                >
                  {pollData.yesPercent > 12 ? `${pollData.yesPercent}% YES` : (pollData.yesPercent > 0 ? `${pollData.yesPercent}%` : '')}
                </div>
                <div
                  className="bg-red-600 h-full transition-all duration-700 flex items-center justify-center text-xs font-mono font-black text-white px-2 truncate"
                  style={{ width: `${pollData.noPercent}%` }}
                >
                  {pollData.noPercent > 12 ? `${pollData.noPercent}% NO` : (pollData.noPercent > 0 ? `${pollData.noPercent}%` : '')}
                </div>
              </div>
            )}

            {/* Stats row beneath bar */}
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-700 px-1">
              <span className="flex items-center gap-1.5 text-tirangaGreen font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-tirangaGreen inline-block" />
                <span>YES: {pollData.yesVotes?.toLocaleString() || 0}</span>
              </span>
              <span className="text-gray-500 font-display text-[11px] font-bold">
                {pollData.totalVotes?.toLocaleString() || 0} Total Citizen Votes
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-black">
                <span>NO: {pollData.noVotes?.toLocaleString() || 0}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
