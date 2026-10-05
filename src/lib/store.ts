import { mergeWorks, useShelf } from "@/lib/catalog";
import { add, blend, scale, vec, type FacetVec, type Vibe, zero } from "@/lib/facets";
import { removeFilm, restoreFilm } from "@/lib/films-fns";
import { COOLDOWN_NO, COOLDOWN_WATCHED_LOVED, COOLDOWN_WATCHED_NEW, decayedCurrent, lifetimeVector } from "@/lib/score";
import { coerceTaste, emptyTaste } from "@/lib/taste";
import type { Work } from "@/lib/work";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Review = { id: string; note: string; at: number };

type Slice = {
  laterUntil: Record<string, number>;
  never: string[];
  queue: { id: string; at: number }[];
  wishlist: string[];
  reviews: Review[];
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

type Last = { label: string; slice: Slice; film?: Work };

type TasteState = Slice & {
  last: Last | null;
  hydrated: boolean;
  accountReady: boolean;
  setHydrated: (value: boolean) => void;
  applyRemote: (raw: unknown) => void;
  clearForNewAccount: () => void;
  setVibe: (vibe: Vibe) => void;
  undo: () => void;
  notTonight: (id: string) => void;
  notMine: (id: string) => void;
  yes: (id: string) => void;
  watched: (id: string) => void;
  removeFromQueue: (id: string) => void;
  restore: (id: string) => void;
  demote: (id: string) => void;
  undemote: (id: string) => void;
  addExtras: (works: Work[]) => void;
  setWhy: (id: string, why: string) => void;
  toggleWishlist: (id: string) => void;
  like: (id: string, note: string) => void;
  setWatching: (id: string | null) => void;
  setToday: (today: { key: string; vibe: string; ids: string[] }) => void;
  markShelf: () => void;
  grokLeft: () => number;
  markGrok: () => void;
};

export function sliceOf(state: Slice): Slice {
  return {
    laterUntil: state.laterUntil,
    never: state.never,
    queue: state.queue,
    wishlist: state.wishlist,
    reviews: state.reviews,
    fatigue: state.fatigue,
    adjust: state.adjust,
    current: state.current,
    currentAt: state.currentAt,
    demoted: state.demoted,
    extras: state.extras,
    whys: state.whys,
    vibe: state.vibe,
    grokDay: state.grokDay,
    shelfAt: state.shelfAt,
    watchingId: state.watchingId,
    started: Boolean(state.started),
    today: state.today,
  };
}

function likedWeights(reviews: Review[]): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const review of reviews) weights[review.id] = 0.75;
  return weights;
}

function known(extras: Work[]): Work[] {
  return mergeWorks(useShelf.getState().films, extras);
}

function findWork(id: string, extras: Work[]): Work | undefined {
  return (
    known(extras).find((work) => work.id === id) ?? useShelf.getState().incoming.find((work) => work.id === id)
  );
}

function bumpCurrent(state: Slice, work: Work, now: number): Pick<Slice, "current" | "currentAt"> {
  const life = lifetimeVector(known(state.extras), state.demoted, state.adjust, likedWeights(state.reviews));
  const current = decayedCurrent(state.current, state.currentAt, life, now);
  return { current: blend(current, vec(work.facets), 0.16), currentAt: now };
}

function todayCount(grokDay: Slice["grokDay"]): number {
  const day = new Date().toISOString().slice(0, 10);
  return grokDay.day === day ? grokDay.n : 0;
}

