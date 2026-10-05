import { FACETS, VIBES, type FacetVec, type Vibe } from "@/lib/facets";
import type { Work } from "@/lib/work";

export type TasteSnapshot = {
  laterUntil: Record<string, number>;
  never: string[];
  queue: { id: string; at: number }[];
  wishlist: string[];
  reviews: { id: string; note: string; at: number }[];
  fatigue: { family: string; at: number }[];
  adjust: FacetVec;
  current: FacetVec | null;
  currentAt: number;
  demoted: string[];
  extras: Work[];
  whys: Record<string, string>;
  vibe: Vibe | null;
  grokDay: { day: string; n: number };
  shelfAt: number;
  watchingId: string | null;
  started: boolean;
  today: { key: string; vibe: string; ids: string[] } | null;
};

function strings(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean).slice(0, max);
}

function vec(value: unknown): FacetVec | null {
  if (!Array.isArray(value) || value.length !== FACETS.length) return null;
  return value.map((item) => {
    const n = typeof item === "number" ? item : 0;
    return Math.min(1.35, Math.max(-0.4, n));
  });
}

export function emptyTaste(): TasteSnapshot {
  return {
    laterUntil: {},
    never: [],
    queue: [],
    wishlist: [],
    reviews: [],
    fatigue: [],
    adjust: FACETS.map(() => 0),
    current: null,
    currentAt: 0,
    demoted: [],
    extras: [],
    whys: {},
    vibe: null,
    grokDay: { day: "", n: 0 },
    shelfAt: 0,
    watchingId: null,
    started: false,
    today: null,
  };
}

export function tasteHasChoices(taste: TasteSnapshot): boolean {
  return Boolean(
    taste.watchingId ||
      taste.reviews.length ||
      taste.wishlist.length ||
      taste.never.length ||
      taste.queue.length ||
      taste.demoted.length ||
      Object.keys(taste.laterUntil).length,
  );
}

export function coerceTaste(input: unknown): TasteSnapshot {
  const base = emptyTaste();
  if (!input || typeof input !== "object") return base;
  const row = input as Record<string, unknown>;
  const laterUntil: Record<string, number> = {};
  if (row.laterUntil && typeof row.laterUntil === "object") {
    for (const [key, value] of Object.entries(row.laterUntil).slice(0, 400)) {
      if (typeof value === "number") laterUntil[key.slice(0, 80)] = value;
    }
  }
  const queue = Array.isArray(row.queue)
    ? row.queue
        .map((item) => {
          const entry = item as { id?: unknown; at?: unknown };
          const id = String(entry?.id ?? "").slice(0, 80);
          return id ? { id, at: typeof entry.at === "number" ? entry.at : 0 } : null;
        })
        .filter((item): item is { id: string; at: number } => Boolean(item))
        .slice(0, 40)
    : [];
  const reviews = Array.isArray(row.reviews)
    ? row.reviews
        .map((item) => {
          const entry = item as { id?: unknown; note?: unknown; at?: unknown };
          const id = String(entry?.id ?? "").slice(0, 80);
          if (!id) return null;
          return {
            id,
            note: String(entry.note ?? "").slice(0, 140),
            at: typeof entry.at === "number" ? entry.at : 0,
          };
        })
        .filter((item): item is TasteSnapshot["reviews"][number] => Boolean(item))
        .slice(0, 80)
    : [];
  const fatigue = Array.isArray(row.fatigue)
    ? row.fatigue
        .map((item) => {
          const entry = item as { family?: unknown; at?: unknown };
          const family = String(entry?.family ?? "").slice(0, 40);
          if (!family) return null;
          return { family, at: typeof entry.at === "number" ? entry.at : 0 };
        })
        .filter((item): item is TasteSnapshot["fatigue"][number] => Boolean(item))
        .slice(0, 80)
    : [];
  const extras = Array.isArray(row.extras)
    ? (row.extras
        .filter((item) => item && typeof item === "object" && String((item as Work).id ?? "") && String((item as Work).name ?? ""))
        .slice(0, 24) as Work[])
    : [];
  const whys: Record<string, string> = {};
  if (row.whys && typeof row.whys === "object") {
    for (const [key, value] of Object.entries(row.whys).slice(0, 80)) {
      whys[key.slice(0, 80)] = String(value).slice(0, 600);
    }
  }
  const vibe = VIBES.includes(row.vibe as Vibe) ? (row.vibe as Vibe) : null;
  const grok = row.grokDay as { day?: unknown; n?: unknown } | null;
  const todayRaw = row.today as { key?: unknown; vibe?: unknown; ids?: unknown } | null;
  const todayIds = Array.isArray(todayRaw?.ids)
    ? todayRaw.ids.map((id) => String(id).slice(0, 80)).filter(Boolean).slice(0, 5)
    : [];
  const today =
    todayRaw && String(todayRaw.key ?? "") && todayIds.length
      ? { key: String(todayRaw.key).slice(0, 20), vibe: String(todayRaw.vibe ?? "").slice(0, 20), ids: todayIds }
      : null;
  return {
    laterUntil,
    never: strings(row.never, 400),
    queue,
    wishlist: strings(row.wishlist, 80),
    reviews,
    fatigue,
    adjust: vec(row.adjust) ?? base.adjust,
    current: vec(row.current),
    currentAt: typeof row.currentAt === "number" ? row.currentAt : 0,
    demoted: strings(row.demoted, 200),
    extras,
    whys,
    vibe,
    grokDay: {
      day: String(grok?.day ?? "").slice(0, 12),
      n: typeof grok?.n === "number" ? Math.min(20, Math.max(0, grok.n)) : 0,
    },
    shelfAt: typeof row.shelfAt === "number" ? row.shelfAt : 0,
    watchingId: row.watchingId ? String(row.watchingId).slice(0, 80) : null,
    started: row.started === true,
    today,
  };
}
