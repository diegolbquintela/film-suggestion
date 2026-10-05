import { similarLine, type Scored } from "@/lib/score";

export function PickCard({
  item,
  why,
}: {
  item: Scored;
  why: string;
}) {
  const { work } = item;
  return (
    <article>
      <p className="font-serif text-lg tabular-nums leading-none text-fg">{item.tonight}</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-fg">{work.name}</h1>
      <p className="mt-2 text-sm leading-normal text-muted">
        {work.year}
        {work.runtime ? ` · ${work.runtime}` : ""}
      </p>
      <p className="mt-8 text-base leading-relaxed text-fg">{why}</p>
      <p className="mt-10 text-sm leading-normal text-muted">{similarLine(item.similar)}</p>
    </article>
  );
}
