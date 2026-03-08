"use client";

import { useState, useCallback } from "react";
import { STAGES } from "@/lib/constants";
import type { Laboratory } from "@/lib/types";
import * as XLSX from "xlsx";

interface ListViewProps {
  labs: Laboratory[];
  onLabClick: (lab: Laboratory) => void;
  onBulkDelete: (ids: (string | number)[]) => void;
}

type SortKey = "score" | "name" | "stage" | "volume";
type SortDir = "asc" | "desc";

const HEADERS: { label: string; key?: SortKey; sortable?: boolean }[] = [
  { label: "Laboratory", key: "name", sortable: true },
  { label: "Location" },
  { label: "Type" },
  { label: "Volume", key: "volume", sortable: true },
  { label: "Tubes/Day" },
  { label: "Automation" },
  { label: "IVD Partner" },
  { label: "Stage", key: "stage", sortable: true },
  { label: "Score", key: "score", sortable: true },
  { label: "Distributor" },
  { label: "RFP" },
];

export default function ListView({ labs, onLabClick, onBulkDelete }: ListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...labs].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "score") cmp = a.score - b.score;
    else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "stage") cmp = a.stage.localeCompare(b.stage);
    else if (sortKey === "volume") cmp = a.volume.localeCompare(b.volume);
    return sortDir === "desc" ? -cmp : cmp;
  });

  const allSelected = sorted.length > 0 && selectedIds.size === sorted.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map((l) => l.id)));
    }
  };

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  };

  const exportExcel = useCallback(() => {
    const rows = sorted.map((lab) => ({
      Laboratory: lab.name,
      Location: `${lab.city}, ${lab.country}`,
      Country: lab.country,
      Region: lab.region,
      Type: lab.type,
      Volume: lab.volume,
      "Tubes/Day": lab.tubesPerDay || "",
      Automation: lab.automation,
      "IVD Partner": lab.ivdPartnerInvolved || "None",
      Stage: STAGES.find((s) => s.key === lab.stage)?.label || lab.stage,
      Score: lab.score,
      Distributor: lab.distributor,
      "RFP Status": lab.rfp,
      "RFP Date": lab.rfpDate || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      if (ws[addr]) {
        ws[addr].s = { font: { bold: true } };
      }
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pipeline");
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    XLSX.writeFile(wb, `pipeline_export_${today}.xlsx`);
  }, [sorted]);

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
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {selectedIds.size > 0 && (
            <>
              <span
                style={{
                  fontSize: 12,
                  color: "#334155",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  color: "#DC2626",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                Delete Selected
              </button>
            </>
          )}
        </div>
        <button
          onClick={exportExcel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            background: "#fff",
            color: "#334155",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            transition: "all 0.15s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#10B981";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#10B981";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#334155";
            e.currentTarget.style.borderColor = "#E2E8F0";
          }}
        >
          <span style={{ fontSize: 14 }}>↓</span>
          Export Excel
        </button>
      </div>

      {/* Table */}
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
              {/* Checkbox column */}
              <th
                style={{
                  padding: "10px 10px 10px 14px",
                  borderBottom: "1px solid #E2E8F0",
                  width: 36,
                }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  style={{ accentColor: "#3B82F6", cursor: "pointer" }}
                />
              </th>
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
              const isChecked = selectedIds.has(lab.id);

              return (
                <tr
                  key={lab.id}
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #F1F5F9",
                    transition: "background 0.1s",
                    background: isChecked ? "#EFF6FF" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isChecked ? "#EFF6FF" : "transparent";
                  }}
                >
                  <td
                    style={{ padding: "11px 10px 11px 14px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(lab.id)}
                      style={{ accentColor: "#3B82F6", cursor: "pointer" }}
                    />
                  </td>
                  <td
                    onClick={() => onLabClick(lab)}
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
                  <td
                    onClick={() => onLabClick(lab)}
                    style={{
                      padding: "11px 14px",
                      color: "#64748B",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lab.city}, {lab.country}
                  </td>
                  <td
                    onClick={() => onLabClick(lab)}
                    style={{ padding: "11px 14px", color: "#64748B" }}
                  >
                    {lab.type}
                  </td>
                  <td
                    onClick={() => onLabClick(lab)}
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
                  <td
                    onClick={() => onLabClick(lab)}
                    style={{
                      padding: "11px 14px",
                      color: "#64748B",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lab.tubesPerDay || "—"}
                  </td>
                  <td
                    onClick={() => onLabClick(lab)}
                    style={{
                      padding: "11px 14px",
                      color: "#64748B",
                      fontSize: 11,
                      maxWidth: 140,
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
                  <td
                    onClick={() => onLabClick(lab)}
                    style={{
                      padding: "11px 14px",
                      color: "#64748B",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lab.ivdPartnerInvolved || "None"}
                  </td>
                  <td onClick={() => onLabClick(lab)} style={{ padding: "11px 14px" }}>
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
                  <td onClick={() => onLabClick(lab)} style={{ padding: "11px 14px" }}>
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
                  <td
                    onClick={() => onLabClick(lab)}
                    style={{
                      padding: "11px 14px",
                      color: "#64748B",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {lab.distributor}
                  </td>
                  <td
                    onClick={() => onLabClick(lab)}
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
                      <span style={{ color: "#94A3B8", fontWeight: 400 }}>
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
                  colSpan={12}
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

      {/* Bulk delete confirmation dialog */}
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
              width: 420,
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
              Delete Selected Prospects
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#64748B",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 20,
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to delete the selected prospects?
              <br />
              <strong style={{ color: "#0F172A" }}>
                {selectedIds.size} prospect{selectedIds.size > 1 ? "s" : ""} will be permanently removed.
              </strong>
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
                onClick={handleBulkDelete}
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
                Delete {selectedIds.size} Prospect{selectedIds.size > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
