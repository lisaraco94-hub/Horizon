import type { Laboratory } from "./types";

export function calculateScore(lab: Omit<Laboratory, "score">): number {
  let score = 0;

  // Product Fit (30%) — highest weight
  const hasFlexLab = lab.product?.includes("FlexLab X");
  const hasProTube = lab.product?.includes("ProTube");
  const hasFlexPath = lab.product?.includes("FlexPath");

  if (hasFlexLab && hasProTube) score += 30;       // both strategic products
  else if (hasFlexLab) score += 22;                 // primary product only
  else if (hasProTube || hasFlexPath) score += 14;  // secondary product
  else score += 3;                                  // no product interest

  // Volume (20%)
  switch (lab.volume) {
    case "3,000+": score += 20; break;
    case "1,000 - 3,000": score += 14; break;
    case "500 - 1,000": score += 8; break;
    case "< 500": score += 4; break;
  }

  // Automation Status (18%)
  switch (lab.automation) {
    case "Legacy Inpeco (via OEM)": score += 18; break;
    case "No automation (manual)": score += 14; break;
    case "Partial pre-analytical (competitor)": score += 9; break;
    case "Competitor full system": score += 4; break;
    case "Mixed / Other": score += 7; break;
  }

  // Stage Progression (15%)
  switch (lab.stage) {
    case "qualified": score += 15; break;
    case "exploring": score += 12; break;
    case "engaged": score += 8; break;
    case "mapped": score += 3; break;
    case "handed_off": score += 15; break;
  }

  // RFP Status (10%) — reduced weight
  switch (lab.rfp) {
    case "RFP published": score += 10; break;
    case "RFP expected": score += 7; break;
    case "No RFP expected": score += 3; break;
    case "Unknown": score += 1; break;
  }

  // Engagement Recency (7%)
  if (lab.notes && lab.notes.length > 0) {
    const now = new Date();
    const mostRecent = new Date(lab.notes[0].date);
    const daysDiff = Math.floor(
      (now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 30) score += 7;
    else if (daysDiff <= 60) score += 5;
    else if (daysDiff <= 90) score += 3;
    else score += 1;
  }

  return Math.min(100, score);
}
