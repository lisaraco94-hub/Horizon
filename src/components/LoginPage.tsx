"use client";

import { useState } from "react";
import { useUser } from "@/lib/UserContext";
import { DEMO_USERS } from "@/lib/constants";

export default function LoginPage() {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(username.trim())) {
      setError(true);
    }
  };

  const handleQuickLogin = (u: string) => {
    login(u);
  };

  const roleLabels: Record<string, string> = {
    global_manager: "Global Manager",
    regional_manager: "Regional Manager",
    distributor: "Distributor",
  };

  const roleColors: Record<string, string> = {
    global_manager: "#6366F1",
    regional_manager: "#3B82F6",
    distributor: "#10B981",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A1628 0%, #1E293B 50%, #0F172A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "40px 36px",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #3B82F6, #10B981)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              H
            </span>
          </div>
          <div
            style={{
              color: "#F8FAFC",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            HORIZON
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: 11,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Global Distribution Intelligence Platform
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              color: "#94A3B8",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
            placeholder="Enter your username..."
            autoFocus
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 10,
              border: error
                ? "1px solid #EF4444"
                : "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#F8FAFC",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              boxSizing: "border-box",
              transition: "border 0.2s",
            }}
            onFocus={(e) => {
              if (!error)
                e.currentTarget.style.border =
                  "1px solid rgba(59,130,246,0.5)";
            }}
            onBlur={(e) => {
              if (!error)
                e.currentTarget.style.border =
                  "1px solid rgba(255,255,255,0.1)";
            }}
          />
          {error && (
            <div
              style={{
                color: "#EF4444",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              Username not recognized. Try one of the options below.
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 16,
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Sign In
          </button>
        </form>

        {/* Quick-access demo users */}
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              color: "#475569",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Demo accounts — quick access
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
                onClick={() => handleQuickLogin(u.username)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.border =
                    `1px solid ${roleColors[u.role]}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.06)";
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `${roleColors[u.role]}25`,
                    border: `1px solid ${roleColors[u.role]}50`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      color: roleColors[u.role],
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {u.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "#E2E8F0",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {u.username}
                  </div>
                  <div
                    style={{ color: "#64748B", fontSize: 11, marginTop: 1 }}
                  >
                    {u.name}
                  </div>
                </div>
                <span
                  style={{
                    background: `${roleColors[u.role]}20`,
                    color: roleColors[u.role],
                    padding: "3px 10px",
                    borderRadius: 12,
                    fontSize: 10,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {roleLabels[u.role]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
