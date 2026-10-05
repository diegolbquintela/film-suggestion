import { PickCard } from "@/components/work-card";
import { cn } from "@/lib/cn";
import { CATALOG, mergeWorks, useShelf } from "@/lib/catalog";
import { VIBE_LABEL, VIBES, type Vibe } from "@/lib/facets";
import { addFilms, dropFilms, listFilms } from "@/lib/films-fns";
import { suggestMore } from "@/lib/grok-fns";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { buildDeck, dayKey, defaultVibe, scoreKept, type DeckInput, type Scored } from "@/lib/score";
import { sliceOf, useTaste } from "@/lib/store";
import { tasteHasChoices } from "@/lib/taste";
import { loadTaste, saveTaste } from "@/lib/taste-fns";
import type { Work } from "@/lib/work";
import { useEffect, useMemo, useState } from "react";

type View = "today" | "saved";

const OWNER_KEY = "tonight-owner";

export function TonightApp({ guest = false, onSignIn }: { guest?: boolean; onSignIn?: () => void }) {
  const [view, setView] = useState<View>("today");
  const [openId, setOpenId] = useState<string | null>(null);
  const user = useCurrentUser();
  const hydrated = useTaste((state) => state.hydrated);
  const accountReady = useTaste((state) => state.accountReady);

  useEffect(() => {
    if (!guest || !hydrated) return;
    useTaste.getState().applyRemote(sliceOf(useTaste.getState()));
    if (!useShelf.getState().films.length) useShelf.getState().setCatalog(CATALOG, []);
  }, [guest, hydrated]);

  useEffect(() => {
    if (guest || !user?.id || !hydrated) return;
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
    })().catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [user?.id, hydrated, guest]);

  useEffect(() => {
    if (!user?.id || !accountReady || guest) return;
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
  }, [user?.id, accountReady, guest]);

  if (!accountReady) {
    return (
      <main className="grid h-dvh place-items-center bg-bg text-fg">
        <p className="text-sm text-muted">Opening your shelf.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh max-h-svh w-full max-w-lg flex-col overflow-hidden bg-bg pt-[env(safe-area-inset-top)] text-fg">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {view === "saved" ? <Saved /> : <Today openId={openId} onOpen={setOpenId} guest={guest} onSignIn={onSignIn} />}
      </div>
      <nav
        className="grid shrink-0 grid-cols-2 border-t border-line pb-[env(safe-area-inset-bottom)]"
        aria-label="Sections"
      >
        <NavButton current={view} id="today" label="Today" onSelect={setView} />
        <NavButton current={view} id="saved" label="Saved" onSelect={setView} />
      </nav>
    </main>
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
  const active = current === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn("min-h-12 text-sm", active ? "text-fg" : "text-muted")}
    >
      {label}
    </button>
  );
}

function useRankInput(): DeckInput {
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
  const vibe = useVibe();
  const works = useMemo(() => mergeWorks(films, extras), [films, extras]);
  return useMemo(
    () => ({
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
      watching: null,
      now: Date.now(),
      key: dayKey(),
    }),
    [works, demoted, never, laterUntil, queue, wishlist, reviews, adjust, current, currentAt, fatigue, vibe],
  );
}

function useVibe(): Vibe {
  const override = useTaste((state) => state.vibe);
  return override ?? defaultVibe();
}

