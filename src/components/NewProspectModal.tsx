"use client";

import { useState, type FormEvent } from "react";
import { useUser } from "@/lib/UserContext";
import { calculateScore } from "@/lib/scoring";
import {
  REGIONS,
  REGION_TARGET_MARKETS,
  STAGES,
  INSTITUTION_TYPES,
  VOLUME_RANGES,
  AUTOMATION_STATUS,
  IVD_VENDORS,
  IVD_PARTNERS,
  PRODUCTS,
  RFP_STATUS,
} from "@/lib/constants";
import type { Laboratory, Region, Stage } from "@/lib/types";

// Approximate city coordinates for geocoding fallback
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  Brazil: { lat: -14.24, lng: -51.93 },
  Argentina: { lat: -34.6, lng: -58.38 },
  Chile: { lat: -33.45, lng: -70.67 },
  Mexico: { lat: 19.43, lng: -99.13 },
  Colombia: { lat: 4.71, lng: -74.07 },
  Peru: { lat: -12.05, lng: -77.04 },
  Ecuador: { lat: -0.18, lng: -78.47 },
  Uruguay: { lat: -34.88, lng: -56.17 },
  Paraguay: { lat: -25.26, lng: -57.58 },
  Bolivia: { lat: -16.49, lng: -68.12 },
  "Costa Rica": { lat: 9.93, lng: -84.09 },
  Panama: { lat: 8.98, lng: -79.52 },
  Guatemala: { lat: 14.63, lng: -90.51 },
  "Dominican Republic": { lat: 18.49, lng: -69.93 },
  "Puerto Rico": { lat: 18.47, lng: -66.11 },
  "El Salvador": { lat: 13.69, lng: -89.22 },
  Honduras: { lat: 14.07, lng: -87.19 },
  Nicaragua: { lat: 12.11, lng: -86.24 },
  China: { lat: 35.86, lng: 104.2 },
  Poland: { lat: 52.23, lng: 21.01 },
  Romania: { lat: 44.43, lng: 26.1 },
  Slovakia: { lat: 48.15, lng: 17.11 },
  "Czech Republic": { lat: 50.07, lng: 14.44 },
  Hungary: { lat: 47.5, lng: 19.04 },
  Turkey: { lat: 39.92, lng: 32.85 },
  "Saudi Arabia": { lat: 24.71, lng: 46.67 },
  UAE: { lat: 25.2, lng: 55.27 },
  India: { lat: 20.59, lng: 78.96 },
  Thailand: { lat: 13.76, lng: 100.5 },
  "South Africa": { lat: -33.92, lng: 18.42 },
  Korea: { lat: 37.57, lng: 126.98 },
  Japan: { lat: 35.68, lng: 139.69 },
  Australia: { lat: -33.87, lng: 151.21 },
  "New Zealand": { lat: -36.85, lng: 174.76 },
};

interface NewProspectModalProps {
  onClose: () => void;
}

