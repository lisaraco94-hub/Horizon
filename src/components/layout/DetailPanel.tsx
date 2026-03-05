"use client";

import { STAGES, REGIONS } from "@/lib/constants";
import type { Laboratory } from "@/lib/types";

interface DetailPanelProps {
  lab: Laboratory;
  onClose: () => void;
}

export default function DetailPanel({ lab, onClose }: DetailPanelProps) {
  const stage = STAGES.find((s) => s.key === lab.stage)!;
  const region = REGIONS[lab.region];

  const details = [
    { label: "Institution Type", value: lab.type },
    { label: "Volume", value: lab.volume + " /day" },
    { label: "Automation", value: lab.automation?.split("(")[0]?.trim() },
    { label: "Region", value: region.label },
    { label: "Distributor", value: lab.distributor },
    {
      label: "RFP Status",
      value: lab.rfp + (lab.rfpDate ? ` (${lab.rfpDate})` : ""),
    },
    { label: "Manager", value: region.manager },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 420,
        height: "100vh",
        background: "#fff",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        zIndex: 100,
        overflowY: "auto",
        animation: "slideIn 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E2E8F0",
          background: `linear-gradient(135deg, ${stage.color}08, ${stage.color}15)`,
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <div
            style={{
              background: `${stage.color}18`,
              color: stage.color,
              padding: "4px 12px",
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {stage.label}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#94A3B8",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.3,
          }}
        >
          {lab.name}
        </h2>
        <p
          style={{
            color: "#64748B",
            fontSize: 13,
            margin: "4px 0 0",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {lab.city}, {lab.country}
        </p>

        {/* Score bar */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="flex-1"
            style={{ height: 6, background: "#E2E8F0", borderRadius: 3 }}
          >
            <div
              style={{
                width: `${lab.score}%`,
                height: "100%",
                borderRadius: 3,
                background: `linear-gradient(90deg, ${stage.color}, ${lab.score > 80 ? "#10B981" : stage.color})`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 14,
              color:
                lab.score >= 80
                  ? "#10B981"
                  : lab.score >= 60
                    ? "#F59E0B"
                    : "#64748B",
            }}
          >
            {lab.score}
          </span>
        </div>
        <div
          style={{
            color: "#94A3B8",
            fontSize: 10,
            marginTop: 4,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          PROSPECT SCORE
        </div>
      </div>

      {/* Details grid */}
      <div style={{ padding: "16px 24px" }}>
        <div className="grid grid-cols-2 gap-3">
          {details.map((item, i) => (
            <div
              key={i}
              style={{ padding: "8px 10px", background: "#F8FAFC", borderRadius: 8 }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#0F172A",
                  marginTop: 2,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* IVD Vendors */}
        <div className="mt-4">
          <div
            style={{
              fontSize: 10,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            IVD Vendors Installed
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {lab.ivd?.map((v) => (
              <span
                key={v}
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  background: "#EFF6FF",
                  color: "#3B82F6",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Product Interest */}
        {lab.product?.length > 0 && (
          <div className="mt-4">
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Product Interest
            </div>
            <div className="flex gap-1.5">
              {lab.product.map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    background: "#ECFDF5",
                    color: "#10B981",
                    borderRadius: 12,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="mt-5">
          <div
            style={{
              fontSize: 10,
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Activity Timeline
          </div>
          {lab.notes?.length > 0 ? (
            lab.notes.map((note, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  paddingLeft: 20,
                  paddingBottom: 16,
                  borderLeft:
                    i < lab.notes.length - 1
                      ? "2px solid #E2E8F0"
                      : "2px solid transparent",
                  marginLeft: 4,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -4,
                    top: 2,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: i === 0 ? stage.color : "#CBD5E1",
                  }}
                />
                <div
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {note.date} · {note.author}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#334155",
                    marginTop: 3,
                    lineHeight: 1.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {note.text}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                color: "#94A3B8",
                fontSize: 12,
                fontStyle: "italic",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              No activity recorded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