function useTodayList(): { shown: Scored[]; done: number; total: number } {
  const input = useRankInput();
  const ready = useShelf((state) => state.ready);
  const today = useTaste((state) => state.today);
  const laterUntil = useTaste((state) => state.laterUntil);
  const never = useTaste((state) => state.never);
  const vibe = input.vibe;
  const key = input.key;
  const deck = useMemo(() => buildDeck(input).deck, [input]);

  useEffect(() => {
    if (!ready) return;
    const state = useTaste.getState();
    if (state.today && state.today.key === key && state.today.vibe === vibe) return;
    const ids = deck.slice(0, 5).map((item) => item.work.id);
    if (!ids.length) return;
    state.setToday({ key, vibe, ids });
  }, [ready, key, vibe, deck]);

  const ids = today && today.key === key && today.vibe === vibe ? today.ids : deck.slice(0, 5).map((item) => item.work.id);
  const now = Date.now();
  const shown = useMemo(
    () =>
      scoreKept(input, ids).filter(
        (item) => !item.work.hidden && !never.includes(item.work.id) && (laterUntil[item.work.id] ?? 0) <= now,
      ),
    [input, ids, never, laterUntil, now],
  );
  const total = ids.length || 5;
  return { shown, done: Math.max(0, total - shown.length), total };
}

function Today({
  openId,
  onOpen,
  guest,
  onSignIn,
}: {
  openId: string | null;
  onOpen: (id: string | null) => void;
  guest: boolean;
  onSignIn?: () => void;
}) {
  const { shown, done, total } = useTodayList();
  const whys = useTaste((state) => state.whys);
  const open = shown.find((item) => item.work.id === openId) ?? null;
  const date = new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-2">
        <div className="min-w-0">
          <p className="text-sm text-muted">{date}</p>
          <p className="mt-1 font-serif text-3xl leading-none">
            {done} of {total}
          </p>
        </div>
        {guest ? (
          <button type="button" className="min-h-11 shrink-0 text-sm" onClick={onSignIn}>
            Sign in
          </button>
        ) : (
          <div className="min-w-0 shrink">
            <UserButton />
          </div>
        )}
      </header>
      {open ? (
        <CardView item={open} why={whys[open.work.id] ?? open.work.why} onClose={() => onOpen(null)} />
      ) : (
        <TodayBody shown={shown} onOpen={onOpen} />
      )}
    </div>
  );
}

function TodayBody({ shown, onOpen }: { shown: Scored[]; onOpen: (id: string) => void }) {
  const ready = useShelf((state) => state.ready);
  if (!ready) return <p className="px-5 pt-6 text-sm text-muted">Opening your shelf.</p>;
  return <TodayList shown={shown} onOpen={onOpen} />;
}

