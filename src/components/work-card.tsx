import type { CSSProperties, ReactNode } from "react";
import { FAMILY_LABEL } from "@/lib/facets";
import { similarLine, type Scored } from "@/lib/score";

export function WorkCard({
  item,
  why,
  badge,
  style,
  extra,
}: {
  item: Scored;
  why: string;
  badge?: string;
  style?: CSSProperties;
  extra?: ReactNode;
}) {
  const { work } = item;
  return (
    <article
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-line bg-surface"
      style={style}
    >
      <div className="shrink-0 border-b border-line bg-surface-2 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase">
          <span>
            {work.loved ? "Rewatch" : item.vibeMatch ? "New" : "Stretch"}
            {" · "}
            {work.kind === "series" ? "Series" : "Film"}
          </span>
          <span className="tabular-nums">{work.year}</span>
        </div>
        {badge ? <p className="mt-2 text-xs tracking-widest text-fg uppercase">{badge}</p> : null}
        <h2 className="mt-2 font-serif text-3xl leading-tight text-fg">{work.name}</h2>
        <p className="mt-1 text-sm leading-normal text-muted">
          {work.runtime}
          {" · "}
          {FAMILY_LABEL[work.family]}
          {work.fromChat ? " · earlier chat" : ""}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
        <p className="text-sm leading-normal text-fg">{work.summary}</p>
        <div>
          <h3 className="text-xs tracking-widest text-muted uppercase">Why you'll like it</h3>
          <p className="mt-1 text-sm leading-normal text-fg">{why}</p>
        </div>
        <div>
          <h3 className="text-xs tracking-widest text-muted uppercase">Close to</h3>
          <p className="mt-1 text-sm leading-normal text-fg">{similarLine(item.similar)}</p>
        </div>
        <div>
          <h3 className="text-xs tracking-widest text-muted uppercase">Vibe</h3>
          <p className="mt-1 text-sm leading-normal text-fg">{work.vibeLine}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-2">
        <p className="text-xs text-muted tabular-nums">
          All-time {item.allTime}
          <span className="px-2 text-line">·</span>
          Tonight {item.tonight}
        </p>
        {extra}
      </div>
    </article>
  );
}
