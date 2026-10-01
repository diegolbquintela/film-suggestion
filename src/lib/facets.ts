export const FACETS = [
  "folk",
  "grief",
  "domestic",
  "institution",
  "moral",
  "crime",
  "spy",
  "weird",
  "war",
  "court",
  "obsession",
  "comfort",
  "satire",
  "euro",
  "cool",
  "faith",
  "talk",
] as const;

export type Facet = (typeof FACETS)[number];
export type FacetVec = number[];

export const FAMILIES = [
  "folk",
  "grief",
  "domestic",
  "institution",
  "crime",
  "spy",
  "weird",
  "war",
  "court",
  "obsession",
  "comfort",
  "satire",
  "euro",
  "cool",
  "faith",
] as const;

export type Family = (typeof FAMILIES)[number];

export const VIBES = ["dusk", "rewatch", "folk", "heat", "summer", "court"] as const;
export type Vibe = (typeof VIBES)[number];

export const SEASONS = ["autumn", "winter", "summer", "any"] as const;
export type Season = (typeof SEASONS)[number];

export const VIBE_LABEL: Record<Vibe, string> = {
  dusk: "Dusk",
  rewatch: "Rewatch",
  folk: "Folk",
  heat: "Heat",
  summer: "Summer",
  court: "Court",
};

export const FAMILY_LABEL: Record<Family, string> = {
  folk: "Folk",
  grief: "Grief",
  domestic: "Domestic",
  institution: "Institution",
  crime: "Crime",
  spy: "Spy",
  weird: "Weird",
  war: "War",
  court: "Court",
  obsession: "Obsession",
  comfort: "Comfort",
  satire: "Satire",
  euro: "Euro summer",
  cool: "Cool",
  faith: "Faith",
};

export function zero(): FacetVec {
  return FACETS.map(() => 0);
}

export function vec(partial: Partial<Record<Facet, number>>): FacetVec {
  return FACETS.map((key) => partial[key] ?? 0);
}

export function add(a: FacetVec, b: FacetVec): FacetVec {
  return a.map((n, i) => n + (b[i] ?? 0));
}

export function scale(a: FacetVec, s: number): FacetVec {
  return a.map((n) => n * s);
}

export function blend(a: FacetVec, b: FacetVec, t: number): FacetVec {
  return a.map((n, i) => n * (1 - t) + (b[i] ?? 0) * t);
}

export function clampVec(a: FacetVec, min: number, max: number): FacetVec {
  return a.map((n) => Math.min(max, Math.max(min, n)));
}

export function dot(a: FacetVec, b: FacetVec): number {
  return a.reduce((sum, n, i) => sum + n * (b[i] ?? 0), 0);
}

export function norm(a: FacetVec): number {
  return Math.sqrt(dot(a, a));
}

export function cosine(a: FacetVec, b: FacetVec): number {
  const n = norm(a) * norm(b);
  if (n === 0) return 0;
  return dot(a, b) / n;
}

export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
