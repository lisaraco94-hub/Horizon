"use client";

import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";
import DetailPanel from "./layout/DetailPanel";
import MapView from "./views/MapView";
import PipelineView from "./views/PipelineView";
import ListView from "./views/ListView";
import DashboardView from "./views/DashboardView";
import { MOCK_LABS } from "@/lib/constants";
import type { Laboratory, Filters } from "@/lib/types";

type View = "map" | "pipeline" | "list" | "dashboard";

export default function HorizonApp() {
  const [activeView, setActiveView] = useState<View>("map");
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [filters, setFilters] = useState<Filters>({ region: "all", stage: "all" });

  const filteredLabs = MOCK_LABS.filter((lab) => {
    if (filters.region !== "all" && lab.region !== filters.region) return false;
    if (filters.stage !== "all" && lab.stage !== filters.stage) return false;
    return true;
  });

  return (
    <div
      className="flex h-screen"
      style={{ background: "#F1F5F9", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          filters={filters}
          onFiltersChange={setFilters}
          labCount={filteredLabs.length}
        />

        {/* Content Area */}
        <div
          className="flex-1 overflow-auto"
          style={{ padding: activeView === "map" ? 0 : 24 }}
        >
          {activeView === "map" && (
            <div className="h-full relative">
              <MapView
                labs={MOCK_LABS}
                filters={filters}
                selectedLab={selectedLab}
                onLabClick={setSelectedLab}
              />
            </div>
          )}

          {activeView === "pipeline" && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <PipelineView
                labs={MOCK_LABS}
                filters={filters}
                onLabClick={setSelectedLab}
              />
            </div>
          )}

          {activeView === "list" && (
            <ListView
              labs={MOCK_LABS}
              filters={filters}
              onLabClick={setSelectedLab}
            />
          )}

          {activeView === "dashboard" && (
            <DashboardView
              labs={MOCK_LABS}
              onLabClick={setSelectedLab}
            />
          )}
        </div>
      </div>

      {selectedLab && (
        <DetailPanel lab={selectedLab} onClose={() => setSelectedLab(null)} />
      )}
    </div>
  );
}
