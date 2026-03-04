import { useState, useEffect, useRef } from "react";

const REGIONS = {
  LATAM: { color: "#10B981", label: "LATAM", manager: "Carlos Mendez" },
  CHINA: { color: "#F59E0B", label: "China", manager: "Wei Zhang" },
  EAST_EU: { color: "#8B5CF6", label: "East Europe", manager: "Andrei Petrov" },
  APAC: { color: "#EC4899", label: "APAC & MEA", manager: "Director" },
};

const STAGES = [
  { key: "mapped", label: "Mapped", color: "#64748B", bg: "#F1F5F9" },
  { key: "engaged", label: "Engaged", color: "#3B82F6", bg: "#EFF6FF" },
  { key: "exploring", label: "Exploring", color: "#F59E0B", bg: "#FFFBEB" },
  { key: "qualified", label: "Qualified", color: "#10B981", bg: "#ECFDF5" },
  { key: "handed_off", label: "Handed Off", color: "#6366F1", bg: "#EEF2FF" },
];

const INSTITUTION_TYPES = ["Public Hospital", "Private Hospital", "University Hospital", "Reference Lab", "Hospital Network", "Private Lab"];
const VOLUME_RANGES = ["< 500", "500 - 1,000", "1,000 - 3,000", "3,000+"];
const AUTOMATION_STATUS = [
  "No automation (manual)",
  "Partial pre-analytical (competitor)",
  "Competitor full system",
  "Legacy Inpeco (via OEM)",
  "Mixed / Other",
];
const IVD_VENDORS = ["Roche", "Beckman Coulter", "Abbott", "Siemens Healthineers", "QuidelOrtho", "Sysmex", "bioMérieux", "Mindray", "Other"];
const PRODUCTS = ["FlexLab X", "ProTube", "FlexPath"];
const RFP_STATUS = ["No RFP expected", "RFP expected", "RFP published", "Unknown"];

