import { REGION_TARGET_MARKETS, DIRECT_MARKETS, REGIONS } from "./constants";
import type { Laboratory, Region, Stage, CountryCoverage, CoverageCategory } from "./types";

export function computeCoverage(labs: Laboratory[]): CountryCoverage[] {
  const allExportCountries: { country: string; region: Region }[] = [];

  for (const [regionKey, countries] of Object.entries(REGION_TARGET_MARKETS)) {
    for (const country of countries) {
      if (!DIRECT_MARKETS.includes(country)) {
        allExportCountries.push({ country, region: regionKey as Region });
      }
    }
  }

  return allExportCountries.map(({ country, region }) => {
    const countryLabs = labs.filter((l) => l.country === country);
    const prospectCount = countryLabs.length;
    const avgScore = prospectCount
      ? Math.round(countryLabs.reduce((a, l) => a + l.score, 0) / prospectCount)
      : 0;

    const stageDistribution: Record<Stage, number> = {
      mapped: 0,
      engaged: 0,
      exploring: 0,
      qualified: 0,
      handed_off: 0,
    };
    for (const lab of countryLabs) {
      stageDistribution[lab.stage]++;
    }

    let category: CoverageCategory;
    if (prospectCount === 0) category = "No Coverage";
    else if (prospectCount <= 2) category = "Early Coverage";
    else category = "Active Pipeline";

    return { country, region, prospectCount, avgScore, stageDistribution, category };
  });
}

export function generateCoverageBriefing(labs: Laboratory[]): string {
  const coverage = computeCoverage(labs);

  const noCoverage = coverage.filter((c) => c.category === "No Coverage");
  const earlyCoverage = coverage.filter((c) => c.category === "Early Coverage");
  const activePipeline = coverage.filter((c) => c.category === "Active Pipeline");

  const totalMarkets = coverage.length;
  const coveredMarkets = totalMarkets - noCoverage.length;
  const coverageRate = Math.round((coveredMarkets / totalMarkets) * 100);

  // Group no-coverage by region
  const noCoverageByRegion: Record<string, string[]> = {};
  for (const c of noCoverage) {
    const regionLabel = REGIONS[c.region]?.label || c.region;
    if (!noCoverageByRegion[regionLabel]) noCoverageByRegion[regionLabel] = [];
    noCoverageByRegion[regionLabel].push(c.country);
  }

  // Top early coverage prospects
  const topEarly = [...earlyCoverage].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);

  let text = `## Export Market Coverage Analysis\n\n`;
  text += `**Coverage Rate**: ${coveredMarkets} of ${totalMarkets} export markets have at least one prospect (${coverageRate}% coverage).\n\n`;
  text += `**Active Pipeline**: ${activePipeline.length} markets with 3+ prospects — ${activePipeline.map((c) => c.country).join(", ") || "none yet"}.\n`;
  text += `**Early Coverage**: ${earlyCoverage.length} markets with 1-2 prospects building initial presence.\n`;
  text += `**No Coverage**: ${noCoverage.length} markets with zero prospects — these represent expansion opportunities.\n\n`;

  if (Object.keys(noCoverageByRegion).length > 0) {
    text += `**White-Space Markets by Region**:\n`;
    for (const [regionLabel, countries] of Object.entries(noCoverageByRegion)) {
      text += `• **${regionLabel}**: ${countries.join(", ")}\n`;
    }
    text += `\n`;
  }

  if (topEarly.length > 0) {
    text += `**Emerging Markets** (early coverage, highest scores):\n`;
    for (const c of topEarly) {
      const stages = Object.entries(c.stageDistribution)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${k}`)
        .join(", ");
      text += `• **${c.country}** — ${c.prospectCount} prospect${c.prospectCount > 1 ? "s" : ""}, avg score ${c.avgScore} (${stages})\n`;
    }
    text += `\n`;
  }

  text += `**Recommendation**: Focus expansion efforts on high-potential white-space markets. Priority regions with zero coverage should be targeted through distributor network activation and trade-show engagement.`;

  return text;
}
