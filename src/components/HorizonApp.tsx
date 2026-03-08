"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/lib/UserContext";
import { getDefaultFilters, filterLabs } from "@/lib/filterLabs";
import LoginPage from "./LoginPage";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";
import DetailPanel from "./layout/DetailPanel";
import NewProspectModal from "./NewProspectModal";
import EditProspectModal from "./EditProspectModal";
import StageChangeModal from "./StageChangeModal";
import MapView from "./views/MapView";
import PipelineView from "./views/PipelineView";
import ListView from "./views/ListView";
import DashboardView from "./views/DashboardView";
import type { Laboratory, Filters, Stage } from "@/lib/types";

type View = "map" | "pipeline" | "list" | "dashboard";

const STAGE_SCORES: Record<Stage, number> = {
  mapped: 20,
  engaged: 40,
  exploring: 60,
  qualified: 80,
  handed_off: 100,
};

export default function HorizonApp() {
  const { user, getVisibleLabs, updateLab, deleteLab } = useUser();
  const [activeView, setActiveView] = useState<View>("map");
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [filters, setFilters] = useState<Filters>(getDefaultFilters());
  const [showNewProspect, setShowNewProspect] = useState(false);
  const [editingLab, setEditingLab] = useState<Laboratory | null>(null);
  const [stageChangeLab, setStageChangeLab] = useState<Laboratory | null>(null);
  const filtersInitialized = useRef(false);

  if (!user) return <LoginPage />;

  const visibleLabs = getVisibleLabs();
  const filteredLabs = filterLabs(visibleLabs, filters);

  // Initialize filters with all countries/distributors for Global Manager
  if (!filtersInitialized.current && user.role === "global_manager" && visibleLabs.length > 0) {
    filtersInitialized.current = true;
    const defaultFilters = getDefaultFilters(user.role, visibleLabs);
    setFilters(defaultFilters);
  }

  const handleCloseDetail = () => {
    setSelectedLab(null);
  };

  const handleEditSave = (updated: Laboratory) => {
    updateLab(updated);
    setSelectedLab(updated);
    setEditingLab(null);
  };

  const handleDelete = (lab: Laboratory) => {
    deleteLab(lab.id);
    setSelectedLab(null);
  };

  const handleBulkDelete = (ids: (string | number)[]) => {
    for (const id of ids) {
      deleteLab(id);
    }
  };

  const handleStageChange = (newStage: Stage, comment: string) => {
    if (!stageChangeLab) return;
    const newScore = STAGE_SCORES[newStage];
    const activityNote = {
      date: new Date().toISOString().slice(0, 10),
      author: user.name,
      text: comment,
      event: "Stage Change" as const,
      fromStage: stageChangeLab.stage,
      toStage: newStage,
      scoreUpdated: newScore,
    };
    const updated: Laboratory = {
      ...stageChangeLab,
      stage: newStage,
      score: newScore,
      notes: [activityNote, ...stageChangeLab.notes],
    };
    updateLab(updated);
    setSelectedLab(updated);
    setStageChangeLab(null);
  };

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
          onNewProspect={() => setShowNewProspect(true)}
          user={user}
          visibleLabs={visibleLabs}
        />

        <div
          className="flex-1 overflow-auto"
          style={{ padding: activeView === "map" ? 0 : 24 }}
        >
          {activeView === "map" && (
            <div className="h-full relative">
              <MapView
                labs={filteredLabs}
                selectedLab={selectedLab}
                onLabClick={setSelectedLab}
                onLabDeselect={handleCloseDetail}
              />
            </div>
          )}

          {activeView === "pipeline" && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <PipelineView
                labs={filteredLabs}
                onLabClick={setSelectedLab}
              />
            </div>
          )}

          {activeView === "list" && (
            <ListView
              labs={filteredLabs}
              onLabClick={setSelectedLab}
              onBulkDelete={handleBulkDelete}
            />
          )}

          {activeView === "dashboard" && (
            <DashboardView labs={filteredLabs} onLabClick={setSelectedLab} />
          )}
        </div>
      </div>

      {selectedLab && (
        <DetailPanel
          lab={selectedLab}
          onClose={handleCloseDetail}
          onEdit={setEditingLab}
          onDelete={handleDelete}
          onStageChange={setStageChangeLab}
        />
      )}

      {showNewProspect && (
        <NewProspectModal onClose={() => setShowNewProspect(false)} />
      )}

      {editingLab && (
        <EditProspectModal
          lab={editingLab}
          onSave={handleEditSave}
          onClose={() => setEditingLab(null)}
        />
      )}

      {stageChangeLab && (
        <StageChangeModal
          lab={stageChangeLab}
          onConfirm={handleStageChange}
          onClose={() => setStageChangeLab(null)}
        />
      )}
    </div>
  );
}