const MOCK_LABS = [
  { id: 1, name: "Hospital Clínico Universidad de Chile", city: "Santiago", country: "Chile", region: "LATAM", lat: -33.44, lng: -70.65, type: "University Hospital", volume: "1,000 - 3,000", automation: "No automation (manual)", ivd: ["Roche", "Beckman Coulter"], stage: "exploring", product: ["FlexLab X"], rfp: "RFP expected", rfpDate: "2026-09", notes: [{ date: "2026-02-15", author: "Carlos Mendez", text: "Met with lab director at COLABIOCLI congress. Very interested in full automation. Currently running 1,800 samples/day manually. Budget cycle starts September." }, { date: "2026-01-20", author: "Carlos Mendez", text: "Distributor confirmed this is a key target. Lab is expanding to new wing in 2027." }], score: 82 },
  { id: 2, name: "São Paulo Reference Laboratory", city: "São Paulo", country: "Brazil", region: "LATAM", lat: -23.55, lng: -46.63, type: "Reference Lab", volume: "3,000+", automation: "Competitor full system", ivd: ["Roche", "Abbott"], stage: "engaged", product: ["FlexLab X"], rfp: "No RFP expected", notes: [{ date: "2026-02-28", author: "Carlos Mendez", text: "Initial contact through Roche transition. Current system is aging. Exploring options for 2027-2028 renewal." }], score: 65 },
  { id: 3, name: "Beijing Ditan Hospital", city: "Beijing", country: "China", region: "CHINA", lat: 39.95, lng: 116.38, type: "Public Hospital", volume: "3,000+", automation: "Partial pre-analytical (competitor)", ivd: ["Mindray", "Roche"], stage: "qualified", product: ["FlexLab X", "ProTube"], rfp: "RFP published", rfpDate: "2026-04", notes: [{ date: "2026-03-01", author: "Wei Zhang", text: "RFP published March 1st. Deadline April 15. We are positioned well through local distributor. Decision maker met twice." }], score: 94 },
  { id: 4, name: "Guangzhou First People's Hospital", city: "Guangzhou", country: "China", region: "CHINA", lat: 23.13, lng: 113.26, type: "Public Hospital", volume: "1,000 - 3,000", automation: "No automation (manual)", ivd: ["Mindray", "Sysmex"], stage: "mapped", product: ["FlexLab X"], rfp: "Unknown", notes: [], score: 45 },
  { id: 5, name: "Wuhan Union Hospital", city: "Wuhan", country: "China", region: "CHINA", lat: 30.58, lng: 114.27, type: "University Hospital", volume: "3,000+", automation: "Legacy Inpeco (via OEM)", ivd: ["Siemens Healthineers"], stage: "exploring", product: ["FlexLab X"], rfp: "RFP expected", rfpDate: "2026-11", notes: [{ date: "2026-02-10", author: "Wei Zhang", text: "Legacy Aptio system installed 2015 via Siemens. Lab director interested in upgrading to FlexLab X. Siemens contract expires 2026." }], score: 88 },
  { id: 6, name: "Warsaw Central Hospital", city: "Warsaw", country: "Poland", region: "EAST_EU", lat: 52.23, lng: 21.01, type: "Public Hospital", volume: "500 - 1,000", automation: "No automation (manual)", ivd: ["Roche", "Sysmex"], stage: "engaged", product: ["FlexLab X"], rfp: "No RFP expected", notes: [{ date: "2026-02-20", author: "Andrei Petrov", text: "Met at IFCC Europe. Interested but no budget allocated yet. Government funding cycle is annual - need to wait for 2027 allocation." }], score: 52 },
  { id: 7, name: "Bucharest Emergency Hospital", city: "Bucharest", country: "Romania", region: "EAST_EU", lat: 44.44, lng: 26.10, type: "Public Hospital", volume: "1,000 - 3,000", automation: "Competitor full system", ivd: ["Abbott", "bioMérieux"], stage: "mapped", product: [], rfp: "Unknown", notes: [], score: 38 },
  { id: 8, name: "Prague University Hospital", city: "Prague", country: "Czech Republic", region: "EAST_EU", lat: 50.08, lng: 14.42, type: "University Hospital", volume: "1,000 - 3,000", automation: "Partial pre-analytical (competitor)", ivd: ["Beckman Coulter", "Roche"], stage: "exploring", product: ["FlexLab X", "ProTube"], rfp: "RFP expected", rfpDate: "2026-07", notes: [{ date: "2026-02-25", author: "Andrei Petrov", text: "Strong opportunity. Lab is consolidating from 3 buildings into 1. Need full automation. RFP expected July." }], score: 79 },
  { id: 9, name: "King Faisal Specialist Hospital", city: "Riyadh", country: "Saudi Arabia", region: "APAC", lat: 24.69, lng: 46.72, type: "Private Hospital", volume: "3,000+", automation: "Competitor full system", ivd: ["Roche", "Siemens Healthineers"], stage: "qualified", product: ["FlexLab X"], rfp: "RFP expected", rfpDate: "2026-06", notes: [{ date: "2026-03-02", author: "Director", text: "High-priority target. Current Beckman automation line aging. Hospital expanding diagnostic center. Budget confirmed for Q3-Q4 2026." }], score: 91 },
  { id: 10, name: "Apollo Hospitals Chennai", city: "Chennai", country: "India", region: "APAC", lat: 13.06, lng: 80.24, type: "Hospital Network", volume: "3,000+", automation: "Partial pre-analytical (competitor)", ivd: ["Abbott", "Sysmex", "Roche"], stage: "engaged", product: ["FlexLab X"], rfp: "No RFP expected", notes: [{ date: "2026-01-15", author: "Director", text: "Apollo network is expanding. Chennai hub lab could be a reference installation for the group. Need to build relationship with corporate procurement." }], score: 71 },
  { id: 11, name: "Bangkok Hospital", city: "Bangkok", country: "Thailand", region: "APAC", lat: 13.74, lng: 100.54, type: "Private Hospital", volume: "1,000 - 3,000", automation: "No automation (manual)", ivd: ["Roche"], stage: "mapped", product: [], rfp: "Unknown", notes: [], score: 42 },
  { id: 12, name: "Hospital Italiano Buenos Aires", city: "Buenos Aires", country: "Argentina", region: "LATAM", lat: -34.60, lng: -58.40, type: "Private Hospital", volume: "1,000 - 3,000", automation: "Legacy Inpeco (via OEM)", ivd: ["Abbott", "Siemens Healthineers"], stage: "qualified", product: ["FlexLab X", "ProTube"], rfp: "RFP published", rfpDate: "2026-05", notes: [{ date: "2026-02-28", author: "Carlos Mendez", text: "Legacy Aptio via Siemens installed 2016. Contract renewal window opening. Lab director already saw FlexLab X demo. Very positive." }, { date: "2026-01-10", author: "Carlos Mendez", text: "Distributor flagged as top priority for H1 2026." }], score: 90 },
];