function TodayList({ shown, onOpen }: { shown: Scored[]; onOpen: (id: string) => void }) {
  const vibe = useVibe();
  const setVibe = useTaste((state) => state.setVibe);
  if (!shown.length) return <EmptyToday />;
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5">
      <div className="flex min-w-0 gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
        {VIBES.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={vibe === id}
            onClick={() => setVibe(id)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-4 text-sm",
              vibe === id ? "border-fg bg-fg text-bg" : "border-line text-fg",
            )}
          >
            {VIBE_LABEL[id]}
          </button>
        ))}
      </div>
      <ul>
        {shown.map((item) => (
          <li key={item.work.id} className="border-b border-line">
            <button type="button" className="w-full py-5 text-left" onClick={() => onOpen(item.work.id)}>
              <span className="block font-serif text-2xl leading-tight">{item.work.name}</span>
              <span className="mt-1 block text-sm text-muted">
                {item.work.year}
                {item.work.runtime ? ` · ${item.work.runtime}` : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyToday() {
  const input = useRankInput();
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const left = useTaste((state) => {
    const day = new Date().toISOString().slice(0, 10);
    const n = state.grokDay.day === day ? state.grokDay.n : 0;
    return 6 - n;
  });

  async function ask() {
    if (asking || left <= 0) return;
    setAsking(true);
    setError("");
    const state = useTaste.getState();
    const works = mergeWorks(useShelf.getState().films, state.extras);
    try {
      const result = await suggestMore({
        data: {
          vibe: input.vibe,
          exclude: works.map((work) => work.name),
          recentYes: [],
          recentNo: [],
          anchors: works
            .filter((work) => work.loved && !work.hidden && !state.demoted.includes(work.id))
            .slice(0, 36)
            .map((work) => work.name),
          watching: "",
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.picks.length) {
        state.addExtras(result.picks);
        const saved = await addFilms({ data: { works: result.picks, source: "grok" } });
        if (saved.ok) useShelf.getState().setCatalog(saved.films, saved.incoming);
        state.setToday({
          key: input.key,
          vibe: input.vibe,
          ids: result.picks.map((work) => work.id).slice(0, 5),
        });
      }
      state.markGrok();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Grok didn't answer.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-5">
      <p className="font-serif text-3xl leading-tight">Nothing left for today.</p>
      <button
        type="button"
        className="mt-6 min-h-11 text-left text-sm underline decoration-line underline-offset-4 disabled:opacity-40"
        disabled={asking || left <= 0}
        onClick={() => void ask()}
      >
        {asking ? "Asking…" : "Ask Grok for more"}
      </button>
      {error ? <p className="mt-3 text-sm text-fg">{error}</p> : null}
    </div>
  );
}

function CardView({ item, why, onClose }: { item: Scored; why: string; onClose: () => void }) {
  const [more, setMore] = useState(false);
  const [liking, setLiking] = useState(false);
  const [note, setNote] = useState("");
  const id = item.work.id;

  function finish(run: () => void) {
    run();
    onClose();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-8">
        <button type="button" className="min-h-11 text-sm text-fg" onClick={onClose}>
          Today
        </button>
        <div className="mt-4">
          <PickCard item={item} why={why} />
        </div>
      </div>
      <div className="shrink-0 border-t border-line px-5 py-3">
        {liking ? (
          <div className="grid gap-2">
            <input
              value={note}
              onChange={(event) => setNote(event.target.value.slice(0, 140))}
              placeholder="A note, optional"
              aria-label="Note"
              className="min-h-11 w-full border-b border-line bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="min-h-11 rounded-full border border-line text-sm" onClick={() => setLiking(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="min-h-11 rounded-full bg-fg text-sm text-bg"
                onClick={() => finish(() => useTaste.getState().like(id, note))}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="min-h-11 rounded-full border border-line text-sm text-fg"
                onClick={() => finish(() => useTaste.getState().notTonight(id))}
              >
                Not tonight
              </button>
              <button
                type="button"
                className="min-h-11 rounded-full bg-fg text-sm text-bg"
                onClick={() => finish(() => useTaste.getState().yes(id))}
              >
                Yes
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="min-h-11 rounded-full border border-line text-sm text-fg" onClick={() => setLiking(true)}>
                Like
              </button>
              <button type="button" className="min-h-11 rounded-full border border-line text-sm text-fg" onClick={() => setMore((open) => !open)}>
                More
              </button>
            </div>
            {more ? (
              <button
                type="button"
                className="min-h-11 rounded-full border border-line text-sm text-muted"
                onClick={() => finish(() => useTaste.getState().notMine(id))}
              >
                Not mine
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function Saved() {
  const reviews = useTaste((state) => state.reviews);
  const films = useShelf((state) => state.films);
  const extras = useTaste((state) => state.extras);
  const works = useMemo(() => mergeWorks(films, extras), [films, extras]);
  const byId = useMemo(() => new Map(works.map((work) => [work.id, work])), [works]);
  const rows = reviews
    .map((review) => ({ review, work: byId.get(review.id) }))
    .filter((row): row is { review: (typeof reviews)[number]; work: Work } => Boolean(row.work));

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">
      <h1 className="font-serif text-3xl leading-none">Saved</h1>
      {rows.length ? (
        <ul className="mt-4">
          {rows.map(({ review, work }) => (
            <li key={review.id} className="border-b border-line py-5">
              <p className="font-serif text-2xl leading-tight">{work.name}</p>
              {review.note ? <p className="mt-2 text-sm leading-normal text-fg">{review.note}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm leading-normal text-muted">Nothing saved yet.</p>
      )}
    </div>
  );
}

