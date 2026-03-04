"use client";

import { STAGES, REGIONS } from "@/lib/constants";
import type { Laboratory, Filters } from "@/lib/types";

interface MapViewProps {
  labs: Laboratory[];
  filters: Filters;
  selectedLab: Laboratory | null;
  onLabClick: (lab: Laboratory) => void;
}

function latLngToXY(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 900;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

function getStageColor(stage: string) {
  return STAGES.find((s) => s.key === stage)?.color || "#94A3B8";
}

export default function MapView({ labs, filters, selectedLab, onLabClick }: MapViewProps) {
  const filteredLabs = labs.filter((lab) => {
    if (filters.region && filters.region !== "all" && lab.region !== filters.region) return false;
    if (filters.stage && filters.stage !== "all" && lab.stage !== filters.stage) return false;
    return true;
  });

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#0A1628", borderRadius: 12 }}
    >
      {/* Grid lines */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 500"
        className="absolute top-0 left-0"
        style={{ opacity: 0.08 }}
      >
        {Array.from({ length: 19 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * 27.7}
            x2={900}
            y2={i * 27.7}
            stroke="#4FC3F7"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: 37 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 25}
            y1={0}
            x2={i * 25}
            y2={500}
            stroke="#4FC3F7"
            strokeWidth={0.5}
          />
        ))}
      </svg>

      {/* Continent outlines */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 500"
        className="absolute top-0 left-0"
      >
        {/* North America */}
        <path
          d="M120,80 L200,70 L240,90 L260,120 L250,160 L230,180 L200,200 L180,220 L160,210 L140,200 L120,180 L100,160 L90,130 L100,100 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* South America */}
        <path
          d="M200,250 L230,240 L250,260 L260,300 L250,350 L230,390 L210,400 L190,380 L180,340 L175,300 L180,270 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* Europe */}
        <path
          d="M420,70 L480,65 L510,80 L520,100 L510,130 L490,140 L460,150 L440,140 L420,120 L410,100 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* Africa */}
        <path
          d="M440,170 L490,165 L520,190 L530,230 L520,280 L500,320 L470,340 L450,320 L430,280 L420,240 L425,200 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* Asia */}
        <path
          d="M520,60 L620,50 L700,70 L740,100 L750,140 L730,170 L700,180 L660,190 L620,180 L580,160 L550,140 L530,110 L520,85 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* Middle East */}
        <path
          d="M520,140 L560,135 L580,160 L570,185 L540,190 L520,180 L510,160 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* India */}
        <path
          d="M610,170 L640,160 L660,190 L650,230 L630,250 L610,240 L600,210 L605,185 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* Southeast Asia */}
        <path
          d="M660,190 L710,185 L740,200 L730,230 L700,240 L680,235 L665,215 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* Australia */}
        <path
          d="M700,310 L760,300 L790,320 L790,350 L770,370 L730,375 L700,360 L690,340 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
        {/* China region */}
        <path
          d="M640,90 L700,80 L740,100 L730,140 L700,155 L660,150 L640,130 L635,110 Z"
          fill="#1A2744"
          stroke="#2A3F66"
          strokeWidth={1}
        />
      </svg>

      {/* Lab markers */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 500"
        className="absolute top-0 left-0"
      >
        {filteredLabs.map((lab) => {
          const pos = latLngToXY(lab.lat, lab.lng);
          const stageColor = getStageColor(lab.stage);
          const isSelected = selectedLab?.id === lab.id;

          return (
            <g
              key={lab.id}
              onClick={() => onLabClick(lab)}
              style={{ cursor: "pointer" }}
            >
              {/* Pulse animation ring for qualified/exploring */}
              {(lab.stage === "qualified" || lab.stage === "exploring") && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 18 : 12}
                  fill="none"
                  stroke={stageColor}
                  strokeWidth={1}
                  opacity={0.3}
                >
                  <animate
                    attributeName="r"
                    from={isSelected ? 12 : 8}
                    to={isSelected ? 22 : 16}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Main dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 8 : 5}
                fill={stageColor}
                stroke={isSelected ? "#fff" : "none"}
                strokeWidth={isSelected ? 2 : 0}
                opacity={0.9}
              />

              {/* Score badge on selection */}
              {isSelected && (
                <g>
                  <rect
                    x={pos.x + 12}
                    y={pos.y - 22}
                    width={42}
                    height={20}
                    rx={4}
                    fill="#0F172A"
                    stroke={stageColor}
                    strokeWidth={1}
                  />
                  <text
                    x={pos.x + 33}
                    y={pos.y - 9}
                    textAnchor="middle"
                    fill={stageColor}
                    fontSize={10}
                    fontWeight={700}
                    fontFamily="'Space Mono', monospace"
                  >
                    {lab.score}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Stage legend (bottom-left) */}
      <div
        className="absolute flex gap-4"
        style={{
          bottom: 16,
          left: 16,
          background: "rgba(10,22,40,0.85)",
          padding: "8px 14px",
          borderRadius: 8,
          backdropFilter: "blur(8px)",
        }}
      >
        {STAGES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.color,
              }}
            />
            <span
              style={{
                color: "#94A3B8",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Region counters (top-right) */}
      <div className="absolute flex gap-2" style={{ top: 16, right: 16 }}>
        {Object.entries(REGIONS).map(([key, r]) => {
          const count = filteredLabs.filter((l) => l.region === key).length;
          return (
            <div
              key={key}
              style={{
                background: "rgba(10,22,40,0.85)",
                padding: "6px 12px",
                borderRadius: 8,
                borderLeft: `3px solid ${r.color}`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  color: r.color,
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {count}
              </div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: 10,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {r.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
