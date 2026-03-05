"use client";

import { useState } from "react";
import { STAGES } from "@/lib/constants";
import type { Laboratory, Filters } from "@/lib/types";

interface ListViewProps {
  labs: Laboratory[];
  filters: Filters;
  onLabClick: (lab: Laboratory) => void;
}

type SortKey = "score" | "name" | "stage" | "volume";
type SortDir = "asc" | "desc";

const HEADERS: { label: string; key?: SortKey; sortable?: boolean }[] = [
  { label: "Laboratory", key: "name", sortable: true },
  { label: "Location" },
  { label: "Type" },
  { label: "Volume", key: "volume", sortable: true },
  { label: "Automation" },
  { label: "Stage", key: "stage", sortable: true },
  { label: "Score", key: "score", sortable: true },
  { label: "RFP" },
];

export default function ListView({ labs, filters, onLabClick }: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filteredLabs = labs.filter((lab) => {
    if (filters.region !== "all" && lab.region !== filters.region) return false;
    if (filters.stage !== "all" && lab.stage !== filters.stage) return false;
    return true;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...filteredLabs].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "score") cmp = a.score - b.score;
    else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "stage") cmp = a.stage.localeCompare(b.stage);
    else if (sortKey === "volume") cmp = a.volume.localeCompare(b.volume);
    return sortDir === "desc" ? -cmp : cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return (
        <span style={{ color: "#CBD5E1", marginLeft: 4, fontSize: 10 }}>
          ↕
        </span>
      );
    return (
      <span style={{ color: "#3B82F6", marginLeft: 4, fontSize: 10 }}>
        {sortDir === "desc" ? "↓" : "↑"}
      </span>
    );
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                onClick={() => h.sortable && h.key && handleSort(h.key)}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  fontSize: 10,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                  borderBottom: "1px solid #E2E8F0",
                  cursor: h.sortable ? "pointer" : "default",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (h.sortable)
                    (e.currentTarget as HTMLElement).style.color = "#64748B";
                }}
                onMouseLeave={(e) => {
                  if (h.sortable)
                    (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                }}
              >
                {h.label}
                {h.sortable && h.key && <SortIcon col={h.key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((lab) => {
            const stage = STAGES.find((s) => s.key === lab.stage)!;
            const rfpColor =
              lab.rfp === "RFP published"
                ? "#EF4444"
                : lab.rfp === "RFP expected"
                ? "#F59E0B"
                : "#94A3B8";

            return (
              <tr
                key={lab.id}
                onClick={() => onLabClick(lab)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #F1F5F9",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F8FAFC")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Laboratory */}
                <td
                  style={{
                    padding: "11px 14px",
                    fontWeight: 600,
                    color: "#0F172A",
                    maxWidth: 220,
                  }}
                >
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lab.name}
                  </div>
                </td>

                {/* Location */}
                <td
                  style={{
                    padding: "11px 14px",
                    color: "#64748B",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lab.city}, {lab.country}
                </td>

                {/* Type */}
                <td style={{ padding: "11px 14px", color: "#64748B" }}>
                  {lab.type}
                </td>

                {/* Volume */}
                <td
                  style={{
                    padding: "11px 14px",
                    color: "#64748B",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  {lab.volume}
                </td>

                {/* Automation */}
                <td
                  style={{
                    padding: "11px 14px",
                    color: "#64748B",
                    fontSize: 11,
                    maxWidth: 160,
                  }}
                >
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lab.automation?.split("(")[0]?.trim()}
                  </div>
                </td>

                {/* Stage pill */}
                <td style={{ padding: "11px 14px" }}>
                  <span
                    style={{
                      background: `${stage.color}18`,
                      color: stage.color,
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {stage.label}
                  </span>
                </td>

                {/* Score */}
                <td style={{ padding: "11px 14px" }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 13,
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
                </td>

                {/* RFP */}
                <td
                  style={{
                    padding: "11px 14px",
                    fontSize: 11,
                    fontWeight:
                      lab.rfp === "RFP published" ||
                      lab.rfp === "RFP expected"
                        ? 600
                        : 400,
                    color: rfpColor,
                    whiteSpace: "nowrap",
                  }}
                >
                  {lab.rfp}
                  {lab.rfpDate && (
                    <span
                      style={{ color: "#94A3B8", fontWeight: 400 }}
                    >
                      {" "}· {lab.rfpDate}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={8}
                style={{
                  padding: "40px 14px",
                  textAlign: "center",
                  color: "#CBD5E1",
                  fontSize: 13,
                  fontStyle: "italic",
                }}
              >
                No prospects match the current filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
