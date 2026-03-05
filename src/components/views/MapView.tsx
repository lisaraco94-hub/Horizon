"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { STAGES, REGIONS } from "@/lib/constants";
import type { Laboratory, Filters } from "@/lib/types";

interface MapViewProps {
  labs: Laboratory[];
  filters: Filters;
  selectedLab: Laboratory | null;
  onLabClick: (lab: Laboratory) => void;
  onLabDeselect: () => void;
}

function getStageColor(stage: string): string {
  return STAGES.find((s) => s.key === stage)?.color || "#94A3B8";
}

function getStageLabel(stage: string): string {
  return STAGES.find((s) => s.key === stage)?.label || stage;
}

function markerSize(score: number): number {
  if (score >= 80) return 16;
  if (score >= 60) return 12;
  return 9;
}

export default function MapView({
  labs,
  filters,
  selectedLab,
  onLabClick,
  onLabDeselect,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);
  const selectedLabRef = useRef<Laboratory | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Keep ref in sync so event handlers always see latest value
  selectedLabRef.current = selectedLab;

  const filteredLabs = labs.filter((lab) => {
    if (filters.region && filters.region !== "all" && lab.region !== filters.region)
      return false;
    if (filters.stage && filters.stage !== "all" && lab.stage !== filters.stage)
      return false;
    return true;
  });

  // Stable callback refs to avoid marker re-creation on every render
  const onLabClickRef = useRef(onLabClick);
  onLabClickRef.current = onLabClick;

  const buildPopupHTML = useCallback((lab: Laboratory) => {
    const color = getStageColor(lab.stage);
    const rfpBadge =
      lab.rfp === "RFP published"
        ? '<span style="color:#EF4444;font-weight:600;">RFP Published</span>'
        : lab.rfp === "RFP expected"
        ? '<span style="color:#F59E0B;font-weight:600;">RFP Expected</span>'
        : `<span style="color:#94A3B8;">${lab.rfp}</span>`;

    return `
      <div style="font-family:'DM Sans',sans-serif;padding:4px 2px;min-width:180px;">
        <div style="font-weight:700;font-size:13px;color:#0F172A;margin-bottom:4px;">${lab.name}</div>
        <div style="color:#64748B;font-size:11px;margin-bottom:6px;">${lab.city}, ${lab.country}</div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;">
          <span style="background:${color}18;color:${color};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">${getStageLabel(lab.stage)}</span>
          <span style="font-family:'Space Mono',monospace;font-weight:700;font-size:12px;color:${lab.score >= 80 ? "#10B981" : lab.score >= 60 ? "#F59E0B" : "#94A3B8"};">${lab.score}</span>
        </div>
        <div style="font-size:11px;color:#64748B;margin-bottom:2px;">Distributor: <strong style="color:#334155;">${lab.distributor}</strong></div>
        <div style="font-size:11px;">${rfpBadge}</div>
      </div>
    `;
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: [
              "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
          },
        },
        layers: [
          {
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [30, 20],
      zoom: 1.8,
      minZoom: 1,
      maxZoom: 16,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    map.on("load", () => setMapLoaded(true));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear previous
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    hoverPopupRef.current?.remove();
    hoverPopupRef.current = null;

    // Shared hover popup instance
    const hoverPopup = new maplibregl.Popup({
      offset: 14,
      closeButton: false,
      closeOnClick: false,
      className: "horizon-popup",
    });
    hoverPopupRef.current = hoverPopup;

    filteredLabs.forEach((lab) => {
      const size = markerSize(lab.score);
      const color = getStageColor(lab.stage);
      const isSelected = selectedLab?.id === lab.id;

      const el = document.createElement("div");
      el.style.width = `${isSelected ? size + 8 : size}px`;
      el.style.height = `${isSelected ? size + 8 : size}px`;
      el.style.borderRadius = "50%";
      el.style.background = color;
      el.style.border = isSelected
        ? "3px solid #fff"
        : "2px solid rgba(255,255,255,0.3)";
      el.style.boxShadow = isSelected
        ? `0 0 14px ${color}80`
        : `0 0 6px ${color}60`;
      el.style.cursor = "pointer";
      el.style.transition = "all 0.2s ease";

      if (lab.stage === "qualified" || lab.stage === "exploring") {
        el.style.animation = "pulse-ring 2s infinite";
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lab.lng, lab.lat])
        .addTo(mapRef.current!);

      // HOVER: show tooltip ONLY when no lab is selected
      el.addEventListener("mouseenter", () => {
        if (selectedLabRef.current) return; // panel open → no tooltip
        hoverPopup.setHTML(buildPopupHTML(lab));
        hoverPopup.setLngLat([lab.lng, lab.lat]).addTo(mapRef.current!);
      });

      el.addEventListener("mouseleave", () => {
        hoverPopup.remove();
      });

      // CLICK: select lab and hide any tooltip
      el.addEventListener("click", () => {
        hoverPopup.remove();
        onLabClickRef.current(lab);
      });

      markersRef.current.push(marker);
    });
  }, [filteredLabs, selectedLab, mapLoaded, buildPopupHTML]);

  // Fly to selected lab
  useEffect(() => {
    if (!mapRef.current || !selectedLab || !mapLoaded) return;
    mapRef.current.flyTo({
      center: [selectedLab.lng, selectedLab.lat],
      zoom: 5,
      duration: 1200,
    });
  }, [selectedLab, mapLoaded]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ borderRadius: 12 }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Stage legend */}
      <div
        className="absolute flex gap-4"
        style={{
          bottom: 16,
          left: 16,
          background: "rgba(10,22,40,0.88)",
          padding: "8px 14px",
          borderRadius: 8,
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        {STAGES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.color,
              }}
            />
            <span
              style={{
                color: "#94A3B8",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Region counters */}
      <div
        className="absolute flex gap-2"
        style={{ top: 16, right: 16, zIndex: 10 }}
      >
        {Object.entries(REGIONS).map(([key, r]) => {
          const count = filteredLabs.filter((l) => l.region === key).length;
          return (
            <div
              key={key}
              style={{
                background: "rgba(10,22,40,0.88)",
                padding: "6px 12px",
                borderRadius: 8,
                borderLeft: `3px solid ${r.color}`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  color: r.color,
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {count}
              </div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: 10,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {r.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inject pulse keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 currentColor; }
          70% { box-shadow: 0 0 0 8px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .maplibregl-popup-content {
          border-radius: 10px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
          padding: 10px 14px !important;
        }
        .maplibregl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
