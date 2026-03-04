import type { Laboratory } from "./types";

export function calculateScore(lab: Omit<Laboratory, "score">): number {
  let score = 0;

  // Volume (25%)
  switch (lab.volume) {
    case "3,000+": score += 25; break;
    case "1,000 - 3,000": score += 18; break;
    case "500 - 1,000": score += 10; break;
    case "< 500": score += 5; break;
  }

  // Automation Status (20%)
  switch (lab.automation) {
    case "Legacy Inpeco (via OEM)": score += 20; break;
    case "No automation (manual)": score += 15; break;
    case "Partial pre-analytical (competitor)": score += 10; break;
    case "Competitor full system": score += 5; break;
    case "Mixed / Other": score += 8; break;
  }

  // RFP Status (20%)
  switch (lab.rfp) {
    case "RFP published": score += 20; break;
    case "RFP expected": score += 15; break;
    case "No RFP expected": score += 5; break;
    case "Unknown": score += 3; break;
  }

  // Stage Progression (15%)
  switch (lab.stage) {
    case "qualified": score += 15; break;
    case "exploring": score += 12; break;
    case "engaged": score += 8; break;
    case "mapped": score += 3; break;
    case "handed_off": score += 15; break;
  }

  // Engagement Recency (10%)
  if (lab.notes && lab.notes.length > 0) {
    const now = new Date();
    const mostRecent = new Date(lab.notes[0].date);
    const daysDiff = Math.floor((now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 30) score += 10;
    else if (daysDiff <= 60) score += 7;
    else if (daysDiff <= 90) score += 4;
    else score += 1;
  }

  // Product Fit (10%)
  if (lab.product && lab.product.length > 1) score += 10;
  else if (lab.product && lab.product.length === 1) score += 7;
  else score += 2;

  return Math.min(100, score);
}
