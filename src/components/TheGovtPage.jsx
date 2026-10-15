import React, { useState, useEffect, useRef } from 'react';
import IndianFlagLogo from './IndianFlagLogo';
import BharatStateMap from './BharatStateMap';
import {
  TrendingUp,
  Milestone,
  Hospital,
  ShieldCheck,
  Smartphone,
  CheckCircle,
  XCircle,
  Share2,
  ExternalLink,
  Layers,
  BarChart3,
  Flame,
  Award,
  Vote,
  Sun,
  Train,
  Plane,
  ChevronRight,
  Filter,
  Sparkles,
  RefreshCw,
  Landmark,
  ShieldAlert,
  ArrowUpRight,
  Check,
  Calendar,
  Lock,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';

// =====================================================================
// ANIMATED COUNT-UP NUMBER HOOK & COMPONENT
// =====================================================================
function AnimatedCounter({ value, duration = 1600, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const numStr = String(value).replace(/[^0-9.]/g, '');
          const target = parseFloat(numStr) || 0;
          const isDecimal = String(value).includes('.');

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = target * easeProgress;
            setDisplayValue(isDecimal ? current.toFixed(1) : Math.round(current));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={elementRef} className="tabular-nums font-mono font-black">
      {prefix}{typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}{suffix}
    </span>
  );
}

// =====================================================================
// DYNAMIC SVG INFOGRAPHIC: AREA & LINE TREND (GDP 2004–2026)
// =====================================================================
function AnimatedAreaChart() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const gdpPoints = [
    { year: '2004', gdp: 0.7, rank: 12, label: '$0.7T' },
    { year: '2009', gdp: 1.3, rank: 11, label: '$1.3T' },
    { year: '2014', gdp: 1.85, rank: 11, label: '$1.85T' },
    { year: '2019', gdp: 2.87, rank: 7, label: '$2.87T' },
    { year: '2022', gdp: 3.42, rank: 5, label: '$3.42T' },
    { year: '2024', gdp: 3.75, rank: 5, label: '$3.75T' },
    { year: '2026', gdp: 4.15, rank: 5, label: '$4.15T' }
  ];

  return (
    <div ref={containerRef} className="p-5 sm:p-7 bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase text-saffron-dark bg-yellow-100 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
            DYNAMIC AREA INFOGRAPHIC
          </span>
          <h3 className="text-xl sm:text-2xl font-comic font-black text-black mt-1">
            Bharat GDP Ascent ($ Trillion) &amp; World Ranking (2004–2026)
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-gray-500 font-bold">2026 Current Size</div>
          <div className="text-2xl font-comic font-black text-tirangaGreen-dark">$4.15 Trillion (#5)</div>
        </div>
      </div>

      <div className="w-full aspect-[16/9] sm:aspect-[21/9] max-h-[280px] relative select-none">
        <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gdpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#138808" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="40" y1="200" x2="680" y2="200" stroke="#000" strokeWidth="2" />
          <line x1="40" y1="140" x2="680" y2="140" stroke="#e5e7eb" strokeDasharray="3 3" />
          <line x1="40" y1="80" x2="680" y2="80" stroke="#e5e7eb" strokeDasharray="3 3" />
          <line x1="40" y1="30" x2="680" y2="30" stroke="#e5e7eb" strokeDasharray="3 3" />

          {/* UPA Era vs NDA Era Divider at 2014 */}
          <line x1="253" y1="20" x2="253" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="245" y="28" fontSize="10" fontWeight="900" textAnchor="end" fill="#dc2626" fontFamily="monospace">
            2004–2014 (UPA)
          </text>
          <text x="261" y="28" fontSize="10" fontWeight="900" textAnchor="start" fill="#15803d" fontFamily="monospace">
            2014–2026 (12-YR NDA)
          </text>

          {/* Dynamic Area Path */}
          <path
            d="M 50 190 Q 150 180 253 155 T 466 75 T 670 30 L 670 200 L 50 200 Z"
            fill="url(#gdpGrad)"
            opacity={inView ? 1 : 0}
            className="transition-opacity duration-1000"
          />

          {/* Dynamic Line Path with strokeDashoffset draw animation */}
          <path
            d="M 50 190 Q 150 180 253 155 T 466 75 T 670 30"
            fill="none"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              strokeDasharray: 800,
              strokeDashoffset: inView ? 0 : 800,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />

          {/* Milestone Circle Points */}
          {inView && (
            <>
              <g className="transition-all duration-500">
                <circle cx="50" cy="190" r="5" fill="#fff" stroke="#000" strokeWidth="2.5" />
                <text x="50" y="218" fontSize="10" fontWeight="900" textAnchor="middle" fill="#666">2004</text>
                <text x="50" y="178" fontSize="10" fontWeight="900" textAnchor="middle" fill="#000">$0.7T</text>
              </g>
              <g className="transition-all duration-500">
                <circle cx="253" cy="155" r="6" fill="#ef4444" stroke="#000" strokeWidth="2.5" />
                <text x="253" y="218" fontSize="10" fontWeight="900" textAnchor="middle" fill="#b91c1c">2014 (#11)</text>
                <text x="253" y="142" fontSize="11" fontWeight="900" textAnchor="middle" fill="#b91c1c">$1.85T</text>
              </g>
              <g className="transition-all duration-500">
                <circle cx="466" cy="75" r="6" fill="#138808" stroke="#000" strokeWidth="2.5" />
                <text x="466" y="218" fontSize="10" fontWeight="900" textAnchor="middle" fill="#15803d">2022 (#5)</text>
                <text x="466" y="62" fontSize="11" fontWeight="900" textAnchor="middle" fill="#15803d">$3.42T</text>
              </g>
              <g className="transition-all duration-500">
                <circle cx="670" cy="30" r="7" fill="#FF9933" stroke="#000" strokeWidth="3" />
                <text x="665" y="218" fontSize="10" fontWeight="900" textAnchor="middle" fill="#15803d">2026 (#5)</text>
                <text x="650" y="20" fontSize="13" fontWeight="900" textAnchor="end" fill="#000">$4.15T (Racing to #3)</text>
              </g>
            </>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-600 mt-4 pt-3 border-t border-gray-200">
        <span>Source: World Bank, IMF World Economic Outlook (2026 Forecast)</span>
        <span className="text-tirangaGreen-dark font-black">Net Growth: +124% ($2.3 Trillion added under NDA)</span>
      </div>
    </div>
  );
}

// =====================================================================
// DYNAMIC SVG BAR CHARTS (BOUNCING UPWARD FROM BASELINE)
// =====================================================================
function AnimatedBarChart() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const barMetrics = [
    { label: 'Defence Exports', upa: '₹686 Cr', nda: '₹38,424 Cr', upaH: 8, ndaH: 95, surge: '56x Surge', unit: '₹ Cr' },
    { label: 'Highway Pace', upa: '12 km/day', nda: '37+ km/day', upaH: 32, ndaH: 96, surge: '3.1x Speed', unit: 'km/day' },
    { label: 'Airports Network', upa: '74 Airports', nda: '166 Airports', upaH: 44, ndaH: 98, surge: '+124% Airports', unit: 'Count' },
    { label: 'AIIMS Institutes', upa: '7 AIIMS', nda: '25 AIIMS', upaH: 28, ndaH: 96, surge: '3.5x Expansion', unit: 'Count' }
  ];

  return (
    <div ref={containerRef} className="p-5 sm:p-7 bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase text-saffron-dark bg-yellow-100 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
            DYNAMIC BAR COMPARISON
          </span>
          <h3 className="text-xl sm:text-2xl font-comic font-black text-black mt-1">
            Key Infrastructure &amp; Security Surge: 2004–2014 vs 2014–2026
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono font-black">
          <span className="inline-flex items-center gap-1 text-red-700">
            <span className="w-3 h-3 bg-red-400 border border-black rounded-sm" /> UPA (2004–2014)
          </span>
          <span className="inline-flex items-center gap-1 text-tirangaGreen-dark">
            <span className="w-3 h-3 bg-tirangaGreen border border-black rounded-sm" /> NDA (2014–2026)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {barMetrics.map((item, idx) => (
          <div key={idx} className="p-4 bg-gray-50 border-2 border-black rounded-2xl flex flex-col justify-between shadow-[3px_3px_0px_#000]">
            <div className="text-center mb-3">
              <div className="text-xs font-mono font-black text-black uppercase truncate">{item.label}</div>
              <span className="inline-block px-2 py-0.5 mt-1 bg-yellow-300 text-black border border-black rounded text-[10px] font-black uppercase">
                {item.surge}
              </span>
            </div>

            <div className="h-44 w-full flex items-end justify-center gap-3 relative pb-2 border-b-2 border-black">
              {/* UPA Bar */}
              <div className="w-10 sm:w-12 flex flex-col items-center">
                <span className="text-[10px] font-mono font-bold text-red-700 mb-1">{item.upa}</span>
                <div
                  className="w-full bg-red-400 border-2 border-black rounded-t-md transition-all duration-1000 ease-out"
                  style={{ height: inView ? `${item.upaH}%` : '0%' }}
                />
              </div>

              {/* NDA Bar */}
              <div className="w-10 sm:w-12 flex flex-col items-center">
                <span className="text-[10px] font-mono font-black text-tirangaGreen-dark mb-1">{item.nda}</span>
                <div
                  className="w-full bg-tirangaGreen border-2 border-black rounded-t-md transition-all duration-1000 ease-out shadow-[2px_0px_0px_#000]"
                  style={{
                    height: inView ? `${item.ndaH}%` : '0%',
                    transitionDelay: `${idx * 150}ms`
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono mt-2 text-gray-500 font-bold">
              <span>UPA: 10 Yrs</span>
              <span>NDA: 12 Yrs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// DYNAMIC SVG DONUT CHARTS (SWEEPING INTO POSITION)
// =====================================================================
function AnimatedDonutChart() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const donuts = [
    {
      title: 'Broad Gauge Rail Electrified',
      upaVal: 35,
      ndaVal: 99.4,
      desc: 'from 35% in 2014 to >99.4% in 2026. 2nd largest electrified rail network globally.',
      accent: '#138808'
    },
    {
      title: 'Global Real-Time Digital Payments (UPI)',
      upaVal: 0,
      ndaVal: 48.5,
      desc: 'Zero in 2014 to 48.5% of ALL global real-time digital payments handled by Bharat (241B+ txns).',
      accent: '#FF9933'
    },
    {
      title: 'Rural Sanitation Coverage (Toilets)',
      upaVal: 38,
      ndaVal: 100,
      desc: 'Jumped from 38% in 2014 to 100% rural sanitation coverage (11.7 Cr household toilets built).',
      accent: '#000080'
    }
  ];

  return (
    <div ref={containerRef} className="p-5 sm:p-7 bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_#000]">
      <div className="mb-6">
        <span className="text-[10px] font-mono font-black uppercase text-saffron-dark bg-yellow-100 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_#000]">
          PROPORTION INFOGRAPHIC
        </span>
        <h3 className="text-xl sm:text-2xl font-comic font-black text-black mt-1">
          Saturation Milestones: 2014 Baseline vs 2026 Achievement
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {donuts.map((d, i) => {
          const circumference = 2 * Math.PI * 40; // r=40
          const strokeDashoffset = circumference - (d.ndaVal / 100) * circumference;

          return (
            <div key={i} className="p-5 bg-yellow-50/50 border-2 border-black rounded-2xl flex flex-col items-center text-center shadow-[3px_3px_0px_#000]">
              <div className="w-32 h-32 relative flex items-center justify-center mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={d.accent}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={inView ? strokeDashoffset : circumference}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)',
                      transitionDelay: `${i * 200}ms`
                    }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-comic font-black text-black">{d.ndaVal}%</span>
                  <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">2026 NDA</span>
                </div>
              </div>

              <h4 className="text-sm font-comic font-black text-black uppercase mb-1 leading-snug">{d.title}</h4>
              <p className="text-xs font-display text-gray-700 font-semibold leading-relaxed">{d.desc}</p>
              <div className="mt-3 pt-2 border-t border-black/10 w-full flex items-center justify-between text-[10px] font-mono">
                <span className="text-red-700 font-bold">2014 UPA: {d.upaVal}%</span>
                <span className="text-tirangaGreen-dark font-black">2026 NDA: {d.ndaVal}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================================
// MAIN THE GOVT PAGE COMPONENT
// =====================================================================
export default function TheGovtPage({ onOpenShareCard }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'map', 'timeline', 'infographics'
  const [searchTerm, setSearchTerm] = useState('');

  // 2029 Mega Mandate Poll State
  const [pollData, setPollData] = useState({
    yesVotes: 28491,
    noVotes: 3120,
    totalVotes: 31611,
    yesPercent: 90,
    noPercent: 10,
    userVoted: null,
    votedAt: null
  });
  const [voting, setVoting] = useState(false);
  const [voteToast, setVoteToast] = useState('');

  useEffect(() => {
    fetch('/api/govt-poll')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setPollData(data);
      })
      .catch(err => console.error('Failed to load govt poll:', err));
  }, []);

  const handleCastVote = async (choice) => {
    if (pollData.userVoted || voting) return;
    setVoting(true);
    try {
      const res = await fetch('/api/govt-poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice })
      });
      const data = await res.json();
      if (res.ok) {
        setPollData(data);
        setVoteToast(choice === 'yes' ? '🚩 Bharat Mata Ki Jai! Your YES vote is recorded.' : '⚠️ Your vote is recorded.');
        setTimeout(() => setVoteToast(''), 4500);
      } else if (res.status === 409) {
        setPollData(prev => ({ ...prev, userVoted: data.userVoted || choice }));
        setVoteToast(data.error || 'You have already voted! 1 vote per IP enforced.');
        setTimeout(() => setVoteToast(''), 4500);
      } else {
        alert(data.error || 'Failed to submit vote');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  // Full 12-Year Verified Data (2014–2026 NDA vs 2002–2014 Congress/UPA)
  const comparisons = [
    {
      id: 'gdp',
      category: 'Economy',
      title: 'GDP Ranking & Economic Size',
      upaVal: '#11 Rank ($1.85 Trillion in 2014)',
      upaText: 'Stigmatized as "Fragile Five" by Morgan Stanley (2013). Double-digit 10.9% CPI inflation, currency crisis, ₹10+ Lakh Cr hidden NPA crisis, policy paralysis.',
      ndaVal: '#5 Rank ($4.15 Trillion in 2026)',
      ndaText: 'Overtook the UK. World’s fastest-growing major economy (7.0% IMF projection in 2026). Forex reserves crossed $685 Billion. Racing towards #3 position.',
      growthBadge: '+124% Expansion • Racing to #3',
      source: 'World Bank & IMF World Economic Outlook (2026)',
      icon: TrendingUp,
      accentColor: '#FF9933'
    },
    {
      id: 'scams',
      category: 'Corruption & Integrity',
      title: 'Financial Scandals vs Zero Central Scams',
      upaVal: '₹4,00,000+ Cr Mega Loot Era',
      upaText: '₹1.76 Lakh Cr 2G Spectrum Scam, ₹1.86 Lakh Cr Coalgate, ₹70,000 Cr CWG Scam, ₹3,600 Cr AgustaWestland VVIP Chopper Scam, Adarsh Housing, National Herald.',
      ndaVal: 'Zero Scams in 12 Years (2014–2026)',
      ndaText: '₹38+ Lakh Crore transferred directly into citizens’ accounts via DBT (JAM Trinity), plugging ₹3.48 Lakh Crore in corrupt middleman leakages.',
      growthBadge: 'Zero Central Scams in 12 Years',
      source: 'CAG Audit Reports & Direct Benefit Transfer (DBT) Mission (2026)',
      icon: ShieldAlert,
      accentColor: '#DC2626'
    },
    {
      id: 'defence',
      category: 'Defence & Security',
      title: 'Defence Exports & Indigenization',
      upaVal: '₹686 Cr (FY14 • 68% Imports)',
      upaText: 'Crippling 68% foreign reliance. Critical shortage of ammunition (barely 10-day war reserves). Modernization stalled by middleman kickback scandals.',
      ndaVal: '₹38,424 Cr (FY26 • 56x Surge)',
      ndaText: 'Exporting military hardware to 80+ nations (BrahMos to Philippines, Pinaka rockets, artilleries). INS Vikrant & Tejas inducted. Defence production crossed ₹1.27 Lakh Cr.',
      growthBadge: '56x Defence Export Surge',
      source: 'Department of Defence Production (PIB 2026)',
      icon: ShieldCheck,
      accentColor: '#138808'
    },
    {
      id: 'security',
      category: 'National Security',
      title: 'Counter-Terrorism & Border Policy',
      upaVal: 'Dossier Era & Mainland Bombings',
      upaText: 'Inaction after 26/11 Mumbai terror attacks (166 martyrs). Serial blasts in Delhi, Mumbai train blasts, Varanasi, Pune, Jaipur. Neglected border infrastructure.',
      ndaVal: 'Zero Mainland Blasts • Surgical Strikes',
      ndaText: 'Uri Surgical Strikes (2016), Balakot Air Strikes (2019). Zero terror attacks in Indian mainland. Border infrastructure accelerated 4x. Abrogation of Article 370.',
      growthBadge: 'Zero Mainland Blasts • Decisive Retaliation',
      source: 'Ministry of Home Affairs & Indian Armed Forces Briefings (2026)',
      icon: Lock,
      accentColor: '#000080'
    },
    {
      id: 'highways',
      category: 'Infrastructure',
      title: 'National Highway Construction Pace',
      upaVal: '12 km / day (91,287 km total)',
      upaText: 'Just 93 km operational expressways. Bureaucratic bottlenecks and stalled environmental clearances choked arterial corridors.',
      ndaVal: '37+ km / day (1,46,572+ km total)',
      ndaText: '4,000+ km access-controlled world-class expressways (Delhi-Mumbai, Samruddhi, Purvanchal, Ganga). 4-lane+ highways expanded to over 46,000 km.',
      growthBadge: '3.1x Construction Pace',
      source: 'Ministry of Road Transport & Highways (MoRTH 2026)',
      icon: Milestone,
      accentColor: '#FF9933'
    },
    {
      id: 'airports',
      category: 'Infrastructure',
      title: 'Operational Commercial Airports',
      upaVal: '74 Airports (Built in 67 Yrs)',
      upaText: 'Air travel was an exclusive luxury for metro elites. Tier-2 and Tier-3 cities lacked functional commercial airstrips.',
      ndaVal: '166 Operational Airports',
      ndaText: 'More than doubled in 12 years under UDAN (Ude Desh Ka Aam Nagrik). Ayodhya, Jewar, Donyi Polo, Mopa, Deoghar, Shivamogga commissioned.',
      growthBadge: '+124% Expansion (More than Doubled)',
      source: 'Airports Authority of India (AAI 2026)',
      icon: Plane,
      accentColor: '#138808'
    },
    {
      id: 'rail',
      category: 'Infrastructure',
      title: 'Railway Electrification & Modernization',
      upaVal: '35% Electrified (21,801 km)',
      upaText: 'Unmanned level crossings caused frequent derailments. Outdated ICF rakes, zero semi-high-speed trains, chronic delays.',
      ndaVal: '>99.4% Electrified (65,000+ km)',
      ndaText: '100+ indigenous Vande Bharat trains running across all states. World’s highest Chenab Rail Bridge (359m). Dedicated Freight Corridors (WDFC/EDFC).',
      growthBadge: '99.4% Saturation • 100+ Vande Bharats',
      source: 'Ministry of Railways (2026)',
      icon: Train,
      accentColor: '#000080'
    },
    {
      id: 'digital',
      category: 'Digital & Fintech',
      title: 'Digital Payments & Fintech Dominance',
      upaVal: '₹0 (Zero UPI • Cash Scarcity)',
      upaText: 'Banking restricted to elite urban branches. Millions unbanked. Middlemen took massive cuts from welfare payouts.',
      ndaVal: '241+ Billion Annual UPI Txns',
      ndaText: 'Bharat accounts for 48.5% of ALL real-time digital payments globally. ₹314 Lakh Crore transaction value. Accepted in France, UAE, Singapore.',
      growthBadge: '48.5% of Global Real-Time Payments',
      source: 'National Payments Corporation of India (NPCI 2026)',
      icon: Smartphone,
      accentColor: '#FF9933'
    },
    {
      id: 'health',
      category: 'Healthcare & Welfare',
      title: 'AIIMS Hospitals & Medical Education',
      upaVal: '7 AIIMS • 51,348 MBBS Seats',
      upaText: 'Healthcare was a catastrophic financial shock for poor families. AIIMS announcements remained on paper for decades.',
      ndaVal: '25 AIIMS • 108,000+ MBBS Seats',
      ndaText: 'MBBS seats more than doubled. Ayushman Bharat provides ₹5 Lakh free annual health insurance to 55+ Crore citizens (35+ Crore Ayushman Cards issued).',
      growthBadge: '3.5x AIIMS • 2x Medical Seats',
      source: 'Ministry of Health & Family Welfare (MoHFW 2026)',
      icon: Hospital,
      accentColor: '#138808'
    },
    {
      id: 'space',
      category: 'Space & Deep Tech',
      title: 'Space Exploration & Semiconductor Fab',
      upaVal: 'Limited Budget & Antrix Scam',
      upaText: 'Antrix-Devas S-band spectrum corruption scandal. Zero semiconductor ecosystem. Foreign satellite reliance.',
      ndaVal: 'Chandrayaan-3 Moon South Pole Landing',
      ndaText: 'First nation to land on Moon’s South Pole. Aditya-L1 solar probe. 430+ foreign satellites launched commercially. Semicon Bharat fabs in Gujarat & Assam.',
      growthBadge: 'World #1 Moon South Pole Landing',
      source: 'ISRO & India Semiconductor Mission (2026)',
      icon: Sun,
      accentColor: '#000080'
    }
  ];

  // Year-by-Year Chronological Journey (Day 1: May 26, 2014 to 2026)
  const timelineMilestones = [
    {
      year: '2014',
      date: 'May 26, 2014',
      title: 'Day 1: Oath of Office & Welfare Trinity',
      desc: 'Narendra Modi sworn in as 14th Prime Minister. Launched Pradhan Mantri Jan Dhan Yojana (53+ Cr bank accounts opened), Swachh Bharat Abhiyan (11.7 Cr toilets), and Make in India.'
    },
    {
      year: '2015',
      date: 'July 1, 2015',
      title: 'Digital India & Rural Electrification',
      desc: 'Launched Digital India, laying the architecture for UPI. Initiated 100% electrification of 18,000 dark villages under Deen Dayal Upadhyaya Gram Jyoti Yojana.'
    },
    {
      year: '2016',
      date: 'Sept 29, 2016',
      title: 'Historic Uri Surgical Strikes & Demonetization',
      desc: 'Indian Army Para SF crossed LoC to dismantle terror launchpads in historic retaliatory surgical strike. Demonetization dealt a decisive blow to hawala and terror networks.'
    },
    {
      year: '2017',
      date: 'July 1, 2017',
      title: 'One Nation, One Tax: GST Implementation',
      desc: 'Historic rollout of Goods and Services Tax (GST) in midnight Parliament session, dismantling 17 state and central cascading taxes into a single unified national market.'
    },
    {
      year: '2018',
      date: 'Sept 23, 2018',
      title: 'Ayushman Bharat (World’s Largest Healthcare)',
      desc: 'PM-JAY launched offering ₹5 Lakh free hospitalization cover per family to over 55 Crore impoverished citizens. 100% village broad-gauge electrification accelerated.'
    },
    {
      year: '2019',
      date: 'Aug 5, 2019',
      title: 'Abrogation of Article 370 & Balakot Air Strikes',
      desc: 'IAF carried out Balakot precision air strikes inside Pakistan. Parliament peacefully abrogated Article 370 & 35A, fully integrating J&K and Ladakh into Bharat’s constitutional fold.'
    },
    {
      year: '2020',
      date: 'March 2020',
      title: 'PMGKAY (Free Rations for 80 Cr Citizens) & Atmanirbhar Bharat',
      desc: 'During COVID pandemic, guaranteed 5 kg free food grains monthly to 80 Crore citizens under PMGKAY. Launched ₹20 Lakh Crore Atmanirbhar Bharat economic package.'
    },
    {
      year: '2021',
      date: 'Oct 21, 2021',
      title: '2.2+ Billion Indigenous Vaccine Doses Administered',
      desc: 'Bharat developed Covaxin and manufactured Covishield indigenously, administering 2.2 Billion doses seamlessly tracked via the open-source CoWIN digital platform.'
    },
    {
      year: '2022',
      date: 'Sept 2, 2022',
      title: 'INS Vikrant Commissioned & Overtaking UK Economy',
      desc: 'Commissioned India’s first indigenous aircraft carrier INS Vikrant at Cochin Shipyard with 76% local content. Bharat officially overtook the United Kingdom to become World’s 5th Largest Economy.'
    },
    {
      year: '2023',
      date: 'Aug 23, 2023',
      title: 'Chandrayaan-3 Moon South Pole & G20 Consensus',
      desc: 'Bharat made history as the first country to land on Moon’s unexplored South Pole (Shiv Shakti Point). Successfully hosted G20 Leaders’ Summit with 100% consensus on the New Delhi Declaration.'
    },
    {
      year: '2024',
      date: 'Jan 22, 2024',
      title: 'Ayodhya Ram Mandir Pran Pratishtha & CAA Notified',
      desc: 'Grand peaceful consecration of Bhavya Shri Ram Janmabhoomi Mandir at Ayodhya fulfilling a 500-year civilizational dream. CAA notified granting citizenship to persecuted minorities.'
    },
    {
      year: '2025–2026',
      date: '2026 Current',
      title: 'Viksit Bharat Ascent: $4.15T GDP & ₹38,424 Cr Defence Exports',
      desc: 'GDP reached $4.15 Trillion as world’s fastest-growing major economy (7.0%). Defence exports surged to ₹38,424 Cr (+56x). >99.4% railway broad gauge electrification achieved.'
    }
  ];

  const handleShareClick = (item) => {
    if (onOpenShareCard) {
      onOpenShareCard({
        title: item.title,
        badge: item.growthBadge,
        claim: `${item.title}: UPA era recorded ${item.upaVal}`,
        truth: `NDA era achieved ${item.ndaVal} (${item.growthBadge})`,
        details: [item.ndaText, `Historical Context: ${item.upaText}`],
        source: item.source
      });
    }
  };

  const filteredComparisons = comparisons.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ndaText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upaText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Economy', 'Corruption & Integrity', 'Defence & Security', 'National Security', 'Infrastructure', 'Digital & Fintech', 'Healthcare & Welfare', 'Space & Deep Tech'];

  return (
    <div className="space-y-8 pb-16 selection:bg-saffron selection:text-black">
      
      {/* =====================================================================
          HERO BANNER (MORPHIC + POP ART HIGH-ENERGY AESTHETIC)
      ===================================================================== */}
      <section className="relative overflow-hidden bg-white border-3 sm:border-4 border-black p-6 sm:p-10 rounded-3xl shadow-[8px_8px_0px_#000] max-w-7xl mx-auto mt-2">
        <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-tirangaGreen/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFE600] border-2 border-black rounded-full shadow-[3px_3px_0px_#000] text-xs font-mono font-black uppercase tracking-wider text-black">
              <IndianFlagLogo className="w-5 h-3.5 rounded border border-black/40 shadow-xs" />
              <span>12-YEAR NATIONAL AUDIT (2014–2026) vs DECADE OF CRISIS (2002–2014)</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-tirangaGreen text-white border-2 border-black rounded-full text-xs font-mono font-black shadow-[2px_2px_0px_#000]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>100% MINISTRY &amp; CAG VERIFIED DATA</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-comic font-black uppercase text-black tracking-tight leading-none mb-4">
            From "Fragile Five" to World’s #5 Economy: The Bharat Record
          </h1>

          <p className="text-sm sm:text-base font-display text-gray-700 font-bold max-w-3xl leading-relaxed mb-8">
            An empirical, verifiable side-by-side comparison between the <strong>12-Year Transformation under Narendra Modi (2014–2026)</strong> and the <strong>Decade of Corruption, Policy Paralysis, and Stagnation under Congress/UPA (2002–2014)</strong>.
          </p>

          {/* Key Stat Cards (Morphic Soft UI with Pop Art Borders) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-3.5 bg-yellow-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">GDP Size (2026)</div>
              <div className="text-2xl sm:text-3xl font-comic text-black mt-0.5">
                <AnimatedCounter value="4.15" prefix="$" suffix="T" />
              </div>
              <div className="text-[10px] font-mono text-tirangaGreen-dark font-black mt-1">
                Rank #5 • Racing to #3
              </div>
            </div>

            <div className="p-3.5 bg-red-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Central Scams</div>
              <div className="text-2xl sm:text-3xl font-comic text-red-700 mt-0.5">
                <span>ZERO</span>
              </div>
              <div className="text-[10px] font-mono text-red-700 font-black mt-1">
                vs ₹4 Lakh Cr (UPA)
              </div>
            </div>

            <div className="p-3.5 bg-green-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Defence Exports</div>
              <div className="text-2xl sm:text-3xl font-comic text-tirangaGreen-dark mt-0.5">
                <AnimatedCounter value="38424" prefix="₹" suffix=" Cr" />
              </div>
              <div className="text-[10px] font-mono text-tirangaGreen-dark font-black mt-1">
                +56x Surge (80+ Nations)
              </div>
            </div>

            <div className="p-3.5 bg-yellow-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Highways Built</div>
              <div className="text-2xl sm:text-3xl font-comic text-black mt-0.5">
                <AnimatedCounter value="146572" suffix=" km" />
              </div>
              <div className="text-[10px] font-mono text-saffron-dark font-black mt-1">
                37+ km/day Pace
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Operational Airports</div>
              <div className="text-2xl sm:text-3xl font-comic text-chakraNavy mt-0.5">
                <AnimatedCounter value="166" />
              </div>
              <div className="text-[10px] font-mono text-chakraNavy font-black mt-1">
                Doubled (74 in 2014)
              </div>
            </div>

            <div className="p-3.5 bg-green-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">Broad Gauge Rail</div>
              <div className="text-2xl sm:text-3xl font-comic text-tirangaGreen-dark mt-0.5">
                <AnimatedCounter value="99.4" suffix="%" />
              </div>
              <div className="text-[10px] font-mono text-tirangaGreen-dark font-black mt-1">
                Electrified (35% in 2014)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          VIEW SWITCHER & NAVIGATION (MORPHIC TACTILE BUTTONS)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-3 border-black p-3.5 rounded-2xl shadow-[5px_5px_0px_#000]">
          
          {/* View Mode Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-comic text-sm uppercase font-black tracking-wider flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-saffron text-black border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 border-black hover:bg-gray-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>🗂️ Bento Fact Cards</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-comic text-sm uppercase font-black tracking-wider flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#FFE600] text-black border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 border-black hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>🗺️ India Map (BJP.org Vector)</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-comic text-sm uppercase font-black tracking-wider flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-black text-popYellow border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 border-black hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>📜 Day 1 to 2026 Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('infographics')}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-comic text-sm uppercase font-black tracking-wider flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                viewMode === 'infographics'
                  ? 'bg-tirangaGreen text-white border-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 border-black hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 Animated Charts</span>
            </button>
          </div>

          {/* Quick Search on Cards View */}
          {viewMode === 'cards' && (
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search metrics (GDP, AIIMS, Scams...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:outline-hidden shadow-[2px_2px_0px_#000]"
              />
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          VIEW 1: BENTO FACT CARDS (COMPARATIVE AUDIT)
      ===================================================================== */}
      {viewMode === 'cards' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-comic uppercase font-black border-2 transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_#FFE600]'
                    : 'bg-white text-gray-800 border-black hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComparisons.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b-3 border-black bg-white">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-black uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-black/20">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono font-black text-saffron-dark bg-yellow-100 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                        {item.growthBadge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-comic font-black text-black leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Side-by-Side UPA vs NDA Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y-3 sm:divide-y-0 sm:divide-x-3 divide-black flex-1">
                    {/* Left: Congress / UPA (2002–2014) */}
                    <div className="p-4 sm:p-5 bg-red-50/70 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-red-800 bg-red-200 px-2 py-0.5 rounded border border-red-400 uppercase">
                            <XCircle className="w-3 h-3" />
                            <span>2002–2014 (Congress)</span>
                          </span>
                        </div>
                        <div className="font-comic text-base sm:text-lg text-red-700 mb-2 leading-tight">
                          {item.upaVal}
                        </div>
                        <p className="text-xs font-display text-gray-700 leading-relaxed font-semibold">
                          {item.upaText}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-red-200 text-[10px] font-mono text-red-800 font-bold">
                        Decade of Scams &amp; Fragile Economy
                      </div>
                    </div>

                    {/* Right: NDA (2014–2026) */}
                    <div className="p-4 sm:p-5 bg-green-50/70 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-white bg-tirangaGreen px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] uppercase">
                            <CheckCircle className="w-3 h-3" />
                            <span>2014–2026 (12-Yr NDA)</span>
                          </span>
                        </div>
                        <div className="font-comic text-base sm:text-lg text-tirangaGreen-dark mb-2 leading-tight">
                          {item.ndaVal}
                        </div>
                        <p className="text-xs font-display text-gray-900 leading-relaxed font-bold">
                          {item.ndaText}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-green-200 text-[10px] font-mono text-tirangaGreen-dark font-black">
                        Status: Exponential Milestone Achieved
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Source & Share Button */}
                  <div className="bg-gray-100 border-t-3 border-black p-3 px-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-gray-600 truncate">
                      Source: {item.source}
                    </span>

                    <button
                      onClick={() => handleShareClick(item)}
                      className="min-h-[44px] px-3.5 py-1.5 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl font-comic text-xs uppercase font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Card</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 2: INTERACTIVE INDIA MAP (OFFICIAL BJP.ORG VECTOR MAP)
      ===================================================================== */}
      {viewMode === 'map' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <BharatStateMap onOpenShareCard={onOpenShareCard} />
        </section>
      )}

      {/* =====================================================================
          VIEW 3: DAY 1 TO 2026 CHRONOLOGICAL TIMELINE (12-YEAR VIKSIT BHARAT)
      ===================================================================== */}
      {viewMode === 'timeline' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white border-3 sm:border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_#000]">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="px-3 py-1 bg-black text-popYellow border border-black rounded-full text-xs font-mono font-black uppercase shadow-[2px_2px_0px_#FFE600]">
                CHRONOLOGICAL RECORD: MAY 26, 2014 TO 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-comic font-black text-black mt-2">
                12 Years of Sovereign Renaissance &amp; Development
              </h2>
              <p className="text-xs sm:text-sm font-display text-gray-600 font-bold mt-1">
                From the moment Narendra Modi bowed on the steps of Parliament on Day 1 to the historic 2026 milestones.
              </p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative border-l-4 border-black ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
              {timelineMilestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot Marker */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-saffron border-3 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-black" />
                  </div>

                  {/* Timeline Box */}
                  <div className="bg-yellow-50/60 hover:bg-yellow-50 border-2 border-black p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_#000] transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-comic font-black text-saffron-dark bg-yellow-200 px-2.5 py-0.5 rounded border border-black">
                        {m.year} • {m.date}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-comic font-black text-black mb-1.5">
                      {m.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-display text-gray-800 font-semibold leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =====================================================================
          VIEW 4: ANIMATED SVG INFOGRAPHICS
      ===================================================================== */}
      {viewMode === 'infographics' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <AnimatedAreaChart />
          <AnimatedBarChart />
          <AnimatedDonutChart />
        </section>
      )}

      {/* =====================================================================
          2026 CITIZEN PULSE POLL: VIKSIT BHARAT MANDATE
      ===================================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-white border-3 sm:border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_#000] text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-black text-popYellow px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase mb-3">
            <Vote className="w-3.5 h-3.5" />
            <span>CITIZEN PULSE 2026: VIKSIT BHARAT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-comic font-black text-black mb-2">
            Will Bharat Achieve a $7 Trillion Economy by 2030 Under Nationalist Leadership?
          </h2>

          <p className="text-xs sm:text-sm font-display text-gray-600 font-bold max-w-xl mx-auto mb-6">
            1 vote per verified IP address. Transparent real-time tally of public confidence.
          </p>

          {voteToast && (
            <div className="mb-4 p-3 bg-yellow-100 border-2 border-black rounded-xl font-bold text-xs text-black animate-bounce">
              {voteToast}
            </div>
          )}

          {/* Voting Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
            <button
              onClick={() => handleCastVote('yes')}
              disabled={Boolean(pollData.userVoted) || voting}
              className={`w-full sm:w-56 min-h-[48px] py-3.5 px-6 rounded-2xl font-comic text-sm uppercase font-black tracking-wider flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_#000] transition-all cursor-pointer ${
                pollData.userVoted === 'yes'
                  ? 'bg-tirangaGreen text-white'
                  : 'bg-tirangaGreen/90 hover:bg-tirangaGreen text-white hover:-translate-y-0.5'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>YES, VIKSIT BHARAT</span>
            </button>

            <button
              onClick={() => handleCastVote('no')}
              disabled={Boolean(pollData.userVoted) || voting}
              className={`w-full sm:w-48 min-h-[48px] py-3.5 px-6 rounded-2xl font-comic text-sm uppercase font-black tracking-wider flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_#000] transition-all cursor-pointer ${
                pollData.userVoted === 'no'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-black hover:-translate-y-0.5'
              }`}
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span>NO</span>
            </button>
          </div>

          {/* Progress Bar & Real-Time Stats */}
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-200 border-2 border-black rounded-full h-5 overflow-hidden flex shadow-inner mb-2">
              <div
                className="bg-tirangaGreen h-full transition-all duration-1000 flex items-center justify-center text-[10px] font-mono font-black text-white"
                style={{ width: `${pollData.yesPercent || 90}%` }}
              >
                {pollData.yesPercent || 90}%
              </div>
              <div
                className="bg-red-500 h-full transition-all duration-1000 flex items-center justify-center text-[10px] font-mono font-black text-white"
                style={{ width: `${pollData.noPercent || 10}%` }}
              >
                {pollData.noPercent || 10}%
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-black text-gray-700">
              <span className="text-tirangaGreen-dark">YES: {pollData.yesVotes?.toLocaleString()}</span>
              <span>Total Votes: {pollData.totalVotes?.toLocaleString()}</span>
              <span className="text-red-700">NO: {pollData.noVotes?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
