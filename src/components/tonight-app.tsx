import { WorkCard } from "@/components/work-card";
import { cn } from "@/lib/cn";
import { mergeWorks, useShelf } from "@/lib/catalog";
import { FAMILY_LABEL, FAMILIES, VIBE_LABEL, VIBES, type Vibe } from "@/lib/facets";
import { addFilms, dropFilms, listFilms, promoteFilm, pullWeekly } from "@/lib/films-fns";
import { describeLiked, sharpenWhy, suggestMore } from "@/lib/grok-fns";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { buildDeck, calendarSeason, dayKey, defaultVibe, type Scored } from "@/lib/score";
import { sliceOf, useTaste } from "@/lib/store";
import { tasteHasChoices } from "@/lib/taste";
import { loadTaste, saveTaste } from "@/lib/taste-fns";
import type { Work } from "@/lib/work";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type View = "feed" | "deck" | "liked" | "taste";

const SEASON_LINE: Record<string, string> = {
  autumn: "Fall. Left means not tonight.",
  winter: "Winter. Folk leads unless you switch.",
  summer: "Summer. Heat and the euro films.",
  any: "No season pushing. Rewatch is the default.",
};

const OWNER_KEY = "tonight-owner";

export function TonightApp() {
  const [view, setView] = useState<View>("feed");
  const [likeFor, setLikeFor] = useState<string | null>(null);
  const [weekNote, setWeekNote] = useState("");
  const films = useShelf((state) => state.films);
  const incoming = useShelf((state) => state.incoming);
  const user = useCurrentUser();
  const hydrated = useTaste((state) => state.hydrated);
  const accountReady = useTaste((state) => state.accountReady);

  useEffect(() => {
    if (!user?.id || !hydrated) return;
    let cancel = false;
    (async () => {
      const taste = await loadTaste();
      if (cancel || !taste.ok) return;
      const local = sliceOf(useTaste.getState());
      const owner = localStorage.getItem(OWNER_KEY);
      const remoteEmpty = !taste.found || !taste.payload || !tasteHasChoices(taste.payload);
      const keepLocal = remoteEmpty && tasteHasChoices(local) && (!owner || owner === user.id);
      if (keepLocal) {
        useTaste.getState().applyRemote(local);
        await saveTaste({ data: sliceOf(useTaste.getState()) });
      } else if (taste.found && taste.payload) {
        useTaste.getState().applyRemote(taste.payload);
      } else if (owner && owner !== user.id) {
        useTaste.getState().clearForNewAccount();
        await saveTaste({ data: sliceOf(useTaste.getState()) });
      } else {
        useTaste.getState().applyRemote(local);
        await saveTaste({ data: sliceOf(useTaste.getState()) });
      }
      if (cancel) return;
      localStorage.setItem(OWNER_KEY, user.id);

      const result = await listFilms();
      if (cancel || !result.ok) return;
      const extras = useTaste.getState().extras;
      const names = new Set([...result.films, ...result.incoming].map((film) => film.name.toLowerCase()));
      const missing = extras.filter((work) => !names.has(work.name.toLowerCase()));
      let next = result.films;
      let holding = result.incoming;
      if (missing.length) {
        const added = await addFilms({ data: { works: missing.slice(0, 12), source: "grok" } });
        if (added.ok) {
          next = added.films;
          holding = added.incoming;
        }
      }
      const banned = new Set(useTaste.getState().never);
      const gone = [...next, ...holding].filter((work) => banned.has(work.id)).map((work) => work.id);
      if (gone.length) {
        const pruned = await dropFilms({ data: { ids: gone } });
        if (pruned.ok) {
          next = pruned.films;
          holding = pruned.incoming;
        }
      }
      if (!cancel) useShelf.getState().setCatalog(next, holding);
      const pulled = await pullWeekly({ data: { watching: findName(useTaste.getState().watchingId ?? "") } });
      if (cancel) return;
      if (!pulled.ok) setWeekNote(pulled.error);
      else {
        setWeekNote("");
        useShelf.getState().setCatalog(pulled.films, pulled.incoming);
      }
    })().catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [user?.id, hydrated]);

  useEffect(() => {
    if (!user?.id || !accountReady) return;
    let last = JSON.stringify(sliceOf(useTaste.getState()));
    let timer = 0;
    const unsub = useTaste.subscribe((state) => {
      if (!state.accountReady) return;
      const next = JSON.stringify(sliceOf(state));
      if (next === last) return;
      last = next;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void saveTaste({ data: JSON.parse(next) as ReturnType<typeof sliceOf> });
      }, 400);
    });
    return () => {
      unsub();
      window.clearTimeout(timer);
    };
  }, [user?.id, accountReady]);

  if (!accountReady) {
    return (
      <main className="grid h-dvh place-items-center bg-bg text-fg">
        <p className="text-sm text-muted">Opening your shelf.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-bg text-fg lg:flex-row">
      <nav
        className="order-last grid shrink-0 grid-cols-4 border-t border-line lg:order-first lg:flex lg:w-36 lg:flex-col lg:gap-1 lg:border-t-0 lg:border-r lg:px-2 lg:pt-4"
        aria-label="Sections"
      >
        <NavButton current={view} id="feed" onSelect={setView} label="Feed" />
        <NavButton current={view} id="deck" onSelect={setView} label="Deck" />
        <NavButton current={view} id="liked" onSelect={setView} label="Liked" />
        <NavButton current={view} id="taste" onSelect={setView} label="Taste" />
      </nav>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header view={view} />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <section
            className={cn(
              "min-h-0 flex-col px-4 pb-2",
              view === "deck" ? "hidden" : "flex flex-1",
              "lg:flex lg:w-96 lg:flex-none lg:border-r lg:border-line",
            )}
          >
            {view === "liked" ? <Liked /> : null}
            {view === "taste" ? <Taste /> : null}
            {view === "feed" || view === "deck" ? (
              <Feed
                films={films}
                incoming={incoming}
                weekNote={weekNote}
                onOpenDeck={() => setView("deck")}
                onLike={setLikeFor}
              />
            ) : null}
          </section>
          <section
            className={cn(
              "min-h-0 flex-col px-4 pb-2",
              view === "deck" ? "flex flex-1" : "hidden",
              "lg:flex lg:min-w-0 lg:flex-1",
            )}
          >
            <Deck onLike={setLikeFor} />
          </section>
        </div>
        <UndoBar />
      </div>
      {likeFor ? <LikeSheet id={likeFor} onClose={() => setLikeFor(null)} /> : null}
    </main>
  );
}

