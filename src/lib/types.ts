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
  distributor: string;
}

export interface Filters {
  region: string;
  stage: string;
}

// ─── Role-based access control ──────────────────────────────────────────────
// Three tiers:
//   distributor      → sees only labs matching their distributor + country
//   regional_manager → sees all labs in their region
//   global_manager   → sees the entire world
export type UserRole = "distributor" | "regional_manager" | "global_manager";

export interface AppUser {
  username: string;
  name: string;
  role: UserRole;
  region?: Region;
  distributor?: string;
  country?: string;
}
