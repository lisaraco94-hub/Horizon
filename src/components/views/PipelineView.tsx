"use client";

import { STAGES } from "@/lib/constants";
import type { Laboratory } from "@/lib/types";

interface PipelineViewProps {
  labs: Laboratory[];
  onLabClick: (lab: Laboratory) => void;
}

const PipelineCard = ({
  lab,
  onClick,
}: {
  lab: Laboratory;
  onClick: (lab: Laboratory) => void;
}) => {
  const stage = STAGES.find((s) => s.key === lab.stage)!;

  return (
    <div
      onClick={() => onClick(lab)}
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "10px 12px",
        border: "1px solid #E2E8F0",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderLeft: `3px solid ${stage.color}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Name + stage badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: "#0F172A",
              lineHeight: 1.35,
              fontFamily: "'DM Sans', sans-serif",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {lab.name}
          </div>
          <div
            style={{
              color: "#64748B",
              fontSize: 11,
              marginTop: 3,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {lab.city}, {lab.country}
          </div>
        </div>
        <span
          style={{
            background: `${stage.color}18`,
            color: stage.color,
            padding: "2px 8px",
            borderRadius: 12,
            fontSize: 10,
            fontWeight: 600,
            whiteSpace: "nowrap",
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
          }}
        >
          {stage.label}
        </span>
      </div>

      {/* Score + RFP pills */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 8,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 11,
            color:
              lab.score >= 80
                ? "#10B981"
                : lab.score >= 60
                ? "#F59E0B"
                : "#94A3B8",
          }}
        >
          {lab.score}
        </span>
        {lab.rfp === "RFP published" && (
          <span
            style={{
              fontSize: 9,
              color: "#EF4444",
              background: "#FEF2F2",
              padding: "1px 7px",
              borderRadius: 8,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid #FECACA",
            }}
          >
            RFP LIVE
          </span>
        )}
        {lab.rfp === "RFP expected" && lab.rfpDate && (
          <span
            style={{
              fontSize: 9,
              color: "#D97706",
              background: "#FFFBEB",
              padding: "1px 7px",
              borderRadius: 8,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid #FDE68A",
            }}
          >
            RFP {lab.rfpDate}
          </span>
        )}
      </div>
    </div>
  );
};

export default function PipelineView({
  labs,
  onLabClick,
}: PipelineViewProps) {
  const stageGroups = STAGES.map((s) => ({
    ...s,
    labs: labs.filter((l) => l.stage === s.key),
  }));

  return (
    <div style={{ display: "flex", gap: 14, height: "100%", minHeight: 0 }}>
      {stageGroups.map((sg) => (
        <div
          key={sg.key}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Column header */}
          <div
            style={{
              borderRadius: 10,
              padding: "9px 14px",
              marginBottom: 10,
              borderTop: `3px solid ${sg.color}`,
              background: `${sg.color}12`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: sg.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: sg.color,
                fontFamily: "'DM Sans', sans-serif",
                flex: 1,
                letterSpacing: "0.01em",
              }}
            >
              {sg.label}
            </span>
            <span
              style={{
                background: sg.color,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {sg.labs.length}
            </span>
          </div>

          {/* Column body */}
          <div
            style={{
              flex: 1,
              background: sg.bg,
              borderRadius: 12,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            {sg.labs.map((lab) => (
              <PipelineCard key={lab.id} lab={lab} onClick={onLabClick} />
            ))}
            {sg.labs.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 12px",
                  color: "#CBD5E1",
                  fontSize: 12,
                  fontStyle: "italic",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                No prospects
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
