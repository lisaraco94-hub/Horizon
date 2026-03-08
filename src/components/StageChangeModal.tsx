"use client";

import { useState } from "react";
import { STAGES } from "@/lib/constants";
import type { Laboratory, Stage } from "@/lib/types";

interface StageChangeModalProps {
  lab: Laboratory;
  onConfirm: (newStage: Stage, comment: string) => void;
  onClose: () => void;
}

export default function StageChangeModal({ lab, onConfirm, onClose }: StageChangeModalProps) {
  const [newStage, setNewStage] = useState<Stage>(lab.stage);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const currentStage = STAGES.find((s) => s.key === lab.stage)!;

  const handleSubmit = () => {
    if (newStage === lab.stage) {
      setError("Please select a different stage.");
      return;
    }
    if (!comment.trim()) {
      setError("Please provide a reason for this stage change.");
      return;
    }
    onConfirm(newStage, comment.trim());
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 440,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Change Stage
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#64748B",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 2,
            }}
          >
            {lab.name}
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "#DC2626",
                marginBottom: 16,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Current Stage
            </div>
            <span
              style={{
                background: `${currentStage.color}18`,
                color: currentStage.color,
                padding: "4px 12px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {currentStage.label}
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
                marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              New Stage
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {STAGES.map((s) => {
                const active = newStage === s.key;
                const isCurrent = lab.stage === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setNewStage(s.key);
                      setError("");
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 14,
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      border: active
                        ? `2px solid ${s.color}`
                        : "1px solid #E2E8F0",
                      background: active ? `${s.color}18` : "#F8FAFC",
                      color: active ? s.color : isCurrent ? "#94A3B8" : "#64748B",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                      opacity: isCurrent ? 0.5 : 1,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 10,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
                marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              What is causing this stage change? *
            </div>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError("");
              }}
              placeholder="e.g. distributor meeting completed, hospital confirmed interest, RFP expected..."
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                color: "#334155",
                background: "#fff",
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: 60,
                lineHeight: 1.5,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 12,
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <button
              type="button"
              onClick={onClose}
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
              type="button"
              onClick={handleSubmit}
              style={{
                padding: "8px 24px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
            >
              Confirm Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
