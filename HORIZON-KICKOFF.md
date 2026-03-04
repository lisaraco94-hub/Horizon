# HORIZON — Global Distribution Intelligence Platform

## Project Kickoff Document for Claude Code

**Version:** 1.0  
**Date:** March 4, 2026  
**Status:** Project Initiation  
**Origin:** Interactive mockup (React JSX) validated with stakeholders

---

## 1. Executive Summary

HORIZON is an internal web platform for managing and accelerating Inpeco's global distribution pipeline in new, indirect markets. It serves as the single source of truth for prospect laboratories worldwide, enabling the Global Business Development team to track, score, and prioritize lab automation opportunities across four strategic regions: LATAM, China, Eastern Europe, and APAC & MEA.

The platform replaces scattered Excel files, emails, and distributor reports with a centralized, intelligent system that provides real-time pipeline visibility, AI-generated briefings, and collaborative prospect management.

---

## 2. Business Context

### 2.1 The Problem

Inpeco is expanding into new geographies through a distributor/indirect sales model. Currently:

- Prospect data lives in disconnected Excel files per region
- Regional managers lack visibility into each other's pipelines
- RFP deadlines are tracked manually and sometimes missed
- There's no standardized scoring to prioritize opportunities
- The Global Business Manager has no consolidated dashboard
- Legacy Inpeco installations (via Siemens OEM) represent upgrade opportunities that aren't systematically tracked

### 2.2 Target Users

| Role | Description | Primary Needs |
|------|-------------|---------------|
| **Global Business Manager** | System owner, oversees all regions | Dashboard, AI briefings, pipeline overview, RFP calendar |
| **Regional Managers** | Carlos Mendez (LATAM), Wei Zhang (China), Andrei Petrov (East EU), Director (APAC & MEA) | Prospect management, activity logging, engagement tracking |
| **Senior Leadership** | VP Sales, CEO | Read-only dashboard, pipeline metrics, forecasts |

### 2.3 Strategic Regions

| Region Key | Label | Manager | Target Markets |
|------------|-------|---------|----------------|
| `LATAM` | LATAM | Carlos Mendez | Chile, Brazil, Argentina, Mexico, Colombia |
| `CHINA` | China | Wei Zhang | Mainland China |
| `EAST_EU` | East Europe | Andrei Petrov | Poland, Romania, Czech Republic, Hungary, Turkey |
| `APAC` | APAC & MEA | Director (TBD) | Saudi Arabia, India, Thailand, UAE, South Africa |

---

## 3. Data Model

### 3.1 Laboratory / Prospect

This is the core entity. Each record represents a laboratory that Inpeco is targeting for automation solutions.

```
Laboratory {
  id:             UUID (auto-generated)
  name:           String (required) — Full institution name
  city:           String (required)
  country:        String (required)
  region:         Enum [LATAM, CHINA, EAST_EU, APAC] (required)
  lat:            Float — Latitude for map placement
  lng:            Float — Longitude for map placement

  // Classification
  type:           Enum [
                    "Public Hospital",
                    "Private Hospital",
                    "University Hospital",
                    "Reference Lab",
                    "Hospital Network",
                    "Private Lab"
                  ]
  volume:         Enum [
                    "< 500",
                    "500 - 1,000",
                    "1,000 - 3,000",
                    "3,000+"
                  ] — Samples per day

  // Competitive Landscape
  automation:     Enum [
                    "No automation (manual)",
                    "Partial pre-analytical (competitor)",
                    "Competitor full system",
                    "Legacy Inpeco (via OEM)",
                    "Mixed / Other"
                  ]
  ivd:            Array<String> — IVD vendors installed, from:
                    ["Roche", "Beckman Coulter", "Abbott",
                     "Siemens Healthineers", "QuidelOrtho",
                     "Sysmex", "bioMérieux", "Mindray", "Other"]

  // Pipeline Status
  stage:          Enum [mapped, engaged, exploring, qualified, handed_off]
  score:          Integer 0-100 — Prospect quality score (see §3.3)
  product:        Array<String> — Product interest, from:
                    ["FlexLab X", "ProTube", "FlexPath"]

  // RFP Tracking
  rfp:            Enum [
                    "No RFP expected",
                    "RFP expected",
                    "RFP published",
                    "Unknown"
                  ]
  rfpDate:        String (YYYY-MM) — Expected or actual RFP date

  // Activity
  notes:          Array<Note> — Activity timeline (see §3.2)

  // Metadata
  createdAt:      DateTime
  updatedAt:      DateTime
  createdBy:      UserID
}
```

### 3.2 Note / Activity Entry

```
Note {
  id:       UUID
  date:     Date (YYYY-MM-DD)
  author:   String — Name of the person logging the activity
  text:     String — Free-text note content
  labId:    UUID — Foreign key to Laboratory
}
```