const AI_BRIEFING = `## Weekly Intelligence Briefing — March 3, 2026

**Pipeline Momentum**: The global prospect base reached **12 laboratories** across 4 regions, with 3 prospects now at **Qualified** stage. This represents strong early traction for the platform.

**Hot Opportunities**: Beijing Ditan Hospital (China) has an active RFP with April 15 deadline — this requires immediate attention. Hospital Italiano Buenos Aires has published their RFP for May, with a legacy Inpeco upgrade path that gives us a competitive advantage.

**Regional Highlights**:
• **LATAM** leads in pipeline activity with 3 prospects across all active stages and 2 upcoming RFPs. Carlos is building a strong base.
• **China** shows the highest average prospect score (76) driven by Beijing Ditan's qualified status. The legacy Inpeco upgrade at Wuhan Union Hospital is a strategic opportunity.
• **East Europe** has 3 prospects but needs acceleration — Prague University Hospital's July RFP is the nearest catalyst.
• **APAC & MEA** has high-value targets (King Faisal, Apollo Network) that could drive significant revenue if converted.

**Key Signals**: 3 of 12 prospects have legacy Inpeco systems — this upgrade cohort should be prioritized as a strategic initiative. The Siemens OEM contract expiration pattern (2025-2026) creates a time-sensitive window.

**Action Items**: Prioritize RFP responses for Beijing (Apr) and Buenos Aires (May). Accelerate engagement in East Europe before Prague's July deadline. Consider Apollo Chennai as a strategic "lighthouse" installation for the Indian market.`;

