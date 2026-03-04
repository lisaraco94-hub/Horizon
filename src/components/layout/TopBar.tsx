"use client";

import { REGIONS, STAGES } from "@/lib/constants";
import type { Filters } from "@/lib/types";

interface TopBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  labCount: number;
}

export default function TopBar({ filters, onFiltersChange, labCount }: TopBarProps) {
  return (
    <div
      className="flex justify-between items-center"
      style={{
        padding: "12px 24px",
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div className="flex gap-3 items-center">
        <select
          value={filters.region}
          onChange={(e) =>
            onFiltersChange({ ...filters, region: e.target.value })
          }
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            color: "#334155",
            background: "#F8FAFC",
            cursor: "pointer",
          }}
        >
          <option value="all">All Regions</option>
          {Object.entries(REGIONS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          value={filters.stage}
          onChange={(e) =>
            onFiltersChange({ ...filters, stage: e.target.value })
          }
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            color: "#334155",
            background: "#F8FAFC",
            cursor: "pointer",
          }}
        >
          <option value="all">All Stages</option>
          {STAGES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <span
          style={{
            fontSize: 11,
            color: "#94A3B8",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {labCount} laboratories
        </span>
        <button
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #3B82F6, #2563EB)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
        >
          + New Prospect
        </button>
      </div>
    </div>
  );
}