### 3.3 Prospect Scoring Logic

The score (0-100) is a composite metric calculated from weighted factors:

| Factor | Weight | Logic |
|--------|--------|-------|
| Volume | 25% | 3,000+ = 25, 1,000-3,000 = 18, 500-1,000 = 10, <500 = 5 |
| Automation Status | 20% | Legacy Inpeco = 20, No automation = 15, Partial competitor = 10, Full competitor = 5 |
| RFP Status | 20% | Published = 20, Expected = 15, No RFP = 5, Unknown = 3 |
| Stage Progression | 15% | Qualified = 15, Exploring = 12, Engaged = 8, Mapped = 3 |
| Engagement Recency | 10% | Note in last 30 days = 10, 60 days = 7, 90 days = 4, older = 1 |
| Product Fit | 10% | Multiple products = 10, Single = 7, None = 2 |

The score should be recalculated automatically whenever underlying data changes.

### 3.4 Pipeline Stages

These represent the prospect lifecycle and correspond to Kanban columns:

| Stage | Key | Color | Description |
|-------|-----|-------|-------------|
| Mapped | `mapped` | `#64748B` (slate) | Lab identified but no contact made |
| Engaged | `engaged` | `#3B82F6` (blue) | Initial contact established, conversations started |
| Exploring | `exploring` | `#F59E0B` (amber) | Active discussions, demos, site visits in progress |
| Qualified | `qualified` | `#10B981` (emerald) | Budget confirmed, decision-maker engaged, timeline clear |
| Handed Off | `handed_off` | `#6366F1` (indigo) | Transferred to direct sales or distributor for deal closure |

---

## 4. Views & Features

### 4.1 Global Map View (Default)

**Purpose:** At-a-glance geographic visualization of the entire prospect pipeline.

**Implementation Details:**
- Dark theme background (`#0A1628`) with subtle grid overlay
- Simplified continent outlines (SVG paths) — no external map dependencies required for MVP; consider upgrading to Mapbox/Leaflet later
- Laboratory markers as colored dots, color-coded by pipeline stage
- Pulsing animation rings on Qualified and Exploring stage prospects to draw attention
- Click a marker to select it and show the score badge
- Click again or use the detail panel to see full info
- Region counters overlay (top-right) showing prospect count per region with region color border
- Stage legend (bottom-left) with color dots

**Coordinate Mapping:**
```
x = ((longitude + 180) / 360) * mapWidth
y = ((90 - latitude) / 180) * mapHeight
```

**Filters apply to map markers** — filtering by region or stage removes non-matching dots from the map.

### 4.2 Pipeline View (Kanban)

**Purpose:** Visual pipeline management in a drag-and-drop board format.

**Implementation Details:**
- 5 columns, one per stage (Mapped → Engaged → Exploring → Qualified → Handed Off)
- Each column has a colored header with dot, label, and count
- Column background uses the stage's light background color
- Prospect cards show: name, city/country, stage badge
- Cards have left border colored by stage
- Empty columns show "No prospects" placeholder
- **Future:** Drag-and-drop to change stage (not in MVP mockup, but critical for v1)

### 4.3 List View (Table)

**Purpose:** Detailed tabular view for sorting, filtering, and quick scanning.

**Columns:** Laboratory, Location, Type, Volume, Automation, Stage, Score, RFP

**Implementation Details:**
- Default sort: by Score descending (highest priority first)
- Stage shown as colored pill badge
- Score colored: green (≥80), amber (≥60), gray (<60)
- RFP colored: red for "RFP published", amber for "RFP expected", gray for others
- RFP date shown inline after status with `·` separator
- Row hover highlights in light gray
- Click any row to open detail panel

### 4.4 Dashboard View

**Purpose:** Executive summary with KPIs, charts, RFP calendar, and AI briefing.

**Components:**

**KPI Cards (top row, 4 cards):**
| KPI | Value | Subtitle | Color |
|-----|-------|----------|-------|
| Total Mapped | Count of all labs | "across 4 regions" | Default |
| Active Pipeline | Count where stage NOT IN (mapped, handed_off) | "engaged to qualified" | Blue |
| Qualified | Count where stage = qualified | "ready for next step" | Green |
| Avg Score | Mean of all prospect scores | "prospect quality" | Amber |

**Pipeline by Stage (horizontal bar chart):**
- One bar per stage, colored by stage color
- Width proportional to count / total
- Animated fill on load
- Count label inside bar

**Prospects by Region (info cards):**
- Region color dot, label, manager name
- Prospect count (large) and average score

**Upcoming RFPs & Deadlines:**
- Cards sorted by rfpDate ascending (soonest first)
- Shows date (monospace, amber), lab name, city/country
- Click to open detail panel
- Only shows labs that have an rfpDate set

