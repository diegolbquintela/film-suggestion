import { useState } from "react";

const SLOTS = [0, 1, 2, 3, 4];

export function StartShelf({
  pending,
  error,
  onStart,
  onSkip,
}: {
  pending: boolean;
  error: string;
  onStart: (titles: string[]) => void;
  onSkip: () => void;
}) {
  const [titles, setTitles] = useState(["", "", "", "", ""]);
  const ready = titles.map((title) => title.trim()).filter((title) => title.length > 1).length >= 3;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-bg px-5 text-fg">
      <div className="w-full max-w-sm">
        <p className="text-sm text-muted">Before the deck</p>
        <h2 className="mt-2 font-serif text-3xl leading-none">Name a few you already like.</h2>
        <p className="mt-3 text-sm leading-normal text-muted">Three to five films or shows. The first suggestions come from these, and they become the start of your taste.</p>
        <div className="mt-6 space-y-2">
          {SLOTS.map((slot) => (
            <input
              key={slot}
              value={titles[slot]}
              onChange={(event) => setTitles(titles.map((title, index) => (index === slot ? event.target.value : title)))}
              placeholder={slot < 3 ? "Required" : "Optional"}
              aria-label={`Title ${slot + 1}`}
              className="min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
            />
          ))}
        </div>
        {error ? <p className="mt-4 text-sm">{error}</p> : null}
        <button
          type="button"
          disabled={!ready || pending}
          className="mt-6 min-h-11 w-full bg-fg text-sm text-bg disabled:opacity-40"
          onClick={() => onStart(titles.map((title) => title.trim()).filter((title) => title.length > 1))}
        >
          {pending ? "Finding the shelf" : "Start from these"}
        </button>
        <button type="button" className="mt-2 min-h-11 w-full text-sm text-muted" disabled={pending} onClick={onSkip}>
          Use the house shelf instead
        </button>
      </div>
    </div>
  );
}
