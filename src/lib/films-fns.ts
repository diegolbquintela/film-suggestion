import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { FAMILIES, FACETS, SEASONS, VIBES, type Family, type Season, type Vibe } from "@/lib/facets";
import type { Work } from "@/lib/work";

function asWork(raw: unknown, keepLoved: boolean): Work | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = String(row.id ?? "").trim().slice(0, 80);
  const name = String(row.name ?? "").trim().slice(0, 120);
  if (!id || name.length < 2) return null;
  const kind = row.kind === "series" ? "series" : "film";
  const family = FAMILIES.includes(row.family as Family) ? (row.family as Family) : "grief";
  const vibes = Array.isArray(row.vibes) ? row.vibes.filter((item): item is Vibe => VIBES.includes(item as Vibe)) : [];
  const seasons = Array.isArray(row.seasons)
    ? row.seasons.filter((item): item is Season => SEASONS.includes(item as Season))
    : [];
  const facets: Work["facets"] = {};
  if (row.facets && typeof row.facets === "object") {
    for (const key of FACETS) {
      const value = (row.facets as Record<string, unknown>)[key];
      if (typeof value === "number" && value > 0) facets[key] = Math.min(1, value);
    }
  }
  const summary = String(row.summary ?? "").trim().slice(0, 600);
  const why = String(row.why ?? "").trim().slice(0, 600);
  if (summary.length < 12 || why.length < 12) return null;
  return {
    id,
    name,
    year: String(row.year ?? "").slice(0, 12),
    kind,
    runtime: String(row.runtime ?? "one sitting").slice(0, 40),
    loved: keepLoved ? Boolean(row.loved) : false,
    weight: keepLoved && typeof row.weight === "number" ? Math.min(2, Math.max(0, row.weight)) : 0,
    hidden: keepLoved ? Boolean(row.hidden) : false,
    fromChat: Boolean(row.fromChat),
    family,
    vibes: vibes.length ? vibes : ["dusk"],
    seasons: seasons.length ? seasons : ["any"],
    facets,
    summary,
    why,
    vibeLine: String(row.vibeLine ?? "").slice(0, 160),
    preachy: typeof row.preachy === "number" ? Math.min(1, Math.max(0, row.preachy)) : 0,
  };
}

function parsePayload(payload: unknown): Work | null {
  if (typeof payload !== "string") return null;
  try {
    return asWork(JSON.parse(payload), true);
  } catch {
    return null;
  }
}

async function readSplit(userId: string): Promise<{ films: Work[]; incoming: Work[] }> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ payload: string; source: string }>`
    select payload, source from films where user_id = ${userId} order by created_at asc
  `;
  const films: Work[] = [];
  const incoming: Work[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const work = parsePayload(row.payload);
    if (!work || seen.has(work.name.toLowerCase())) continue;
    seen.add(work.name.toLowerCase());
    if (row.source === "incoming") incoming.push(work);
    else films.push(work);
  }
  return { films, incoming };
}

async function ensureSeed(userId: string): Promise<void> {
  const { getSql } = await import("@/lib/db");
  const { CATALOG } = await import("@/lib/catalog");
  const sql = await getSql();
  const counts = await sql<{ n: number }>`select count(*)::int as n from films where user_id = ${userId}`;
  if ((counts[0]?.n ?? 0) > 0) return;
  for (const work of CATALOG) {
    await sql`
      insert into films (user_id, id, name, payload, source)
      values (${userId}, ${work.id}, ${work.name}, ${JSON.stringify(work)}, 'seed')
      on conflict (user_id, id) do nothing
    `;
  }
}

export const listFilms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      await ensureSeed(context.userId);
      return { ok: true as const, ...(await readSplit(context.userId)) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "The shelf didn't load." };
    }
  });

function asAdd(input: unknown): { works: Work[]; source: "grok" | "liked" | "incoming" } {
  const data = input as { works?: unknown; source?: unknown } | null;
  if (!Array.isArray(data?.works)) throw new Error("No films");
  const works = data.works.map((item) => asWork(item, false)).filter((item): item is Work => Boolean(item)).slice(0, 12);
  if (!works.length) throw new Error("No films");
  const source = data?.source === "liked" || data?.source === "incoming" ? data.source : "grok";
  return { works, source };
}

