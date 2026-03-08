import { STAGES, REGIONS } from "./constants";
import type { Laboratory, Stage } from "./types";

const STAGE_ORDER: Stage[] = ["mapped", "engaged", "exploring", "qualified", "handed_off"];

function stageLabel(key: string): string {
  return STAGES.find((s) => s.key === key)?.label || key;
}

function regionLabel(key: string): string {
  return REGIONS[key as keyof typeof REGIONS]?.label || key;
}

export function generateIntelligenceBriefing(labs: Laboratory[]): string {
  if (labs.length === 0) return "No prospect data available for analysis.";

  const sections: string[] = [];

  // ── Strategic Signals ──
  const signals: string[] = [];

  // RFP signals
  const publishedRfps = labs.filter((l) => l.rfp === "RFP published");
  const expectedRfps = labs.filter((l) => l.rfp === "RFP expected" && l.rfpDate);
  if (publishedRfps.length > 0) {
    const names = publishedRfps.map((l) => `${l.name} (${l.country})`).join(", ");
    signals.push(`**Active RFPs** require immediate attention: ${names}.`);
  }
  if (expectedRfps.length > 0) {
    const nearest = expectedRfps.sort((a, b) => a.rfpDate!.localeCompare(b.rfpDate!))[0];
    signals.push(`**${expectedRfps.length} upcoming RFPs** detected — nearest deadline is ${nearest.name} (${nearest.rfpDate}).`);
  }

  // Legacy Inpeco upgrade path
  const legacyInpeco = labs.filter((l) => l.automation.includes("Legacy Inpeco"));
  if (legacyInpeco.length > 0) {
    signals.push(`**${legacyInpeco.length} legacy Inpeco installations** identified as strategic upgrade opportunities.`);
  }

  if (signals.length > 0) {
    sections.push("## Strategic Signals\n\n" + signals.map((s) => `• ${s}`).join("\n"));
  }

  // ── Regional Dynamics ──
  const dynamics: string[] = [];
  const regionData = Object.keys(REGIONS).map((key) => {
    const regionLabs = labs.filter((l) => l.region === key);
    const avg = regionLabs.length
      ? Math.round(regionLabs.reduce((a, l) => a + l.score, 0) / regionLabs.length)
      : 0;
    return { key, label: regionLabel(key), count: regionLabs.length, avg, labs: regionLabs };
  }).filter((r) => r.count > 0);

  regionData.sort((a, b) => b.avg - a.avg);

  if (regionData.length >= 2) {
    const top = regionData.slice(0, 2);
    dynamics.push(`**${top.map((r) => r.label).join(" and ")}** show the strongest pipeline development with the highest average prospect scores.`);

    const low = regionData.filter((r) => r.avg < regionData[0].avg - 15);
    if (low.length > 0) {
      dynamics.push(`**${low.map((r) => r.label).join(", ")}** ${low.length > 1 ? "have" : "has"} comparable prospect volume but significantly lower average score — engagement acceleration needed.`);
    }
  }

  // Regions with no qualified/exploring
  const weakRegions = regionData.filter(
    (r) => r.labs.every((l) => l.stage === "mapped")
  );
  if (weakRegions.length > 0) {
    dynamics.push(`**${weakRegions.map((r) => r.label).join(", ")}**: all prospects remain at Mapped stage — distributor activation recommended.`);
  }

  if (dynamics.length > 0) {
    sections.push("## Regional Dynamics\n\n" + dynamics.slice(0, 3).map((s) => `• ${s}`).join("\n"));
  }

  // ── Pipeline Velocity ──
  const velocity: string[] = [];

  // Countries with recent stage changes
  const countriesWithChanges: Record<string, number> = {};
  const countriesLastChange: Record<string, string> = {};
  for (const lab of labs) {
    for (const note of lab.notes) {
      if (note.event === "Stage Change" && note.fromStage && note.toStage) {
        const noteDate = new Date(note.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (noteDate >= thirtyDaysAgo) {
          countriesWithChanges[lab.country] = (countriesWithChanges[lab.country] || 0) + 1;
        }
        if (!countriesLastChange[lab.country] || note.date > countriesLastChange[lab.country]) {
          countriesLastChange[lab.country] = note.date;
        }
      }
    }
  }

  const fastCountries = Object.entries(countriesWithChanges)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);
  if (fastCountries.length > 0) {
    velocity.push(`**${fastCountries.map(([c]) => c).join(", ")}** ${fastCountries.length > 1 ? "show" : "shows"} the fastest pipeline progression with stage upgrades recorded in the last 30 days.`);
  }

  // Stagnant prospects — labs with no activity in last 60 days
  const stagnantByRegion: Record<string, number> = {};
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  for (const lab of labs) {
    if (lab.stage === "handed_off") continue;
    const lastActivity = lab.notes.length > 0
      ? new Date(lab.notes[0].date)
      : lab.createdAt ? new Date(lab.createdAt) : sixtyDaysAgo;
    if (lastActivity < sixtyDaysAgo) {
      const rl = regionLabel(lab.region);
      stagnantByRegion[rl] = (stagnantByRegion[rl] || 0) + 1;
    }
  }
  const stagnant = Object.entries(stagnantByRegion);
  if (stagnant.length > 0) {
    velocity.push(`**${stagnant.map(([r]) => r).join(", ")}** prospects remain largely stagnant with no stage changes recorded recently.`);
  }

  // Regions adding new prospects
  const recentCreations: Record<string, number> = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  for (const lab of labs) {
    if (lab.createdAt && new Date(lab.createdAt) >= thirtyDaysAgo) {
      const rl = regionLabel(lab.region);
      recentCreations[rl] = (recentCreations[rl] || 0) + 1;
    }
  }
  const activeProspecting = Object.entries(recentCreations).sort(([, a], [, b]) => b - a);
  if (activeProspecting.length > 0) {
    velocity.push(`**${activeProspecting[0][0]}** continues to generate new mapped laboratories indicating strong prospecting activity.`);
  }

  if (velocity.length > 0) {
    sections.push("## Pipeline Velocity\n\n" + velocity.slice(0, 3).map((s) => `• ${s}`).join("\n"));
  }

  // ── Pipeline Risks ──
  const risks: string[] = [];

  const movedToSf = labs.filter((l) => l.stage === "handed_off").length;
  if (movedToSf === 0) {
    risks.push(`**No prospects** have yet progressed to "Moved to Salesforce" — the pipeline has not yet produced conversion outcomes.`);
  }

  // Prospects stuck in early stages
  const earlyStuck = labs.filter((l) => {
    if (l.stage !== "mapped" && l.stage !== "engaged") return false;
    const lastDate = l.notes.length > 0 ? l.notes[0].date : l.createdAt;
    if (!lastDate) return true;
    const d = new Date(lastDate);
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    return d < fortyFiveDaysAgo;
  });
  if (earlyStuck.length > 0) {
    risks.push(`**${earlyStuck.length} prospect${earlyStuck.length > 1 ? "s" : ""}** remain in early stages without recent activity — review needed to avoid pipeline stagnation.`);
  }

  // Low-scoring regions
  const lowScoreRegions = regionData.filter((r) => r.avg < 50 && r.count >= 2);
  if (lowScoreRegions.length > 0) {
    risks.push(`**${lowScoreRegions.map((r) => r.label).join(", ")}** ${lowScoreRegions.length > 1 ? "have" : "has"} an average score below 50 — deeper qualification work may be needed.`);
  }

  if (risks.length > 0) {
    sections.push("## Pipeline Risks\n\n" + risks.slice(0, 3).map((s) => `• ${s}`).join("\n"));
  }

  // ── Distributor Performance ──
  const distPerf: string[] = [];
  const distMap: Record<string, Laboratory[]> = {};
  for (const lab of labs) {
    if (!lab.distributor) continue;
    if (!distMap[lab.distributor]) distMap[lab.distributor] = [];
    distMap[lab.distributor].push(lab);
  }

  const distStats = Object.entries(distMap).map(([name, dlabs]) => {
    const avg = Math.round(dlabs.reduce((a, l) => a + l.score, 0) / dlabs.length);
    const hasQualified = dlabs.some((l) => l.stage === "qualified" || l.stage === "handed_off");
    const hasProgression = dlabs.some((l) =>
      l.notes.some((n) => n.event === "Stage Change")
    );
    const region = regionLabel(dlabs[0].region);
    return { name, count: dlabs.length, avg, hasQualified, hasProgression, region };
  });

  // Strongest distributors
  const strong = distStats
    .filter((d) => d.hasQualified || d.avg >= 70)
    .sort((a, b) => b.avg - a.avg);
  if (strong.length > 0) {
    const top = strong[0];
    distPerf.push(`**${top.name}** shows the strongest pipeline development in ${top.region} with prospects progressing to advanced stages.`);
  }

  // Weak distributors
  const weak = distStats.filter((d) => d.avg < 45 && d.count >= 1 && !d.hasQualified);
  if (weak.length > 0) {
    distPerf.push(`**${weak.map((d) => d.name).join(", ")}** ${weak.length > 1 ? "show" : "shows"} limited pipeline traction — consider joint engagement plans to accelerate progression.`);
  }

  // Distributors with no stage progression
  const noProgression = distStats.filter((d) => !d.hasProgression && d.count >= 1);
  if (noProgression.length > 0) {
    distPerf.push(`**${noProgression.map((d) => d.name).join(", ")}**: no stage changes recorded — distributor activation or review recommended.`);
  }

  if (distPerf.length > 0) {
    sections.push("## Distributor Performance\n\n" + distPerf.slice(0, 3).map((s) => `• ${s}`).join("\n"));
  }

  // ── Stalled Opportunities ──
  const stalled: string[] = [];
  const now = new Date();
  for (const lab of labs) {
    if (lab.stage === "handed_off") continue;
    const lastDate = lab.notes.length > 0 ? lab.notes[0].date : lab.createdAt;
    if (!lastDate) continue;
    const last = new Date(lastDate);
    const daysSince = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 60) {
      stalled.push(
        `**${lab.name}** has remained in ${stageLabel(lab.stage)} stage for ${daysSince} days without recent activity.`
      );
    }
  }

  if (stalled.length > 0) {
    sections.push("## Stalled Opportunities\n\n" + stalled.slice(0, 3).map((s) => `• ${s}`).join("\n"));
  }

  // ── Recommended Actions ──
  const actions: string[] = [];

  if (publishedRfps.length > 0 || expectedRfps.length > 0) {
    actions.push(`Prioritize **RFP preparation** for upcoming deadlines to maximize conversion rate.`);
  }

  const slowRegions = regionData.filter(
    (r) => r.avg < regionData[0].avg - 10 && r.count > 0
  );
  if (slowRegions.length > 0) {
    actions.push(`Support **distributor engagement** in ${slowRegions.map((r) => r.label).join(", ")} to accelerate pipeline progression.`);
  }

  // Coverage gaps
  const coveredCountries = new Set(labs.map((l) => l.country));
  const allRegionKeys = Object.keys(REGIONS);
  const regionsWithGaps = allRegionKeys.filter((rk) => {
    const rLabs = labs.filter((l) => l.region === rk);
    return rLabs.length > 0 && rLabs.length < 3;
  });
  if (regionsWithGaps.length > 0) {
    actions.push(`Activate **prospecting in uncovered export markets** — regions with thin coverage: ${regionsWithGaps.map((r) => regionLabel(r)).join(", ")}.`);
  }

  if (legacyInpeco.length > 0) {
    actions.push(`Launch **upgrade campaign** targeting legacy Inpeco installations before OEM contract renewals.`);
  }

  if (actions.length > 0) {
    sections.push("## Recommended Actions\n\n" + actions.slice(0, 3).map((s) => `• ${s}`).join("\n"));
  }

  return sections.join("\n\n");
}
