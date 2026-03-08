import type { AppUser } from "./types";

export const REGIONS = {
  LATAM: { color: "#10B981", label: "LATAM", manager: "Fabio Cuhna" },
  CHINA: { color: "#F59E0B", label: "China", manager: "Frederick Leung" },
  EAST_EU: { color: "#8B5CF6", label: "East Europe", manager: "Riccardo Melis" },
  APAC: { color: "#EC4899", label: "APAC & MEA", manager: "Director (TBD)" },
} as const;

export const REGION_TARGET_MARKETS: Record<string, string[]> = {
  LATAM: [
    "Brazil", "Argentina", "Chile", "Mexico", "Colombia", "Peru",
    "Ecuador", "Uruguay", "Paraguay", "Bolivia", "Costa Rica",
    "Panama", "Guatemala", "Dominican Republic", "Puerto Rico",
    "El Salvador", "Honduras", "Nicaragua",
  ],
  CHINA: ["China"],
  EAST_EU: ["Poland", "Romania", "Slovakia", "Czech Republic", "Hungary", "Turkey"],
  APAC: [
    "Saudi Arabia", "UAE", "India", "Thailand", "South Africa",
    "Korea", "Japan", "Australia", "New Zealand",
  ],
};

// Countries managed by direct subsidiaries — excluded from export coverage analysis
export const DIRECT_MARKETS = [
  "United States", "Canada", "Spain", "France",
  "Italy", "Germany", "Austria", "Switzerland",
];

export const STAGES = [
  { key: "mapped" as const, label: "Mapped", color: "#64748B", bg: "#F1F5F9" },
  { key: "engaged" as const, label: "Engaged", color: "#3B82F6", bg: "#EFF6FF" },
  { key: "exploring" as const, label: "Exploring", color: "#F59E0B", bg: "#FFFBEB" },
  { key: "qualified" as const, label: "Qualified", color: "#10B981", bg: "#ECFDF5" },
  { key: "handed_off" as const, label: "Moved to Salesforce", color: "#6366F1", bg: "#EEF2FF" },
];

export const INSTITUTION_TYPES = [
  "Public Hospital",
  "Private Hospital",
  "University Hospital",
  "Reference Lab",
  "Hospital Network",
  "Private Lab",
];

export const VOLUME_RANGES = ["< 500", "500 - 1,000", "1,000 - 3,000", "3,000+"];

export const AUTOMATION_STATUS = [
  "No automation (manual)",
  "Partial pre-analytical (competitor)",
  "Competitor full system",
  "Legacy Inpeco (via OEM)",
  "Mixed / Other",
];

export const IVD_VENDORS = [
  "Roche",
  "Siemens Healthineers",
  "Abbott",
  "Beckman Coulter",
  "IDS",
];

export const IVD_PARTNERS = [
  "None",
  "Roche",
  "Siemens Healthineers",
  "Abbott",
  "Beckman Coulter",
  "IDS",
  "Other",
];

export const PRODUCTS = ["FlexLab X", "ProTube", "FlexPath"];

export const RFP_STATUS = ["No RFP expected", "RFP expected", "RFP published", "Unknown"];

// ─── Demo users for mock authentication ──────────────────────────────────────
export const DEMO_USERS: AppUser[] = [
  {
    username: "RHGlobal",
    name: "Head of Global Distribution",
    role: "global_manager",
  },
  {
    username: "FCLatam",
    name: "Regional Distribution Manager LATAM",
    role: "regional_manager",
    region: "LATAM",
  },
  {
    username: "BlueHealth.Brasil",
    name: "Blue Health — Brazil",
    role: "distributor",
    region: "LATAM",
    distributor: "Blue Health",
    country: "Brazil",
  },
];

export const AI_BRIEFING_STATIC = `## Weekly Intelligence Briefing — March 3, 2026

**Pipeline Momentum**: The global prospect base reached **12 laboratories** across 4 regions, with 3 prospects now at **Qualified** stage. This represents strong early traction for the platform.

**Hot Opportunities**: Beijing Ditan Hospital (China) has an active RFP with April 15 deadline — this requires immediate attention. Hospital Italiano Buenos Aires has published their RFP for May, with a legacy Inpeco upgrade path that gives us a competitive advantage.

**Regional Highlights**:
• **LATAM** leads in pipeline activity with 3 prospects across all active stages and 2 upcoming RFPs. Fabio is building a strong base.
• **China** shows the highest average prospect score (76) driven by Beijing Ditan's qualified status. The legacy Inpeco upgrade at Wuhan Union Hospital is a strategic opportunity.
• **East Europe** has 3 prospects but needs acceleration — Prague University Hospital's July RFP is the nearest catalyst.
• **APAC & MEA** has high-value targets (King Faisal, Apollo Network) that could drive significant revenue if converted.

**Key Signals**: 3 of 12 prospects have legacy Inpeco systems — this upgrade cohort should be prioritized as a strategic initiative. The Siemens OEM contract expiration pattern (2025-2026) creates a time-sensitive window.

**Action Items**: Prioritize RFP responses for Beijing (Apr) and Buenos Aires (May). Accelerate engagement in East Europe before Prague's July deadline. Consider Apollo Chennai as a strategic "lighthouse" installation for the Indian market.`;