**AI Intelligence Briefing:**
- Dark gradient background (`#0A1628` → `#1E293B`)
- Auto-generated weekly summary
- Covers: pipeline momentum, hot opportunities, regional highlights, key signals, action items
- **Future:** This should be generated dynamically via LLM API call analyzing current data

### 4.5 Detail Panel (Slide-in Sidebar)

**Purpose:** Full prospect profile accessible from any view.

**Trigger:** Click on any lab marker, card, or table row.

**Layout (right sidebar, 420px wide, full height):**

1. **Header Section:**
   - Stage badge (colored pill)
   - Close button (✕)
   - Lab name (h2, bold)
   - City, Country
   - Score bar (progress bar with gradient, score number)
   - "PROSPECT SCORE" label

2. **Details Grid (2×3):**
   - Institution Type
   - Volume (/day)
   - Automation status
   - Region
   - RFP Status (with date if available)
   - Manager

3. **IVD Vendors Installed:** Blue pills with vendor names

4. **Product Interest:** Green pills with product names (only if products selected)

5. **Activity Timeline:** Vertical timeline with:
   - Colored dot (stage color for most recent, gray for older)
   - Date · Author
   - Note text
   - Connected by vertical line between entries
   - "No activity recorded yet" if empty

**Animation:** Slides in from right with 0.3s ease transition.

---

## 5. UI Design System

### 5.1 Color Palette

**Regions:**
| Region | Color | Usage |
|--------|-------|-------|
| LATAM | `#10B981` | Borders, badges, counters |
| China | `#F59E0B` | Borders, badges, counters |
| East Europe | `#8B5CF6` | Borders, badges, counters |
| APAC & MEA | `#EC4899` | Borders, badges, counters |

**Stages:**
| Stage | Color | Light BG |
|-------|-------|----------|
| Mapped | `#64748B` | `#F1F5F9` |
| Engaged | `#3B82F6` | `#EFF6FF` |
| Exploring | `#F59E0B` | `#FFFBEB` |
| Qualified | `#10B981` | `#ECFDF5` |
| Handed Off | `#6366F1` | `#EEF2FF` |

**Score Thresholds:**
| Range | Color | Meaning |
|-------|-------|---------|
| ≥ 80 | `#10B981` (green) | High priority |
| 60-79 | `#F59E0B` (amber) | Medium priority |
| < 60 | `#94A3B8` (gray) | Low priority |

**General:**
- Primary background: `#F1F5F9`
- Sidebar dark: `#0A1628`
- Card background: `#FFFFFF`
- Text primary: `#0F172A`
- Text secondary: `#64748B`
- Text muted: `#94A3B8`
- Borders: `#E2E8F0`
- Subtle bg: `#F8FAFC`
- Brand gradient: `linear-gradient(135deg, #3B82F6, #10B981)`
- CTA gradient: `linear-gradient(135deg, #3B82F6, #2563EB)`

### 5.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Body / UI | DM Sans | 400-700 | 11-14px |
| Numbers / Scores / KPIs | Space Mono | 400, 700 | 11-28px |
| Brand "HORIZON" | Space Mono | 700 | 16px |
| Labels (uppercase) | DM Sans | 600 | 9-10px |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap
```

### 5.3 Component Patterns

- **Badges/Pills:** Rounded (12px radius), colored background at 18% opacity with matching text
- **Cards:** White bg, 1px `#E2E8F0` border, 10-12px border-radius, left color border for stage
- **Hover effects:** Subtle shadow (`0 4px 12px rgba(0,0,0,0.08)`) and translateY(-1px)
- **Sidebar navigation:** Active item has blue-tinted background (`rgba(59,130,246,0.15)`) with `#60A5FA` text
- **Buttons:** Gradient backgrounds, 8px radius, subtle box-shadow
- **Select dropdowns:** Light gray background (`#F8FAFC`), subtle border, 8px radius

---

## 6. Application Structure

### 6.1 Navigation Sidebar (Left, 220px)

- **Brand block:** "H" logo (gradient square) + "HORIZON" + "Global Distribution Platform"
- **Navigation items:**
  - 🌍 Global Map
  - ◧ Pipeline
  - ☰ List View
  - ◫ Dashboard
- **User block (bottom):** Avatar circle (gradient) + "Global Business Mgr" + "System Owner"

### 6.2 Top Bar (Filters & Actions)

- Region filter dropdown (All Regions + 4 region options)
- Stage filter dropdown (All Stages + 5 stage options)
- Lab count indicator ("X laboratories")
- "+ New Prospect" CTA button

### 6.3 Content Area

Switches between the 4 views based on navigation selection. Map view uses full height with no padding; other views use 24px padding.

---

## 7. Technical Recommendations for Implementation

