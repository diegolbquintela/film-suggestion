import { LOVED } from "@/lib/works-loved";
import { SHELF } from "@/lib/works-shelf";
import type { Work } from "@/lib/work";
import { create } from "zustand";

export const CATALOG: Work[] = [...LOVED, ...SHELF];

export function mergeWorks(remote: Work[], extras: Work[]): Work[] {
  const ready = useShelf.getState().ready;
  const base = ready ? remote : CATALOG;
  const map = new Map<string, Work>();
  for (const work of base) map.set(work.id, work);
  for (const work of extras) {
    const key = work.name.toLowerCase();
    if ([...map.values()].some((item) => item.name.toLowerCase() === key)) continue;
    map.set(work.id, work);
  }
  return [...map.values()];
}

export function allWorks(extras: Work[]): Work[] {
  return mergeWorks([], extras);
}

export const useShelf = create<{
  films: Work[];
  incoming: Work[];
  ready: boolean;
  setFilms: (films: Work[]) => void;
  setCatalog: (films: Work[], incoming: Work[]) => void;
}>((set) => ({
  films: [],
  incoming: [],
  ready: false,
  setFilms: (films) => set({ films, ready: true }),
  setCatalog: (films, incoming) => set({ films, incoming, ready: true }),
}));
