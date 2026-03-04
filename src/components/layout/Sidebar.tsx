"use client";

type View = "map" | "pipeline" | "list" | "dashboard";

const NAV_ITEMS: { key: View; label: string; icon: string }[] = [
  { key: "map", label: "Global Map", icon: "🌍" },
  { key: "pipeline", label: "Pipeline", icon: "◧" },
  { key: "list", label: "List View", icon: "☰" },
  { key: "dashboard", label: "Dashboard", icon: "◫" },
];

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div
      className="flex flex-col shrink-0"
      style={{ width: 220, background: "#0A1628" }}
    >
      {/* Brand */}
      <div
        className="px-5 pt-6 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3B82F6, #10B981)",
            }}
          >
            <span
              className="text-white font-bold"
              style={{ fontSize: 16, fontFamily: "'Space Mono', monospace" }}
            >
              H
            </span>
          </div>
          <div>
            <div
              style={{
                color: "#F8FAFC",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.05em",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              HORIZON
            </div>
            <div
              style={{
                color: "#475569",
                fontSize: 8,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Global Distribution Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2.5 py-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className="flex items-center gap-2.5 w-full text-left mb-0.5 transition-all duration-150"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                color: isActive ? "#60A5FA" : "#64748B",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="text-center" style={{ fontSize: 16, width: 22 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User block */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366F1, #EC4899)",
            }}
          >
            <span className="text-white" style={{ fontSize: 11, fontWeight: 700 }}>
              GB
            </span>
          </div>
          <div>
            <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 500 }}>
              Global Business Mgr
            </div>
            <div style={{ color: "#475569", fontSize: 10 }}>System Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}
