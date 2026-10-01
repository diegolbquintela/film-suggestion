import {
  add,
  blend,
  clampVec,
  cosine,
  hash,
  scale,
  vec,
  zero,
  type FacetVec,
  type Season,
  type Vibe,
} from "@/lib/facets";
import type { Work } from "@/lib/work";

export const DAY = 86_400_000;
export const COOLDOWN_NO = 8 * DAY;
export const COOLDOWN_WATCHED_LOVED = 21 * DAY;
export const COOLDOWN_WATCHED_NEW = 45 * DAY;

export type Scored = {
  work: Work;
  allTime: number;
  tonight: number;
  raw: number;
  vibeMatch: boolean;
  similar: { name: string; score: number }[];
};

export function calendarSeason(now = new Date()): Season {
  const month = now.getMonth();
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  if (month === 11 || month <= 1) return "winter";
  return "any";
}

export function defaultVibe(now = new Date()): Vibe {
  const month = now.getMonth();
  if (month >= 8 && month <= 10) return "dusk";
  if (month === 11 || month <= 1) return "folk";
  if (month >= 5 && month <= 7) return "summer";
  return "rewatch";
}

export function dayKey(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

export function lifetimeVector(
  works: Work[],
  demoted: string[],
  adjust: FacetVec,
  liked: Record<string, number> = {},
): FacetVec {
  let acc = zero();
  let weight = 0;
  for (const work of works) {
    if (demoted.includes(work.id) || work.hidden) continue;
    const pull = work.loved ? work.weight : (liked[work.id] ?? 0);
    if (pull <= 0) continue;
    acc = add(acc, scale(vec(work.facets), pull));
    weight += pull;
  }
  const centroid = weight > 0 ? scale(acc, 1 / weight) : zero();
  return clampVec(add(centroid, adjust), -0.15, 1.35);
}

export function decayedCurrent(current: FacetVec | null, currentAt: number, life: FacetVec, now: number): FacetVec {
  if (!current) return life;
  const days = Math.max(0, (now - currentAt) / DAY);
  const keep = Math.pow(0.5, days / 10);
  return blend(life, current, keep);
}

export function fatigueCounts(events: { family: string; at: number }[], now: number): Record<string, number> {
  const map: Record<string, number> = {};
  for (const event of events) {
    if (now - event.at > 7 * DAY) continue;
    map[event.family] = (map[event.family] ?? 0) + 1;
  }
  return map;
}

export function toScore(value: number): number {
  const scaled = ((value - 0.05) / 0.85) * 100;
  return Math.round(Math.min(97, Math.max(12, scaled)));
}

function nearest(work: Work, anchors: Work[]): { name: string; score: number }[] {
  const mine = vec(work.facets);
  return anchors
    .filter((anchor) => anchor.id !== work.id && !anchor.hidden)
    .map((anchor) => ({ name: anchor.name, score: cosine(mine, vec(anchor.facets)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}

export function scoreWork(
  work: Work,
  life: FacetVec,
  taste: FacetVec,
  vibe: Vibe,
  season: Season,
  fatigue: Record<string, number>,
  anchors: Work[],
  key: string,
  watching: Work | null,
): Scored {
  const features = vec(work.facets);
  const anchorScores = anchors
    .filter((anchor) => anchor.id !== work.id)
    .map((anchor) => cosine(features, vec(anchor.facets)))
    .sort((a, b) => b - a);
  const best = anchorScores[0] ?? 0;
  const second = anchorScores[1] ?? best;
  const anchorScore = best * 0.7 + second * 0.3;
  const centroid = cosine(taste, features);
  const all = anchorScore * 0.75 + cosine(life, features) * 0.25;
  const vibeMatch = work.vibes.includes(vibe);
  const exactSeason = work.seasons.includes(season);
  const anySeason = work.seasons.includes("any");
  let raw = anchorScore * 0.5 + centroid * 0.12;
  if (vibeMatch) raw += 0.24;
  if (exactSeason) raw += 0.08;
  else if (anySeason) raw += 0.03;
  raw -= work.preachy * 0.15;
  if (watching && watching.id !== work.id) {
    raw += Math.max(0, cosine(features, vec(watching.facets))) * 0.1;
  }
  const tired = fatigue[work.family] ?? 0;
  if (tired >= 3) raw *= 0.7;
  else if (tired >= 2) raw *= 0.88;
  raw += ((hash(`${work.id}:${key}`) % 100) / 100) * 0.03;
  return {
    work,
    allTime: toScore(all),
    tonight: toScore(raw),
    raw,
    vibeMatch,
    similar: nearest(work, anchors),
  };
}

export type DeckInput = {
  works: Work[];
  demoted: string[];
  never: string[];
  laterUntil: Record<string, number>;
  queueIds: string[];
  wishlistIds: string[];
  likedIds: string[];
  adjust: FacetVec;
  current: FacetVec | null;
  currentAt: number;
  fatigue: { family: string; at: number }[];
  vibe: Vibe;
  watching: Work | null;
  now: number;
  key: string;
};

function weave(pool: Scored[], wish: Set<string>, limit: number): Scored[] {
  const wished = pool.filter((item) => wish.has(item.work.id)).sort((a, b) => b.raw - a.raw);
  const rest = pool.filter((item) => !wish.has(item.work.id)).sort((a, b) => b.raw - a.raw);
  const out: Scored[] = [];
  let w = 0;
  let r = 0;
  while (out.length < limit && (w < wished.length || r < rest.length)) {
    const takeWish = out.length % 3 === 1 && w < wished.length;
    if (takeWish) out.push(wished[w++]);
    else if (r < rest.length) out.push(rest[r++]);
    else out.push(wished[w++]);
  }
  return out;
}

export function buildDeck(input: DeckInput): { deck: Scored[]; life: FacetVec } {
  const works = input.works;
  const liked: Record<string, number> = {};
  for (const id of input.likedIds) liked[id] = 0.75;
  const life = lifetimeVector(works, input.demoted, input.adjust, liked);
  const current = decayedCurrent(input.current, input.currentAt, life, input.now);
  const taste = blend(life, current, 0.32);
  const season = calendarSeason(new Date(input.now));
  const fatigue = fatigueCounts(input.fatigue, input.now);
  const likedSet = new Set(input.likedIds);
  const wish = new Set(input.wishlistIds);
  const anchors = works.filter(
    (work) => !work.hidden && !input.demoted.includes(work.id) && (work.loved || likedSet.has(work.id)),
  );
  const blocked = new Set([...input.never, ...input.queueIds]);

  const scored = works
    .filter((work) => !work.hidden && !blocked.has(work.id))
    .filter((work) => (input.laterUntil[work.id] ?? 0) <= input.now)
    .map((work) => {
      const item = scoreWork(work, life, taste, input.vibe, season, fatigue, anchors, input.key, input.watching);
      if (wish.has(work.id)) {
        item.raw += 0.12;
        item.tonight = toScore(item.raw);
      }
      return item;
    });

  const discoveries = scored
    .filter((item) => !item.work.loved)
    .filter((item) => item.allTime >= 36 || wish.has(item.work.id) || likedSet.has(item.work.id))
    .sort((a, b) => b.raw - a.raw);
  const rewatches = scored.filter((item) => item.work.loved).sort((a, b) => b.raw - a.raw);

  const discoveryTarget = input.vibe === "rewatch" ? 4 : 10;
  const picked: Scored[] = [];
  const familyCount: Record<string, number> = {};
  for (const item of discoveries) {
    if (picked.length >= discoveryTarget) break;
    const count = familyCount[item.work.family] ?? 0;
    if (count >= 2) continue;
    picked.push(item);
    familyCount[item.work.family] = count + 1;
  }
  if (picked.length < discoveryTarget) {
    for (const item of discoveries) {
      if (picked.length >= discoveryTarget) break;
      if (picked.some((have) => have.work.id === item.work.id)) continue;
      picked.push(item);
    }
  }

  const rewatchTarget = input.vibe === "rewatch" ? 6 : 2;
  const rewatchPicked = rewatches.slice(0, rewatchTarget);
  const seen = new Set([...picked, ...rewatchPicked].map((item) => item.work.id));
  const wishExtras = scored.filter((item) => wish.has(item.work.id) && !seen.has(item.work.id)).slice(0, 4);
  const pool = [...picked, ...rewatchPicked, ...wishExtras];
  let deck = weave(pool, wish, 8);
  if (input.vibe !== "rewatch" && !deck.some((item) => item.work.loved) && rewatchPicked[0]) {
    const insert = rewatchPicked[0];
    if (!deck.some((item) => item.work.id === insert.work.id)) {
      deck.splice(Math.min(2, deck.length), 0, insert);
      deck = deck.slice(0, 8);
    }
  }
  return { deck, life };
}

export function similarLine(similar: { name: string; score: number }[]): string {
  if (similar.length === 0) return "Nothing on your list sits close.";
  return similar.map((item) => `${item.name} ${Math.round(item.score * 100)}`).join("  ·  ");
}
