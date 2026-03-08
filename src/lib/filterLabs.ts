import type { Laboratory, Filters } from "./types";
import { STAGES } from "./constants";

const ALL_REGIONS = ["LATAM", "CHINA", "EAST_EU", "APAC"];
const ALL_STAGES = STAGES.map((s) => s.key);

export function getDefaultFilters(): Filters {
  return {
    regions: [...ALL_REGIONS],
    stages: ALL_STAGES.filter((s) => s !== "handed_off"),
    createdTime: "all",
  };
}

export function filterLabs(labs: Laboratory[], filters: Filters): Laboratory[] {
  return labs.filter((lab) => {
    if (filters.regions.length > 0 && !filters.regions.includes(lab.region)) return false;
    if (filters.stages.length > 0 && !filters.stages.includes(lab.stage)) return false;

    if (filters.createdTime !== "all" && lab.createdAt) {
      const created = new Date(lab.createdAt);
      const now = new Date();
      if (filters.createdTime === "last_week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (created < weekAgo) return false;
      } else if (filters.createdTime === "last_month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (created < monthAgo) return false;
      }
    }

    return true;
  });
}
