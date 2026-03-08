"use client";

import { useState } from "react";
import { STAGES, REGIONS } from "@/lib/constants";
import type { Laboratory, Note } from "@/lib/types";

interface DetailPanelProps {
  lab: Laboratory;
  onClose: () => void;
  onEdit: (lab: Laboratory) => void;
  onDelete: (lab: Laboratory) => void;
  onStageChange: (lab: Laboratory) => void;
}

export default function DetailPanel({ lab, onClose, onEdit, onDelete, onStageChange }: DetailPanelProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const stage = STAGES.find((s) => s.key === lab.stage)!;
  const region = REGIONS[lab.region];

  const details = [
    { label: "Institution Type", value: lab.type },
    { label: "Volume", value: lab.volume + " /day" },
    { label: "Tubes / Day", value: lab.tubesPerDay || "—" },
    { label: "Automation", value: lab.automation?.split("(")[0]?.trim() },
    { label: "Region", value: region.label },
    { label: "Distributor", value: lab.distributor },
    { label: "IVD Partner", value: lab.ivdPartnerInvolved || "None" },
    {
      label: "RFP Status",
      value: lab.rfp + (lab.rfpDate ? ` (${lab.rfpDate})` : ""),
    },
    { label: "Manager", value: region.manager },
  ];

  const getStageLabel = (key: string) => STAGES.find((s) => s.key === key)?.label || key;
  const getStageColor = (key: string) => STAGES.find((s) => s.key === key)?.color || "#94A3B8";

  const renderTimelineEntry = (note: Note, i: number, total: number) => {
    const isStageChange = note.event === "Stage Change";
    const dotColor = i === 0 ? stage.color : isStageChange ? "#6366F1" : "#CBD5E1";

    return (
      <div
        key={i}
        style={{
          position: "relative",
          paddingLeft: 20,
          paddingBottom: 16,
          borderLeft:
            i < total - 1
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
            background: dotColor,
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
        {isStageChange && note.fromStage && note.toStage ? (
          <div style={{ marginTop: 3 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 8,
                  background: `${getStageColor(note.fromStage)}18`,
                  color: getStageColor(note.fromStage),
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {getStageLabel(note.fromStage)}
              </span>
              <span style={{ color: "#94A3B8", fontSize: 11 }}>→</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 8,
                  background: `${getStageColor(note.toStage)}18`,
                  color: getStageColor(note.toStage),
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {getStageLabel(note.toStage)}
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#334155",
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {note.text}
            </div>
          </div>
        ) : (
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
        )}
      </div>
    );
  };

  return (
    <>
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
            <button
              onClick={() => onStageChange(lab)}
              style={{
                background: `${stage.color}18`,
                color: stage.color,
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                border: `1px solid ${stage.color}30`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              title="Click to change stage"
            >
              {stage.label} ▾
            </button>
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

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => onEdit(lab)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "#fff",
                color: "#334155",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                flex: 1,
                padding: "7px 0",
                borderRadius: 8,
                border: "1px solid #FECACA",
                background: "#FEF2F2",
                color: "#DC2626",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.15s",
              }}
            >
              Delete
            </button>
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
              lab.notes.map((note, i) =>
                renderTimelineEntry(note, i, lab.notes.length)
              )
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

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 250,
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteConfirm(false);
          }}
        >
          <div
            style={{
              width: 400,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0F172A",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 8,
              }}
            >
              Delete Prospect
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748B",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 6,
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to delete this prospect?
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#0F172A",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              {lab.name}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  color: "#64748B",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete(lab);
                }}
                style={{
                  padding: "8px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