export const addFilms = createServerFn({ method: "POST" })
  .validator(asAdd)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await ensureSeed(context.userId);
    const existing = await sql<{ name: string }>`select name from films where user_id = ${context.userId}`;
    const have = new Set(existing.map((row) => row.name.toLowerCase()));
    for (const work of data.works) {
      const key = work.name.toLowerCase();
      if (have.has(key)) continue;
      await sql`
        insert into films (user_id, id, name, payload, source)
        values (${context.userId}, ${work.id}, ${work.name}, ${JSON.stringify(work)}, ${data.source})
        on conflict (user_id, id) do nothing
      `;
      have.add(key);
    }
    return { ok: true as const, ...(await readSplit(context.userId)) };
  });

export const removeFilm = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const id = String((input as { id?: unknown } | null)?.id ?? "").trim().slice(0, 80);
    if (!id) throw new Error("Missing title");
    return { id };
  })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from films where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true as const, ...(await readSplit(context.userId)) };
  });

export const dropFilms = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const ids = Array.isArray((input as { ids?: unknown } | null)?.ids)
      ? (input as { ids: unknown[] }).ids.map((id) => String(id).slice(0, 80)).filter(Boolean).slice(0, 200)
      : [];
    return { ids };
  })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    for (const id of data.ids) {
      await sql`delete from films where id = ${id} and user_id = ${context.userId}`;
    }
    return { ok: true as const, ...(await readSplit(context.userId)) };
  });

export const promoteFilm = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const id = String((input as { id?: unknown } | null)?.id ?? "").trim().slice(0, 80);
    if (!id) throw new Error("Missing title");
    return { id };
  })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`update films set source = 'deck' where id = ${data.id} and user_id = ${context.userId} and source = 'incoming'`;
    return { ok: true as const, ...(await readSplit(context.userId)) };
  });

export const restoreFilm = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const work = asWork((input as { work?: unknown } | null)?.work, true);
    if (!work) throw new Error("Missing title");
    return { work };
  })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const source = data.work.loved ? "seed" : "deck";
    await sql`
      insert into films (user_id, id, name, payload, source)
      values (${context.userId}, ${data.work.id}, ${data.work.name}, ${JSON.stringify(data.work)}, ${source})
      on conflict (user_id, id) do nothing
    `;
    return { ok: true as const, ...(await readSplit(context.userId)) };
  });

export const pullWeekly = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const watching = String((input as { watching?: unknown } | null)?.watching ?? "").trim().slice(0, 120);
    return { watching };
  })
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    try {
      await ensureSeed(context.userId);
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const recent = await sql<{ id: string; added: number }>`
        select id, added from suggest_log
        where user_id = ${context.userId} and ran_at > now() - interval '7 days'
        order by ran_at desc
        limit 1
      `;
      const last = recent[0];
      if (last && last.added > 0) return { ok: true as const, added: 0, ...(await readSplit(context.userId)) };
      if (last) await sql`delete from suggest_log where id = ${last.id} and user_id = ${context.userId}`;

      const claim = `week-${Date.now()}`;
      await sql`insert into suggest_log (user_id, id, added) values (${context.userId}, ${claim}, 0)`;
      try {
        const rows = await sql<{ payload: string; source: string }>`
          select payload, source from films where user_id = ${context.userId} and source <> 'incoming'
        `;
        const names: string[] = [];
        const anchors: string[] = [];
        for (const row of rows) {
          const work = parsePayload(row.payload);
          if (!work) continue;
          names.push(work.name);
          if (work.loved || row.source === "liked") anchors.push(`${work.name} (${work.family})`);
        }
        const { fetchWeeklyPicks } = await import("@/lib/grok-fns");
        const picks = await fetchWeeklyPicks(anchors.slice(0, 36), names, data.watching);
        if (!picks.length) throw new Error("Grok didn't name anything usable.");
        for (const work of picks) {
          await sql`
            insert into films (user_id, id, name, payload, source)
            values (${context.userId}, ${work.id}, ${work.name}, ${JSON.stringify(work)}, 'incoming')
            on conflict (user_id, id) do nothing
          `;
        }
        await sql`update suggest_log set added = ${picks.length} where id = ${claim} and user_id = ${context.userId}`;
        return { ok: true as const, added: picks.length, ...(await readSplit(context.userId)) };
      } catch (error) {
        await sql`delete from suggest_log where id = ${claim} and user_id = ${context.userId}`;
        throw error;
      }
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "This week's five didn't land." };
    }
  });
