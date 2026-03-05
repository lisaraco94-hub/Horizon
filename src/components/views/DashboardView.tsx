"use client";

import { useEffect, useState } from "react";
import { STAGES, REGIONS, AI_BRIEFING } from "@/lib/constants";
import type { Laboratory } from "@/lib/types";

interface DashboardViewProps {
  labs: Laboratory[];
  onLabClick: (lab: Laboratory) => void;
}

const KPICard = ({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  color?: string;
  icon: string;
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      padding: "16px 20px",
      border: "1px solid #E2E8F0",
      flex: 1,
    }}
  >
    <div
      style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: color || "#0F172A",
            marginTop: 6,
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11,
              color: "#64748B",
              marginTop: 4,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {sub}
          </div>
        )}
      </div>
      <div style={{ fontSize: 24, opacity: 0.5 }}>{icon}</div>
    </div>
  </div>
);

const AiBriefingBlock = ({ text }: { text: string }) => {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <div
              key={i}
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#F8FAFC",
                marginBottom: 10,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {line.replace("## ", "")}
            </div>
          );
        }
        if (line.startsWith("•")) {
          // parse bold inside bullet
          const inner = line.slice(1).trim();
          return (
            <div
              key={i}
              style={{
                paddingLeft: 14,
                marginTop: 3,
                fontSize: 13,
                lineHeight: 1.75,
                color: "#CBD5E1",
                fontFamily: "'DM Sans', sans-serif",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 4,
                  color: "#475569",
                }}
              >
                •
              </span>
              {renderBold(inner)}
            </div>
          );
        }
        if (line.trim() === "")
          return <div key={i} style={{ height: 8 }} />;
        return (
          <div
            key={i}
            style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: "#CBD5E1",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 2,
            }}
          >
            {renderBold(line)}
          </div>
        );
      })}
    </div>
  );
};

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ color: "#F8FAFC", fontWeight: 700 }}>
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function DashboardView({ labs, onLabClick }: DashboardViewProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const activePipeline = labs.filter(
    (l) => !["mapped", "handed_off"].includes(l.stage)
  ).length;
  const qualified = labs.filter((l) => l.stage === "qualified").length;
  const avgScore = Math.round(
    labs.reduce((a, l) => a + l.score, 0) / labs.length
  );

  const upcomingRfps = labs
    .filter((l) => l.rfpDate)
    .sort((a, b) => (a.rfpDate! > b.rfpDate! ? 1 : -1));

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* KPI Row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <KPICard
          label="Total Mapped"
          value={labs.length}
          sub="across 4 regions"
          icon="🌍"
        />
        <KPICard
          label="Active Pipeline"
          value={activePipeline}
          sub="engaged → qualified"
          color="#3B82F6"
          icon="◧"
        />
        <KPICard
          label="Qualified"
          value={qualified}
          sub="ready for hand-off"
          color="#10B981"
          icon="✓"
        />
        <KPICard
          label="Avg Score"
          value={avgScore}
          sub="prospect quality index"
          color="#F59E0B"
          icon="★"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {/* Pipeline by Stage */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 12,
            padding: "20px 22px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: 18,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Pipeline by Stage
          </div>
          {STAGES.map((s) => {
            const count = labs.filter((l) => l.stage === s.key).length;
            const pct = (count / labs.length) * 100;
            return (
              <div
                key={s.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 82,
                    fontSize: 11,
                    color: "#64748B",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 22,
                    background: "#F1F5F9",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: animated ? `${pct}%` : "0%",
                      height: "100%",
                      background: s.color,
                      borderRadius: 6,
                      transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 8,
                      minWidth: count > 0 && animated ? 28 : 0,
                    }}
                  >
                    {count > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#fff",
                          fontWeight: 700,
                          fontFamily: "'Space Mono', monospace",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94A3B8",
                    fontFamily: "'Space Mono', monospace",
                    width: 18,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Prospects by Region */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 12,
            padding: "20px 22px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: 18,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Prospects by Region
          </div>
          {Object.entries(REGIONS).map(([key, r]) => {
            const regionLabs = labs.filter((l) => l.region === key);
            const avgRegionScore = regionLabs.length
              ? Math.round(
                  regionLabs.reduce((a, l) => a + l.score, 0) /
                    regionLabs.length
                )
              : 0;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                  padding: "10px 14px",
                  background: "#F8FAFC",
                  borderRadius: 10,
                  borderLeft: `3px solid ${r.color}`,
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: r.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748B",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {r.manager}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#0F172A",
                      fontFamily: "'Space Mono', monospace",
                      lineHeight: 1,
                    }}
                  >
                    {regionLabs.length}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      fontFamily: "'DM Sans', sans-serif",
                      marginTop: 2,
                    }}
                  >
                    avg {avgRegionScore}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming RFPs */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "20px 22px",
          border: "1px solid #E2E8F0",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#0F172A",
            marginBottom: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Upcoming RFPs & Deadlines
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {upcomingRfps.map((lab) => {
            const isPublished = lab.rfp === "RFP published";
            return (
              <div
                key={lab.id}
                onClick={() => onLabClick(lab)}
                style={{
                  padding: "12px 16px",
                  background: isPublished ? "#FEF2F2" : "#FFFBEB",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: `1px solid ${isPublished ? "#FECACA" : "#FDE68A"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transition: "all 0.2s",
                  minWidth: 240,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      color: isPublished ? "#DC2626" : "#D97706",
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    {lab.rfpDate}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: isPublished ? "#EF4444" : "#F59E0B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginTop: 3,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {isPublished ? "PUBLISHED" : "EXPECTED"}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {lab.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748B",
                      fontFamily: "'DM Sans', sans-serif",
                      marginTop: 2,
                    }}
                  >
                    {lab.city}, {lab.country}
                  </div>
                </div>
              </div>
            );
          })}
          {upcomingRfps.length === 0 && (
            <div
              style={{
                color: "#CBD5E1",
                fontSize: 13,
                fontStyle: "italic",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              No upcoming RFPs
            </div>
          )}
        </div>
      </div>

      {/* AI Intelligence Briefing */}
      <div
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #1E293B 100%)",
          borderRadius: 12,
          padding: "22px 26px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3B82F6, #10B981)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 15, color: "#fff" }}>✦</span>
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#F8FAFC",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              AI Intelligence Briefing
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Auto-generated weekly · Last updated March 3, 2026
            </div>
          </div>
        </div>
        <AiBriefingBlock text={AI_BRIEFING} />
      </div>
    </div>
  );
}