export const MOCK_LABS = [
  { id: 1, name: "Hospital Clínico Universidad de Chile", city: "Santiago", country: "Chile", region: "LATAM" as const, lat: -33.44, lng: -70.65, type: "University Hospital", volume: "1,000 - 3,000", tubesPerDay: "1,800", automation: "No automation (manual)", ivd: ["Roche", "Beckman Coulter"], ivdPartnerInvolved: "Beckman Coulter", stage: "exploring" as const, product: ["FlexLab X"], rfp: "RFP expected", rfpDate: "2026-09", notes: [{ date: "2026-02-15", author: "Fabio Cuhna", text: "Met with lab director at COLABIOCLI congress. Very interested in full automation. Currently running 1,800 samples/day manually. Budget cycle starts September." }, { date: "2026-01-20", author: "Fabio Cuhna", text: "Distributor confirmed this is a key target. Lab is expanding to new wing in 2027." }], score: 82, distributor: "Simed", createdAt: "2026-01-20" },
  { id: 2, name: "São Paulo Reference Laboratory", city: "São Paulo", country: "Brazil", region: "LATAM" as const, lat: -23.55, lng: -46.63, type: "Reference Lab", volume: "3,000+", tubesPerDay: "4,200", automation: "Competitor full system", ivd: ["Roche", "Abbott"], ivdPartnerInvolved: "Roche", stage: "engaged" as const, product: ["FlexLab X"], rfp: "No RFP expected", notes: [{ date: "2026-02-28", author: "Fabio Cuhna", text: "Initial contact through Roche transition. Current system is aging. Exploring options for 2027-2028 renewal." }], score: 65, distributor: "Blue Health", createdAt: "2026-02-28" },
  { id: 3, name: "Beijing Ditan Hospital", city: "Beijing", country: "China", region: "CHINA" as const, lat: 39.95, lng: 116.38, type: "Public Hospital", volume: "3,000+", tubesPerDay: "5,500", automation: "Partial pre-analytical (competitor)", ivd: ["Roche"], ivdPartnerInvolved: "None", stage: "qualified" as const, product: ["FlexLab X", "ProTube"], rfp: "RFP published", rfpDate: "2026-04", notes: [{ date: "2026-03-01", author: "Frederick Leung", text: "RFP published March 1st. Deadline April 15. We are positioned well through local distributor. Decision maker met twice." }], score: 94, distributor: "China Medical Systems", createdAt: "2026-03-01" },
  { id: 4, name: "Guangzhou First People's Hospital", city: "Guangzhou", country: "China", region: "CHINA" as const, lat: 23.13, lng: 113.26, type: "Public Hospital", volume: "1,000 - 3,000", tubesPerDay: "2,100", automation: "No automation (manual)", ivd: ["Siemens Healthineers"], ivdPartnerInvolved: "Siemens Healthineers", stage: "mapped" as const, product: ["FlexLab X"], rfp: "Unknown", notes: [], score: 45, distributor: "China Medical Systems", createdAt: "2026-01-15" },
  { id: 5, name: "Wuhan Union Hospital", city: "Wuhan", country: "China", region: "CHINA" as const, lat: 30.58, lng: 114.27, type: "University Hospital", volume: "3,000+", tubesPerDay: "4,800", automation: "Legacy Inpeco (via OEM)", ivd: ["Siemens Healthineers"], ivdPartnerInvolved: "Siemens Healthineers", stage: "exploring" as const, product: ["FlexLab X"], rfp: "RFP expected", rfpDate: "2026-11", notes: [{ date: "2026-02-10", author: "Frederick Leung", text: "Legacy Aptio system installed 2015 via Siemens. Lab director interested in upgrading to FlexLab X. Siemens contract expires 2026." }], score: 88, distributor: "SinoMed Partners", createdAt: "2026-02-10" },
  { id: 6, name: "Warsaw Central Hospital", city: "Warsaw", country: "Poland", region: "EAST_EU" as const, lat: 52.23, lng: 21.01, type: "Public Hospital", volume: "500 - 1,000", tubesPerDay: "750", automation: "No automation (manual)", ivd: ["Roche", "IDS"], ivdPartnerInvolved: "None", stage: "engaged" as const, product: ["FlexLab X"], rfp: "No RFP expected", notes: [{ date: "2026-02-20", author: "Riccardo Melis", text: "Met at IFCC Europe. Interested but no budget allocated yet. Government funding cycle is annual - need to wait for 2027 allocation." }], score: 52, distributor: "MedPol Distribution", createdAt: "2026-02-20" },
  { id: 7, name: "Bucharest Emergency Hospital", city: "Bucharest", country: "Romania", region: "EAST_EU" as const, lat: 44.44, lng: 26.10, type: "Public Hospital", volume: "1,000 - 3,000", tubesPerDay: "1,400", automation: "Competitor full system", ivd: ["Abbott", "IDS"], ivdPartnerInvolved: "Abbott", stage: "mapped" as const, product: [], rfp: "Unknown", notes: [], score: 38, distributor: "RomLab Solutions", createdAt: "2026-01-05" },
  { id: 8, name: "Prague University Hospital", city: "Prague", country: "Czech Republic", region: "EAST_EU" as const, lat: 50.08, lng: 14.42, type: "University Hospital", volume: "1,000 - 3,000", tubesPerDay: "2,300", automation: "Partial pre-analytical (competitor)", ivd: ["Beckman Coulter", "Roche"], ivdPartnerInvolved: "Beckman Coulter", stage: "exploring" as const, product: ["FlexLab X", "ProTube"], rfp: "RFP expected", rfpDate: "2026-07", notes: [{ date: "2026-02-25", author: "Riccardo Melis", text: "Strong opportunity. Lab is consolidating from 3 buildings into 1. Need full automation. RFP expected July." }], score: 79, distributor: "CzechMed", createdAt: "2026-02-25" },
  { id: 9, name: "King Faisal Specialist Hospital", city: "Riyadh", country: "Saudi Arabia", region: "APAC" as const, lat: 24.69, lng: 46.72, type: "Private Hospital", volume: "3,000+", tubesPerDay: "6,000", automation: "Competitor full system", ivd: ["Roche", "Siemens Healthineers"], ivdPartnerInvolved: "None", stage: "qualified" as const, product: ["FlexLab X"], rfp: "RFP expected", rfpDate: "2026-06", notes: [{ date: "2026-03-02", author: "Director (TBD)", text: "High-priority target. Current Beckman automation line aging. Hospital expanding diagnostic center. Budget confirmed for Q3-Q4 2026." }], score: 91, distributor: "Gulf Medical Trading", createdAt: "2026-03-02" },
  { id: 10, name: "Apollo Hospitals Chennai", city: "Chennai", country: "India", region: "APAC" as const, lat: 13.06, lng: 80.24, type: "Hospital Network", volume: "3,000+", tubesPerDay: "5,000", automation: "Partial pre-analytical (competitor)", ivd: ["Abbott", "Roche"], ivdPartnerInvolved: "Abbott", stage: "engaged" as const, product: ["FlexLab X"], rfp: "No RFP expected", notes: [{ date: "2026-01-15", author: "Director (TBD)", text: "Apollo network is expanding. Chennai hub lab could be a reference installation for the group. Need to build relationship with corporate procurement." }], score: 71, distributor: "MedTech India", createdAt: "2026-01-15" },
  { id: 11, name: "Bangkok Hospital", city: "Bangkok", country: "Thailand", region: "APAC" as const, lat: 13.74, lng: 100.54, type: "Private Hospital", volume: "1,000 - 3,000", tubesPerDay: "1,200", automation: "No automation (manual)", ivd: ["Roche"], ivdPartnerInvolved: "None", stage: "mapped" as const, product: [], rfp: "Unknown", notes: [], score: 42, distributor: "Thai Lab Solutions", createdAt: "2026-01-10" },
  { id: 12, name: "Hospital Italiano Buenos Aires", city: "Buenos Aires", country: "Argentina", region: "LATAM" as const, lat: -34.60, lng: -58.40, type: "Private Hospital", volume: "1,000 - 3,000", tubesPerDay: "2,600", automation: "Legacy Inpeco (via OEM)", ivd: ["Abbott", "Siemens Healthineers"], ivdPartnerInvolved: "Siemens Healthineers", stage: "qualified" as const, product: ["FlexLab X", "ProTube"], rfp: "RFP published", rfpDate: "2026-05", notes: [{ date: "2026-02-28", author: "Fabio Cuhna", text: "Legacy Aptio via Siemens installed 2016. Contract renewal window opening. Lab director already saw FlexLab X demo. Very positive." }, { date: "2026-01-10", author: "Fabio Cuhna", text: "Distributor flagged as top priority for H1 2026." }], score: 90, distributor: "Promed", createdAt: "2026-01-10" },
  { id: 13, name: "Hospital Nacional Arzobispo Loayza", city: "Lima", country: "Peru", region: "LATAM" as const, lat: -12.05, lng: -77.04, type: "Public Hospital", volume: "500 - 1,000", tubesPerDay: "900", automation: "No automation (manual)", ivd: ["Roche"], ivdPartnerInvolved: "None", stage: "mapped" as const, product: [], rfp: "Unknown", notes: [{ date: "2026-02-05", author: "Fabio Cuhna", text: "Bionuclear identified this hospital as a potential prospect. Initial mapping completed." }], score: 35, distributor: "Bionuclear", createdAt: "2026-02-05" },
];
