export type Region = "LATAM" | "CHINA" | "EAST_EU" | "APAC";
export type Stage = "mapped" | "engaged" | "exploring" | "qualified" | "handed_off";

export interface Note {
  id?: string;
  date: string;
  author: string;
  text: string;
}

export interface Laboratory {
  id: string | number;
  name: string;
  city: string;
  country: string;
  region: Region;
  lat: number;
  lng: number;
  type: string;
  volume: string;
  automation: string;
  ivd: string[];
  stage: Stage;
  score: number;
  product: string[];
  rfp: string;
  rfpDate?: string;
  notes: Note[];
}

export interface Filters {
  region: string;
  stage: string;
}

// ─── Role-based access control ──────────────────────────────────────────────
// Three tiers:
//   distributor      → sees only their own assigned labs + their sub-region
//   regional_manager → sees all labs in their region (all distributors under them)
//   global_manager   → sees the entire world (all regions)
export type UserRole = "distributor" | "regional_manager" | "global_manager";

export interface AppUser {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  /** Region the user belongs to (undefined for global_manager) */
  region?: Region;
  /** Specific lab IDs assigned to this user (only relevant for distributors) */
  assignedLabIds?: (string | number)[];
}
