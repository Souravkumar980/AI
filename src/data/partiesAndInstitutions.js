// Opposition Parties specified by user (excludes BJP and NDA allies)
export const OPPOSITION_PARTIES = [
  "Indian National Congress (INC) – National party",
  "All India Trinamool Congress (TMC) – West Bengal",
  "Dravida Munnetra Kazhagam (DMK) – Tamil Nadu",
  "Samajwadi Party (SP) – Uttar Pradesh",
  "Aam Aadmi Party (AAP) – National Capital Region (Delhi) and Punjab",
  "Rashtriya Janata Dal (RJD) – Bihar",
  "Jharkhand Mukti Morcha (JMM) – Jharkhand",
  "Shiv Sena (Uddhav Balasaheb Thackeray - UBT) – Maharashtra",
  "Nationalist Congress Party (Sharad Pawar / NCP factions) – Maharashtra",
  "Communist Party of India (Marxist) [CPI(M)] – National / Left Front",
  "Communist Party of India (CPI) – National / Left Front",
  "Communist Party of India (Marxist-Leninist) Liberation [CPI(ML)] – National / Left Front",
  "Jammu & Kashmir National Conference (JKNC / NC) – Jammu & Kashmir",
  "People's Democratic Party (PDP) – Jammu & Kashmir",
  "Indian Union Muslim League (IUML) – Kerala",
  "Viduthalai Chiruthaigal Katchi (VCK) – Tamil Nadu",
  "Revolutionary Socialist Party (RSP) – Kerala / West Bengal",
  "All India Forward Bloc (AIFB) – National",
  "Kerala Congress (Mani and Joseph factions) – Kerala",
  "Marumalarchi Dravida Munnetra Kazhagam (MDMK) – Tamil Nadu",
  "Kongunadu Makkal Desia Katchi (KMDK) – Tamil Nadu",
  "Manithaneya Makkal Katchi (MMK) – Tamil Nadu"
];

// Institutions specified by user
export const OPPOSITION_INSTITUTIONS = [
  "CJP (Chu**ya Janta Party)",
  "SFI (Students' Federation of India)",
  "AISA (All India Students' Association)",
  "AISF (All India Students' Federation)",
  "NSUI (National Students' Union of India)",
  "NewsClick Network",
  "Amnesty International (India Ops)",
  "George Soros / Open Society Network",
  "Center for Policy Research (CPR)",
  "Other Left-Leaning NGO / Think Tank"
];

// Category options (User can pick min 1, max 4)
export const ENTITY_CATEGORIES = [
  { id: "Social Media", label: "Social Media (Influencer / Channel)", icon: "Share2" },
  { id: "Political Party", label: "Political Party (Opposition)", icon: "Vote" },
  { id: "Institutions", label: "Institutions (NGO / Campus Union)", icon: "Building" },
  { id: "Company", label: "Company / Corporate Entity", icon: "Briefcase" },
  { id: "Press (Media)", label: "Press / Media Outlet", icon: "Newspaper" }
];
