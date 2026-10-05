import { factsFor } from "@/lib/facts";
import { similarLine, type Scored } from "@/lib/score";

export function PickCard({
  item,
  why,
}: {
  item: Scored;
  why: string;
}) {
  const { work } = item;
  const facts = factsFor(work);
  const scores = [
    facts.google ? (["Google", facts.google] as const) : null,
    facts.imdb ? (["IMDb", facts.imdb] as const) : null,
    facts.rotten ? (["Rotten Tomatoes", facts.rotten] as const) : null,
  ].filter((row) => row !== null);
  return (
    <article>
      <p className="text-sm leading-none text-muted">Tonight</p>
      <p className="mt-1 font-serif text-lg tabular-nums leading-none text-fg">{item.tonight}</p>
      <h1 className="mt-5 font-serif text-4xl leading-tight text-fg">{work.name}</h1>
      <p className="mt-2 text-sm leading-normal text-muted">
        {work.year}
        {work.runtime ? ` · ${work.runtime}` : ""}
      </p>
      <dl className="mt-6 space-y-2 text-sm leading-normal">
        <Fact label="Director" value={facts.director} />
        <Fact label="Cast" value={facts.cast} />
        <Fact label="Genre" value={facts.genre} />
        {scores.map(([label, value]) => (
          <Fact key={label} label={label} value={value} />
        ))}
      </dl>
      <p className="mt-8 text-base leading-relaxed text-fg">{why}</p>
      <p className="mt-10 text-sm leading-normal text-muted">{similarLine(item.similar)}</p>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8.25rem_minmax(0,1fr)] gap-x-3">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 text-fg">{value}</dd>
    </div>
  );
}