function Header({ view }: { view: View }) {
  const queue = useTaste((state) => state.queue.length);
  const line =
    view === "feed"
      ? "The card opens the deck. The list under it is the shelf."
      : view === "deck"
        ? SEASON_LINE[calendarSeason()]
        : view === "liked"
          ? "Everything you marked liked. It stays here."
          : "All-time moves slowly. A like moves it. Drop a title if the read was wrong.";
  return (
    <header className="shrink-0 px-4 pt-3 pb-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h1 className="font-serif text-2xl leading-none">Tonight</h1>
        <div className="flex items-baseline gap-3">
          <p className="text-sm text-muted tabular-nums">{queue} waiting</p>
          <UserButton />
        </div>
      </div>
      <p className="mt-2 text-sm leading-normal text-muted lg:hidden">{line}</p>
      <p className="mt-2 hidden text-sm leading-normal text-muted lg:block">
        The list stays on the left. The card on the right is what to watch.
      </p>
      <WatchingNow />
    </header>
  );
}

function MoodRow() {
  const vibe = useVibe();
  return (
    <div className="shrink-0 pt-1 pb-2">
      <p className="hidden text-sm text-muted lg:block">{SEASON_LINE[calendarSeason()]}</p>
      <div className="relative -mx-4 mt-0 lg:mt-2">
        <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible">
          {VIBES.map((id) => (
            <VibeChip key={id} id={id} active={vibe === id} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-bg to-transparent lg:hidden" />
      </div>
    </div>
  );
}

function WatchingNow() {
  const watchingId = useTaste((state) => state.watchingId);
  const setWatching = useTaste((state) => state.setWatching);
  const films = useShelf((state) => state.films);
  const extras = useTaste((state) => state.extras);
  const works = useMemo(() => mergeWorks(films, extras), [films, extras]);
  const current = works.find((work) => work.id === watchingId);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? works.filter((work) => work.name.toLowerCase().includes(needle)).slice(0, 6)
    : [];

  return (
    <div className="mt-2">
      {current && !open ? (
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-sm">
            Watching <span className="font-medium">{current.name}</span>
          </p>
          <button type="button" className="min-h-11 shrink-0 text-sm text-muted" onClick={() => setWatching(null)}>
            Clear
          </button>
        </div>
      ) : (
        <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Watching now"}
        </button>
      )}
      {open ? (
        <div className="mt-1">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What are you in the middle of?"
            aria-label="What you are watching"
            className="min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {matches.length ? (
            <ul>
              {matches.map((work) => (
                <li key={work.id}>
                  <button
                    type="button"
                    className="min-h-11 w-full text-left text-sm"
                    onClick={() => {
                      setWatching(work.id);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    {work.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : needle ? (
            <p className="py-2 text-sm text-muted">Nothing on the shelf by that name.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function VibeChip({ id, active }: { id: Vibe; active: boolean }) {
  const setVibe = useTaste((state) => state.setVibe);
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => setVibe(id)}
      className={cn(
        "min-h-11 shrink-0 rounded-full border px-4 text-sm transition-transform duration-150 ease-out active:scale-[0.96]",
        active ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-muted",
      )}
    >
      {VIBE_LABEL[id]}
    </button>
  );
}

function useVibe(): Vibe {
  const override = useTaste((state) => state.vibe);
  return override ?? defaultVibe();
}

function useDeck(): Scored[] {
  const extras = useTaste((state) => state.extras);
  const films = useShelf((state) => state.films);
  const demoted = useTaste((state) => state.demoted);
  const never = useTaste((state) => state.never);
  const laterUntil = useTaste((state) => state.laterUntil);
  const queue = useTaste((state) => state.queue);
  const wishlist = useTaste((state) => state.wishlist);
  const reviews = useTaste((state) => state.reviews);
  const adjust = useTaste((state) => state.adjust);
  const current = useTaste((state) => state.current);
  const currentAt = useTaste((state) => state.currentAt);
  const fatigue = useTaste((state) => state.fatigue);
  const watchingId = useTaste((state) => state.watchingId);
  const vibe = useVibe();
  const works = useMemo(() => mergeWorks(films, extras), [films, extras]);
  const watching = works.find((work) => work.id === watchingId) ?? null;
  return useMemo(
    () =>
      buildDeck({
        works,
        demoted,
        never,
        laterUntil,
        queueIds: queue.map((item) => item.id),
        wishlistIds: wishlist,
        likedIds: reviews.map((review) => review.id),
        adjust,
        current,
        currentAt,
        fatigue,
        vibe,
        watching,
        now: Date.now(),
        key: dayKey(),
      }).deck,
    [works, demoted, never, laterUntil, queue, wishlist, reviews, adjust, current, currentAt, fatigue, vibe, watching],
  );
}

function Deck({ onLike }: { onLike: (id: string) => void }) {
  const deck = useDeck();
  const top = deck[0];
  const whys = useTaste((state) => state.whys);
  const notTonight = useTaste((state) => state.notTonight);
  const notMine = useTaste((state) => state.notMine);
  const yes = useTaste((state) => state.yes);
  const toggleWishlist = useTaste((state) => state.toggleWishlist);
  const wishlist = useTaste((state) => state.wishlist);
  const already = useTaste((state) => (top ? state.reviews.some((review) => review.id === top.work.id) : false));
  const wished = Boolean(top && wishlist.includes(top.work.id));
  const [x, setX] = useState(0);
  const [leaving, setLeaving] = useState<0 | -1 | 1>(0);
  const [busy, setBusy] = useState(false);
  const [grokError, setGrokError] = useState("");
  const [asking, setAsking] = useState<"more" | "why" | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const drag = useRef({ id: -1, startX: 0, startY: 0, lock: null as null | "x" | "y", x: 0 });

  useEffect(() => {
    setX(0);
    setLeaving(0);
    setBusy(false);
  }, [top?.work.id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!top || busy) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowLeft") act("no");
      if (event.key === "ArrowRight") act("yes");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function act(kind: "no" | "yes" | "never") {
    if (!top || busy) return;
    const id = top.work.id;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = kind === "yes" ? 1 : -1;
    const run = () => {
      if (kind === "yes") yes(id);
      else if (kind === "never") notMine(id);
      else notTonight(id);
      setBusy(false);
      setLeaving(0);
      setX(0);
    };
    if (reduced || kind === "never") {
      run();
      return;
    }
    setBusy(true);
    setLeaving(dir);
    window.setTimeout(run, 170);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (busy) return;
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lock: null, x: 0 };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const pointer = drag.current;
    if (pointer.id !== event.pointerId || busy) return;
    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    if (!pointer.lock) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      pointer.lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (pointer.lock === "x") event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (pointer.lock !== "x") return;
    pointer.x = dx;
    setX(dx);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const pointer = drag.current;
    if (pointer.id !== event.pointerId) return;
    const dx = pointer.lock === "x" ? pointer.x : 0;
    drag.current.id = -1;
    if (dx > 88) act("yes");
    else if (dx < -88) act("no");
    else setX(0);
  }

  async function askMore() {
    if (asking) return;
    if (useTaste.getState().grokLeft() <= 0) {
      setGrokError("That's enough Grok for today. The deck still works.");
      return;
    }
    setAsking("more");
    setGrokError("");
    const state = useTaste.getState();
    const names = knownNow().map((work) => work.name);
    const anchors = knownNow()
      .filter((work) => work.loved && !work.hidden && !state.demoted.includes(work.id))
      .slice(0, 36)
      .map((work) => work.name);
    try {
      const result = await suggestMore({
        data: {
          vibe: useVibeNow(),
          exclude: names,
          recentYes: state.queue.slice(0, 6).map((item) => findName(item.id)),
          recentNo: recentNoNames(),
          anchors,
          watching: findName(state.watchingId ?? ""),
        },
      });
      if (!result.ok) setGrokError(result.error);
      else {
        state.addExtras(result.picks);
        const saved = await addFilms({ data: { works: result.picks, source: "grok" } });
        if (saved.ok) useShelf.getState().setFilms(saved.films);
        state.markShelf();
        state.markGrok();
      }
    } catch (error) {
      setGrokError(error instanceof Error ? error.message : "Grok didn't answer.");
    } finally {
      setAsking(null);
    }
  }

  async function askWhy() {
    if (!top || asking) return;
    const cached = whys[top.work.id];
    if (cached) return;
    if (useTaste.getState().grokLeft() <= 0) {
      setGrokError("That's enough Grok for today.");
      return;
    }
    setAsking("why");
    setGrokError("");
    try {
      const result = await sharpenWhy({
        data: {
          name: top.work.name,
          summary: top.work.summary,
          vibe: useVibeNow(),
          anchors: top.similar.map((item) => item.name).join(", "),
        },
      });
      if (!result.ok) setGrokError(result.error);
      else {
        useTaste.getState().setWhy(top.work.id, result.why);
        useTaste.getState().markGrok();
      }
    } catch (error) {
      setGrokError(error instanceof Error ? error.message : "Grok didn't answer.");
    } finally {
      setAsking(null);
    }
  }

  const shift = leaving === 0 ? x : leaving * 420;
  const rotate = leaving === 0 ? x / 22 : leaving * 12;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MoodRow />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {deck[1] ? <div className="absolute inset-x-3 top-2 h-2 rounded-full bg-line" /> : null}
        {top ? (
          <div
            className="absolute inset-x-0 top-2 bottom-0 flex touch-pan-y overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translateX(${shift}px) rotate(${rotate}deg)`,
              transition: leaving !== 0 || x === 0 ? "transform 170ms ease-out" : "none",
            }}
          >
            <Stamp show={x > 36 || leaving === 1} side="left" label="Yes" />
            <Stamp show={x < -36 || leaving === -1} side="right" label="Not tonight" />
            <WorkCard
              item={top}
              why={whys[top.work.id] ?? top.work.why}
              badge={wished ? "Later" : undefined}
              extra={
                <button type="button" className="min-h-11 shrink-0 text-sm" onClick={() => setMoreOpen(true)}>
                  More
                </button>
              }
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-start justify-center gap-3">
            <p className="font-serif text-3xl leading-tight">Nothing left in this mood.</p>
            <p className="text-sm leading-normal text-muted">
              Left only cooled titles for about a week. Switch mood, or ask Grok for three that aren't on the shelf.
            </p>
          </div>
        )}
      </div>
      {grokError ? <p className="pt-2 text-sm text-muted">{grokError}</p> : null}
      <div className="grid shrink-0 grid-cols-2 gap-2 pt-2">
        <Action disabled={!top || busy} onClick={() => act("no")}>
          Not tonight
        </Action>
        <button
          type="button"
          disabled={!top || busy}
          onClick={() => act("yes")}
          className="min-h-11 rounded-full bg-accent px-3 text-sm font-medium text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40"
        >
          Yes — tonight
        </button>
        <Action disabled={!top || busy} onClick={() => top && toggleWishlist(top.work.id)}>
          {wished ? "On later" : "Later"}
        </Action>
        <Action disabled={!top || busy} onClick={() => top && onLike(top.work.id)}>
          {already ? "Liked" : "Liked it"}
        </Action>
      </div>
      {moreOpen ? (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-fg/40 lg:items-center lg:p-6" onClick={() => setMoreOpen(false)}>
          <div
            className="grid w-full max-w-lg gap-2 border-t border-line bg-bg px-4 pt-4 pb-5 lg:rounded-card lg:border"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="min-h-11 rounded-full border border-line text-sm"
              disabled={!top || busy}
              onClick={() => {
                setMoreOpen(false);
                act("never");
              }}
            >
              Not my thing
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-line text-sm"
              disabled={asking !== null}
              onClick={() => {
                setMoreOpen(false);
                void askMore();
              }}
            >
              {asking === "more" ? "Asking Grok…" : "Three more"}
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-line text-sm"
              disabled={!top || asking !== null}
              onClick={() => {
                setMoreOpen(false);
                void askWhy();
              }}
            >
              {asking === "why" ? "Asking…" : "Sharpen the why"}
            </button>
            <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setMoreOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stamp({ show, side, label }: { show: boolean; side: "left" | "right"; label: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-6 z-10 rounded-full border px-3 py-1 text-xs tracking-widest uppercase",
        side === "left" ? "left-5 border-accent text-accent" : "right-5 border-muted text-muted",
        show ? "opacity-100" : "opacity-0",
      )}
    >
      {label}
    </div>
  );
}

function Action({ children, onClick, disabled }: { children: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-11 rounded-full border border-line bg-surface px-3 text-sm text-fg transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Feed({
  films,
  incoming,
  weekNote,
  onOpenDeck,
  onLike,
}: {
  films: Work[];
  incoming: Work[];
  weekNote: string;
  onOpenDeck: () => void;
  onLike: (id: string) => void;
}) {
  const deck = useDeck();
  const queue = useTaste((state) => state.queue);
  const wishlist = useTaste((state) => state.wishlist);
  const extras = useTaste((state) => state.extras);
  const shelfAt = useTaste((state) => state.shelfAt);
  const toggleWishlist = useTaste((state) => state.toggleWishlist);
  const remove = useTaste((state) => state.removeFromQueue);
  const notMine = useTaste((state) => state.notMine);
  const works = useMemo(() => mergeWorks(films, extras), [films, extras]);
  const byId = useMemo(() => new Map(works.map((work) => [work.id, work])), [works]);
  const waiting = queue.map((item) => byId.get(item.id)).filter((work): work is Work => Boolean(work));
  const later = wishlist.map((id) => byId.get(id)).filter((work): work is Work => Boolean(work));
  const rows = deck.filter((item) => !wishlist.includes(item.work.id));
  const stale = shelfAt === 0 || Date.now() - shelfAt > 7 * 86_400_000;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <button
        type="button"
        onClick={onOpenDeck}
        className="mb-2 w-full rounded-card border-2 border-fg bg-fg px-5 py-5 text-left text-accent-fg"
      >
        <p className="text-xs tracking-widest uppercase opacity-70">The deck</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">{deck[0]?.work.name ?? "Tonight"}</h2>
        <p className="mt-2 text-sm leading-normal opacity-75">
          {deck[0] ? deck[0].work.vibeLine : "Open when you want a yes or a not-tonight."}
        </p>
        <p className="mt-4 text-sm">Open</p>
      </button>

      {weekNote ? <p className="mb-4 text-sm leading-normal text-muted">{weekNote}</p> : null}
      {incoming.length ? (
        <section className="border-b border-line py-4">
          <h2 className="text-xs tracking-widest text-muted uppercase">This week</h2>
          <p className="mt-2 text-sm leading-normal text-muted">Five titles drawn from what you kept. They stay here until you move one onto the deck.</p>
          <ul>
            {incoming.map((work) => (
              <li key={work.id} className="border-b border-line py-4">
                <p className="font-serif text-xl leading-tight">{work.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {work.year} · {FAMILY_LABEL[work.family]}
                </p>
                <p className="mt-2 text-sm leading-normal">{work.why}</p>
                <div className="mt-1 flex gap-4">
                  <button
                    type="button"
                    className="min-h-11 text-sm"
                    onClick={() => {
                      void promoteFilm({ data: { id: work.id } }).then((result) => {
                        if (result.ok) useShelf.getState().setCatalog(result.films, result.incoming);
                      });
                    }}
                  >
                    To the deck
                  </button>
                  <button type="button" className="min-h-11 text-sm text-muted" onClick={() => notMine(work.id)}>
                    Not my thing
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {waiting.length ? (
        <section className="border-b border-line py-4">
          <h2 className="text-xs tracking-widest text-muted uppercase">Waiting</h2>
          <ul>
            {waiting.map((work) => (
              <li key={work.id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-sm">{work.name}</span>
                <button type="button" className="min-h-11 text-sm text-muted" onClick={() => remove(work.id)}>
                  Back
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {later.length ? (
        <section className="border-b border-line py-4">
          <h2 className="text-xs tracking-widest text-muted uppercase">Later</h2>
          <ul>
            {later.map((work) => (
              <FeedRow key={work.id} work={work} onLike={onLike} onLater={() => toggleWishlist(work.id)} later />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="py-4">
        <h2 className="text-xs tracking-widest text-muted uppercase">On the shelf</h2>
        <ul>
          {rows.map((item) => (
            <FeedRow
              key={item.work.id}
              work={item.work}
              line={item.work.why}
              onLike={onLike}
              onLater={() => toggleWishlist(item.work.id)}
            />
          ))}
        </ul>
      </section>

      <AddLiked works={works} />
      <p className="pb-6 text-sm leading-normal text-muted">
        {stale
          ? "Once a week, five new titles land above the shelf. They are not on the deck until you add them."
          : "Likes stay tagged. Not my thing leaves the catalogue. The weekly five is drawn from what remains."}
      </p>
    </div>
  );
}

function FeedRow({
  work,
  line,
  later,
  onLike,
  onLater,
}: {
  work: Work;
  line?: string;
  later?: boolean;
  onLike: (id: string) => void;
  onLater: () => void;
}) {
  return (
    <li className="border-b border-line py-4">
      <p className="font-serif text-xl leading-tight">{work.name}</p>
      <p className="mt-1 text-sm text-muted">
        {work.year}
        {" · "}
        {work.kind === "series" ? "Series" : "Film"}
        {later ? " · later" : ""}
      </p>
      <p className="mt-2 text-sm leading-normal">{line ?? work.summary}</p>
      <div className="mt-1 flex gap-4">
        <button type="button" className="min-h-11 text-sm text-muted" onClick={onLater}>
          {later ? "Remove" : "Later"}
        </button>
        <button type="button" className="min-h-11 text-sm" onClick={() => onLike(work.id)}>
          Liked it
        </button>
      </div>
    </li>
  );
}

function AddLiked({ works }: { works: Work[] }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    const title = name.trim();
    if (title.length < 2 || busy) return;
    setBusy(true);
    setError("");
    const have = works.find((work) => work.name.toLowerCase() === title.toLowerCase());
    if (have) {
      useTaste.getState().like(have.id, note);
      setName("");
      setNote("");
      setBusy(false);
      return;
    }
    const anchors = works
      .filter((work) => work.loved && !work.hidden)
      .slice(0, 20)
      .map((work) => work.name);
    try {
      const described = await describeLiked({ data: { name: title, note, anchors } });
      if (!described.ok) {
        setError(described.error);
        return;
      }
      useTaste.getState().addExtras([described.work]);
      const saved = await addFilms({ data: { works: [described.work], source: "liked" } });
      if (saved.ok) useShelf.getState().setFilms(saved.films);
      useTaste.getState().like(described.work.id, note);
      useTaste.getState().markGrok();
      setName("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That title didn't save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border-t border-line py-4">
      <h2 className="text-xs tracking-widest text-muted uppercase">I watched something</h2>
      <p className="mt-2 text-sm leading-normal text-muted">A like joins the shelf and pulls the next cards toward it.</p>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Title"
        aria-label="Title you liked"
        className="mt-3 min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
      />
      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="One line, optional"
        aria-label="Why you liked it"
        className="mt-2 min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
      />
      {error ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
      <button
        type="button"
        disabled={busy || name.trim().length < 2}
        onClick={submit}
        className="mt-3 min-h-11 text-sm underline decoration-line underline-offset-4 disabled:opacity-40"
      >
        {busy ? "Saving…" : "I liked it"}
      </button>
    </section>
  );
}

function LikeSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const [note, setNote] = useState("");
  const name = findName(id);
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-fg/40 lg:items-center lg:p-6" onClick={onClose}>
      <div
        className="w-full max-w-lg border-t border-line bg-bg px-4 pt-4 pb-5 lg:rounded-card lg:border"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-serif text-xl leading-tight">Liked {name}</p>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="One line, optional"
          aria-label="Why you liked it"
          className="mt-2 min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="min-h-11 flex-1 rounded-full bg-accent text-sm text-accent-fg"
            onClick={() => {
              useTaste.getState().like(id, note);
              onClose();
            }}
          >
            Save
          </button>
          <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Liked() {
  const reviews = useTaste((state) => state.reviews);
  const extras = useTaste((state) => state.extras);
  const films = useShelf((state) => state.films);
  const works = useMemo(() => mergeWorks(films, extras), [films, extras]);
  const byId = useMemo(() => new Map(works.map((work) => [work.id, work])), [works]);

  if (!reviews.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
        <p className="font-serif text-3xl leading-tight">Nothing liked yet.</p>
        <p className="text-sm leading-normal text-muted">On a card, Liked it keeps the title here so you can come back to it.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <ul>
        {reviews.map((review) => {
          const work = byId.get(review.id);
          return (
            <li key={review.id} className="border-b border-line py-4">
              <p className="font-serif text-xl leading-tight">{work?.name ?? "A title"}</p>
              <p className="mt-1 text-sm text-muted">
                {work ? `${work.year} · ` : ""}
                {new Date(review.at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              {review.note ? <p className="mt-2 text-sm leading-normal">{review.note}</p> : null}
              {work ? <p className="mt-2 text-sm leading-normal text-muted">{work.summary}</p> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Taste() {
  const extras = useTaste((state) => state.extras);
  const films = useShelf((state) => state.films);
  const demoted = useTaste((state) => state.demoted);
  const never = useTaste((state) => state.never);
  const demote = useTaste((state) => state.demote);
  const undemote = useTaste((state) => state.undemote);
  const restore = useTaste((state) => state.restore);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const works = mergeWorks(films, extras);
  const needle = query.trim().toLowerCase();
  const loved = works.filter((work) => work.loved && !work.hidden && !demoted.includes(work.id));
  const dropped = works.filter((work) => demoted.includes(work.id));
  const banned = works.filter((work) => never.includes(work.id));

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-4">
      <p className="text-sm leading-normal text-muted">
        Left is not tonight — it comes back in about a week. Not my thing leaves the catalogue. Likes stay, tagged,
        and the weekly five is drawn from those.
      </p>
      <ul className="mt-4 grid gap-2 text-sm leading-normal text-fg">
        <li>Bullitt, not Bullet. The Thomas Crown Affair, not Cromwell — Wolf Hall is the Cromwell, and it's on the shelf.</li>
        <li>The Promised Land is the 2023 Mads Mikkelsen film. Drop it if you meant a Steve McQueen picture.</li>
        <li>Ripley is the 1999 film plus the 2024 series. Purple Noon is a suggestion.</li>
        <li>Servant and Widow's Bay stayed in from the earlier chats. Widow's Bay still outranks From.</li>
      </ul>
      <div className="mt-4 flex items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a title"
          aria-label="Find a title"
          className="min-h-11 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-fg outline-none placeholder:text-muted"
        />
        <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setEditing((value) => !value)}>
          {editing ? "Done" : "Edit"}
        </button>
      </div>
      {FAMILIES.map((family) => {
        const group = loved.filter((work) => work.family === family && (!needle || work.name.toLowerCase().includes(needle)));
        if (!group.length) return null;
        return (
          <section key={family} className="mt-5">
            <h2 className="text-xs tracking-widest text-muted uppercase">{FAMILY_LABEL[family]}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {group.map((work) => (
                <li key={work.id}>
                  <button
                    type="button"
                    disabled={!editing}
                    onClick={() => demote(work.id)}
                    className={cn(
                      "min-h-11 rounded-full border border-line bg-surface px-3 text-sm text-fg",
                      editing && "border-muted",
                    )}
                  >
                    {work.name}
                    {work.fromChat ? " ·" : ""}
                    {editing ? "  · drop" : ""}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {dropped.length ? (
        <section className="mt-6">
          <h2 className="text-xs tracking-widest text-muted uppercase">Dropped from all-time</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dropped.map((work) => (
              <li key={work.id}>
                <button type="button" className="min-h-11 rounded-full border border-line px-3 text-sm text-muted" onClick={() => undemote(work.id)}>
                  {work.name} · restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {banned.length ? (
        <section className="mt-6">
          <h2 className="text-xs tracking-widest text-muted uppercase">Not my thing</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {banned.map((work) => (
              <li key={work.id}>
                <button type="button" className="min-h-11 rounded-full border border-line px-3 text-sm text-muted" onClick={() => restore(work.id)}>
                  {work.name} · restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function UndoBar() {
  const last = useTaste((state) => state.last);
  const undo = useTaste((state) => state.undo);
  if (!last) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-1">
      <p className="truncate text-sm text-muted">{last.label}</p>
      <button type="button" className="min-h-11 shrink-0 text-sm text-fg" onClick={undo}>
        Undo
      </button>
    </div>
  );
}

function NavButton({
  current,
  id,
  label,
  onSelect,
}: {
  current: View;
  id: View;
  label: string;
  onSelect: (view: View) => void;
}) {
  const later = useTaste((state) => state.wishlist.length);
  const liked = useTaste((state) => state.reviews.length);
  const active = current === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "min-h-12 text-sm lg:px-3 lg:text-left",
        active ? "text-fg lg:border-l-2 lg:border-fg" : "text-muted lg:border-l-2 lg:border-transparent",
      )}
    >
      {label}
      {id === "feed" && later ? <span className="tabular-nums"> {later}</span> : null}
      {id === "liked" && liked ? <span className="tabular-nums"> {liked}</span> : null}
    </button>
  );
}

function useVibeNow(): Vibe {
  return useTaste.getState().vibe ?? defaultVibe();
}

function knownNow(): Work[] {
  return mergeWorks(useShelf.getState().films, useTaste.getState().extras);
}

function findName(id: string): string {
  return knownNow().find((work) => work.id === id)?.name ?? id;
}

function recentNoNames(): string[] {
  const { laterUntil } = useTaste.getState();
  const now = Date.now();
  const works = knownNow();
  return Object.entries(laterUntil)
    .filter(([, until]) => until > now && until < Number.MAX_SAFE_INTEGER / 2)
    .slice(0, 8)
    .map(([id]) => works.find((work) => work.id === id)?.name ?? "")
    .filter(Boolean);
}
