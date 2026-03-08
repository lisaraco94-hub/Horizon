"use client";

import { useState, useRef, useEffect } from "react";
import { REGIONS, STAGES } from "@/lib/constants";
import type { Filters } from "@/lib/types";

interface TopBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  labCount: number;
  onNewProspect: () => void;
}

function MultiSelectDropdown({
  label,
  items,
  selected,
  onChange,
}: {
  label: string;
  items: { key: string; label: string; color?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allSelected = selected.length === items.length;
  const noneSelected = selected.length === 0;
  const summary = allSelected
    ? `All ${label}`
    : noneSelected
      ? `No ${label}`
      : selected.length === 1
        ? items.find((i) => i.key === selected[0])?.label || selected[0]
        : `${selected.length} ${label}`;

  const toggleItem = (key: string) => {
    onChange(
      selected.includes(key)
        ? selected.filter((s) => s !== key)
        : [...selected, key]
    );
  };

  const toggleAll = () => {
    onChange(allSelected ? [] : items.map((i) => i.key));
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          color: "#334155",
          background: "#F8FAFC",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        {summary}
        <span style={{ fontSize: 9, color: "#94A3B8" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 200,
            minWidth: 200,
            padding: "6px 0",
          }}
        >
          {/* Select All */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              color: "#334155",
              fontWeight: 600,
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              style={{ accentColor: "#3B82F6" }}
            />
            Select All
          </label>

          {items.map((item) => (
            <label
              key={item.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                color: "#334155",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <input
                type="checkbox"
                checked={selected.includes(item.key)}
                onChange={() => toggleItem(item.key)}
                style={{ accentColor: item.color || "#3B82F6" }}
              />
              {item.color && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
              )}
              {item.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar({ filters, onFiltersChange, labCount, onNewProspect }: TopBarProps) {
  const regionItems = Object.entries(REGIONS).map(([k, v]) => ({
    key: k,
    label: v.label,
    color: v.color,
  }));

  const stageItems = STAGES.map((s) => ({
    key: s.key,
    label: s.label,
    color: s.color,
  }));

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
        <MultiSelectDropdown
          label="Regions"
          items={regionItems}
          selected={filters.regions}
          onChange={(regions) => onFiltersChange({ ...filters, regions })}
        />

        <MultiSelectDropdown
          label="Stages"
          items={stageItems}
          selected={filters.stages}
          onChange={(stages) => onFiltersChange({ ...filters, stages })}
        />

        <select
          value={filters.createdTime}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              createdTime: e.target.value as Filters["createdTime"],
            })
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
          <option value="all">All Time</option>
          <option value="last_week">Added in last week</option>
          <option value="last_month">Added in last month</option>
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
          onClick={onNewProspect}
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
