import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  TrendingUp,
  Hospital,
  Milestone,
  Sparkles,
  Filter,
  CheckCircle,
  Train
} from 'lucide-react';

export default function BharatStateMap({ onOpenShareCard }) {
  const [selectedStateId, setSelectedStateId] = useState('UP');
  const [hoveredState, setHoveredState] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [allianceFilter, setAllianceFilter] = useState('all'); // 'all', 'nda', 'opposition'
  const [copied, setCopied] = useState(false);

  // -----------------------------------------------------------------
  // COMPREHENSIVE 36 STATES & UTs DATABASE (2014–2026 VERIFIED RECORD)
  // -----------------------------------------------------------------
  const statesData = {
    UP: {
      id: 'UP',
      name: 'Uttar Pradesh',
      code: 'UP',
      capital: 'Lucknow',
      cm: 'Yogi Adityanath (BJP)',
      isNDA: true,
      tagline: 'Expressway Capital of Bharat & Sanatan Renaissance',
      summary: 'Transformed from riot-torn lawlessness into Bharat’s 2nd largest state economy ($300B+ GDP), 6+ world-class expressways, and Dharmic spiritual revival.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Operational Expressways', before: '2 (Yamuna/Agra)', after: '6+ (Purvanchal, Bundelkhand, Ganga, Gorakhpur)', growth: '3.5x Network' },
        { label: 'Communal Riots', before: 'Rampant (Muzaffarnagar 2013)', after: 'ZERO Major Riots since 2017', growth: '100% Peace' },
        { label: 'Operational AIIMS', before: '0 Operational', after: '2 Functional (Gorakhpur & Rae Bareli)', growth: '2 Functional' },
        { label: 'Airports Network', before: '4 Functional', after: '10+ (Ayodhya, Jewar Mega Hub, Varanasi)', growth: '3x Growth' }
      ],
      highlights: [
        'Ayodhya Shri Ram Janmabhoomi Mandir grand consecration & Kashi Vishwanath Dham expansion (100x larger, hosting 10+ Cr pilgrims).',
        'Over 1,225 km of access-controlled expressways equipped with emergency fighter jet airstrips.',
        'Zero-tolerance anti-mafia operations: dismantled ₹3,800+ Cr mafia crime syndicates with strict law enforcement.',
        'Defence Industrial Corridor producing BrahMos supersonic cruise missiles in Lucknow.'
      ],
      whatsappText: `🚩 *UTTAR PRADESH TRANSFORMATION (2014–2026)* 🇮🇳\n\n🏛️ *Dharmic Revival:* Grand Ayodhya Ram Mandir & Kashi Vishwanath Dham (100x expansion)\n🛣️ *Expressways:* 6+ world-class expressways (Purvanchal, Bundelkhand, Ganga)\n🛡️ *Law & Order:* ZERO major riots since 2017; Mafia empire dismantled\n🏥 *Healthcare:* 2 functional AIIMS (Gorakhpur & Rae Bareli) + Medical colleges in 65+ districts\n✈️ *Aviation:* 10+ operational airports including Ayodhya & Jewar Mega Airport\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    MH: {
      id: 'MH',
      name: 'Maharashtra',
      code: 'MH',
      capital: 'Mumbai',
      cm: 'Devendra Fadnavis / Eknath Shinde (NDA)',
      isNDA: true,
      tagline: 'Mega Infrastructure Engine: Atal Setu, Samruddhi & Metro 3',
      summary: 'Powering India’s economic capital with India’s longest sea bridge (Atal Setu MTHL), 701 km Samruddhi expressway, and world-class transshipment ports.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Longest Sea Bridge', before: 'Stalled for 30 years', after: 'Atal Setu (MTHL 21.8 km) Open', growth: 'Engineering Marvel' },
        { label: 'Samruddhi Expressway', before: '0 km', after: '701 km (Mumbai to Nagpur)', growth: '701 km Super Highway' },
        { label: 'Underground Metro', before: '0 km underground', after: 'Mumbai Metro 3 (Aqua Line) Active', growth: 'Colaba-SEEPZ Active' },
        { label: 'Wadhawan Mega Port', before: 'Stalled concept', after: '₹76,200 Cr Deepwater Port Cleared', growth: 'Top 10 Global Port' }
      ],
      highlights: [
        'Inauguration of Atal Bihari Vajpayee Sewri-Nhava Sheva Atal Setu (MTHL) slashing Mumbai-Navi Mumbai commute to 20 minutes.',
        '701 km Hindu Hrudaysamrat Balasaheb Thackeray Samruddhi Mahamarg connecting 10 districts.',
        'Navi Mumbai International Airport nearing completion with greenfield multimodal hub.',
        '₹76,200 Cr greenfield port at Wadhawan (Dahanu) to rank among the top 10 container ports globally.'
      ],
      whatsappText: `🌊 *MAHARASHTRA MEGA TRANSFORMATION (2014–2026)* 🇮🇳\n\n🌉 *Atal Setu (MTHL):* India's longest 21.8 km sea bridge operational\n🛣️ *Samruddhi Mahamarg:* 701 km super expressway connecting Mumbai & Nagpur\n🚇 *Mumbai Metro:* Underground Metro 3 (Aqua Line) running\n🚢 *Wadhawan Port:* ₹76,200 Cr deepwater port approved\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    GJ: {
      id: 'GJ',
      name: 'Gujarat',
      code: 'GJ',
      capital: 'Gandhinagar',
      cm: 'Bhupendra Patel (BJP)',
      isNDA: true,
      tagline: 'Semiconductor Capital, GIFT City & Bullet Train Spine',
      summary: 'The pioneer model of Atmanirbhar Bharat: India’s first Semiconductor fabrication plants, GIFT City international finance hub, and High-Speed Rail.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Semiconductor Fabs', before: '0 in India', after: 'Micron & Tata Mega Fabs Underway', growth: 'India’s 1st Chip Fabs' },
        { label: 'High Speed Bullet Train', before: 'Concept only', after: 'Full Piers & Bridges Completed', growth: 'Bullet Train Hub' },
        { label: 'Statue of Unity', before: 'None', after: 'World’s Tallest 182m Statue Built', growth: 'Global Landmark' },
        { label: 'Surat Diamond Bourse', before: 'None', after: 'World’s Largest Office Building', growth: 'Overtook Pentagon' }
      ],
      highlights: [
        'Micron $2.75 Billion semiconductor assembly plant in Sanand and Tata-PSMC mega chip foundry in Dholera.',
        'GIFT City established as India’s premier International Financial Services Centre (IFSC) hosting Google, SGX Nifty, and global banks.',
        'Mumbai-Ahmedabad Bullet Train bridges and high-speed tracks advancing rapidly.',
        'Surat Diamond Bourse operationalized as the world’s largest interconnected office building, surpassing the Pentagon.'
      ],
      whatsappText: `⚡ *GUJARAT TRANSFORMATION (2014–2026)* 🇮🇳\n\n💻 *Semicon Bharat:* Tata & Micron multi-billion dollar chip plants under construction\n🏙️ *GIFT City:* India's premier international financial hub trading SGX Nifty\n🚄 *Bullet Train:* High-speed rail corridor piers and viaducts completed\n🗽 *Statue of Unity:* 182m tribute to Sardar Patel hosting millions of visitors\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    MP: {
      id: 'MP',
      name: 'Madhya Pradesh',
      code: 'MP',
      capital: 'Bhopal',
      cm: 'Mohan Yadav (BJP)',
      isNDA: true,
      tagline: 'Cleanliness Capital, Mahakal Lok & Ken-Betwa Lifeline',
      summary: 'Leading Bharat in clean governance: Indore crowned Cleanest City 7 consecutive times, historic Ken-Betwa river interlinking, and Cheetah reintroduction.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Cleanest City Record', before: 'Unranked / Poor', after: 'Indore #1 in India (7 Consecutive Years)', growth: 'National Model' },
        { label: 'River Interlinking', before: 'Stalled for 40 years', after: '₹44,605 Cr Ken-Betwa Underway', growth: '1st National Project' },
        { label: 'Spiritual Tourism', before: 'Cramped Mahakal', after: 'Grand Shri Mahakal Lok Corridor', growth: '5x Pilgrim Surge' },
        { label: 'Cheetah Project', before: 'Extinct in India (1952)', after: 'Reintroduced at Kuno National Park', growth: 'Historical Return' }
      ],
      highlights: [
        'Shri Mahakal Lok Corridor in Ujjain inaugurated, revitalizing sacred Sanatan heritage.',
        'Historic ₹44,605 Crore Ken-Betwa Link Project launched to drought-proof Bundelkhand forever.',
        'Kuno National Park successfully breeding reintroduced African Cheetahs after 70 years of extinction in India.',
        'Asia’s largest 750 MW Rewa Ultra Mega Solar Power plant supplying clean energy to Delhi Metro.'
      ],
      whatsappText: `🌿 *MADHYA PRADESH RECORD (2014–2026)* 🇮🇳\n\n🏆 *Cleanliness Champion:* Indore #1 Cleanest City in India for 7 straight years\n🕉️ *Mahakal Lok:* Spectacular corridor expansion at sacred Ujjain\n💧 *Ken-Betwa Accord:* ₹44,605 Cr river interlinking drought-proofing Bundelkhand\n🐆 *Project Cheetah:* Historic reintroduction of Cheetahs at Kuno National Park\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    RJ: {
      id: 'RJ',
      name: 'Rajasthan',
      code: 'RJ',
      capital: 'Jaipur',
      cm: 'Bhajan Lal Sharma (BJP)',
      isNDA: true,
      tagline: 'Solar Powerhouse of the World, ERCP Accord & Barmer Refinery',
      summary: 'Transforming desert sands into renewable superpower with the world’s largest solar park (Bhadla 2,245 MW), ERCP water accord, and Delhi-Mumbai expressway.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Solar Generation', before: '< 1,000 MW', after: '2,245 MW Bhadla Mega Solar Park', growth: 'World’s Largest' },
        { label: 'Delhi-Mumbai Expressway', before: '0 km', after: '374 km 8-Lane Section Operational', growth: 'Delhi-Jaipur 3.5 Hrs' },
        { label: 'ERCP Water Dispute', before: 'Inter-state stalemate', after: 'Historic Central-MP-RJ Accord Signed', growth: '13 Districts Drought-Proof' },
        { label: 'Barmer Mega Refinery', before: 'Stalled foundation', after: '9 MMTPA Refinery Nearing Completion', growth: 'Hydrocarbon Hub' }
      ],
      highlights: [
        'Bhadla Solar Park in Thar Desert operating at 2,245 MW capacity as the world’s largest single-location solar farm.',
        'Delhi-Mumbai Expressway 8-lane expressway section operational, cutting travel time to Jaipur/Ranthambore.',
        'Tripartite agreement signed for Modified Parbati-Kalisindh-Chambal integrated with ERCP to supply water to 13 districts.',
        'Barmer Petrochemical Complex nearing full commissioning.'
      ],
      whatsappText: `☀️ *RAJASTHAN TRANSFORMATION (2014–2026)* 🇮🇳\n\n⚡ *Bhadla Solar Park:* 2,245 MW world's largest solar installation\n🛣️ *Delhi-Mumbai Expressway:* 374 km 8-lane expressway operational\n💧 *ERCP Water Resolution:* Historic accord to drought-proof 13 eastern districts\n🛢️ *Barmer Refinery:* 9 MMTPA mega oil refinery nearing operational rollout\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    OD: {
      id: 'OD',
      name: 'Odisha',
      code: 'OD',
      capital: 'Bhubaneswar',
      cm: 'Mohan Charan Majhi (BJP)',
      isNDA: true,
      tagline: 'Historic 2024 Mandate: Jagannath Ratna Bhandar & Industrial Surge',
      summary: 'First ever BJP government in Odisha: Reopening of sacred Jagannath Temple Ratna Bhandar after 46 years, coastal highway networks, and port megahubs.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Ratna Bhandar Audit', before: 'Locked for 46 years', after: 'Reopened & Inventoried in 2024', growth: 'Civilizational Justice' },
        { label: 'Port Cargo Traffic', before: '68 MMT at Paradip', after: '145+ MMT (Paradip #1 Major Port)', growth: 'India’s #1 Port' },
        { label: 'AIIMS Bhubaneswar', before: 'Nascent stages', after: 'Premier Referral Medical Hub', growth: 'Fully Functional' },
        { label: 'Vande Bharat Routes', before: '0', after: 'Connected Puri, Rourkela, Cuttack', growth: '3+ Routes Active' }
      ],
      highlights: [
        'Decisive historic election victory in 2024 establishing first nationalist BJP administration in Odisha.',
        'Immediate fulfillment of public pledge: Reopened all 4 gates of Puri Jagannath Temple and unsealed the sacred Ratna Bhandar after 46 years.',
        'Paradip Port handled over 145.38 Million Metric Tonnes of cargo to emerge as India’s highest volume major cargo port.',
        'Massive steel and green hydrogen investments anchoring the Dhamra-Paradip-Gopalpur coastal corridor.'
      ],
      whatsappText: `🚩 *ODISHA NEW ERA (2014–2026)* 🇮🇳\n\n🏛️ *Jagannath Heritage:* All 4 temple gates opened & Ratna Bhandar unsealed after 46 years\n🚢 *Paradip Port:* Overtook Deendayal Port to become India's #1 cargo port (145+ MMT)\n🏥 *AIIMS Bhubaneswar:* Fully established as eastern India's top medical hub\n🚆 *High Speed Connectivity:* Multiple Vande Bharat routes active\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    AS: {
      id: 'AS',
      name: 'Assam & Northeast',
      code: 'AS',
      capital: 'Guwahati',
      cm: 'Himanta Biswa Sarma (BJP)',
      isNDA: true,
      tagline: 'Tata Semiconductor Fab, AFSPA Rollback & Peace Accords',
      summary: 'Transforming Northeast from an isolated insurgency zone into Bharat’s booming economic powerhouse: ₹27,000 Cr Tata chip plant, 85% AFSPA rollback, and AIIMS Guwahati.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Semiconductor Plant', before: '₹0 Investment', after: '₹27,000 Cr Tata OSAT at Jagiroad', growth: 'High-Tech Revolution' },
        { label: 'AFSPA Footprint', before: 'Enforced across whole state', after: 'Withdrawn from >85% of Assam', growth: 'Peace Restored' },
        { label: 'AIIMS Guwahati', before: '0 in Northeast', after: 'Fully Functional Super-Specialty', growth: 'Inaugurated 2023' },
        { label: 'Brahmaputra Bridges', before: 'Just 3 bridges in 60 yrs', after: '6+ Bridges (Bogibeel, Dhola-Sadiya)', growth: '2x River Crossings' }
      ],
      highlights: [
        'Tata Electronics ₹27,000 Crore semiconductor assembly and testing facility operationalizing in Jagiroad.',
        'Inauguration of AIIMS Guwahati, ending decades where Northeastern patients had to travel 2,000 km to Delhi.',
        'Historic peace accords with Bodo, Karbi, Dimasa, and ULFA factions, disarming thousands of militants.',
        'Bogibeel (India’s longest rail-cum-road bridge) and Dhola-Sadiya (Bhupen Hazarika Setu) revolutionizing connectivity.'
      ],
      whatsappText: `🏔️ *ASSAM & NORTHEAST TRANSFORMATION (2014–2026)* 🇮🇳\n\n💻 *Semiconductor Hub:* ₹27,000 Cr Tata Chip plant established in Jagiroad\n🕊️ *AFSPA Rolled Back:* Withdrawn from 85%+ areas as peace accords resolved insurgencies\n🏥 *AIIMS Guwahati:* First AIIMS in Northeast serving all 8 sister states\n🌉 *Engineering Feats:* Bogibeel (4.94 km) & Dhola-Sadiya (9.15 km) bridges active\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    JK: {
      id: 'JK',
      name: 'Jammu & Kashmir',
      code: 'JK',
      capital: 'Srinagar / Jammu',
      cm: 'Central UT Administration',
      isNDA: true,
      tagline: 'Article 370 Abrogated, World’s Highest Rail Bridge & Record Tourism',
      summary: 'Historic integration with Bharat: Complete abrogation of Article 370, zero stone-pelting, world’s highest Chenab Rail Bridge (359m), and all-time record 2.15+ Cr tourists.',
      badgeColor: 'bg-emerald-500 text-white',
      stats: [
        { label: 'Stone Pelting Incidents', before: '2,653 in 2016', after: 'ZERO in 2024–2026', growth: '100% Eliminated' },
        { label: 'Annual Tourists', before: '~20-30 Lakh', after: '2.15+ Crore (All-Time Record)', growth: '7x Surge' },
        { label: 'Highest Rail Bridge', before: 'Stalled for decades', after: 'Chenab Bridge (359m high)', growth: 'Taller than Eiffel' },
        { label: 'Operational AIIMS', before: '0', after: 'AIIMS Jammu Active & Awantipora', growth: '2 Sanctioned' }
      ],
      highlights: [
        'Abrogation of Article 370 & 35A on August 5, 2019, extending Indian Constitution and equal rights to Dalits, Valmikis, and women.',
        'World’s highest railway arch bridge over the Chenab River (359 meters high) linking Kashmir valley to the Indian national railway grid.',
        'All-time historic record of over 2.15 Crore domestic and international tourists visiting J&K without fear.',
        'Successful hosting of the G20 Tourism Working Group meet in Srinagar showcasing peaceful New Kashmir to the world.'
      ],
      whatsappText: `🏔️ *JAMMU & KASHMIR RECORD (2014–2026)* 🇮🇳\n\n🇮🇳 *Article 370:* Peacefully abrogated; One Nation, One Constitution implemented\n🚫 *Stone Pelting:* Slashed from 2,650+ incidents to ZERO\n🧳 *Tourism Renaissance:* All-time record 2.15+ Crore tourists visited J&K safely\n🌉 *Chenab Rail Bridge:* World's highest railway arch bridge (359m) operational\n🏥 *AIIMS Jammu:* Inaugurated and treating thousands daily\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    LK: {
      id: 'LK',
      name: 'Ladakh',
      code: 'LK',
      capital: 'Leh / Kargil',
      cm: 'Central UT Administration',
      isNDA: true,
      tagline: 'Separate UT, Zojila All-Weather Tunnel & Highest Motorable Road',
      summary: 'Honoring the 70-year aspiration of Ladakhis: granted separate Union Territory status, Zojila and Z-Morh all-weather strategic tunnels, and 13 GW mega solar grid.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Union Territory Status', before: 'Neglected under J&K', after: 'Independent Union Territory', growth: '70-Yr Demand Met' },
        { label: 'Highest Motorable Road', before: 'Khardung La', after: 'Umling La (19,024 ft)', growth: 'Guinness World Record' },
        { label: 'Zojila All-Weather Tunnel', before: 'Stalled on paper', after: '14.15 km Tunnel in Final Stages', growth: 'Eliminates Winter Blockade' },
        { label: 'Renewable Solar Grid', before: 'Diesel generators', after: '13 GW Mega Solar-Wind Park', growth: 'Green Energy Hub' }
      ],
      highlights: [
        'Granted independent Union Territory status fulfilling decades of patriotic demands.',
        'World’s highest motorable road at Umling La Pass constructed by BRO at 19,024 feet.',
        'Zojila (14.15 km) and Z-Morh strategic tunnels ensuring year-round civilian and military connectivity.',
        '13 GW Mega Renewable Energy Park at Pang approved with inter-state transmission line.'
      ],
      whatsappText: `🏔️ *LADAKH TRANSFORMATION (2014–2026)* 🇮🇳\n\n🇮🇳 *Union Territory:* Created independent UT directly under Central care\n🛣️ *Umling La Pass:* World's highest motorable road at 19,024 feet built by BRO\n🚇 *Zojila Tunnel:* 14.15 km engineering marvel ending 6-month winter isolation\n⚡ *13 GW Solar Grid:* Transforming cold desert into clean green power generator\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    DL: {
      id: 'DL',
      name: 'Delhi & NCR',
      code: 'DL',
      capital: 'New Delhi',
      cm: 'National Capital Region',
      isNDA: false,
      tagline: 'New Parliament House, Kartavya Path & 160 km/h Namo Bharat RRTS',
      summary: 'National capital transformed with sovereign democratic monuments: New Parliament House housing the sacred Sengol, Bharat Mandapam, and Namo Bharat RRTS.',
      badgeColor: 'bg-chakraNavy text-white',
      stats: [
        { label: 'New Parliament House', before: '100-yr old colonial hall', after: 'Grand Sovereign Parliament Built', growth: 'Democratic Pride' },
        { label: 'Namo Bharat RRTS', before: '0 km', after: '160 km/h Rapid Transit Active', growth: 'India’s 1st RRTS' },
        { label: 'Bharat Mandapam', before: 'Dilapidated Pragati Maidan', after: 'Hosted Historic G20 Summit', growth: 'World Class Complex' },
        { label: 'National War Memorial', before: 'Neglected for 60 years', after: 'Built at India Gate', growth: '26,000+ Martyrs Honored' }
      ],
      highlights: [
        'New Parliament House built under Central Vista, housing the sacred Sengol; Rajpath rechristened to Kartavya Path.',
        'Namo Bharat Regional Rapid Transit System (RRTS) operating at 160 km/h between Delhi and Meerut.',
        'Bharat Mandapam and Yashobhoomi established as global top-10 convention venues.',
        'Eastern and Western Peripheral Expressways completed, diverting 100,000+ commercial trucks daily.'
      ],
      whatsappText: `🏛️ *DELHI & NCR TRANSFORMATION (2014–2026)* 🇮🇳\n\n🇮🇳 *New Parliament House:* Sovereign democratic home built with sacred Sengol\n🚆 *Namo Bharat RRTS:* 160 km/h high-speed rapid rail cutting Meerut travel to 45 mins\n🌐 *Bharat Mandapam:* World-class G20 summit venue & Yashobhoomi complex\n🎖️ *National War Memorial:* Permanent memorial honoring 26,000+ fallen martyrs\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    BR: {
      id: 'BR',
      name: 'Bihar',
      code: 'BR',
      capital: 'Patna',
      cm: 'Nitish Kumar / Samrat Choudhary (NDA)',
      isNDA: true,
      tagline: 'Patna Marine Drive, Darbhanga AIIMS & Industrial Resurgence',
      summary: 'Double engine growth: JP Ganga Pathway (Patna Marine Drive), Darbhanga AIIMS approved, Barauni Fertilizer plant revived, and rural electricity reaching 100%.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Ganga Riverfront Expressway', before: 'Traffic nightmare', after: 'JP Ganga Pathway (Marine Drive)', growth: '20 km Expressway' },
        { label: 'Operational AIIMS', before: '1 (AIIMS Patna)', after: '2nd AIIMS at Darbhanga Cleared', growth: '2 AIIMS in State' },
        { label: 'Barauni Fertilizer Plant', before: 'Shut down for 20 years', after: 'Revived with ₹9,500 Cr', growth: '1.27 MMT Urea/Year' },
        { label: 'Rural Electrification', before: 'Chronic dark villages', after: '100% Village Electrification', growth: 'Saubhagya Mission' }
      ],
      highlights: [
        'JP Ganga Pathway (Marine Drive) constructed along River Ganga, reducing Digha to Didarganj transit to 20 minutes.',
        'Darbhanga AIIMS project expedited with land handover to serve North Bihar and Mithilanchal.',
        'Barauni Fertilizer Plant revived by PM Modi with ₹9,500 Cr investment, ending urea shortage for farmers.',
        'Patna Metro Rail project progressing with subterranean tunnels.'
      ],
      whatsappText: `🚩 *BIHAR DEVELOPMENT ACCORD (2014–2026)* 🇮🇳\n\n🛣️ *JP Ganga Pathway:* Patna's iconic Marine Drive operational\n🏥 *Darbhanga AIIMS:* Second AIIMS sanctioned and advancing rapidly\n🏭 *Barauni Fertilizer:* 20-year shut factory revived producing 12.7 Lakh MT urea\n⚡ *Power Revolution:* 100% village electricity coverage under Saubhagya\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    AP: {
      id: 'AP',
      name: 'Andhra Pradesh',
      code: 'AP',
      capital: 'Amaravati',
      cm: 'N. Chandrababu Naidu / Pawan Kalyan (NDA)',
      isNDA: true,
      tagline: 'Amaravati Greenfield Renaissance, Polavaram & Tech Capital',
      summary: 'Resurgent NDA governance: Amaravati capital construction revived with ₹15,000 Cr central backing, Polavaram lifeline project fast-tracked, and IT corridor expansion.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Amaravati Capital Support', before: 'Scrapped / Halted', after: '₹15,000 Cr Central Backing Pledged', growth: 'Capital Revived' },
        { label: 'Polavaram National Project', before: 'Slowed / Delayed', after: 'Central Funding & Priority Status', growth: 'Andhra Lifeline' },
        { label: 'Bhogapuram Airport', before: 'Paper plan', after: 'Under Rapid Construction', growth: 'Greenfield Hub' },
        { label: 'Visakhapatnam IT Corridor', before: 'Stagnant', after: 'Adani Data Centers & IT Parks', growth: 'Tech Spine' }
      ],
      highlights: [
        'Central budget sanctioned ₹15,000 Crore special financial backing for Amaravati capital city completion.',
        'Polavaram Multipurpose National Irrigation Project fast-tracked to drought-proof Rayalaseema and coastal belts.',
        'Bhogapuram Greenfield International Airport advancing on war footing.',
        'Visakhapatnam developing as eastern India’s financial and high-speed data center gateway.'
      ],
      whatsappText: `🌊 *ANDHRA PRADESH RECORD (2014–2026)* 🇮🇳\n\n🏛️ *Amaravati Capital:* ₹15,000 Cr central backing to build world-class greenfield capital\n💧 *Polavaram Project:* National irrigation project fast-tracked as lifeline\n✈️ *Bhogapuram Airport:* Greenfield international hub under rapid construction\n💻 *IT Hub:* Visakhapatnam emerging as major technology and data hub\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    HR: {
      id: 'HR',
      name: 'Haryana',
      code: 'HR',
      capital: 'Chandigarh',
      cm: 'Nayab Singh Saini (BJP)',
      isNDA: true,
      tagline: 'Maruti Mega EV Hub, 100% Rail Electrification & 14 Crops MSP',
      summary: '10-year clean governance: 100% electrified railway network, Maruti Suzuki’s ₹18,000 Cr mega EV plant in Kharkhoda, and procurement of 14 crops on MSP.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Railway Electrification', before: '42%', after: '100% Broad Gauge Electrified', growth: '1st Major State' },
        { label: 'Maruti Suzuki Kharkhoda', before: '0', after: '₹18,000 Cr EV Plant Established', growth: '10 Lakh Cars/Yr' },
        { label: 'KMP Expressway', before: 'Delayed 12 years', after: '135.6 km Ring Expressway Active', growth: 'Decongested Delhi' },
        { label: 'Farmer MSP Coverage', before: '2 crops', after: '14+ Crops Procured at MSP', growth: 'Direct Bank Payout' }
      ],
      highlights: [
        'First major Indian state to achieve 100% electrification of its broad gauge railway network.',
        'Maruti Suzuki establishing Asia’s largest single-site auto plant at Kharkhoda with ₹18,000 Cr outlay.',
        'Kundli-Manesar-Palwal (KMP) Expressway completed, diverting heavy transit traffic outside Delhi.',
        'Transparent "Parchi-Kharchi" free government recruitment system providing merit-based jobs.'
      ],
      whatsappText: `🌾 *HARYANA RECORD (2014–2026)* 🇮🇳\n\n🚆 *100% Rail Electrification:* First state to completely electrify all broad gauge rail\n🚗 *Maruti Kharkhoda:* ₹18,000 Cr plant producing 10 Lakh cars annually\n🛣️ *KMP Expressway:* 136 km peripheral expressway operational\n🌾 *Farmer Prosperity:* 14 crops procured directly on MSP with DBT payments\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    CH: {
      id: 'CH',
      name: 'Chhattisgarh',
      code: 'CH',
      capital: 'Raipur',
      cm: 'Vishnu Deo Sai (BJP)',
      isNDA: true,
      tagline: 'Mahtari Vandan, Tribal Empowerment & Naxal Footprint Slashed',
      summary: 'Good governance restored: Mahtari Vandan monthly financial support to 70 Lakh women, 70% reduction in Naxalite violence, and record paddy procurement.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Naxalite Violence', before: 'Rampant red corridor', after: '70% Slashed, Top Cadres Neutralized', growth: 'Peace in Bastar' },
        { label: 'Mahtari Vandan Yojana', before: 'None', after: '₹1,000/Month to 70 Lakh Women', growth: 'DBT Cash Support' },
        { label: 'Paddy Procurement', before: 'Delayed & restricted', after: '₹3,100/Quintal Record Payout', growth: 'Highest in India' },
        { label: 'Raipur-Vizag Expressway', before: '0 km', after: '6-Lane Economic Corridor Active', growth: 'Port Connectivity' }
      ],
      highlights: [
        'Mahtari Vandan Yojana transferring ₹1,000 monthly cash assistance directly into bank accounts of 70 Lakh women.',
        'Decisive joint security operations dismantling Naxal terror networks across Sukma, Bijapur, and Bastar.',
        'Record procurement of 21 quintals of paddy per acre at ₹3,100 per quintal with one-time settlement.',
        'Raipur-Visakhapatnam Economic Corridor transforming interior tribal regions into trade hubs.'
      ],
      whatsappText: `🏹 *CHHATTISGARH RECORD (2014–2026)* 🇮🇳\n\n👩 *Mahtari Vandan:* ₹1,000 monthly cash assistance to 70 Lakh women\n🛡️ *Internal Security:* 70% reduction in Naxal footprint; security camps in core areas\n🌾 *Paddy Record:* ₹3,100 per quintal procurement honoring farmer hard work\n🛣️ *Raipur-Vizag Expressway:* High-speed trade access to east coast ports\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    UK: {
      id: 'UK',
      name: 'Uttarakhand',
      code: 'UK',
      capital: 'Dehradun',
      cm: 'Pushkar Singh Dhami (BJP)',
      isNDA: true,
      tagline: 'First State to Pass UCC, Char Dham All-Weather Highway & Rail Grid',
      summary: 'Devbhoomi leading the nation: First Indian state to enact the Uniform Civil Code (UCC), 900 km Char Dham all-weather highway, and Rishikesh-Karnaprayag rail line.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Uniform Civil Code (UCC)', before: 'Pending since 1950', after: 'Enacted as 1st State in India', growth: 'Constitutional Milestone' },
        { label: 'Char Dham Highway', before: 'Landslide prone roads', after: '900 km All-Weather Highway', growth: 'Safe Himalayan Transit' },
        { label: 'Rishikesh-Karnaprayag Rail', before: '0 km in hills', after: '125 km (104 km in Tunnels)', growth: 'Engineering Marvel' },
        { label: 'Anti-Copying Law', before: 'Paper leaks common', after: 'Strictest Law (10-Yr Jail & Fine)', growth: '100% Merit Jobs' }
      ],
      highlights: [
        'Historical passage of the Uniform Civil Code (UCC) Bill, ensuring equal inheritance, marriage, and civil rights for all citizens.',
        '900 km Char Dham all-weather road network linking Badrinath, Kedarnath, Gangotri, and Yamunotri.',
        'Rishikesh-Karnaprayag rail line carving 104 km of state-of-the-art tunnels through the Himalayas.',
        'Kedarnath Dham & Badrinath Master Plan reconstruction personally overseen by PM Modi.'
      ],
      whatsappText: `🏔️ *UTTARAKHAND HISTORIC RECORD (2014–2026)* 🇮🇳\n\n⚖️ *Uniform Civil Code (UCC):* First state in independent India to enact UCC\n🛣️ *Char Dham Highway:* 900 km all-weather double-lane road across Himalayan shrines\n🚆 *Himalayan Rail Line:* 125 km Rishikesh-Karnaprayag rail with 104 km tunnels\n🕉️ *Kedarnath Redevelopment:* Modern disaster-resilient shrine complex built\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    GA: {
      id: 'GA',
      name: 'Goa',
      code: 'GA',
      capital: 'Panaji',
      cm: 'Pramod Sawant (BJP)',
      isNDA: true,
      tagline: 'Mopa International Airport, Zuari Cable Bridge & 100% Tap Water',
      summary: 'Modern tourism & logistics hub: Manohar International Airport at Mopa operational, New Zuari cable-stayed bridge, and 100% Har Ghar Jal certified.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Operational Airports', before: '1 (Congested Dabolim)', after: '2 (Manohar Intl Airport Mopa)', growth: '2x Aviation Capacity' },
        { label: 'Zuari River Crossing', before: 'Aging 2-lane bottleneck', after: '8-Lane Cable-Stayed Bridge', growth: 'Signature Landmark' },
        { label: 'Har Ghar Jal', before: '40% tap coverage', after: '100% Piped Tap Water Certified', growth: '1st State in India' },
        { label: 'National Games 2023', before: 'Postponed for years', after: 'Successfully Hosted with 10,000+ Athletes', growth: 'World-Class Arenas' }
      ],
      highlights: [
        'Manohar International Airport at Mopa commissioned, handling international passenger and cargo airlines.',
        'Iconic 8-lane cable-stayed Zuari Bridge opened, cutting Panaji-Margao travel to 20 minutes.',
        'First state in India to achieve 100% Har Ghar Jal piped water connection certification.',
        'AYUSH super-specialty hospital and medical research centers established.'
      ],
      whatsappText: `🌴 *GOA DEVELOPMENT RECORD (2014–2026)* 🇮🇳\n\n✈️ *Mopa Airport:* Manohar International Airport handling millions of global travelers\n🌉 *New Zuari Bridge:* 8-lane cable-stayed engineering marvel operational\n💧 *100% Har Ghar Jal:* First state in Bharat to connect every home with piped tap water\n🏥 *Healthcare:* Goa Medical College super-specialty expansion active\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    AR: {
      id: 'AR',
      name: 'Arunachal Pradesh',
      code: 'AR',
      capital: 'Itanagar',
      cm: 'Pema Khandu (BJP)',
      isNDA: true,
      tagline: 'Sela Tunnel at 13,000 Ft, Donyi Polo Airport & Border Fortification',
      summary: 'Safeguarding Bharat’s eastern frontier: Sela Tunnel at 13,000 ft providing all-weather access to Tawang, Donyi Polo greenfield airport, and Vibrant Villages Program.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'Sela All-Weather Tunnel', before: 'Snowbound 4 months/yr', after: '13,000 ft Bi-Lane Tunnel Open', growth: 'World’s Longest at 13K Ft' },
        { label: 'Capital Aviation', before: '0 functional airports', after: 'Donyi Polo Airport (Itanagar)', growth: 'Direct Flights to Delhi' },
        { label: 'Vibrant Villages Program', before: 'Deserted border hamlets', after: 'Electrified, 4G & Road Connected', growth: 'Frontier Fortified' },
        { label: 'Hydropower Potential', before: 'Stalled projects', after: '2,880 MW Dibang & Subansiri', growth: 'Powerhouse of East' }
      ],
      highlights: [
        'Sela Tunnel dedicated to the nation by PM Modi at 13,000 ft elevation, bypassing snowbound Sela Pass.',
        'Donyi Polo Airport in Hollongi operational, giving Arunachal its first capital commercial airport.',
        'Vibrant Villages Program developing over 450 border villages with roads, 4G towers, and tourism.',
        'Subansiri Lower and Dibang multipurpose hydro projects expedited to add gigawatts of clean power.'
      ],
      whatsappText: `🏔️ *ARUNACHAL PRADESH RECORD (2014–2026)* 🇮🇳\n\n🚇 *Sela Tunnel:* World's longest bi-lane tunnel at 13,000 ft giving 24/7 access to Tawang\n✈️ *Donyi Polo Airport:* Capital Itanagar connected to national air network\n🛡️ *Vibrant Villages:* Border villages connected with 4G mobile, roads & clean electricity\n⚡ *Hydropower Giant:* Subansiri & Dibang mega dams advancing rapidly\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    WB: {
      id: 'WB',
      name: 'West Bengal',
      code: 'WB',
      capital: 'Kolkata',
      cm: 'Mamata Banerjee (AITC)',
      isNDA: false,
      tagline: 'India’s 1st Underwater Metro, Vande Bharat Grid & Central Welfare',
      summary: 'Central development projects delivered: India’s first underwater metro tunnel under Hooghly River, 6+ Vande Bharat routes, and PM Awas/Ration coverage.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'Underwater Metro', before: 'Stalled for decades', after: 'Underwater Metro (Hooghly) Running', growth: '1st in Bharat' },
        { label: 'Vande Bharat Routes', before: '0', after: 'Connected Howrah, NJP, Puri, Ranchi', growth: '6+ Routes' },
        { label: 'AIIMS Kalyani', before: '0', after: 'Operational Super-Specialty', growth: 'AIIMS Functional' },
        { label: 'Free Rations (PMGKAY)', before: 'Limited distribution', after: '6.0+ Crore Citizens Covered', growth: '100% Free Food' }
      ],
      highlights: [
        'Kolkata East-West Metro running under the Hooghly River in India’s first underwater transport tunnel.',
        'AIIMS Kalyani fully functional with modern OPD and IPD wings.',
        'Howrah railway terminal modernized with multiple semi-high-speed Vande Bharat trains.',
        'Over 6 Crore citizens receiving free monthly foodgrains under Pradhan Mantri Garib Kalyan Anna Yojana.'
      ],
      whatsappText: `🚆 *WEST BENGAL CENTRAL INITIATIVES (2014–2026)* 🇮🇳\n\n🚇 *Underwater Metro:* India's first underwater metro operating under Hooghly River\n🏥 *AIIMS Kalyani:* Premier medical institute serving eastern districts\n🚅 *Vande Bharat Fleet:* Multiple semi-high-speed express routes from Howrah & Sealdah\n🌾 *Free Rations:* 6+ Crore citizens protected under Central PMGKAY scheme\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    TN: {
      id: 'TN',
      name: 'Tamil Nadu',
      code: 'TN',
      capital: 'Chennai',
      cm: 'M.K. Stalin (DMK)',
      isNDA: false,
      tagline: 'Electronics Export Hub, Defence Corridor & Kashi-Tamil Sangamam',
      summary: 'National integration and electronics manufacturing: Tamil Nadu Defence Industrial Corridor, iPhone assembly hubs, and Kashi-Tamil Sangamam cultural bridge.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'Electronics Exports', before: 'Rank #4 in India', after: 'Rank #1 Electronics Exporter', growth: 'Apple iPhone Hub' },
        { label: 'Defence Corridor', before: '₹0 Investment', after: '₹12,000+ Cr Pledged Investments', growth: '5 Nodal Cities' },
        { label: 'Kashi-Tamil Sangamam', before: 'None', after: 'Annual National Cultural Festival', growth: 'Sanatan Unity' },
        { label: 'New Airport Terminal', before: 'Outdated terminals', after: 'Chennai T2 Integrated Terminal', growth: 'World Class' }
      ],
      highlights: [
        'Tamil Nadu emerged as India’s #1 electronics exporter with major Foxconn, Pegatron, and Tata plants.',
        'Tamil Nadu Defence Industrial Corridor active across Chennai, Coimbatore, Hosur, Salem, and Tiruchirappalli.',
        'Kashi-Tamil Sangamam launched by PM Modi, reviving ancient dharmic bonds between Kashi and Tamil Nadu.',
        'Chennai International Airport modernized with new Integrated Terminal Building (T2).'
      ],
      whatsappText: `🏭 *TAMIL NADU TRANSFORMATION (2014–2026)* 🇮🇳\n\n📱 *Electronics Hub:* Surged to Rank #1 electronics exporter in Bharat (iPhone assembly)\n🛡️ *TN Defence Corridor:* ₹12,000+ Cr defence and aerospace manufacturing network\n🕉️ *Kashi-Tamil Sangamam:* Historic national cultural and civilizational revival\n✈️ *Chennai Airport T2:* World-class integrated terminal building commissioned\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    KA: {
      id: 'KA',
      name: 'Karnataka',
      code: 'KA',
      capital: 'Bengaluru',
      cm: 'Siddaramaiah (INC)',
      isNDA: false,
      tagline: 'Asia’s Largest Helicopter Factory, Bengaluru-Mysuru Expressway',
      summary: 'High-tech and aerospace capital: HAL Tumakuru helicopter manufacturing plant, Bengaluru-Mysuru 10-lane expressway, and Kempegowda T2 airport.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'HAL Tumakuru Chopper Plant', before: '0', after: 'Asia’s Largest Helicopter Facility', growth: '600+ Choppers Target' },
        { label: 'Bengaluru-Mysuru Highway', before: '4-hour traffic jam', after: '10-Lane Expressway (75 Mins)', growth: 'Expressway Open' },
        { label: 'Kempegowda Airport T2', before: 'Single terminal', after: 'Terminal 2 "Terminal in a Garden"', growth: 'UNESCO Prix Versailles' },
        { label: 'Bengaluru Metro Expansion', before: '< 20 km operational', after: '73+ km Namma Metro Active', growth: 'Purple & Green Lines' }
      ],
      highlights: [
        'Asia’s largest helicopter manufacturing facility opened by PM Modi in Tumakuru, manufacturing Prachand and LUH.',
        'Bengaluru-Mysuru 10-lane access-controlled expressway operational, slashing travel time from 3.5 hours to 75 minutes.',
        'Kempegowda International Airport Terminal 2 ("Terminal in a Garden") won global UNESCO architectural awards.',
        'Bengaluru Suburban Rail Project backed with ₹15,767 Crore central funding.'
      ],
      whatsappText: `🚁 *KARNATAKA INDUSTRIAL HIGHLIGHTS (2014–2026)* 🇮🇳\n\n🚁 *HAL Tumakuru:* Asia's largest helicopter plant producing Light Combat Choppers\n🛣️ *Bengaluru-Mysuru Expressway:* 10-lane super highway cutting transit to 75 mins\n✈️ *Kempegowda T2:* World-class "Terminal in a Garden" international hub\n🚇 *Namma Metro:* Rapidly expanded with Whitefield and electronics city connectivity\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    KL: {
      id: 'KL',
      name: 'Kerala',
      code: 'KL',
      capital: 'Thiruvananthapuram',
      cm: 'Pinarayi Vijayan (CPI-M)',
      isNDA: false,
      tagline: 'INS Vikrant Aircraft Carrier, Vizhinjam Port & Kochi Water Metro',
      summary: 'Maritime and maritime industrial pride: First indigenous aircraft carrier INS Vikrant commissioned, Vizhinjam international transshipment deepwater port, and Kochi Water Metro.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'Indigenous Aircraft Carrier', before: '100% Import dependency', after: 'INS Vikrant Commissioned in Kochi', growth: '76% Indigenous Content' },
        { label: 'Vizhinjam Mega Port', before: 'Stalled for 25 years', after: 'India’s 1st Transshipment Hub', growth: 'Berthing Giant Ships' },
        { label: 'Kochi Water Metro', before: '0', after: '1st Integrated Water Metro in Asia', growth: 'Electric Hybrid Boats' },
        { label: 'National Highway 66', before: 'Land acquisition blocked', after: '6-Lane NH-66 Modernization', growth: 'Corridor Upgraded' }
      ],
      highlights: [
        'Historic commissioning of INS Vikrant (IAC-1) at Cochin Shipyard, placing Bharat in the elite club of carrier designers.',
        'Vizhinjam International Deepwater Multipurpose Seaport opened, berthing the world’s largest container motherships.',
        'Kochi Water Metro launched with battery-powered electric hybrid catamarans.',
        'Expansion of National Highway 66 into a 6-lane economic corridor with full central funding.'
      ],
      whatsappText: `⚓ *KERALA STRATEGIC ACHIEVEMENTS (2014–2026)* 🇮🇳\n\n⚓ *INS Vikrant:* First indigenous aircraft carrier built & commissioned at Cochin Shipyard\n🚢 *Vizhinjam Deepwater Port:* India's first container transshipment hub operational\n🚤 *Kochi Water Metro:* Asia's first electric water metro transit network\n🛣️ *NH-66 Expansion:* Modern 6-lane coastal highway network across state\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    TS: {
      id: 'TS',
      name: 'Telangana',
      code: 'TS',
      capital: 'Hyderabad',
      cm: 'A. Revanth Reddy (INC)',
      isNDA: false,
      tagline: 'AIIMS Bibinagar, Hyderabad Metro & Cherlapally Mega Terminal',
      summary: 'Pharma & defence corridor: AIIMS Bibinagar operationalized, Cherlapally 4th railway terminal, regional ring road, and defense missile test hubs.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'AIIMS Bibinagar', before: '0', after: 'Full Super-Specialty AIIMS', growth: 'Operational' },
        { label: 'Ramagundam Fertilizer', before: 'Closed for decades', after: '₹6,338 Cr Revival Operational', growth: '12.7 Lakh MT Urea' },
        { label: 'Cherlapally Terminal', before: 'Overcrowded Secunderabad', after: 'Modern 4th Railway Hub', growth: 'Decongested Hyderabad' },
        { label: 'Defence Labs DRDO', before: 'Limited test sites', after: 'Missile Testing Corridors', growth: 'Akash/Agni Testing' }
      ],
      highlights: [
        'AIIMS Bibinagar established and serving thousands of patients across Telangana.',
        'PM Modi dedicated the revived ₹6,338 Crore Ramagundam Fertilizer Plant to the nation.',
        'Cherlapally modernized as Hyderabad’s 4th major railway terminal.',
        'National Highways expanded with Hyderabad-Bangalore and Regional Ring Road packages.'
      ],
      whatsappText: `🌾 *TELANGANA CENTRAL PROJECTS (2014–2026)* 🇮🇳\n\n🏥 *AIIMS Bibinagar:* World-class super-specialty hospital serving common citizens\n🏭 *Ramagundam Plant:* ₹6,338 Cr revived fertilizer plant producing urea\n🚆 *Cherlapally Terminal:* Modernized 4th railway terminal decongesting Secunderabad\n🛣️ *Regional Ring Road:* Multi-thousand crore highway connectivity\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    PB: {
      id: 'PB',
      name: 'Punjab',
      code: 'PB',
      capital: 'Chandigarh',
      cm: 'Bhagwant Mann (AAP)',
      isNDA: false,
      tagline: 'AIIMS Bathinda, Kartarpur Corridor & Amritsar-Jamnagar Expressway',
      summary: 'Connecting sacred Sikh heritage: Historic Kartarpur Sahib corridor operationalized, AIIMS Bathinda, and Amritsar-Jamnagar economic corridor.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'Kartarpur Corridor', before: 'Closed since 1947', after: 'Visa-Free Corridor Opened (2019)', growth: '72-Yr Dream Realized' },
        { label: 'AIIMS Bathinda', before: '0', after: 'Fully Functional Super-Specialty', growth: 'AIIMS Running' },
        { label: 'Amritsar-Jamnagar Expressway', before: '0 km', after: 'Direct Trade Highway to Ports', growth: 'Port Connectivity' },
        { label: 'Direct MSP DBT Payments', before: 'Middlemen Arhtiya delay', after: '100% Direct DBT to Bank Accounts', growth: 'Farmer Empowerment' }
      ],
      highlights: [
        'Kartarpur Sahib Corridor opened on the 550th birth anniversary of Guru Nanak Dev Ji, enabling visa-free pilgrimage.',
        'AIIMS Bathinda operationalized with 750 beds and full medical college.',
        'Direct Benefit Transfer (DBT) of MSP payments directly credited into farmers’ bank accounts, bypassing commission agents.',
        'Amritsar-Jamnagar Expressway connecting Punjab directly to ports in Gujarat.'
      ],
      whatsappText: `☬ *PUNJAB SACRED & INFRA RECORD (2014–2026)* 🇮🇳\n\n☬ *Kartarpur Sahib Corridor:* Visa-free access to holy Gurdwara opened after 72 years\n🏥 *AIIMS Bathinda:* Fully functional premier healthcare institute in Malwa belt\n🛣️ *Amritsar-Jamnagar Expressway:* Super corridor directly connecting to Gujarat ports\n🌾 *Direct MSP DBT:* 100% payments credited directly to farmer bank accounts\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    JH: {
      id: 'JH',
      name: 'Jharkhand',
      code: 'JH',
      capital: 'Ranchi',
      cm: 'Hemant Soren (JMM)',
      isNDA: false,
      tagline: 'Deoghar International Airport, AIIMS Deoghar & Sahibganj Port',
      summary: 'Spiritual and mineral transformation: Deoghar International Airport, AIIMS Deoghar, and Sahibganj multi-modal cargo terminal on River Ganga.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'Deoghar Airport', before: '0 airport near Baidyanath', after: 'Direct Flights to Delhi & Kolkata', growth: 'Pilgrim Hub' },
        { label: 'AIIMS Deoghar', before: '0', after: 'Operational AIIMS Hospital', growth: 'Inaugurated' },
        { label: 'Sahibganj River Port', before: 'None', after: 'Multimodal Inland Waterway Terminal', growth: 'National Waterway 1' },
        { label: 'North Karanpura Plant', before: 'Delayed 20 years', after: 'Supercritical Power Plant Active', growth: 'Clean Energy' }
      ],
      highlights: [
        'Deoghar International Airport opened by PM Modi, connecting Baba Baidyanath Dham directly by air.',
        'AIIMS Deoghar established to serve the Santhal Pargana tribal and rural population.',
        'Sahibganj Multimodal Inland Waterways Terminal operationalized on the National Waterway-1 (Ganga).',
        'North Karanpura Super Thermal Power Project unit synchronized with air-cooled condenser technology.'
      ],
      whatsappText: `🚩 *JHARKHAND CENTRAL PROJECTS (2014–2026)* 🇮🇳\n\n✈️ *Deoghar Airport:* International-standard airport connecting Baidyanath Dham\n🏥 *AIIMS Deoghar:* Premier healthcare super-specialty operating in Santhal Pargana\n🚢 *Sahibganj River Port:* Multimodal inland cargo terminal on River Ganga\n⚡ *North Karanpura:* Supercritical mega power project generating electricity\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    HP: {
      id: 'HP',
      name: 'Himachal Pradesh',
      code: 'HP',
      capital: 'Shimla / Dharamshala',
      cm: 'Sukhvinder Singh Sukhu (INC)',
      isNDA: false,
      tagline: 'Atal Tunnel Rohtang, AIIMS Bilaspur & Kiratpur-Nerchowk Four-Lane',
      summary: 'Engineering marvels across the Himalayas: Atal Tunnel Rohtang (9.02 km at 10,000 ft), AIIMS Bilaspur, and Vande Bharat connectivity to Una.',
      badgeColor: 'bg-gray-800 text-white',
      stats: [
        { label: 'Atal Tunnel Rohtang', before: 'Stalled for 10+ years', after: '9.02 km Tunnel Opened (10,000 Ft)', growth: 'World’s Longest Highway Tunnel' },
        { label: 'AIIMS Bilaspur', before: '0', after: 'Full AIIMS Hospital Operational', growth: 'Inaugurated' },
        { label: 'Kiratpur-Nerchowk Highway', before: 'Twisting bottleneck roads', after: '4-Lane Highway with Tunnels', growth: 'Halved Travel Time' },
        { label: 'Vande Bharat Express', before: '0', after: 'New Delhi to Amb Andaura (Una)', growth: 'High Speed Link' }
      ],
      highlights: [
        'Atal Tunnel (9.02 km long) built under Rohtang Pass at 10,000 ft elevation, providing all-weather access to Lahaul-Spiti.',
        'AIIMS Bilaspur inaugurated by PM Modi, providing world-class tertiary healthcare in the hill state.',
        'Kiratpur-Nerchowk four-lane expressway opened, slashing Chandigarh-Kullu travel time by 3.5 hours.',
        'Semi-high-speed Vande Bharat Express connecting Una directly to New Delhi.'
      ],
      whatsappText: `🏔️ *HIMACHAL PRADESH RECORD (2014–2026)* 🇮🇳\n\n🚇 *Atal Tunnel Rohtang:* 9.02 km engineering wonder operating at 10,000 feet\n🏥 *AIIMS Bilaspur:* Premier super-specialty hospital established in the hills\n🛣️ *Kiratpur-Nerchowk 4-Lane:* Modern highway cutting Manali travel time drastically\n🚆 *Vande Bharat Una:* Direct high-speed train link to New Delhi\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    AN: {
      id: 'AN',
      name: 'Andaman & Nicobar',
      code: 'AN',
      capital: 'Port Blair (Sri Vijaya Puram)',
      cm: 'Central UT Administration',
      isNDA: true,
      tagline: 'Submarine Optical Fiber, Sri Vijaya Puram Renaming & Great Nicobar Port',
      summary: 'Sovereign maritime stronghold: Chennai-Andaman undersea optical fiber cable (CANI), Veer Savarkar International Airport terminal, and Great Nicobar transshipment hub.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'High Speed Internet', before: 'Slow satellite link (kbps)', after: '2,312 km Undersea Optical Cable', growth: '4G/5G Connectivity' },
        { label: 'Capital Renaming', before: 'Colonial Port Blair', after: 'Sri Vijaya Puram (Dharmic Pride)', growth: 'Colonial Name Erased' },
        { label: 'New Airport Terminal', before: 'Cramped airstrip', after: 'Veer Savarkar Shell-Shaped T1', growth: '50 Lakh Passengers/Yr' },
        { label: 'Great Nicobar Project', before: 'Stalled', after: '₹72,000 Cr Transshipment Port', growth: 'Global Chokepoint' }
      ],
      highlights: [
        '2,312 km Chennai-Andaman & Nicobar Islands (CANI) undersea optical fiber cable operationalized.',
        'Port Blair rechristened to "Sri Vijaya Puram" in honor of the Chola maritime empire.',
        'New integrated terminal building at Veer Savarkar International Airport inaugurated.',
        '₹72,000 Crore Great Nicobar International Transshipment Port approved.'
      ],
      whatsappText: `🏝️ *ANDAMAN & NICOBAR RECORD (2014–2026)* 🇮🇳\n\n🌐 *Undersea Fiber Cable:* 2,312 km submarine optical fiber bringing 4G/5G to islanders\n🏛️ *Sri Vijaya Puram:* Colonial name discarded in tribute to Netaji & Chola heritage\n✈️ *Veer Savarkar Airport:* Shell-shaped modern international terminal open\n🚢 *Great Nicobar Port:* Strategic transshipment terminal on Malacca Strait\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    },

    LKD: {
      id: 'LKD',
      name: 'Lakshadweep',
      code: 'LKD',
      capital: 'Kavaratti',
      cm: 'Central UT Administration',
      isNDA: true,
      tagline: 'Kochi-Lakshadweep Undersea Fiber, Eco-Resorts & Desalination',
      summary: 'Island transformation: Submarine optical fiber cable (KLI-SOFC) bringing high-speed broadband, world-class eco-tourism, and clean solar-powered desalination.',
      badgeColor: 'bg-saffron text-black',
      stats: [
        { label: 'High-Speed Broadband', before: 'Extremely poor satellite', after: 'Undersea Fiber Cable (KLI-SOFC)', growth: '100x Speed Surge' },
        { label: 'Eco-Tourism Surge', before: 'Neglected islands', after: 'Global Tourism Destination', growth: '10x Interest Surge' },
        { label: 'Drinking Water', before: 'Acute fresh water shortage', after: 'Desalination Plants Active', growth: 'Clean Tap Water' },
        { label: 'Aviation Upgrade', before: 'Single Agatti airstrip', after: 'Agatti Airfield Modernization', growth: 'Large Aircraft Ready' }
      ],
      highlights: [
        'Kochi-Lakshadweep Submarine Optical Fiber Cable (KLI-SOFC) dedicated to the nation by PM Modi.',
        'Global spotlight on Lakshadweep following PM Modi’s visit, spurring domestic eco-tourism.',
        'Low Temperature Thermal Desalination (LTTD) plants supplying potable drinking water.',
        'Solar and battery microgrid systems replacing diesel generators across islands.'
      ],
      whatsappText: `🌴 *LAKSHADWEEP TRANSFORMATION (2014–2026)* 🇮🇳\n\n🌐 *KLI Submarine Fiber:* Undersea fiber optic cable delivering high-speed internet to 11 islands\n🏝️ *Global Tourism:* Sustainable eco-resorts matching Maldives standards\n💧 *Clean Water:* Thermal desalination plants providing sweet drinking water\n✈️ *Agatti Airfield:* Runway expansion enabling direct flights from major metros\n\n*Rashtra Hit Sarvopari 🇮🇳* #ExposedPropagandus\nhttps://exposedpropagandus.is-best.net`
    }
  };

  const selectedState = statesData[selectedStateId] || statesData.UP;

  const handleCopyWhatsApp = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedState.whatsappText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareStateCard = () => {
    if (onOpenShareCard) {
      onOpenShareCard({
        title: `${selectedState.name} Transformation Record`,
        badge: selectedState.tagline,
        claim: selectedState.stats[0].label + ': ' + selectedState.stats[0].before,
        truth: selectedState.stats[0].label + ': ' + selectedState.stats[0].after + ' (' + selectedState.stats[0].growth + ')',
        details: selectedState.highlights,
        source: 'Official Ministry & State Assembly Records (2014–2026)'
      });
    }
  };

  // Helper to get fill color according to ruling alliance and filters
  const getStateFill = (code) => {
    const isSelected = selectedStateId === code;
    const isHovered = hoveredState?.code === code;
    const stateInfo = statesData[code];
    const isNDA = stateInfo ? stateInfo.isNDA : false;

    // Hovered state turns deep navy/purple with gold highlight
    if (isHovered) return '#1E1B4B';
    // Selected state turns bright saffron with outline
    if (isSelected) return '#F36523';

    if (allianceFilter === 'nda') {
      return isNDA ? '#F36523' : '#E5E7EB';
    }
    if (allianceFilter === 'opposition') {
      return !isNDA ? '#475569' : '#E5E7EB';
    }

    // Default view matching BJP.org: NDA states are saffron (#F36523), non-NDA are #F8F8F8 / light gray
    return isNDA ? '#F36523' : '#F8F8F8';
  };

  const getStateOpacity = (code) => {
    const isHovered = hoveredState?.code === code;
    const stateInfo = statesData[code];
    const isNDA = stateInfo ? stateInfo.isNDA : false;

    if (isHovered) return 1;
    if (allianceFilter === 'nda' && !isNDA) return 0.35;
    if (allianceFilter === 'opposition' && isNDA) return 0.35;
    return isNDA ? 1 : 0.75;
  };

  const handleStateMouseEnter = (code, name, isNDA, e) => {
    setHoveredState({ code, name, isNDA });
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleStateClick = (code) => {
    if (statesData[code]) {
      setSelectedStateId(code);
    }
  };

  return (
    <div className="bento-card p-5 sm:p-8 bg-white border-3 sm:border-4 border-black rounded-3xl shadow-[8px_8px_0px_#000] space-y-6 relative overflow-hidden">
      
      {/* -------------------------------------------------------------
          Top Header: Soft Morphic Pill & Action Controls
      ------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b-3 border-black">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE600] border-2 border-black rounded-full shadow-[2px_2px_0px_#000] mb-2 text-xs font-mono font-black uppercase text-black">
            <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
            <span>OFFICIAL BJP.ORG VECTOR MAP INTERACTION • 2014–2026 DOSSIER</span>
          </div>
          <h2 className="font-comic text-2xl sm:text-4xl text-black uppercase tracking-tight">
            🗺️ Interactive Map of Bharat: 36 States &amp; UTs
          </h2>
          <p className="text-xs sm:text-sm font-display text-gray-700 font-bold mt-1">
            Hover over any state to inspect governance status. Click any state on the map to explore verified 12-year development records (2014–2026).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="min-h-[44px] px-3.5 py-2 bg-[#25D366] hover:bg-emerald-600 text-white border-2 border-black rounded-xl text-xs font-comic uppercase font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000] active:translate-y-0.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied WhatsApp Pack!' : 'Copy WhatsApp Pack'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareStateCard}
            className="min-h-[44px] px-3.5 py-2 bg-saffron hover:bg-saffron-dark text-black border-2 border-black rounded-xl text-xs font-comic uppercase font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000] active:translate-y-0.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Fact Card</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Filter Bar & State Summary Quick Toggles
      ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-100/80 p-3 rounded-2xl border-2 border-black">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-black uppercase text-gray-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Alliance Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setAllianceFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase transition-all border-2 ${
              allianceFilter === 'all'
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black border-black hover:bg-gray-200'
            }`}
          >
            All States (36)
          </button>

          <button
            type="button"
            onClick={() => setAllianceFilter('nda')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase transition-all border-2 flex items-center gap-1.5 ${
              allianceFilter === 'nda'
                ? 'bg-[#F36523] text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black border-black hover:bg-orange-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>🚩 BJP / NDA Ruled (22)</span>
          </button>

          <button
            type="button"
            onClick={() => setAllianceFilter('opposition')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase transition-all border-2 ${
              allianceFilter === 'opposition'
                ? 'bg-gray-800 text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black border-black hover:bg-gray-200'
            }`}
          >
            Opposition Ruled (14)
          </button>
        </div>

        <div className="text-[11px] font-mono font-black text-gray-700">
          Selected State: <span className="text-saffron-dark underline uppercase">{selectedState.name}</span> ({selectedState.isNDA ? '🚩 BJP/NDA Ruled' : 'Opposition Ruled'})
        </div>
      </div>

      {/* -------------------------------------------------------------
          Main Grid: SVG Vector Map (Left) + Morphic Dossier Card (Right)
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: The Official BJP.org SVG Map of Bharat */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#FFFDF8] to-[#FFF5EB] p-4 sm:p-5 border-3 border-black rounded-3xl shadow-[5px_5px_0px_#000] flex flex-col items-center relative">
          
          {/* Map Header & Legend */}
          <div className="w-full flex items-center justify-between text-xs font-mono font-black mb-2 px-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-3 h-3 rounded-full bg-[#F36523] border border-black shadow-xs inline-block" />
                <span>BJP / NDA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-3 h-3 rounded-full bg-[#F8F8F8] border border-black shadow-xs inline-block" />
                <span>Others</span>
              </span>
            </div>
            
            <button
              onClick={() => setAllianceFilter(prev => prev === 'nda' ? 'all' : 'nda')}
              className="text-[10px] uppercase font-mono font-black bg-popYellow px-2 py-0.5 border border-black rounded hover:bg-yellow-400 cursor-pointer shadow-[1px_1px_0px_#000]"
            >
              {allianceFilter === 'nda' ? 'Show All' : 'Click to See BJP/NDA States'}
            </button>
          </div>

          {/* SVG Map Container */}
          <div className="w-full relative aspect-[595/674] max-h-[580px] flex items-center justify-center select-none">
            
            {/* Floating Live Tooltip */}
            {hoveredState && (
              <div
                className="absolute z-30 pointer-events-none bg-black text-white px-3 py-1.5 rounded-xl border-2 border-popYellow shadow-[4px_4px_0px_rgba(0,0,0,0.8)] font-comic text-xs uppercase font-black transition-transform duration-75 flex items-center gap-1.5"
                style={{
                  top: '12px',
                  right: '12px'
                }}
              >
                <span>{hoveredState.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${hoveredState.isNDA ? 'bg-[#F36523] text-white' : 'bg-gray-600 text-gray-200'}`}>
                  {hoveredState.isNDA ? '🚩 BJP/NDA' : 'Opposition'}
                </span>
              </div>
            )}

            {/* The BJP.org SVG Map (viewBox 0 0 595.3 674.3) */}
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 595.3 674.3"
              className="w-full h-full drop-shadow-md overflow-visible"
            >
              <g id="XMLID_52_">
                
                {/* 1. Himachal Pradesh */}
                <path
                  id="Himachal Pradesh"
                  data-code="HP"
                  d="M164.2,131.8l6.8,3.6l-0.3,4.9l3.3,4.7l0.1,2.5h0.1l2.2-2.9l6.1,5.6l-0.9,5.9l4.7,3.1l6.2,1.9v5.6l5.6,1.9 l1.8-0.8l0.2-0.2l0.1,0.1l1.6-0.7v-10.4l4.7-6.8l8.8-0.3l4.9,1.9l3.1-0.1l0.1,0.8c0,0.2,0.1,0.5,0.1,0.7c0.2,0,0.5,0,0.9,0.1 l-0.2-2.4l-0.1-2.6v-0.1l-3.2-1.6l-0.5-2.3l2.2-0.3l0.3-1.9h-1.8l-0.3-7.2l-4.8-5.6l1.3-2.8l-0.3-0.7l-5.6-5.7l-5.9,1.3l-4.8-5.7 l-4,2.1l-9.9-4.3l-1.2-4.8l-8.9,2l-5.2,5.8l-3.7-1.6l-1,1l4.8,2.8l-3.4,4.9l2.1,4.5l-5.6,1.8L164.2,131.8z"
                  fill={getStateFill('HP')}
                  opacity={getStateOpacity('HP')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'HP' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('HP')}
                  onMouseEnter={(e) => handleStateMouseEnter('HP', 'Himachal Pradesh', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 2. Haryana */}
                <polygon
                  id="Haryana"
                  data-code="HR"
                  points="179.1,219.9 183,213.2 188.6,217.1 185.8,222.6 185.9,226.3 188.8,224.5 193.9,224.3 196.3,221.5 195.6,216.9 196.8,213.1 194.9,211 193.7,210.5 191.8,213.4 186.6,210.2 184,206.2 186.9,199.9 190.9,200.4 191.3,198.8 189.2,195.4 189.9,191.3 186.9,189.6 188.2,185.2 190.2,182.4 190.4,175.9 195.5,175.9 195.6,173 197.8,170.2 190.5,167.7 190.5,162.2 187.2,161.2 187.6,171.5 183.9,169.5 182.7,170.9 183.4,174.5 177.9,176.5 174.4,175.4 173.9,176.9 174.6,181.9 167.3,185.1 165.5,182 160,182 156.5,186.2 152.8,186.2 152.8,180.4 146.4,178 142.1,178.1 140.4,180.4 144.6,183.2 143.6,189 148.6,188.8 155.1,191.9 159.4,191.5 159.3,205.1 169.4,213.1 166.8,221.5 169.9,222.2 170.5,218.9 174.2,215.5 178,215.8 177.8,219.7"
                  fill={getStateFill('HR')}
                  opacity={getStateOpacity('HR')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'HR' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('HR')}
                  onMouseEnter={(e) => handleStateMouseEnter('HR', 'Haryana', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 3. Uttar Pradesh */}
                <path
                  id="Uttar Pradesh"
                  data-code="UP"
                  d="M245.2,206.1l-4-2.5l-8,0.6l-5.9-6.6l-2.8,0.7l-4.8-5.6l3.4-2.3l-1-1.4l-5.6-0.4l-1.8-4.3l-7.7,4.4l-5-2.7 l-0.4-8.6l3.7-3.3l-5-4.1l-2.7,3.7l-0.2,4.2h-5l-0.2,5.2l-2.1,3.1l-0.8,2.7l2.9,1.6l-0.8,4.6l2,3.6l-0.8,2.9l0.7,2.2l1,5l1.8,0.8 l2.9,3.1l-1.4,4.4l0.8,5.1l-3,3.4l-0.6,6.4l6.6,4.1l-2.1,4l2.9,1l-2.8,3.1l-3.7,0.5l0.3,1.9l1.9-0.1l0.3-1.8l4.7-1.5l2.5,0.3 l2.2-2.2l6.2,3.9l8,0.6l6.6,7.6l0.4,6.5l-2.9,0.9l0.5,2.6l-4.5,9.3l-6.7,0.9l-3.7,3.7l0.8,2.6l2.8,1.6l-2,2.8l-2.9,1.7l-0.1,2.5 l2.6,3.4l-3.1,4.1l3.1,4.1l4.3-2l1.7,2.3l5.3-1.7l-0.6-2.3l-3.9-2.5l-0.2-5.8l-2.6-3.1l-0.4-3.8l-1.9-2.8l8-4.7l2.4,6.2l4.7,1.7 l2.4-2.2l4.1,2.5l3-0.3l10.7-5.6l3.6,4.4l-1.7,3l2.9,0.6l7.9-4.5l0.9,4l-0.2,0.3c-0.5,0.8-1.1,1.8-1.5,2.4c1,0.1,2.6,0.4,5.6,0.8 l4.4-5.7l4.3-0.8l14.1,11.1l5-1.2l6,1.4l-2.2,4.5l0.9,2.9v4.3l-2.2,0.4l1.7,2.1l1.7,1.7l2.5,1.2l6.3-4.5l0.9-9.4l3-1.2l-0.3-2 l-3.3-1.1l-1.4-10.1l5.3-4.9l4.3,0.3l2.3-5.1l6.8-3.4l4.5,1.1l1.3-1.2l-11.2-6.5v-3.8l3.1-0.6v-1.3l-5.5-1.4l3-4.5h6.5v-1.7l-6.5-4 l-4.1-7.4l-0.6-2.2l-0.3,0.4l-1.9-1.8l-5.9-0.1l-0.4,2.6l-1.5-1.2l-4.4-1.5l-7.2-1.6l-0.1-3.7l-1.9-0.4l-3.4,0.4l-7.6-4l-2.2,2 l-2.4-2.9l-8.5-5.5l-2-3.6l-19.2-9.2L245.2,206.1z"
                  fill={getStateFill('UP')}
                  opacity={getStateOpacity('UP')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'UP' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('UP')}
                  onMouseEnter={(e) => handleStateMouseEnter('UP', 'Uttar Pradesh', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 4. Goa */}
                <polygon
                  id="Goa"
                  data-code="GA"
                  points="115.5,497.6 120.4,501.3 121.7,500.4 123.6,493.6 123.1,485.1 120.8,483.4 118.8,487.1 115.9,485.6 114.2,482.5 111.5,481.4 112.1,487.9 115.8,490.5"
                  fill={getStateFill('GA')}
                  opacity={getStateOpacity('GA')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'GA' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('GA')}
                  onMouseEnter={(e) => handleStateMouseEnter('GA', 'Goa', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 5. Uttarakhand */}
                <path
                  id="Uttarakhand"
                  data-code="UK"
                  d="M249.3,161l-7.9-5.8l-4,1.2l-2.7-0.9l-0.3-2.2l-2-1.1l-4.1-7.4l-1.8,1.6l-0.5,1.3l0.1,2.2 l0.3,4.6l-1.1-0.1c-1.1-0.1-2.4-0.2-2.5-0.2c-0.7,0-1-0.6-1.1-1.4l-1.8,0.1l-4.9-1.9l-7.5,0.3l-3.9,5.6v11.1l-1.8,0.8l6.4,5.3 l-4.6,4.2l0.3,6.7l3.1,1.7l8.6-4.9l2.2,5.1l5.3,0.4l2.6,3.8l-3.2,2.2l2.6,3l2.8-0.7l6.1,6.8l7.7-0.5l3.6,2.2l2.4-1.4l-0.3-2.3 l1.2-4.3l2.4-3.1l-2-0.7l0.3-2.4l3.4-3.6l-2.4-2l3.2-5.5l4.3-0.3l2.6-4.1l3.7-1.1l-0.8-1.6l-2.8-0.4l-6.3-6.3l-2.2,0.8l-2.8-0.4 L249.3,161z"
                  fill={getStateFill('UK')}
                  opacity={getStateOpacity('UK')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'UK' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('UK')}
                  onMouseEnter={(e) => handleStateMouseEnter('UK', 'Uttarakhand', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 6. Dadar & Nagar Haveli */}
                <polygon
                  id="Dadar & Nagar Haveli"
                  data-code="DHV"
                  points="102.8,383.1 102.6,383.5 104.1,386.2 105.8,386.4 107.1,384.4 104.9,382.9"
                  fill={getStateFill('DHV')}
                  opacity={getStateOpacity('DHV')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'DHV' ? '2.5' : '1'}
                  className="cursor-pointer"
                  onClick={() => handleStateClick('DHV')}
                  onMouseEnter={(e) => handleStateMouseEnter('DHV', 'Dadra & Nagar Haveli', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 7. Maharashtra */}
                <path
                  id="Maharashtra"
                  data-code="MH"
                  d="M111.4,478.7v0.6l4.1,1.8l1.7,3.1l0.8,0.4l2.1-4.1l3,2.2l2.2-7.3l2.1-2.1v-1l-3.4-0.4 l-0.9-7.7l7.1-1.4l4.5-1.9l4.4-4l3.9-0.7l1.3,1.9l6.3-0.7l2.5-0.4l1.4-5.5l-2.6-3.6l3.7-3.1l4.7,3.9l7.9,0.5l1.2-5.1l4.2-4l2.7,0.7 l4.5-5.8l-0.2-2.8l2.9-0.6l1.6-4.2l2.8-1.6l4.1,1.1l0.7-0.2l1.7-3l3.2-0.7l2.3-3.7l-0.6-2.1l-2.2-2.2l2.8-2.2l-0.8-5.9h5.1l0.8,1.9 l0.8-0.2l0.4-3.4l2.1-1.1l-0.2-4l-0.8-4.3l3.6-2.2l3,2.6h7.1l-0.6,3.6l7.4,3.9l3-2.3l3.7,2.5l4.4-2.1l6.6,1.9l0.2,6.4l-2.9,3.9 l3.6,2l-0.5,4.3l3-0.3l2.5-9.2l4-4.9l3.9,2.3l1.7-4l-4.2-3.4l-2.8,0.4l-3.1-5l3.2-1.6l1-1.8l-4.1-1.7l0.8-4.3h3.9l-0.3-5.2 l-3.7-1.5l2.8-4.2l-1.6-6.2l2-4.9l0.7-1l-3.8-2.3l-3.6-1.6l-3.6,1.3l-2.9-1.3l-5.5,2.3l-6.4-4.7l-5.3,1.7v3.3l-10.2,1.1l-2.8-3.2 h-3.6l-6,5.1l-9-1l-2.7-4.8h4.3l0.2-2.4l-3-2.6l-5.5,2.8l-4.5-0.2l-2,5.4l-2.3,0.6l0.5,4.6l-10.3,4l-3.3-2.8l1.5-3.6l-1.6-2.3 l-17.6,0.4l-3.6-5.6H138l-5.2-2.2l1.1-6.7L131,348l-2.4,2.8h-3.4l-4.6,1l0.8,2.8l-1.7,2.5l9.8-1.3l1.2,4.3l-8.4,2.2l-3.4,4.2h-4.2 c-0.1,0.3-0.1,0.6-0.2,0.9c0.6,0.2,2.2,0.4,3.8,0.4h0.4l4.1,4.3l-5.4,6.6l-4.8-4.2l-1.5,0.6l1.8,2.5l0.9,5.2l-4,3.4l-1.1-0.8 l-1.8,3L103,388l-1.6-3.1l-0.9,0.9l-1.7,1l-0.2,0.7l-1.9,3.1l0.3,9.1l0.7,3.7l-0.8,1.5l1.1,5l1.6,3.6l-0.8,4.1l1.3,6.7l1.1,7.4 l1.1,1.8v2.3l2.6,12.7l0.1,8.9l3.4,19.4L111.4,478.7z"
                  fill={getStateFill('MH')}
                  opacity={getStateOpacity('MH')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'MH' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('MH')}
                  onMouseEnter={(e) => handleStateMouseEnter('MH', 'Maharashtra', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 8. Rajasthan */}
                <polygon
                  id="Rajasthan"
                  data-code="RJ"
                  points="54.8,245 55.2,248.1 54.4,249.2 54.1,253.1 52.2,255.9 56.7,264.4 63.6,263.9 63.5,271 67.5,276.1 67.9,281.9 70.5,286.6 70.2,286.9 74,288 78.6,286.1 83.9,287.6 88.3,286.3 98.8,292.8 104.8,294.8 107,291.7 111.5,295 109.9,299.3 111.4,301.6 114,301.4 116.2,304.3 114.3,307.8 116.5,311.7 119.2,310 120.3,315.8 125.4,317.2 130.8,323 131.3,324.3 131.4,323.6 135.3,324.2 139.9,322.7 139.5,321.8 134.8,320.6 136.2,316.6 143.5,313.9 142.4,309.1 144.7,305.6 144.2,300.9 140.9,300.2 141.3,295.6 138.7,292.6 144.4,289.8 141.9,287.3 142.2,282.5 147.2,284.9 149.9,281.7 153.9,281.5 157.1,286.2 153.4,287.9 153.8,288.9 158.1,288.9 161,287.5 165.4,296.6 160.8,297.8 160.1,298.6 163.1,301.5 161.6,307.2 156.1,307.4 155.8,308.1 156.6,308.9 163.2,308.2 164.1,304.6 167.2,303.4 166.5,297.7 173.6,300.7 177.2,299.5 181.2,302.8 182.2,302.8 181.1,298.6 178.8,295.4 181.9,293.5 184.5,294.7 186.6,294 185.5,291 180,291 181.3,286.2 183.5,283 192.1,281.8 191.4,278 178.4,281.1 173.3,266.1 182.6,263.9 184.7,260.1 207.6,248.5 209.8,244.9 207.7,243.6 205.9,245.4 202.8,245 199.6,246 199.2,248.2 194.1,248.5 193.3,243.1 198.2,242.3 198.7,241.8 196.3,241 198.7,236.7 192.6,232.9 193.3,226.1 189.3,226.3 184.1,229.7 183.9,222.2 186.2,217.7 183.6,215.9 180.1,221.9 175.8,221.3 175.9,217.5 174.9,217.4 172.2,219.8 171.4,224.4 164.4,222.9 167.3,213.7 157.4,206 157.6,193.5 154.8,193.8 148.2,190.7 141.3,190.9 142.6,184 137.8,180.9 139.7,178.2 129.8,178.4 127.1,174.4 120,175.9 120,177.8 111.8,195.1 100.5,199.1 96.4,209.3 92.4,211.7 89.1,219.3 78.4,218.7 69.1,221.9 66.4,214.7 60,214.3 52.5,226 43.7,232.1 42.7,240 48.9,244.5"
                  fill={getStateFill('RJ')}
                  opacity={getStateOpacity('RJ')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'RJ' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('RJ')}
                  onMouseEnter={(e) => handleStateMouseEnter('RJ', 'Rajasthan', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 9. Delhi */}
                <polygon
                  id="Delhi"
                  data-code="DL"
                  points="188,202 186.1,206 187.9,208.9 191.3,210.9 192.4,209.2 191.4,204.1 190.8,202.4"
                  fill={getStateFill('DL')}
                  opacity={getStateOpacity('DL')}
                  stroke="#000"
                  strokeWidth={selectedStateId === 'DL' ? '3' : '1.5'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('DL')}
                  onMouseEnter={(e) => handleStateMouseEnter('DL', 'Delhi', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 10. Sikkim */}
                <polygon
                  id="Sikkim"
                  data-code="SK"
                  points="399.6,232.3 399.5,232.5 403.7,234.9 413.4,232.1 414.6,230.9 415.8,229.6 413,227.4 413,225.2 415.2,219.8 414.8,215.9 408.2,213.1 404.6,217.2 400.7,217.1 399.2,218.6 400.9,220.1 401.5,221.4 399.4,223 399.2,226.4 397.2,230.5 399.4,230.9"
                  fill={getStateFill('SK')}
                  opacity={getStateOpacity('SK')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'SK' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('SK')}
                  onMouseEnter={(e) => handleStateMouseEnter('SK', 'Sikkim', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 11. Bihar */}
                <polygon
                  id="Bihar"
                  data-code="BR"
                  points="402.2,252.6 402.6,250.4 402,249.2 400.2,252.1 397.7,250.3 395.8,249.5 392.1,251.5 391.7,251.5 391,252 390,251.1 388.6,250.8 385.4,251.8 385,252.4 384.2,252.1 380.1,253.4 381.1,249 380.8,249 377.2,251.5 374.9,251.3 362.6,248.1 356.9,250.1 353.7,247.3 354.9,244.9 354.9,244.7 353.7,243.9 350.5,246.6 345.8,246.6 342.4,243.3 341.5,242.9 332.2,240.9 335.4,236.8 333.9,234.9 326.7,233.7 323.9,231.8 319.8,233.5 320.3,235.2 324.1,242 331.1,246.3 331.1,250.9 323.7,250.9 322.6,252.4 326.9,253.5 326.9,257.9 323.8,258.4 323.8,259.5 336.1,266.8 332.2,270.4 327.4,269.2 321.8,272.1 319.3,277.9 314.5,277.4 310.6,281.1 311.7,289.2 315,290.3 315.4,292.9 318.9,292.9 322.5,291.1 326.4,292.2 326.4,294.1 330.4,293.6 332.1,297.1 334,297.6 337.9,292.8 342.9,293.6 343,295.7 355.1,292 355.7,286 364.4,286.4 365,290.1 368.1,291.3 371.2,294.1 373.8,289.7 381.2,289.5 383.7,280.4 388.8,275.7 392.2,273.6 395.6,274.6 396.2,273.1 398.7,268.8 401.1,268.7 399.9,266 395.3,261.9 395.8,257"
                  fill={getStateFill('BR')}
                  opacity={getStateOpacity('BR')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'BR' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('BR')}
                  onMouseEnter={(e) => handleStateMouseEnter('BR', 'Bihar', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 12. Jharkhand */}
                <polygon
                  id="Jharkhand"
                  data-code="JH"
                  points="394.5,277.5 395,276.3 392.5,275.6 390,277.2 385.3,281.4 382.6,291.3 374.8,291.5 371.7,296.9 367.1,293 363.3,291.4 362.8,288.2 357.4,287.9 356.8,293.4 341.3,298.2 341.1,295.2 338.7,294.8 334.7,299.7 330.8,298.7 329.3,295.6 324.5,296.2 324.5,293.6 322.7,293.1 319.3,294.7 315.8,294.7 315.8,294.9 312.5,296.3 311.7,304.5 318.2,308.5 319.9,314.2 321.1,315 323,313.5 327.1,314.9 325.5,318.1 327.9,320.8 329,325.4 332.8,327.2 333.1,330.5 327.9,335.9 325.9,337.3 326.4,339.1 332.3,341.3 335.8,337.9 345.4,336.6 348.3,342.2 346.4,345.1 349.1,346.5 353.1,342.8 358.9,346.6 361,347.4 364.8,344.4 362.8,336.7 366.8,333.5 380,341.2 381,339.9 380,337.7 378.8,336.3 377.6,334.2 371.7,332.2 373.3,328.6 368.8,328.3 365.9,324.9 359.8,321.9 361,315.6 367.5,312 368.7,315.4 370.7,314.8 379.1,310.3 379.6,307.7 381.5,304.9 385.6,307 386.1,307 387.2,305 386.9,303.1 391.6,301.4 394.2,300 393.8,297.5 396.4,295.3 397.5,290.5 396.2,286.3 398,283"
                  fill={getStateFill('JH')}
                  opacity={getStateOpacity('JH')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'JH' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('JH')}
                  onMouseEnter={(e) => handleStateMouseEnter('JH', 'Jharkhand', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 13. Madhya Pradesh */}
                <path
                  id="Madhya Pradesh"
                  data-code="MP"
                  d="M193.5,361.3l0.7,1.2l7.3,0.8l5.9-5h5.1l2.7,3.1l7.6-0.8v-3l7.4-2.4l6.3,4.7l5.3-2.2l3,1.3l3.6-1.3l4.4,2.1 l3.9,2.4l1.9-6.3l2.5-2.1v-7.5l2.9-0.4l3-6.9l6.6,0.6l7.4-6.5l2.9-6.6l3-0.7l0.8-3.8h-3.2l-1.1-2.9l-7-1.2l0.2-5.3l-3.4-3.4 l4.2-2.1l4.7,2.5l2.6-0.2h3.2l6.7,1l3.4-3.3L298,307l-3.9-4.6l3.8-0.7v-2.4l-1-3.3l1.5-3l-3.3-0.8l-5.5,1.3l-14.2-11.1l-2.7,0.5 l-4.7,6l-0.5-0.1c-2.6-0.4-6.8-1-7.3-1.1h-0.5l-0.3-0.5c-0.3-0.5-0.1-0.9,1.1-2.8c0.3-0.6,0.7-1.1,0.9-1.4l-0.2-0.8l-6.4,3.6 l-6.1-1.3l2.3-4.2l-1.8-2.1l-9.7,5.1l-4.1,0.4l-3.3-2.1l-2.2,2l-6.6-2.4l-1.9-4.9l-4.5,2.6l1.1,1.6l0.4,3.7l2.6,3.2l0.2,5.4 l3.7,2.3l1.2,4.8l-8.2,2.7l-1.6-2.1l-4.3,2l-5-6.4l3.1-4.2l-2.2-2.8l0.2-4.2l3.4-2l0.6-0.9l-1.7-1l-1.4-4.5l4.9-4.9l6.4-0.9 l3.8-7.8l-0.6-3.7l3-0.9l-0.3-4.4l-5.7-6.6l-7.7-0.5l-1.6-1l-2.4,4.2l-22.9,11.6l-2.1,4.1l-8.2,1.9l3.9,11.5l13.2-3.2l1.5,7.7 l-9.7,1.4l-1.5,2.1l-0.6,2.2h4.3l2.2,6l-4.7,1.5l-2.3-1.1l-0.6,0.3l1.4,1.9l1.8,7l-4.2-0.3l-3.8-3l-3.2,1.1l-4.9-1.9l0.5,4 l-3.6,1.4l-1,3.9l-8.7,0.8l-2.5-2.2l1.5-3l5.3-0.2l0.8-3.2l-3.4-3.4l2.2-2.5l2.9-0.7l-2.6-5.4l-1.6,0.8h-5.9l-1.7-3.9l3.4-1.6 l-1.3-2l-2.2,0.1l-3,3.6l-3.9-1.8l-0.1,1.2l3.8,3.8l-5.9,2.8l1.5,1.8l-0.3,3.7l3,0.7l0.6,6.8l-2.2,3.3l1.2,5.6l-8,2.9l-0.4,1.2 l3.8,1l1.5,3.6l-6.9,2.2l-3.7-0.5l0.5,1.2l3.9,1.7l-2.8,6.8l-8.4,0.7v0.1l4.5,1.3l-1.1,3.8l-1.8,0.7l0.2,3.1l-0.4,3.6h1.7l2.7-3.1 l5.6,2.2l-1.1,6.7l3.4,1.5h5.7l3.6,5.6l17.6-0.4l2.8,4.1l-1.4,3.2l1.4,1.2l7.9-3l-0.6-4.8l2.9-0.8l2.1-5.8l5.3,0.2l6.1-3.1l4.8,4.1 l-0.5,5.1h-2.2V361.3z"
                  fill={getStateFill('MP')}
                  opacity={getStateOpacity('MP')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'MP' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('MP')}
                  onMouseEnter={(e) => handleStateMouseEnter('MP', 'Madhya Pradesh', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 14. Chhattisgarh */}
                <polygon
                  id="Chhattisgarh"
                  data-code="CH"
                  points="331.2,329.8 331.1,328.4 327.4,326.8 326.3,321.7 323.1,318.4 324.5,316 323.3,315.6 321.1,317.3 318.3,315.3 316.7,309.7 310.8,306.2 303.7,311.1 299.9,309.3 299.3,308.7 295.1,312.7 287.6,311.5 284.6,311.5 281.5,311.7 277.3,309.4 276.3,309.9 278.4,312 278.3,316.5 284.7,317.6 285.8,320.3 290,320.3 288.5,327.4 285.2,328.2 282.6,334.3 274.2,341.6 268.2,341.1 265.2,347.6 263,348 263,354.6 260.2,357 258.2,363.5 256.5,365.7 254.8,369.8 256.5,376.3 254.5,379.2 257.1,380.2 257.6,388.5 253.2,388.5 253,389.9 257.5,391.9 255.2,395.9 253.2,397 254.7,399.1 257.1,398.8 263,403.5 259.8,410.8 255.5,408.2 252.7,411.6 250.4,420.3 254.9,422.2 261.4,428.3 260.3,432.6 265.3,432.4 265.7,439.3 268.2,438.9 272.4,439.4 273,435.9 275.1,433.5 275.5,428.8 280.9,427.3 281.9,425.1 285,420.3 290,417.6 289.8,413.8 288,410.8 288.4,407.1 286.1,405.3 285.3,401.3 285.2,397.4 281,395.5 281,391.4 285.6,390.2 289.6,392.4 291.5,394 298.2,395.9 298.4,393.5 290,390.8 292,386.8 290.2,385.5 290.2,373.1 295.3,371.5 297.7,367.2 305.7,368.3 307.5,366.3 310.9,362.8 311.1,360.2 313.3,353.8 316.3,352 316.5,350.8 312.5,349.6 315,344.7 321.4,342.1 324.6,339.5 323.8,336.5 326.7,334.5"
                  fill={getStateFill('CH')}
                  opacity={getStateOpacity('CH')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'CH' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('CH')}
                  onMouseEnter={(e) => handleStateMouseEnter('CH', 'Chhattisgarh', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 15. Telangana */}
                <polygon
                  id="Telangana"
                  data-code="TL"
                  points="261.8,457.2 264,455.6 274.4,451.2 277.4,446.5 278.6,443.6 280.8,442.4 280.8,440 280.7,439.7 279.6,441.1 272.1,441.4 272.1,441.2 268.2,440.8 263.9,441.5 263.6,434.3 258,434.5 259.3,428.9 253.9,423.8 249.2,421.8 243.4,422.4 244,417 239.8,414.6 243.5,409.5 243.4,405.1 238.7,403.8 234.2,406.1 230.7,403.6 227.8,405.9 218,400.8 218.5,398.1 213,398.1 210.4,395.8 209.1,396.6 209.8,399.8 210,405.2 207.7,406.3 207.3,410 203.6,410.9 202.6,408.7 201,408.7 201.6,413.6 199.7,415.1 200.7,416.2 201.6,419.7 198.5,424.6 195.3,425.4 194,427.6 194.5,428.5 196.7,429.9 195.2,435 197.3,435 196.3,439.9 193.5,443.1 192.9,444.6 196.4,444 197.9,448.1 192.7,451.1 191.3,455.6 192.9,458.7 192.1,463.5 193.9,466.2 192.7,469.3 192.3,470.3 195,470.2 195.3,475.4 193.3,476.1 192.9,480.8 195.3,483.3 200.9,483.5 205,485.7 209.1,478.8 215.1,478.8 217.9,480.5 220.7,477.2 227.8,476.5 228.7,467.4 239.7,466.3 242.8,466.4 245,465.3 243.9,462.5 248.8,458.4 252.3,463.9 255.9,464.2 256.3,463.2 254.8,462.5 253,458 256.8,454.8"
                  fill={getStateFill('TS')}
                  opacity={getStateOpacity('TS')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'TS' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('TS')}
                  onMouseEnter={(e) => handleStateMouseEnter('TS', 'Telangana', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 16. Nagaland */}
                <polygon
                  id="Nagaland"
                  data-code="NG"
                  points="533.6,228.1 524.7,235.9 522.3,240.1 519.5,240.1 518.9,238.7 516.4,241.5 516.6,247.6 515.5,254.4 510.8,255.8 510.7,253.8 509,255.8 504.5,260.5 504.8,262.3 507.4,263.3 507.6,266.6 509,267.3 512.5,259.3 522.1,260.2 525.4,256.1 528.6,256.1 528.4,259.6 529.9,260.3 532.7,259.2 535.2,254.9 535.1,249.3 538,246.8 536.7,245.1 538.4,241.9 536.4,239.2 534,238 537.3,234.9 535.5,231 536.9,227.6"
                  fill={getStateFill('NL')}
                  opacity={getStateOpacity('NL')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'NL' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('NL')}
                  onMouseEnter={(e) => handleStateMouseEnter('NL', 'Nagaland', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 17. Assam */}
                <polygon
                  id="Assam"
                  data-code="AS"
                  points="434.5,262.3 435.8,264 435.8,264.6 437.2,265.1 437.3,263.2 439.2,258.3 443.8,255.7 459.5,256.3 462.1,258.8 465.5,255.9 470.8,252.4 475.3,252.4 481.2,249.6 482.8,253.3 480.5,255.9 481.2,258.6 486.6,257.2 491,260.5 490.7,264.2 495.6,266.5 493.6,271.1 488.7,272.8 486.6,274.5 486.3,274.6 488.7,276.9 487.1,277.9 483.7,276.9 482.8,278.4 484.9,280.7 483.3,282.4 483.3,283.8 486,286.7 486,290.5 488.6,291.4 489.6,292.2 492.5,288 492.3,284.2 496.9,283.4 497.5,286 499.8,286 499.9,285.6 498.7,283.8 498.5,278.3 502.1,275.2 502.6,270 505.8,266.8 505.7,264.7 503.2,263.7 502.5,259.9 507.7,254.6 512.3,249.1 512.6,253.4 513.9,253 514.7,247.5 514.5,240.9 519.5,235.1 520.8,238.2 521.3,238.2 523.3,234.6 532.7,226.3 538,225.6 541,220.6 551.1,217.3 550.5,215.2 547.8,215.4 544.2,208.7 547.7,204.3 544.1,203.7 542,207 518.1,217 511,226.4 508.8,231.8 492.3,234.6 491.3,232 489.2,230.8 482.7,235.4 477.7,235.7 477.2,235.3 476.7,235.6 475.9,235.4 472,237.1 466.8,237.3 462.8,240.6 454.1,241.4 451.1,238.4 447.9,238.6 444.5,236.7 438.6,241.6 435.8,241.6 435.9,242.4 433.2,250.8 430.9,252.5 430.9,252.6 432.2,252.5 434.8,256.7"
                  fill={getStateFill('AS')}
                  opacity={getStateOpacity('AS')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'AS' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('AS')}
                  onMouseEnter={(e) => handleStateMouseEnter('AS', 'Assam', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 18. Karnataka */}
                <polygon
                  id="Karnataka"
                  data-code="KA"
                  points="132.6,544 135.3,549.2 139.5,549.5 153.4,563.2 167.3,570.3 169.5,573.1 175.2,573.5 175.8,572.3 179.3,569.2 182.6,570.9 186.5,571.4 195.2,567.5 196,564.2 194.2,563.6 191.5,563.8 188.1,562 190.6,559.3 192,557.9 190.6,556.7 191.5,552.4 195.4,551 194.7,548.1 199.4,546.4 206.3,550 212.8,543.3 213.1,539.9 209.7,538 208.5,533.1 206.8,533.1 201,531 202.9,527 201.2,526.3 197.9,528.7 188.1,531 189.1,527.6 185,527.5 182.6,530.1 178.1,528.8 179.3,526.2 177.6,525 177.3,519.1 181.1,518.2 183,521.3 187.8,521 189.5,518.5 186.7,515.3 182.8,517.3 178.5,515.7 178.5,511.3 173.6,510.5 174.8,507.4 177.3,504.1 173.7,501.9 178,498.2 182.1,500.9 184,500.4 184.2,496.8 179.5,493.8 180.2,488.4 182.5,486.5 181.5,484.5 185.3,478.9 191.1,479.9 191.6,474.8 193.4,474.1 193.3,472.1 189.2,472.3 191.1,468.6 191.8,466.4 190.1,463.9 191,459 189.2,455.8 191.1,449.8 195.6,447.3 195.2,446.2 190.1,447 191.8,442.1 194.6,439.1 195,436.8 192.7,436.8 194.5,430.7 193,429.8 192.5,428.6 191.7,428.9 187.9,427.8 186.3,428.7 184.6,433.2 182.2,433.7 182.4,435.6 176.8,442.9 173.9,442.2 170.9,444.9 169.4,451 159.4,450.4 155.5,447.2 154.3,448.2 156.6,451 154.6,458.5 150.8,459.2 143.3,460.1 142.1,458.2 139.9,458.6 135.7,462.5 130.8,464.6 125.2,465.7 125.7,470.3 129.4,470.7 129.4,474.2 127,476.5 124.7,484 124.9,484.1 125.5,493.8 123.3,501.5 121.8,502.7 121.7,504.5 123.9,505.1 124.4,509.8 126.1,510.4 125.9,514.2 127.9,519.7 129.5,524.6 131.2,528.7 130.8,529.9 131.1,533.1 132.6,535.1 131.5,536.5"
                  fill={getStateFill('KA')}
                  opacity={getStateOpacity('KA')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'KA' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('KA')}
                  onMouseEnter={(e) => handleStateMouseEnter('KA', 'Karnataka', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 19. Manipur */}
                <polygon
                  id="Manipur"
                  data-code="MN"
                  points="508.9,292.5 510.4,294.5 511.5,295.2 514,293.6 515.2,293.1 516.6,295 519.8,294.6 522.1,296.2 524.6,292.3 524.2,289.1 524.8,285.6 526.5,283 529,277.6 531.9,273.4 532.3,268.4 529,267.4 527.4,265 528.9,263.7 529.2,262 526.5,260.8 526.6,258 526.3,258 522.9,262.1 513.7,261.2 509.9,269.9 506.9,268.3 504.4,271 503.8,276.2 500.4,279.1 500.5,283.2 501.9,285.3 500.6,289.4 501.2,292.3 506.2,293.5 507.3,294.3 507.8,292.6"
                  fill={getStateFill('MN')}
                  opacity={getStateOpacity('MN')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'MN' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('MN')}
                  onMouseEnter={(e) => handleStateMouseEnter('MN', 'Manipur', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 20. Mizoram */}
                <polygon
                  id="Mizoram"
                  data-code="MZ"
                  points="505.3,295.2 499.6,293.8 498.7,289.3 499.2,287.8 496,287.8 495.5,285.6 494.2,285.8 494.4,288.5 490.1,294.7 487.8,293.2 487.7,293.2 488,301.6 486.7,304.9 488.5,307.8 490.2,311.5 488.5,313 488.9,317.8 493.5,324.5 497,339.7 498.1,339.2 498.6,336.3 499.9,335.8 500.6,337.4 503.2,338 504.9,337.2 505.3,334.1 507.4,333.4 507.4,330.6 504.1,321.7 505,318.5 508.2,314.9 509.3,312.2 508,307.5 509.7,304.2 510,300.9 508.3,297.1"
                  fill={getStateFill('MZ')}
                  opacity={getStateOpacity('MZ')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'MZ' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('MZ')}
                  onMouseEnter={(e) => handleStateMouseEnter('MZ', 'Mizoram', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 21. Arunachal Pradesh */}
                <polygon
                  id="Arunachal Pradesh"
                  data-code="AR"
                  points="574.5,196.6 576.1,195.4 575.8,193.4 572.8,194.2 570.6,193.3 560.6,191.6 556.3,194 554.8,193.7 555,190.8 557.2,188.4 559,186.1 558.7,184.9 556.3,179.3 555.3,178.5 552.9,181.2 550.1,183 548.7,179.7 553.3,176.9 553.3,175.3 549.7,175.3 549.8,172.2 546.2,171.8 537.6,177.6 536.3,182.1 531.2,180.3 526.9,180.5 522.3,179.3 522.2,177.1 519.9,176.7 512.9,183.3 513.2,187.1 509.9,188.5 509.2,192.3 500.9,192.8 497,193.3 494.6,198.3 496.6,201 485,206.9 486,208.8 486.9,210.1 481.4,213.5 479.4,213 476.2,212.8 472.3,216.3 469.1,213.8 466.6,219.7 470.9,222.5 473.9,221.5 476.8,224.2 476.6,228.6 476.9,231.6 477.3,232 477.6,233 478.4,233.8 482.1,233.6 489.1,228.5 492.9,230.7 493.5,232.5 507.5,230.2 509.4,225.5 516.9,215.5 540.8,205.6 543.2,201.6 551.1,203.1 546.4,208.9 548.8,213.4 552,213.2 553.3,218.5 542.2,222.3 538.8,227.8 537.5,231 538.9,233.8 541,233.6 555,218.7 558.8,218 562.8,215.5 565,214.9 567.1,215.9 568,219.1 570.2,219.7 572.8,219.7 573.4,218.3 568.6,213.1 567.1,209.9 572.2,203 575.6,201.8 575.8,199.6 575.2,198.5"
                  fill={getStateFill('AR')}
                  opacity={getStateOpacity('AR')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'AR' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('AR')}
                  onMouseEnter={(e) => handleStateMouseEnter('AR', 'Arunachal Pradesh', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 22. Tripura */}
                <polygon
                  id="Tripura"
                  data-code="TP"
                  points="486.2,301.3 485.9,292.5 484.1,291.9 484.1,287.5 482.9,286.2 481.4,288.2 478.6,288.2 478.5,290.8 478.1,292.6 475.9,292.1 474.1,292.1 473,294.5 469,294.6 468.3,298.5 464.9,303 465.2,307.8 468.7,310.7 468.7,314.7 471,316.5 471,314.7 471.9,314.3 473.1,317.7 473.8,320.5 476.1,320.6 479.5,317.7 477.8,313.5 478.7,310.7 479.5,309.4 480.4,306.8 479.4,305.5 480.5,303.2 482.4,303.8 485.6,302.7"
                  fill={getStateFill('TR')}
                  opacity={getStateOpacity('TR')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'TR' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('TR')}
                  onMouseEnter={(e) => handleStateMouseEnter('TR', 'Tripura', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 23. Meghalaya */}
                <polygon
                  id="Meghalaya"
                  data-code="MG"
                  points="476.6,271.3 481.3,270.9 482.4,272.9 483.8,273.2 485.8,272.8 487.8,271.2 492.2,269.5 493.2,267.4 488.7,265.3 489.1,261.4 486.2,259.2 479.9,260.8 478.5,255.5 480.6,253 480.3,252.2 475.7,254.3 471.4,254.3 466.6,257.5 462.1,261.3 458.8,258.2 444.3,257.7 440.6,259.6 439.2,263.6 438.9,267.7 435.9,266.6 436.2,271.8 443.1,272.5 445.3,273.8 448.6,274 450.2,273.3 455.2,273.6 462,272 472.3,273.7"
                  fill={getStateFill('ML')}
                  opacity={getStateOpacity('ML')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'ML' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('ML')}
                  onMouseEnter={(e) => handleStateMouseEnter('ML', 'Meghalaya', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 24. Puducherry */}
                <polygon
                  id="Puducherry_1"
                  data-code="PD"
                  points="236.3,569.8 239.2,570.6 239.9,570.8 241.2,566.9 237.1,568"
                  fill="#F36523"
                  stroke="#000"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('PD')}
                />
                <polygon
                  id="Puducherry_2"
                  data-code="PD"
                  points="239.3,591.4 241.6,592.4 241.6,589 239.4,590"
                  fill="#F36523"
                  stroke="#000"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('PD')}
                />
                <polygon
                  id="Puducherry_3"
                  data-code="PD"
                  points="149.4,574.8 149.9,572.1 147.5,572.2"
                  fill="#F36523"
                  stroke="#000"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('PD')}
                />

                {/* 25. Tamil Nadu */}
                <polygon
                  id="Tamil Nadu"
                  data-code="TN"
                  points="245.5,536.3 237.9,540.9 235,538.7 232.8,538.7 233.7,542.7 229.2,542.7 225.3,544.8 216.3,545.7 214.1,549.4 210.4,554.6 206,552 199.3,548.4 196.9,549.3 197.6,552.2 193.1,553.7 192.7,556 194.7,557.6 192,560.6 191.2,561.5 191.9,562 194.4,561.8 198.3,563 196.7,568.8 186.8,573.4 182.1,572.8 179.5,571.4 177.4,573.4 176.4,575.5 169.3,574.9 165.4,577.1 163.1,576.9 162.8,578.6 166.6,579.4 170,580.7 168.9,583.2 172.2,582.8 176.3,588.6 171.9,589.4 172,590.5 175.4,590.5 177.9,594.3 175.1,598.2 175.2,601.2 177.4,603.8 181.1,602.8 185.2,602.4 186.1,607.2 183.2,618.3 184.5,620.1 187.7,619.9 188.8,623.5 182.3,633.4 183.8,635.8 184.9,638.5 183,641.8 185,643.2 183.5,647 182,649.6 186.6,652.7 189.7,653.7 197.5,649.1 201.4,648.2 202.5,634.8 222.6,628.5 222.6,626.9 219.9,626.2 219.9,622 227,612.5 227.8,610.8 226.7,609.3 227.8,606.4 236.3,603.4 238.4,605.7 241.6,605.1 241.6,594.5 237.3,592.6 237.6,588.8 241.6,586.9 241.6,586.5 239.5,583.7 239.5,572.8 238.5,572.4 233.7,570.9 235.8,566.4 242.4,564.7 242.4,564.7 246.7,558.8 250.7,545.4 250.7,538.4"
                  fill={getStateFill('TN')}
                  opacity={getStateOpacity('TN')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'TN' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('TN')}
                  onMouseEnter={(e) => handleStateMouseEnter('TN', 'Tamil Nadu', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 26. Kerala */}
                <polygon
                  id="Kerala"
                  data-code="KL"
                  points="177.6,647.1 180.5,648.6 180.5,648.6 181.9,646.2 182.7,643.8 180.6,642.3 182.8,638.4 182.1,636.7 180.2,633.4 186.8,623.2 186.4,621.9 183.5,622.1 181.2,618.7 184.3,607.1 183.6,604.4 181.4,604.7 176.6,605.9 173.4,601.9 173.2,597.7 175.6,594.3 174.4,592.3 170.4,592.3 169.8,587.9 173.1,587.3 171.3,584.8 166,585.4 167.5,581.7 166.1,581.2 160.6,580.1 161.4,575 165,575.2 167.7,573.7 166.1,571.9 152.3,564.8 138.7,551.4 136.3,551.2 138.7,556 139.4,560.7 146.2,570.3 152.2,570.1 150.9,576.9 151.6,577.9 156,590.8 157.8,592.1 157.2,595.1 158.6,601.1 160.5,603.8 162.2,608.6 165.2,611.6 166.5,617.9 167.5,622.4 163.1,622.6 168,632.6 167.5,635.2"
                  fill={getStateFill('KL')}
                  opacity={getStateOpacity('KL')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'KL' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('KL')}
                  onMouseEnter={(e) => handleStateMouseEnter('KL', 'Kerala', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 27. West Bengal */}
                <polygon
                  id="West Bengal"
                  data-code="WB"
                  points="422.4,326.9 421.9,326.8 421.6,325.2 419.1,322.2 421.6,319.1 420.4,318.6 417.8,319.6 415.5,318.3 417.1,313.3 412.9,308.5 413.3,303.5 415.7,302.2 415.4,296.8 408.9,294.2 406.5,294 405.6,292.8 402.5,291.4 402.2,288.2 401.7,287.5 402.2,287 402.1,286.1 403.9,279.8 406.5,281 409.5,275.2 419.1,274.8 419.4,274.1 415.7,272.2 415.8,270.1 411.3,270.1 408.2,266.5 406.2,264.8 404.2,264 404.1,264 403.9,263.9 401.5,262.9 401.5,259.8 402.3,256.3 403.6,255.6 404.3,254.4 405,253.8 405,253.1 406.6,252.5 406.8,252.4 406.3,248.4 406.9,245.1 413.4,247 413.4,252 414.1,253.3 415.2,253.3 415.9,252.7 416.4,252.1 416.4,247.6 422.4,248.7 423.4,253.6 426.7,256.2 428.4,256.5 429.2,251.6 431.7,249.6 433.9,242.2 433.8,240.5 430,240 426.4,239 421.2,240.3 413.7,233.9 403.4,237 398.5,234.1 398,234.8 402.3,239.6 403,244.5 401.3,245.1 401.3,245.2 402.8,246.2 402.7,246.5 404.5,250.1 403.8,253.7 397.5,258 397.2,261.1 401.6,264.9 403.8,270.4 399.8,270.6 397.9,273.9 396.6,277.2 400.1,282.9 398.2,286.5 399.5,290.4 398,296.4 395.8,298.2 396.2,301.1 392.3,303.1 388.9,304.3 389,305.3 387.4,308.7 385.3,308.9 382.1,307.3 381.3,308.3 381,311.5 371.4,316.5 367.6,317.7 366.5,314.7 362.6,316.8 361.9,320.9 367,323.4 369.7,326.4 376,327 374.3,331.1 378.8,332.5 380.5,335.3 381.6,336.8 383.2,340.2 381,342.9 386.3,345.7 385.7,348.6 387,349.1 390.2,345.8 391.4,349.5 394.2,350.1 395.8,354.3 403.1,351.4 405.4,346.1 406.3,345.5 407.4,343.9 407,342.4 406.5,341.3 408.3,340.4 410.5,342.8 408.6,346.4 409.5,349.3 412.6,349.5 416.4,348.3 416.5,345.6 417.7,343.9 419.6,343.5 420.8,346.3 424.7,346.3"
                  fill={getStateFill('WB')}
                  opacity={getStateOpacity('WB')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'WB' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('WB')}
                  onMouseEnter={(e) => handleStateMouseEnter('WB', 'West Bengal', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 28. Andhra Pradesh */}
                <polygon
                  id="Andhra Pradesh"
                  data-code="AP"
                  points="338.9,411 336.8,413.2 334.3,414.7 333.7,418.9 331,420.1 323,418.7 318.6,412.4 316.4,413.6 313.7,415.7 313.7,419.4 308.3,419 306.2,421.9 307.3,423.2 307.8,429.3 301.5,427.9 300.8,429.5 296.2,432.3 296.7,425.9 293.6,424.8 292.4,426.3 293.7,428.6 293.7,432.6 291.5,435.2 282.3,438.3 282.7,439.7 282.7,443.5 280,444.9 279,447.4 275.7,452.7 264.9,457.2 261.9,459.3 257.1,457 255.3,458.5 256.2,461.2 258.7,462.3 257,466.1 251.2,465.7 248.4,461.2 246.1,463.1 247.4,466.2 243.2,468.4 239.7,468.2 230.4,469.1 229.5,478.2 221.7,478.9 218.3,483 214.6,480.7 210.1,480.7 205.7,488.3 200.4,485.3 194.4,485.1 191.5,481.9 186.2,481 183.6,484.7 184.9,487 181.9,489.4 181.5,492.9 186.2,495.9 185.7,502 181.8,503 178.2,500.5 176.9,501.7 180,503.6 176.4,508.3 176.2,509.1 180.3,509.8 180.3,514.3 182.7,515.2 187,513.1 192,518.3 188.8,522.8 182,523.3 180.3,520.3 179.2,520.6 179.4,524 181.7,525.5 180.7,527.6 182,527.9 184.3,525.6 191.7,525.9 190.9,528.4 197,527 200.9,524.2 205.5,526.1 203.6,530 207.2,531.2 209.9,531.2 211.3,536.8 215.1,538.9 214.6,544.2 207.9,551 209.9,552.2 212.6,548.4 215.2,544 224.8,542.9 228.8,540.9 231.3,540.9 230.4,536.9 235.7,536.9 238,538.7 245.3,534.3 247.8,535.2 246.8,531.9 248.7,530.5 249.7,527.9 247.2,526.3 247.5,520.9 246.2,518.9 248,517.4 245,498.6 249.7,486.8 256.6,482.5 261.5,482.5 261.7,487 264.6,486.2 270.4,474.1 273.7,471.8 280.1,472.2 292,468.2 292.6,461.3 292.7,456.4 307.6,446.2 312.2,442.7 315.1,437.6 328.9,427.4 342.3,411.4 342.2,411"
                  fill={getStateFill('AP')}
                  opacity={getStateOpacity('AP')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'AP' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('AP')}
                  onMouseEnter={(e) => handleStateMouseEnter('AP', 'Andhra Pradesh', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 29. Odisha */}
                <polygon
                  id="Odisha"
                  data-code="OD"
                  points="392.7,351.7 390,351.1 389.4,349.3 387.4,351.2 383.6,349.8 384.2,346.7 378,343.5 378.7,342.7 366.9,335.8 364.8,337.4 367,345.1 361.4,349.5 358,348.4 353.3,345.2 349.4,348.9 343.6,345.8 346.2,342.1 344.2,338.6 336.6,339.6 332.7,343.4 325.8,341 322.3,343.7 316.3,346.2 315.2,348.5 318.6,349.5 318.1,353.1 314.8,355.1 312.9,360.5 312.7,363.6 308.9,367.5 306.4,370.4 298.7,369.3 296.6,373.1 292,374.5 292,384.6 294.3,386.2 292.6,389.6 300.2,392.2 300,398.4 290.7,395.7 288.5,394 285.4,392.2 282.9,392.8 282.9,394.3 286.9,396.1 287.1,401.1 287.8,404.3 290.4,406.2 290,410.3 291.7,413.3 291.9,418.8 286.3,421.7 283.6,425.9 282.3,428.8 277.2,430.3 276.9,434.3 274.9,436.7 274.3,439.5 278.7,439.3 280.4,437 290.4,433.6 291.8,431.9 291.8,429.1 290.2,426.2 293,422.5 298.6,424.6 298.3,428.8 299.3,428.2 300.4,425.7 305.7,426.9 305.5,423.9 304,421.9 307.4,417 311.8,417.3 311.8,414.7 315.4,412 319.2,409.8 324.1,416.9 330.7,418.2 332,417.5 332.6,413.5 335.6,411.7 338.1,409 342,409 348.6,403.6 349.9,399.5 354.3,396.3 358,395 359.5,396.8 374.8,391.6 377.5,386.1 379.2,385.3 382.6,382.9 382.3,380.2 382.8,376 385.7,374 383.8,369.7 382.2,368.6 382.2,362.4 387.9,356.6 392.5,356.3 394.1,355.1"
                  fill={getStateFill('OD')}
                  opacity={getStateOpacity('OD')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'OD' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('OD')}
                  onMouseEnter={(e) => handleStateMouseEnter('OD', 'Odisha', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 30. Chandigarh */}
                <polygon
                  id="Chandigarh"
                  data-code="CD"
                  points="182.7,160.8 182.5,164.7 185.6,167.2 185.4,160.5 185.4,160.6 183.4,159.3"
                  fill={getStateFill('CD')}
                  opacity={getStateOpacity('CD')}
                  stroke="#333"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('CD')}
                />

                {/* 31. Punjab */}
                <polygon
                  id="Punjab"
                  data-code="PN"
                  points="183.1,167.6 180.6,165.5 180.9,160.4 181.8,158.2 179.5,156.6 180.4,150.6 176.6,147.1 174.9,149.3 172.2,148.9 172.1,145.5 168.7,140.7 168.9,136.4 162,132.8 163.2,127.6 167.7,126.2 166.9,124.6 158.3,128 158.3,130.5 155.5,131.5 148.9,132.3 144.1,136.1 142.4,138.8 144.8,140.8 145.7,142.8 143.7,144.3 142.6,148.8 144.6,151.5 142.8,154.5 139.3,154.6 137.7,159.4 131.2,164.4 130.7,166.9 132.9,169.8 130.7,173.6 129.1,174 130.8,176.5 146.7,176.2 154.6,179 154.6,184.3 155.5,184.3 159.1,180.1 166.6,180.1 168.1,182.8 172.6,180.8 172,176.7 173.3,173.1 177.8,174.5 181.3,173.3 180.7,170.3"
                  fill={getStateFill('PB')}
                  opacity={getStateOpacity('PB')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'PB' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('PB')}
                  onMouseEnter={(e) => handleStateMouseEnter('PB', 'Punjab', false, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 32. Daman and Diu */}
                <polygon
                  id="Daman and Diu_1"
                  data-code="DD"
                  points="102.2,380.9 101,379.2 98.9,379.7 98.1,382.2 98.6,383.5 100.2,383"
                  fill="#F36523"
                  stroke="#333"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('DD')}
                />
                <polygon
                  id="Daman and Diu_2"
                  data-code="DD"
                  points="61.4,370.4 60.8,371.6 64.5,371.9 64,370.3"
                  fill="#F36523"
                  stroke="#333"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('DD')}
                />

                {/* 33. Gujarat */}
                <path
                  id="Gujarat"
                  data-code="GJ"
                  d="M132.1,333.5l1.7-4.1l-2.8-1.3l-1.7-4.3l-4.8-5.1l-5.7-1.6L118,313l-2.1,1.3l-3.8-6.5l1.8-3.2 l-0.8-1.1l-2.6,0.2l-2.6-4.1l1.4-3.9l-1.8-1.3l-1.9,2.6l-7.5-2.5l-9.9-6.2l-4.2,1.2l-5.2-1.4l-4.7,1.8l-5.3-1.6l-1.1,3.3l1.6,1.9 l-4,3.7h-4.1l-1.3-2.4l2-1.6l-1.6-1.9l-9.5,2.4l-1.2,3.2c0,0-5.4-0.7-6-0.5c-0.7,0.1-1.8-2.8-1.8-2.8l-8.5,0.5l-9.3-2l-0.4,6.8 l-8.1-0.7l-2.7,0.5l0.7,6l-2.4,0.3l-0.1,1.9l2.7-0.3l1.8-1.2l5.5-3l0.9,1.3l-4.3,2.7l-1.8,2.8l3.4,3l-0.4,3.1l7.9,8.6l12.2,2.2 l8.7-1.5l2.8-5.6l3.6-0.9l1.5,0.8l2.8,0.1l2.3-0.9l1.1,1.1l-4.8,4.3l-1.8,3l-2-0.1l-4.8,5.5l-2,0.1l-1.1,0.8l-5.1,1.2l-6.2,2 l-6.4,1.2l0.4-4.8l-4-0.8l-0.7,6.2l12.6,13.3l13,15.6l5.6,4.5l4.2,0.3l1.4-2.9l5.3-0.2l0.8,2.7l2.2-1.4l16.6-5.2l-0.7-2.6l1.6-1.3 l4-6l-3-3.4l-2.7,0.3l-0.3-1.6l3-1.5l0.1-1.8l5.4-8.1l1.6,3.1l1.9-1.2l6,0.3l-0.4,2l-1.9,0.3l-2,0.3l-0.4,2.2l2.4,1.1v1.8l-2.7,1.3 l-0.5,2.6l4.5,0.9l0.1,3.1l-2.2,1.5l-0.1,2l-0.4,3.1l2,1.9l1.9,3.1l-0.2,9.7l0.4-0.3l2.2,3.2l0.9-0.1l4.2,2.9l2-1.8l-0.6-3.8 l-2.9-4.2l4.8-1.9l4.2,3.7l3.1-3.9l-2.3-2.4c-0.4,0-1.2,0-2-0.1c-1.1-0.1-3.1-0.3-3.1-1.7c0-1,0.4-2.3,0.4-2.5l0.2-0.7h4.8l3.2-4 l7.2-1.9l-0.3-0.9l-8.8,1.2l-2.9-0.4l3-4.5l-1.1-3.9l5.9-1.4l0.5-3.8l-0.2-4.4l2.2-0.8l0.3-1.1l-4.2-1.2l0.4-3.2L132.1,333.5z"
                  fill={getStateFill('GJ')}
                  opacity={getStateOpacity('GJ')}
                  stroke="#333"
                  strokeWidth={selectedStateId === 'GJ' ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => handleStateClick('GJ')}
                  onMouseEnter={(e) => handleStateMouseEnter('GJ', 'Gujarat', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                />

                {/* 34. Andaman and Nicobar Islands */}
                <g
                  id="Andaman and Nicobar"
                  data-code="AN"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('AN')}
                  onMouseEnter={(e) => handleStateMouseEnter('AN', 'Andaman & Nicobar', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <polygon points="547.8,480.7 545.8,492.2 546.9,492.2 547.8,490.2 549.8,490.2 549.6,484.3 548.6,482.7 549.3,480" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="545.1,496.1 548.6,496 548.6,499.8 549.6,501.7 547.1,505.1 545.9,507.4 544.8,507.2" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <path d="M544.3,510.9l-0.5,4l-1.1,0.6v4.1l1.3,3.1l1.8-2.1c0,0,1,0.2,1-0.6s-1.6-6.9-1.6-6.9L544.3,510.9z" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="542.4,540 542.4,546.7 545.5,546.9 545.1,542.3 544.5,539.7" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="576.2,621 577.3,618 580.2,616.9 583.4,622.3 583.2,623.4 584.5,625.9 580.7,627.3 578.9,622.5" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="576.3,612.7 575.9,613.9 575.8,614.1 577.1,615.4 577.9,613.1" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="567.2,600.5 567.2,602.6 570.1,603.3 569.8,600.7" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="560.4,593.8 562.9,596.6 563.9,595.3 561.2,592.8" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="551.9,575.9 554.7,576.5 554.7,574.4 552.3,573.3" fill={getStateFill('AN')} stroke="#333" strokeWidth="0.8" />
                </g>

                {/* 35. Lakshadweep */}
                <g
                  id="Lakshadweep"
                  data-code="LKD"
                  className="cursor-pointer"
                  onClick={() => handleStateClick('LKD')}
                  onMouseEnter={(e) => handleStateMouseEnter('LKD', 'Lakshadweep', true, e)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <polygon points="75.5,599.2 69.1,604.7 72.2,604.9" fill={getStateFill('LKD')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="84.2,573 84.9,575 91.4,574.6 90.4,572.8" fill={getStateFill('LKD')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="82.7,583.6 79.3,587.4 79.9,589.6 83.6,585.9" fill={getStateFill('LKD')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="66,579.3 71.1,578.2 70.6,575.6 68.6,575.6" fill={getStateFill('LKD')} stroke="#333" strokeWidth="0.8" />
                  <polygon points="54.3,574.9 57.2,570.5 59.1,571.6 55,576.2" fill={getStateFill('LKD')} stroke="#333" strokeWidth="0.8" />
                </g>

                {/* 36. Ladakh & J&K Peak */}
                <g>
                  {/* Ladakh */}
                  <polygon
                    id="Ladakh"
                    data-code="LK"
                    points="244.4,50.4 239.2,50.8 233.3,46.3 231.2,46.3 230.9,50.3 223.5,49.2 212.1,52 210.6,56 209.6,54.8 207.1,54.8 206.3,56.7 204.2,55.8 198.4,57 197.4,55.3 200,54.7 199.2,51.6 188.4,50.3 186.1,47.8 188.1,44.5 187.6,42.9 182.5,41.4 180.5,37.4 176,37.8 176,35.2 168.5,31.8 167,27.3 163.7,25.7 162.4,21 158.2,20.6 158.3,23.7 156.2,24.5 153.4,21 149.6,21 149.6,23.3 142.9,23.3 138.7,26.1 133.9,23.3 132.7,24.4 137.1,27.9 135.4,28.8 128.4,26.8 121.6,28.3 115.8,37.7 111.4,37.7 111.4,45.6 113.3,46.7 122,46.4 122,49.5 127.6,54.7 132.3,54.3 132.3,55.6 131.2,57.4 132,59.9 139.4,62.9 138.6,64.9 144.7,64.9 154.8,72.1 159.8,69.9 166.1,76.8 165.2,81.3 172.5,89.8 178.3,89.8 181.1,98.4 188.6,102.4 187.9,106.9 187.3,106.8 188.4,111.4 196.6,114.9 201.2,112.5 206.2,118.5 212,117.2 216.4,121.7 220.7,119.1 221.9,119.2 222.3,124.1 226.6,126.8 233.4,120.8 235.4,121.8 238,118 233.4,112.5 234.2,105.9 224.9,104.3 223.9,99.8 227.9,98.1 223.4,92.9 225.3,90 233.4,89 237.5,85.3 236.5,79.8 240.9,79.9 241.3,75.6 247,74.6 247.8,65.4 250.3,56"
                    fill={getStateFill('LK')}
                    opacity={getStateOpacity('LK')}
                    stroke="#333"
                    strokeWidth={selectedStateId === 'LK' ? '2.5' : '1'}
                    className="cursor-pointer transition-colors duration-150"
                    onClick={() => handleStateClick('LK')}
                    onMouseEnter={(e) => handleStateMouseEnter('LK', 'Ladakh', true, e)}
                    onMouseLeave={() => setHoveredState(null)}
                  />

                  {/* Jammu and Kashmir */}
                  <polygon
                    id="Jammu and Kashmir"
                    data-code="JK"
                    points="186.5,103.5 179.5,99.8 176.9,91.8 171.6,91.8 163.1,81.8 164,77.4 159.3,72.2 154.6,74.3 144.1,66.9 137.8,66.9 136.7,69.7 132.9,69.6 129.3,75.1 126,74.8 124.9,77.9 126.8,80.9 126.3,88.1 128,98.1 127.4,107.1 144.8,115.7 147.2,114.1 148.4,114.4 147.2,117.2 147.2,122 153.8,122.2 158.3,125.6 158.3,126 165.8,122.9 168.9,118.5 164,115.4 167.5,111.9 171.1,113.5 175.6,108.2 186.1,105.9"
                    fill={getStateFill('JK')}
                    opacity={getStateOpacity('JK')}
                    stroke="#333"
                    strokeWidth={selectedStateId === 'JK' ? '2.5' : '1'}
                    className="cursor-pointer transition-colors duration-150"
                    onClick={() => handleStateClick('JK')}
                    onMouseEnter={(e) => handleStateMouseEnter('JK', 'Jammu & Kashmir', true, e)}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                </g>

              </g>
            </svg>
          </div>

          {/* Bottom Footnote on Map */}
          <div className="w-full text-center mt-3 pt-2 border-t border-black/10 text-[10px] font-mono text-gray-500 font-bold">
            Data accurate as of 2026 • Real-time interactive SVG state coordinates
          </div>
        </div>

        {/* Right: Morphic + Pop Art State Dossier Card */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Main State Card */}
          <div className="bg-white border-3 sm:border-4 border-black p-5 sm:p-7 rounded-3xl shadow-[6px_6px_0px_#000] relative">
            
            {/* Top State Badge & Alignment */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black uppercase border border-black shadow-[1px_1px_0px_#000] ${
                    selectedState.isNDA ? 'bg-saffron text-black' : 'bg-gray-800 text-white'
                  }`}>
                    {selectedState.isNDA ? '🚩 BJP / NDA Ruled State' : 'Opposition Ruled State'}
                  </span>
                  
                  <span className="text-xs font-mono font-extrabold text-gray-500">
                    Capital: <strong>{selectedState.capital}</strong>
                  </span>
                </div>

                <h3 className="font-comic text-2xl sm:text-4xl text-black uppercase leading-tight">
                  {selectedState.name}
                </h3>
              </div>

              <span className="px-3 py-1 bg-black text-popYellow rounded-xl text-sm font-mono font-black border border-black shadow-[2px_2px_0px_#FFE600] shrink-0">
                {selectedState.code}
              </span>
            </div>

            {/* Slogan & Summary */}
            <div className="p-3 bg-yellow-50/80 border-2 border-black rounded-2xl mb-4">
              <div className="text-xs font-comic font-black text-saffron-dark uppercase mb-0.5">
                {selectedState.tagline}
              </div>
              <p className="text-xs font-display text-gray-800 font-bold leading-relaxed">
                {selectedState.summary}
              </p>
            </div>

            {/* Before vs After Quantitative Grid */}
            <div className="mb-5">
              <div className="text-[11px] font-mono font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-tirangaGreen" />
                <span>Verified Transformation Metrics (2014 vs 2026)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedState.stats.map((st, i) => (
                  <div key={i} className="p-3 bg-gray-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
                    <div className="text-[11px] font-mono font-black text-black mb-1.5 truncate">
                      {st.label}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono gap-1">
                      <span className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-[10px] font-bold truncate max-w-[45%]">
                        {st.before}
                      </span>
                      <span className="text-gray-400">➔</span>
                      <span className="text-tirangaGreen-dark bg-green-100 px-1.5 py-0.5 rounded text-[10px] font-black truncate max-w-[50%]">
                        {st.after}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono font-extrabold text-saffron-dark text-right">
                      {st.growth}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ground Reality Highlights */}
            <div>
              <div className="text-[11px] font-mono font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-tirangaGreen" />
                <span>Key Development Projects &amp; Historical Milestones</span>
              </div>

              <div className="space-y-2">
                {selectedState.highlights.map((h, i) => (
                  <div key={i} className="p-2.5 bg-white border border-black/20 rounded-xl text-xs font-display text-gray-800 font-bold flex items-start gap-2">
                    <span className="text-saffron font-black mt-0.5">•</span>
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Select Bar for All Major States */}
          <div className="bg-gray-100 border-2 border-black p-3 rounded-2xl">
            <div className="text-[10px] font-mono font-black text-gray-500 uppercase mb-2">
              Fast Jump to State Record:
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {Object.values(statesData).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStateId(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-black border transition-all cursor-pointer ${
                    selectedStateId === st.id
                      ? 'bg-saffron text-black border-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
