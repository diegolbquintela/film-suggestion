import type { Facet, Family, Season, Vibe } from "@/lib/facets";

export type Kind = "film" | "series";

export type Work = {
  id: string;
  name: string;
  year: string;
  kind: Kind;
  runtime: string;
  loved: boolean;
  weight: number;
  hidden: boolean;
  fromChat: boolean;
  family: Family;
  vibes: Vibe[];
  seasons: Season[];
  facets: Partial<Record<Facet, number>>;
  summary: string;
  why: string;
  vibeLine: string;
  preachy: number;
};

type Input = {
  id: string;
  name: string;
  year: string;
  kind?: Kind;
  runtime: string;
  loved?: boolean;
  weight?: number;
  hidden?: boolean;
  fromChat?: boolean;
  family: Family;
  vibes: Vibe[];
  seasons?: Season[];
  facets: Partial<Record<Facet, number>>;
  summary: string;
  why: string;
  vibeLine: string;
  preachy?: number;
};

export function work(input: Input): Work {
  return {
    id: input.id,
    name: input.name,
    year: input.year,
    kind: input.kind ?? "film",
    runtime: input.runtime,
    loved: input.loved ?? false,
    weight: input.weight ?? (input.loved ? 1 : 0),
    hidden: input.hidden ?? false,
    fromChat: input.fromChat ?? false,
    family: input.family,
    vibes: input.vibes,
    seasons: input.seasons ?? ["any"],
    facets: input.facets,
    summary: input.summary,
    why: input.why,
    vibeLine: input.vibeLine,
    preachy: input.preachy ?? 0,
  };
}