// Simple SVG world map paths (simplified continents)
const WorldMap = ({ labs, onLabClick, selectedLab, filters }) => {
  const filteredLabs = labs.filter(lab => {
    if (filters.region && filters.region !== "all" && lab.region !== filters.region) return false;
    if (filters.stage && filters.stage !== "all" && lab.stage !== filters.stage) return false;
    return true;
  });

  const getStageColor = (stage) => STAGES.find(s => s.key === stage)?.color || "#94A3B8";

  const latLngToXY = (lat, lng) => {
    const x = ((lng + 180) / 360) * 900;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#0A1628", borderRadius: 12, overflow: "hidden" }}>
      {/* Grid lines */}
      <svg width="100%" height="100%" viewBox="0 0 900 500" style={{ position: "absolute", top: 0, left: 0, opacity: 0.08 }}>
        {[...Array(19)].map((_, i) => <line key={`h${i}`} x1={0} y1={i * 27.7} x2={900} y2={i * 27.7} stroke="#4FC3F7" strokeWidth={0.5} />)}
        {[...Array(37)].map((_, i) => <line key={`v${i}`} x1={i * 25} y1={0} x2={i * 25} y2={500} stroke="#4FC3F7" strokeWidth={0.5} />)}
      </svg>
      {/* Simplified continent outlines */}
      <svg width="100%" height="100%" viewBox="0 0 900 500" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* North America */}
        <path d="M120,80 L200,70 L240,90 L260,120 L250,160 L230,180 L200,200 L180,220 L160,210 L140,200 L120,180 L100,160 L90,130 L100,100 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* South America */}
        <path d="M200,250 L230,240 L250,260 L260,300 L250,350 L230,390 L210,400 L190,380 L180,340 L175,300 L180,270 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* Europe */}
        <path d="M420,70 L480,65 L510,80 L520,100 L510,130 L490,140 L460,150 L440,140 L420,120 L410,100 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* Africa */}
        <path d="M440,170 L490,165 L520,190 L530,230 L520,280 L500,320 L470,340 L450,320 L430,280 L420,240 L425,200 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* Asia */}
        <path d="M520,60 L620,50 L700,70 L740,100 L750,140 L730,170 L700,180 L660,190 L620,180 L580,160 L550,140 L530,110 L520,85 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* Middle East */}
        <path d="M520,140 L560,135 L580,160 L570,185 L540,190 L520,180 L510,160 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* India */}
        <path d="M610,170 L640,160 L660,190 L650,230 L630,250 L610,240 L600,210 L605,185 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* Southeast Asia */}
        <path d="M660,190 L710,185 L740,200 L730,230 L700,240 L680,235 L665,215 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* Australia */}
        <path d="M700,310 L760,300 L790,320 L790,350 L770,370 L730,375 L700,360 L690,340 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
        {/* China specific region */}
        <path d="M640,90 L700,80 L740,100 L730,140 L700,155 L660,150 L640,130 L635,110 Z" fill="#1A2744" stroke="#2A3F66" strokeWidth={1} />
      </svg>
      {/* Lab markers */}
      <svg width="100%" height="100%" viewBox="0 0 900 500" style={{ position: "absolute", top: 0, left: 0 }}>
        {filteredLabs.map(lab => {
          const pos = latLngToXY(lab.lat, lab.lng);
          const stageColor = getStageColor(lab.stage);
          const isSelected = selectedLab?.id === lab.id;
          return (
            <g key={lab.id} onClick={() => onLabClick(lab)} style={{ cursor: "pointer" }}>
              {/* Pulse animation ring */}
              {(lab.stage === "qualified" || lab.stage === "exploring") && (
                <circle cx={pos.x} cy={pos.y} r={isSelected ? 18 : 12} fill="none" stroke={stageColor} strokeWidth={1} opacity={0.3}>
                  <animate attributeName="r" from={isSelected ? 12 : 8} to={isSelected ? 22 : 16} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Main dot */}
              <circle cx={pos.x} cy={pos.y} r={isSelected ? 8 : 5} fill={stageColor} stroke={isSelected ? "#fff" : "none"} strokeWidth={isSelected ? 2 : 0} opacity={0.9} />
              {/* Score badge */}
              {isSelected && (
                <g>
                  <rect x={pos.x + 12} y={pos.y - 22} width={42} height={20} rx={4} fill="#0F172A" stroke={stageColor} strokeWidth={1} />
                  <text x={pos.x + 33} y={pos.y - 9} textAnchor="middle" fill={stageColor} fontSize={10} fontWeight={700} fontFamily="monospace">{lab.score}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 16, background: "rgba(10,22,40,0.85)", padding: "8px 14px", borderRadius: 8, backdropFilter: "blur(8px)" }}>
        {STAGES.map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            <span style={{ color: "#94A3B8", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
          </div>
        ))}
      </div>
      {/* Stats overlay */}
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
        {Object.entries(REGIONS).map(([key, r]) => {
          const count = filteredLabs.filter(l => l.region === key).length;
          return (
            <div key={key} style={{ background: "rgba(10,22,40,0.85)", padding: "6px 12px", borderRadius: 8, borderLeft: `3px solid ${r.color}`, backdropFilter: "blur(8px)" }}>
              <div style={{ color: r.color, fontSize: 18, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{count}</div>
              <div style={{ color: "#64748B", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>{r.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProspectCard = ({ lab, onClick, compact }) => {
  const stage = STAGES.find(s => s.key === lab.stage);
  const region = REGIONS[lab.region];
  return (
    <div onClick={() => onClick(lab)} style={{
      background: "#fff", borderRadius: 10, padding: compact ? "10px 12px" : "14px 16px",
      border: "1px solid #E2E8F0", cursor: "pointer", transition: "all 0.2s",
      borderLeft: `3px solid ${stage.color}`,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: compact ? 12 : 13, color: "#0F172A", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{lab.name}</div>
          <div style={{ color: "#64748B", fontSize: 11, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{lab.city}, {lab.country}</div>
        </div>
        <div style={{ background: `${stage.color}18`, color: stage.color, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif" }}>
          {stage.label}
        </div>
      </div>
      {!compact && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#64748B", background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>{lab.volume} samples/day</span>
          <span style={{ fontSize: 10, color: region.color, background: `${region.color}15`, padding: "2px 6px", borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>{region.label}</span>
          {lab.score >= 80 && <span style={{ fontSize: 10, color: "#F59E0B", background: "#FFFBEB", padding: "2px 6px", borderRadius: 4, fontFamily: "'Space Mono', monospace", fontWeight: 600 }}>★ {lab.score}</span>}
        </div>
      )}
    </div>
  );
};

const DetailPanel = ({ lab, onClose }) => {
  if (!lab) return null;
  const stage = STAGES.find(s => s.key === lab.stage);
  const region = REGIONS[lab.region];

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: 420, height: "100vh", background: "#fff",
      boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", zIndex: 100, overflowY: "auto",
      animation: "slideIn 0.3s ease",
    }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: `linear-gradient(135deg, ${stage.color}08, ${stage.color}15)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ background: `${stage.color}18`, color: stage.color, padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{stage.label}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94A3B8", lineHeight: 1 }}>✕</button>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{lab.name}</h2>
        <p style={{ color: "#64748B", fontSize: 13, margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>{lab.city}, {lab.country}</p>
        {/* Score bar */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 6, background: "#E2E8F0", borderRadius: 3 }}>
            <div style={{ width: `${lab.score}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${stage.color}, ${lab.score > 80 ? "#10B981" : stage.color})`, transition: "width 0.5s ease" }} />
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: lab.score >= 80 ? "#10B981" : lab.score >= 60 ? "#F59E0B" : "#64748B" }}>{lab.score}</span>
        </div>
        <div style={{ color: "#94A3B8", fontSize: 10, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>PROSPECT SCORE</div>
      </div>

      {/* Details grid */}
      <div style={{ padding: "16px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Institution Type", value: lab.type },
            { label: "Volume", value: lab.volume + " /day" },
            { label: "Automation", value: lab.automation?.split("(")[0]?.trim() },
            { label: "Region", value: region.label },
            { label: "RFP Status", value: lab.rfp + (lab.rfpDate ? ` (${lab.rfpDate})` : "") },
            { label: "Manager", value: region.manager },
          ].map((item, i) => (
            <div key={i} style={{ padding: "8px 10px", background: "#F8FAFC", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#0F172A", marginTop: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* IVD Vendors */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 6 }}>IVD Vendors Installed</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {lab.ivd?.map(v => (
              <span key={v} style={{ fontSize: 11, padding: "3px 10px", background: "#EFF6FF", color: "#3B82F6", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{v}</span>
            ))}
          </div>
        </div>

        {/* Product Interest */}
        {lab.product?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 6 }}>Product Interest</div>
            <div style={{ display: "flex", gap: 6 }}>
              {lab.product.map(p => (
                <span key={p} style={{ fontSize: 11, padding: "3px 10px", background: "#ECFDF5", color: "#10B981", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 10 }}>Activity Timeline</div>
          {lab.notes?.length > 0 ? lab.notes.map((note, i) => (
            <div key={i} style={{ position: "relative", paddingLeft: 20, paddingBottom: 16, borderLeft: i < lab.notes.length - 1 ? "2px solid #E2E8F0" : "2px solid transparent", marginLeft: 4 }}>
              <div style={{ position: "absolute", left: -4, top: 2, width: 10, height: 10, borderRadius: "50%", background: i === 0 ? stage.color : "#CBD5E1" }} />
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{note.date} · {note.author}</div>
              <div style={{ fontSize: 12, color: "#334155", marginTop: 3, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{note.text}</div>
            </div>
          )) : (
            <div style={{ color: "#94A3B8", fontSize: 12, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>No activity recorded yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, sub, color, icon }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0", flex: 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: color || "#0F172A", marginTop: 4, fontFamily: "'Space Mono', monospace" }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: "#64748B", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 22, opacity: 0.6 }}>{icon}</div>
    </div>
  </div>
);

export default function HorizonApp() {
  const [activeView, setActiveView] = useState("map");
  const [selectedLab, setSelectedLab] = useState(null);
  const [filters, setFilters] = useState({ region: "all", stage: "all" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const filteredLabs = MOCK_LABS.filter(lab => {
    if (filters.region !== "all" && lab.region !== filters.region) return false;
    if (filters.stage !== "all" && lab.stage !== filters.stage) return false;
    return true;
  });

  const stageGroups = STAGES.map(s => ({
    ...s,
    labs: filteredLabs.filter(l => l.stage === s.key),
  }));

  const navItems = [
    { key: "map", label: "Global Map", icon: "🌍" },
    { key: "pipeline", label: "Pipeline", icon: "◧" },
    { key: "list", label: "List View", icon: "☰" },
    { key: "dashboard", label: "Dashboard", icon: "◫" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F1F5F9", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0A1628", display: "flex", flexDirection: "column", padding: "0", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>H</span>
            </div>
            <div>
              <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "'Space Mono', monospace" }}>HORIZON</div>
              <div style={{ color: "#475569", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Global Distribution Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "12px 10px", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveView(item.key)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: activeView === item.key ? "rgba(59,130,246,0.15)" : "transparent",
              color: activeView === item.key ? "#60A5FA" : "#64748B",
              fontSize: 13, fontWeight: activeView === item.key ? 600 : 400,
              fontFamily: "'DM Sans', sans-serif", marginBottom: 2, textAlign: "left",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>GB</span>
            </div>
            <div>
              <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 500 }}>Global Business Mgr</div>
              <div style={{ color: "#475569", fontSize: 10 }}>System Owner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ padding: "12px 24px", background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select value={filters.region} onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#334155", background: "#F8FAFC", cursor: "pointer" }}>
              <option value="all">All Regions</option>
              {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={filters.stage} onChange={e => setFilters(f => ({ ...f, stage: e.target.value }))}
              style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#334155", background: "#F8FAFC", cursor: "pointer" }}>
              <option value="all">All Stages</option>
              {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{filteredLabs.length} laboratories</span>
            <button style={{
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff",
              fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}>+ New Prospect</button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: activeView === "map" ? 0 : 24 }}>
          {/* MAP VIEW */}
          {activeView === "map" && (
            <div style={{ height: "100%", position: "relative" }}>
              <WorldMap labs={MOCK_LABS} onLabClick={setSelectedLab} selectedLab={selectedLab} filters={filters} />
            </div>
          )}

          {/* PIPELINE VIEW */}
          {activeView === "pipeline" && (
            <div style={{ display: "flex", gap: 16, height: "100%", minHeight: 0 }}>
              {stageGroups.map(sg => (
                <div key={sg.key} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "0 4px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: sg.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{sg.label}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'Space Mono', monospace" }}>{sg.labs.length}</span>
                  </div>
                  <div style={{ flex: 1, background: sg.bg, borderRadius: 12, padding: 10, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                    {sg.labs.map(lab => (
                      <ProspectCard key={lab.id} lab={lab} onClick={setSelectedLab} compact />
                    ))}
                    {sg.labs.length === 0 && (
                      <div style={{ textAlign: "center", padding: 20, color: "#94A3B8", fontSize: 12, fontStyle: "italic" }}>No prospects</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {activeView === "list" && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Laboratory", "Location", "Type", "Volume", "Automation", "Stage", "Score", "RFP"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLabs.sort((a, b) => b.score - a.score).map(lab => {
                    const stage = STAGES.find(s => s.key === lab.stage);
                    return (
                      <tr key={lab.id} onClick={() => setSelectedLab(lab)} style={{ cursor: "pointer", borderBottom: "1px solid #F1F5F9" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, color: "#0F172A" }}>{lab.name}</td>
                        <td style={{ padding: "10px 14px", color: "#64748B" }}>{lab.city}, {lab.country}</td>
                        <td style={{ padding: "10px 14px", color: "#64748B" }}>{lab.type}</td>
                        <td style={{ padding: "10px 14px", color: "#64748B", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>{lab.volume}</td>
                        <td style={{ padding: "10px 14px", color: "#64748B", fontSize: 11 }}>{lab.automation?.split("(")[0]?.trim()}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ background: `${stage.color}18`, color: stage.color, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600 }}>{stage.label}</span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 12, color: lab.score >= 80 ? "#10B981" : lab.score >= 60 ? "#F59E0B" : "#94A3B8" }}>{lab.score}</span>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: lab.rfp === "RFP published" ? "#EF4444" : lab.rfp === "RFP expected" ? "#F59E0B" : "#94A3B8" }}>
                          {lab.rfp}{lab.rfpDate ? ` · ${lab.rfpDate}` : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* DASHBOARD VIEW */}
          {activeView === "dashboard" && (
            <div>
              {/* KPIs */}
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <KPICard label="Total Mapped" value={MOCK_LABS.length} sub="across 4 regions" icon="🌍" />
                <KPICard label="Active Pipeline" value={MOCK_LABS.filter(l => !["mapped", "handed_off"].includes(l.stage)).length} color="#3B82F6" sub="engaged to qualified" icon="◧" />
                <KPICard label="Qualified" value={MOCK_LABS.filter(l => l.stage === "qualified").length} color="#10B981" sub="ready for next step" icon="✓" />
                <KPICard label="Avg Score" value={Math.round(MOCK_LABS.reduce((a, l) => a + l.score, 0) / MOCK_LABS.length)} color="#F59E0B" sub="prospect quality" icon="★" />
              </div>

              {/* Charts row */}
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                {/* Stage Distribution */}
                <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>Pipeline by Stage</div>
                  {STAGES.map(s => {
                    const count = MOCK_LABS.filter(l => l.stage === s.key).length;
                    const pct = (count / MOCK_LABS.length) * 100;
                    return (
                      <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 80, fontSize: 11, color: "#64748B" }}>{s.label}</div>
                        <div style={{ flex: 1, height: 20, background: "#F1F5F9", borderRadius: 6, overflow: "hidden" }}>
                          <div style={{ width: loaded ? `${pct}%` : 0, height: "100%", background: `${s.color}`, borderRadius: 6, transition: "width 1s ease", display: "flex", alignItems: "center", paddingLeft: 8 }}>
                            {count > 0 && <span style={{ fontSize: 10, color: "#fff", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>{count}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Region Distribution */}
                <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>Prospects by Region</div>
                  {Object.entries(REGIONS).map(([key, r]) => {
                    const labs = MOCK_LABS.filter(l => l.region === key);
                    const avgScore = labs.length ? Math.round(labs.reduce((a, l) => a + l.score, 0) / labs.length) : 0;
                    return (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "8px 12px", background: "#F8FAFC", borderRadius: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{r.label}</div>
                          <div style={{ fontSize: 10, color: "#64748B" }}>{r.manager}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", fontFamily: "'Space Mono', monospace" }}>{labs.length}</div>
                          <div style={{ fontSize: 9, color: "#94A3B8" }}>avg {avgScore}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming RFPs */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Upcoming RFPs & Deadlines</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {MOCK_LABS.filter(l => l.rfpDate).sort((a, b) => a.rfpDate.localeCompare(b.rfpDate)).map(lab => (
                    <div key={lab.id} onClick={() => setSelectedLab(lab)} style={{
                      padding: "10px 16px", background: "#FFFBEB", borderRadius: 10, cursor: "pointer",
                      border: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#D97706", fontSize: 14 }}>{lab.rfpDate}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{lab.name}</div>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{lab.city}, {lab.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Briefing */}
              <div style={{ background: "linear-gradient(135deg, #0A1628, #1E293B)", borderRadius: 12, padding: 24, color: "#E2E8F0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #10B981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14 }}>✦</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>AI Intelligence Briefing</div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>Auto-generated weekly · Last updated March 3, 2026</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.8, color: "#CBD5E1", fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap" }}>
                  {AI_BRIEFING.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) return <div key={i} style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginTop: 8, marginBottom: 4 }}>{line.replace("## ", "")}</div>;
                    if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA", marginTop: 12, marginBottom: 2 }}>{line.replace(/\*\*/g, "")}</div>;
                    if (line.startsWith("**")) {
                      const parts = line.split("**");
                      return <div key={i} style={{ marginTop: 2 }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#F8FAFC" }}>{p}</strong> : <span key={j}>{p}</span>)}</div>;
                    }
                    if (line.startsWith("•")) return <div key={i} style={{ paddingLeft: 12, marginTop: 2 }}>{line}</div>;
                    if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
                    return <div key={i}>{line}</div>;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedLab && <DetailPanel lab={selectedLab} onClose={() => setSelectedLab(null)} />}
    </div>
  );
}