### 7.1 Suggested Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + TypeScript | Matches mockup, component-based |
| Styling | Tailwind CSS | Utility-first, matches the design token approach |
| State Management | Zustand or React Context | Lightweight, sufficient for this scope |
| Routing | React Router | Standard SPA navigation |
| Backend | Node.js + Express or Next.js API routes | JavaScript ecosystem consistency |
| Database | PostgreSQL | Relational data with strong querying |
| ORM | Prisma | Type-safe database access |
| Auth | NextAuth.js or Auth0 | Role-based access (admin, regional manager, viewer) |
| Maps (v2) | Leaflet or Mapbox GL | Replace SVG map with real interactive map |
| Deployment | Vercel or Docker | Fast deployment, easy scaling |

### 7.2 MVP Scope (Phase 1)

**Must Have:**
- All 4 views (Map, Pipeline, List, Dashboard) fully functional
- CRUD operations for laboratories (create, read, update, delete)
- Activity/notes timeline with add capability
- Filtering by region and stage
- Prospect scoring (auto-calculated)
- Detail panel for each prospect
- Responsive design (desktop-first, but usable on tablet)
- Basic authentication (user login)

**Nice to Have (Phase 1.5):**
- Drag-and-drop on Pipeline/Kanban view
- Export to Excel/CSV
- Search by lab name, city, or country
- Sort by any column in List view

### 7.3 Future Phases

**Phase 2 — Intelligence & Collaboration:**
- AI-generated weekly briefings (via Claude API)
- Notifications for upcoming RFP deadlines
- Comments/mentions on prospect records
- Distributor portal (limited external access)
- Email integration for auto-logging touchpoints

**Phase 3 — Advanced Analytics:**
- Win/loss tracking post-handoff
- Revenue forecasting
- Competitive intelligence dashboard
- Integration with CRM (Salesforce/HubSpot)
- Real interactive map (Mapbox) replacing SVG

---

## 8. Sample Data

The mockup includes 12 representative prospects that should be used as seed data for development and testing. They span all 4 regions, all 5 stages, and various combinations of automation status, IVD vendors, and RFP states. See the full dataset in the mockup source code (`MOCK_LABS` array).

Key test scenarios the sample data covers:
- **Active RFP with deadline:** Beijing Ditan Hospital (April 2026), Hospital Italiano Buenos Aires (May 2026)
- **Legacy Inpeco upgrade:** Wuhan Union Hospital, Hospital Italiano Buenos Aires
- **High-score prospects:** Beijing Ditan (94), King Faisal (91), Hospital Italiano (90)
- **No activity yet:** Guangzhou First People's, Bucharest Emergency, Bangkok Hospital
- **All stage transitions:** Data covers mapped through qualified (no handed_off yet in sample)

---

## 9. File Structure Suggestion

```
horizon/
├── README.md
├── package.json
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data from MOCK_LABS
├── src/
│   ├── app/                   # Next.js app router (or pages/)
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Main app shell
│   │   ├── api/
│   │   │   ├── labs/          # CRUD endpoints
│   │   │   ├── notes/         # Activity endpoints
│   │   │   └── auth/          # Authentication
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── DetailPanel.tsx
│   │   ├── views/
│   │   │   ├── MapView.tsx
│   │   │   ├── PipelineView.tsx
│   │   │   ├── ListView.tsx
│   │   │   └── DashboardView.tsx
│   │   ├── cards/
│   │   │   ├── ProspectCard.tsx
│   │   │   └── KPICard.tsx
│   │   └── ui/                # Reusable primitives
│   │       ├── Badge.tsx
│   │       ├── ScoreBar.tsx
│   │       └── RegionDot.tsx
│   ├── lib/
│   │   ├── scoring.ts         # Prospect score calculation
│   │   ├── constants.ts       # Regions, stages, enums
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── db.ts              # Prisma client
│   └── styles/
│       └── globals.css
├── public/
│   └── fonts/
└── .env
```

---

## 10. Getting Started with Claude Code

When starting a new Claude Code session for this project, provide the following context:

```
I'm building HORIZON, a prospect pipeline management platform for lab automation sales.
The complete spec is in HORIZON-KICKOFF.md at the project root.
The validated UI mockup is in horizon-mockup.jsx.

Key things to know:
- 4 views: Global Map, Pipeline (Kanban), List, Dashboard
- Core entity: Laboratory with stage, score, notes, IVD vendors, RFP tracking
- 4 regions: LATAM, China, East Europe, APAC & MEA
- 5 pipeline stages: Mapped → Engaged → Exploring → Qualified → Handed Off
- Design: Dark sidebar, light content, DM Sans + Space Mono fonts
- Tech: Next.js + TypeScript + Tailwind + Prisma + PostgreSQL

Start with: [specific task you want to accomplish]
```

---

*This document was reverse-engineered from the validated interactive mockup. All design tokens, data structures, and UI patterns are production-ready and approved.*