export default function NewProspectModal({ onClose }: NewProspectModalProps) {
  const { user, addLab } = useUser();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState<Region>(user?.region || "LATAM");
  const [country, setCountry] = useState(user?.country || "");
  const [distributor, setDistributor] = useState(user?.distributor || "");
  const [type, setType] = useState(INSTITUTION_TYPES[0]);
  const [volume, setVolume] = useState(VOLUME_RANGES[0]);
  const [tubesPerDay, setTubesPerDay] = useState("");
  const [automation, setAutomation] = useState(AUTOMATION_STATUS[0]);
  const [ivd, setIvd] = useState<string[]>([]);
  const [ivdPartner, setIvdPartner] = useState("None");
  const [ivdPartnerOther, setIvdPartnerOther] = useState("");
  const [product, setProduct] = useState<string[]>([]);
  const [rfp, setRfp] = useState(RFP_STATUS[0]);
  const [rfpDate, setRfpDate] = useState("");
  const [stage, setStage] = useState<Stage>("mapped");
  const [notesText, setNotesText] = useState("");
  const [error, setError] = useState("");

  const availableCountries = REGION_TARGET_MARKETS[region] || [];

  const toggleItem = (
    arr: string[],
    setArr: (v: string[]) => void,
    item: string
  ) => {
    setArr(
      arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !country) {
      setError("Laboratory name, city, and country are required.");
      return;
    }

    const coords = COUNTRY_COORDS[country] || { lat: 0, lng: 0 };
    const resolvedPartner =
      ivdPartner === "Other" ? ivdPartnerOther.trim() || "Other" : ivdPartner;

    const initialNotes = notesText.trim()
      ? [
          {
            date: new Date().toISOString().slice(0, 10),
            author: user?.name || "Unknown",
            text: notesText.trim(),
          },
        ]
      : [];

    const newLab: Omit<Laboratory, "score"> = {
      id: Date.now(),
      name: name.trim(),
      city: city.trim(),
      country,
      region,
      lat: coords.lat + (Math.random() - 0.5) * 2,
      lng: coords.lng + (Math.random() - 0.5) * 2,
      type,
      volume,
      tubesPerDay: tubesPerDay.trim() || undefined,
      automation,
      ivd,
      ivdPartnerInvolved: resolvedPartner,
      stage,
      product,
      rfp,
      rfpDate: rfpDate || undefined,
      notes: initialNotes,
      distributor: distributor.trim(),
    };

    const score = calculateScore(newLab);
    addLab({ ...newLab, score });
    onClose();
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
        zIndex: 200,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 560,
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
              New Prospect
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94A3B8",
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 2,
              }}
            >
              Score will be calculated automatically
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

        {/* Body — scrollable */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
          }}
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
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Hospital Central de São Paulo"
                style={inputStyle}
              />
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setError("");
                }}
                placeholder="e.g. São Paulo"
                style={inputStyle}
              />
            </div>

            {/* Region */}
            <div>
              <label style={labelStyle}>Region</label>
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value as Region);
                  setCountry("");
                }}
                style={selectStyle}
              >
                {Object.entries(REGIONS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Country *</label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setError("");
                }}
                style={selectStyle}
              >
                <option value="">Select country...</option>
                {availableCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Distributor */}
            <div>
              <label style={labelStyle}>
                Distributor
                {user?.role === "distributor" && (
                  <span style={{ color: "#10B981", marginLeft: 6 }}>
                    (auto-filled)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={distributor}
                onChange={(e) => setDistributor(e.target.value)}
                placeholder="Distributor name"
                style={inputStyle}
              />
            </div>

            {/* Institution Type */}
            <div>
              <label style={labelStyle}>Institution Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={selectStyle}
              >
                {INSTITUTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Volume */}
            <div>
              <label style={labelStyle}>Estimated Volume (tubes/day)</label>
              <select
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                style={selectStyle}
              >
                {VOLUME_RANGES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Tubes per Day */}
            <div>
              <label style={labelStyle}>Tubes / Day (exact)</label>
              <input
                type="text"
                value={tubesPerDay}
                onChange={(e) => setTubesPerDay(e.target.value)}
                placeholder="e.g. 2,500"
                style={inputStyle}
              />
            </div>

            {/* Automation */}
            <div>
              <label style={labelStyle}>Automation Installed</label>
              <select
                value={automation}
                onChange={(e) => setAutomation(e.target.value)}
                style={selectStyle}
              >
                {AUTOMATION_STATUS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
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
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* RFP */}
            <div>
              <label style={labelStyle}>RFP Status</label>
              <select
                value={rfp}
                onChange={(e) => setRfp(e.target.value)}
                style={selectStyle}
              >
                {RFP_STATUS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* RFP Date */}
            <div>
              <label style={labelStyle}>RFP Expected Date</label>
              <input
                type="month"
                value={rfpDate}
                onChange={(e) => setRfpDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* IVD Vendors — multi-select chips */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>IVD Vendors Installed</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {IVD_VENDORS.map((v) => {
                  const active = ivd.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleItem(ivd, setIvd, v)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 14,
                        fontSize: 11,
                        fontWeight: active ? 600 : 400,
                        border: active
                          ? "1px solid #3B82F6"
                          : "1px solid #E2E8F0",
                        background: active ? "#EFF6FF" : "#F8FAFC",
                        color: active ? "#2563EB" : "#64748B",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
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
                    <option key={p} value={p}>
                      {p}
                    </option>
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

            {/* Product Interest — multi-select chips */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Product Interest</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {PRODUCTS.map((p) => {
                  const active = product.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleItem(product, setProduct, p)}
                      style={{
                        padding: "4px 14px",
                        borderRadius: 14,
                        fontSize: 11,
                        fontWeight: active ? 600 : 400,
                        border: active
                          ? "1px solid #10B981"
                          : "1px solid #E2E8F0",
                        background: active ? "#ECFDF5" : "#F8FAFC",
                        color: active ? "#059669" : "#64748B",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Initial Notes</label>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add initial notes about this prospect..."
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
              Create Prospect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