export const useTaste = create<TasteState>()(
  persist(
    (set, get) => ({
      laterUntil: {},
      never: [],
      queue: [],
      wishlist: [],
      reviews: [],
      fatigue: [],
      adjust: zero(),
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
      last: null,
      hydrated: false,
      accountReady: false,
      setHydrated: (hydrated) => set({ hydrated }),
      applyRemote: (raw) => set({ ...coerceTaste(raw), last: null, accountReady: true }),
      clearForNewAccount: () => set({ ...emptyTaste(), last: null, accountReady: true }),
      setVibe: (vibe) => set({ vibe }),
      undo: () => {
        const last = get().last;
        if (!last) return;
        set({ ...last.slice, last: null });
        if (!last.film) return;
        const film = last.film;
        void restoreFilm({ data: { work: film } }).then((result) => {
          if (result.ok) useShelf.getState().setCatalog(result.films, result.incoming);
        });
      },
      notTonight: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work) return;
        const now = Date.now();
        set({
          last: { label: `Not tonight · ${work.name}`, slice: sliceOf(state) },
          laterUntil: { ...state.laterUntil, [id]: now + COOLDOWN_NO },
          wishlist: state.wishlist.filter((item) => item !== id),
          fatigue: [
            ...state.fatigue.filter((event) => now - event.at < 8 * 86_400_000),
            { family: work.family, at: now },
          ],
          queue: state.queue.filter((item) => item.id !== id),
        });
      },
      notMine: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work) return;
        const adjust = add(state.adjust, scale(vec(work.facets), -0.08)).map((n) =>
          Math.min(0.4, Math.max(-0.4, n)),
        );
        const shelf = useShelf.getState();
        if (shelf.ready) {
          shelf.setCatalog(
            shelf.films.filter((item) => item.id !== id),
            shelf.incoming.filter((item) => item.id !== id),
          );
        }
        set({
          last: { label: `Off the catalogue · ${work.name}`, slice: sliceOf(state), film: work },
          adjust,
          never: state.never.includes(id) ? state.never : [...state.never, id],
          queue: state.queue.filter((item) => item.id !== id),
          wishlist: state.wishlist.filter((item) => item !== id),
          extras: state.extras.filter((item) => item.id !== id),
          laterUntil: { ...state.laterUntil, [id]: Number.MAX_SAFE_INTEGER },
        });
        void removeFilm({ data: { id } }).then((result) => {
          if (result.ok) useShelf.getState().setCatalog(result.films, result.incoming);
        });
      },
      yes: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work) return;
        const now = Date.now();
        const wait = work.loved ? COOLDOWN_WATCHED_LOVED : COOLDOWN_WATCHED_NEW;
        set({
          last: { label: `Yes · ${work.name}`, slice: sliceOf(state) },
          ...bumpCurrent(state, work, now),
          laterUntil: { ...state.laterUntil, [id]: now + wait },
          wishlist: state.wishlist.filter((item) => item !== id),
          queue: state.queue.filter((item) => item.id !== id),
        });
      },
      watched: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work) return;
        const now = Date.now();
        const wait = work.loved ? COOLDOWN_WATCHED_LOVED : COOLDOWN_WATCHED_NEW;
        set({
          last: { label: `Watched · ${work.name}`, slice: sliceOf(state) },
          queue: state.queue.filter((item) => item.id !== id),
          laterUntil: { ...state.laterUntil, [id]: now + wait },
        });
      },
      removeFromQueue: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        set({
          last: { label: work ? `Back on the deck · ${work.name}` : "Back on the deck", slice: sliceOf(state) },
          queue: state.queue.filter((item) => item.id !== id),
        });
      },
      restore: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        const laterUntil = { ...state.laterUntil };
        delete laterUntil[id];
        set({
          last: { label: work ? `Restored · ${work.name}` : "Restored", slice: sliceOf(state) },
          never: state.never.filter((item) => item !== id),
          laterUntil,
        });
      },
      demote: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work) return;
        set({
          last: { label: `Dropped · ${work.name}`, slice: sliceOf(state) },
          demoted: state.demoted.includes(id) ? state.demoted : [...state.demoted, id],
        });
      },
      undemote: (id) => {
        const state = get();
        set({
          last: { label: "Back on the all-time list", slice: sliceOf(state) },
          demoted: state.demoted.filter((item) => item !== id),
        });
      },
      addExtras: (works) => {
        const state = get();
        const have = new Set(known(state.extras).map((work) => work.name.toLowerCase()));
        const fresh = works.filter((work) => !have.has(work.name.toLowerCase()));
        set({ extras: [...fresh, ...state.extras].slice(0, 24) });
      },
      setWhy: (id, why) => set({ whys: { ...get().whys, [id]: why } }),
      toggleWishlist: (id) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work || state.never.includes(id)) return;
        const on = state.wishlist.includes(id);
        set({
          last: { label: on ? `Off later · ${work.name}` : `Later · ${work.name}`, slice: sliceOf(state) },
          wishlist: on ? state.wishlist.filter((item) => item !== id) : [id, ...state.wishlist.filter((item) => item !== id)],
        });
      },
      like: (id, note) => {
        const state = get();
        const work = findWork(id, state.extras);
        if (!work) return;
        const now = Date.now();
        const wait = work.loved ? COOLDOWN_WATCHED_LOVED : COOLDOWN_WATCHED_NEW;
        const adjust = add(state.adjust, scale(vec(work.facets), 0.05)).map((n) => Math.min(0.4, Math.max(-0.4, n)));
        const reviews = [{ id, note: note.trim().slice(0, 140), at: now }, ...state.reviews.filter((item) => item.id !== id)].slice(0, 80);
        set({
          last: { label: `Liked · ${work.name}`, slice: sliceOf(state) },
          reviews,
          adjust,
          ...bumpCurrent({ ...state, reviews }, work, now),
          queue: state.queue.filter((item) => item.id !== id),
          wishlist: state.wishlist.filter((item) => item !== id),
          laterUntil: { ...state.laterUntil, [id]: now + wait },
        });
      },
      setWatching: (id) => set({ watchingId: id }),
      setToday: (today) => set({ today: { key: today.key, vibe: today.vibe, ids: today.ids.slice(0, 5) } }),
      markShelf: () => set({ shelfAt: Date.now() }),
      grokLeft: () => 6 - todayCount(get().grokDay),
      markGrok: () => {
        const day = new Date().toISOString().slice(0, 10);
        const n = todayCount(get().grokDay);
        set({ grokDay: { day, n: n + 1 } });
      },
    }),
    {
      name: "tonight-taste",
      partialize: (state) => sliceOf(state),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.wishlist) state.wishlist = [];
        if (!state.reviews) state.reviews = [];
        if (!state.shelfAt) state.shelfAt = 0;
        if (!state.watchingId) state.watchingId = null;
        if (!state.today) state.today = null;
        state.setHydrated(true);
      },
    },
  ),
);
