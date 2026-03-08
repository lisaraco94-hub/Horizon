"use client";

import { useState, type FormEvent } from "react";
import { useUser } from "@/lib/UserContext";
import {
  REGIONS,
  REGION_TARGET_MARKETS,
  STAGES,
  IVD_PARTNERS,
} from "@/lib/constants";
import type { Laboratory, Region, Stage } from "@/lib/types";

interface EditProspectModalProps {
  lab: Laboratory;
  onSave: (lab: Laboratory) => void;
  onClose: () => void;
}

export default function EditProspectModal({ lab, onSave, onClose }: EditProspectModalProps) {
  const { user } = useUser();

  const [name, setName] = useState(lab.name);
  const [city, setCity] = useState(lab.city);
  const [region, setRegion] = useState<Region>(lab.region);
  const [country, setCountry] = useState(lab.country);
  const [distributor, setDistributor] = useState(lab.distributor);
  const [tubesPerDay, setTubesPerDay] = useState(lab.tubesPerDay || "");
  const [ivdPartner, setIvdPartner] = useState(
    IVD_PARTNERS.includes(lab.ivdPartnerInvolved || "None")
      ? lab.ivdPartnerInvolved || "None"
      : "Other"
  );
  const [ivdPartnerOther, setIvdPartnerOther] = useState(
    IVD_PARTNERS.includes(lab.ivdPartnerInvolved || "None")
      ? ""
      : lab.ivdPartnerInvolved || ""
  );
  const [stage, setStage] = useState<Stage>(lab.stage);
  const [notesText, setNotesText] = useState("");
  const [error, setError] = useState("");

  const availableCountries = REGION_TARGET_MARKETS[region] || [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !country) {
      setError("Laboratory name, city, and country are required.");
      return;
    }

    const resolvedPartner =
      ivdPartner === "Other" ? ivdPartnerOther.trim() || "Other" : ivdPartner;

    const newNotes = notesText.trim()
      ? [
          {
            date: new Date().toISOString().slice(0, 10),
            author: user?.name || "Unknown",
            text: notesText.trim(),
            event: "Note" as const,
          },
          ...lab.notes,
        ]
      : lab.notes;

    const updated: Laboratory = {
      ...lab,
      name: name.trim(),
      city: city.trim(),
      country,
      region,
      distributor: distributor.trim(),
      tubesPerDay: tubesPerDay.trim() || undefined,
      ivdPartnerInvolved: resolvedPartner,
      stage,
      notes: newNotes,
    };

    onSave(updated);
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #E2E8F0",
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    color: "#334155",
    background: "#F8FAFC",
    boxSizing: "border-box",
  };

  const inputStyle: React.CSSProperties = {
    ...selectStyle,
    background: "#fff",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
    marginBottom: 4,
    fontFamily: "'DM Sans', sans-serif",
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
        zIndex: 250,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 520,
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0F172A",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Edit Prospect
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94A3B8",
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 2,
              }}
            >
              Update prospect information
            </div>
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

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}
        >
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 16px",
            }}
          >
            {/* Laboratory Name */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Laboratory Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                style={inputStyle}
              />
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => { setCity(e.target.value); setError(""); }}
                style={inputStyle}
              />
            </div>

            {/* Region */}
            <div>
              <label style={labelStyle}>Region</label>
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value as Region); setCountry(""); }}
                style={selectStyle}
              >
                {Object.entries(REGIONS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Country *</label>
              <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); setError(""); }}
                style={selectStyle}
              >
                <option value="">Select country...</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Distributor */}
            <div>
              <label style={labelStyle}>Distributor</label>
              <input
                type="text"
                value={distributor}
                onChange={(e) => setDistributor(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Tubes per Day */}
            <div>
              <label style={labelStyle}>Tubes / Day</label>
              <input
                type="text"
                value={tubesPerDay}
                onChange={(e) => setTubesPerDay(e.target.value)}
                placeholder="e.g. 2,500"
                style={inputStyle}
              />
            </div>

            {/* Stage */}
            <div>
              <label style={labelStyle}>Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                style={selectStyle}
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* IVD Partner Involved */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>IVD Partner Involved</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <select
                  value={ivdPartner}
                  onChange={(e) => setIvdPartner(e.target.value)}
                  style={{ ...selectStyle, flex: 1 }}
                >
                  {IVD_PARTNERS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {ivdPartner === "Other" && (
                  <input
                    type="text"
                    value={ivdPartnerOther}
                    onChange={(e) => setIvdPartnerOther(e.target.value)}
                    placeholder="Specify partner..."
                    style={{ ...inputStyle, flex: 1 }}
                  />
                )}
              </div>
            </div>

            {/* Add Note */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Add Note</label>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add a new note to this prospect..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 60,
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 24,
              paddingTop: 16,
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
              type="submit"
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
