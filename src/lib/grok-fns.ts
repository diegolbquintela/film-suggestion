import { createServerFn } from "@tanstack/react-start";
import { FAMILIES, FACETS, SEASONS, VIBES, type Family, type Season, type Vibe } from "@/lib/facets";
import type { Work } from "@/lib/work";

const DAILY_CAP = 12;
let bucket = { day: "", n: 0 };

function chargeServer(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (bucket.day !== day) bucket = { day, n: 0 };
  if (bucket.n >= DAILY_CAP) return false;
  bucket.n += 1;
  return true;
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error("not json");
  }
}

async function complete(system: string, user: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("Grok isn't available in this sitting. The deck still ranks from your list.");
  if (!chargeServer()) throw new Error("That's enough Grok for today. The deck still works.");

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.5,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) throw new Error("Grok is unavailable right now.");
  const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Grok returned nothing.");
  return text;
}

const SYSTEM = `You program a private film and television deck for one viewer.
Suggest only real, already-released films and series. Never invent titles.
No spoilers past the premise. Avoid preachy prestige and empty franchise noise.
The viewer loves austere folk grief (Lamb, The Witch, You Won't Be Alone), domestic uncanny (Servant, Hereditary), institutional mystery (Severance, The Wire), moral spy marriage (The Americans), character crime (Goodfellas, The Sopranos), euro-summer desire (Vicky Cristina Barcelona, Ripley), court intrigue, and crafted war.
They do not want jump-scare slashers or films that lecture them.
Reply with JSON only.`;

type SuggestInput = {
  vibe: string;
  exclude: string[];
  recentYes: string[];
  recentNo: string[];
  anchors: string[];
  watching: string;
};

function asSuggest(input: unknown): SuggestInput {
  const data = input as Partial<SuggestInput> | null;
  const vibe = String(data?.vibe ?? "");
  if (!VIBES.includes(vibe as Vibe)) throw new Error("Unknown mood");
  const list = (value: unknown, max: number) =>
    Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean).slice(0, max) : [];
  return {
    vibe,
    exclude: list(data?.exclude, 180),
    recentYes: list(data?.recentYes, 8),
    recentNo: list(data?.recentNo, 8),
    anchors: list(data?.anchors, 40),
    watching: String(data?.watching ?? "").slice(0, 120),
  };
}

function asWhy(input: unknown): { name: string; summary: string; anchors: string; vibe: string } {
  const data = input as { name?: unknown; summary?: unknown; anchors?: unknown; vibe?: unknown } | null;
  const name = String(data?.name ?? "").slice(0, 120);
  const summary = String(data?.summary ?? "").slice(0, 500);
  if (!name || !summary) throw new Error("Missing title");
  return {
    name,
    summary,
    anchors: String(data?.anchors ?? "").slice(0, 300),
    vibe: String(data?.vibe ?? "").slice(0, 40),
  };
}

function toWork(raw: unknown, taken: Set<string>): Work | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const name = String(row.name ?? "").trim();
  if (name.length < 2 || taken.has(name.toLowerCase())) return null;
  const kind = row.kind === "series" ? "series" : "film";
  const family = FAMILIES.includes(row.family as Family) ? (row.family as Family) : "grief";
  const vibes = Array.isArray(row.vibes) ? row.vibes.filter((item): item is Vibe => VIBES.includes(item as Vibe)) : [];
  const seasons = Array.isArray(row.seasons)
    ? row.seasons.filter((item): item is Season => SEASONS.includes(item as Season))
    : ["any" as Season];
  const facets: Work["facets"] = {};
  if (row.facets && typeof row.facets === "object") {
    for (const key of FACETS) {
      const value = (row.facets as Record<string, unknown>)[key];
      if (typeof value === "number" && value > 0) facets[key] = Math.min(1, value);
    }
  }
  const summary = String(row.summary ?? "").trim();
  const why = String(row.why ?? "").trim();
  if (summary.length < 20 || why.length < 20) return null;
  const year = String(row.year ?? "").slice(0, 12);
  const minutes = typeof row.minutes === "number" ? Math.round(row.minutes) : 0;
  return {
    id: `grok-${slug(name)}-${year || "x"}`,
    name,
    year,
    kind,
    runtime: kind === "series" ? "one episode" : minutes > 0 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : "one sitting",
    loved: false,
    weight: 0,
    hidden: false,
    fromChat: false,
    family,
    vibes: vibes.length ? vibes : ["dusk"],
    seasons: seasons.length ? seasons : ["any"],
    facets,
    summary,
    why,
    vibeLine: String(row.vibeLine ?? "A Grok pick for this mood.").slice(0, 140),
    preachy: typeof row.preachy === "number" ? Math.min(1, Math.max(0, row.preachy)) : 0,
  };
}

export const suggestMore = createServerFn({ method: "POST" })
  .validator(asSuggest)
  .handler(async ({ data }) => {
    try {
      const text = await complete(
        SYSTEM,
        `Mood: ${data.vibe}.
Loved anchors: ${data.anchors.join(", ")}.
Recent yes: ${data.recentYes.join(", ") || "none"}.
Recent not-tonight (do not treat as a permanent no): ${data.recentNo.join(", ") || "none"}.
${data.watching ? `They are in the middle of ${data.watching}. Let one pick sit near it. Do not make the set about it.` : ""}
Do not suggest any of these: ${data.exclude.join("; ")}.
Return {"picks":[3 objects]} with keys name, year, kind (film|series), minutes, family (one of ${FAMILIES.join("|")}), vibes (subset of ${VIBES.join("|")}), seasons (subset of ${SEASONS.join("|")}), facets (object, keys ${FACETS.join("|")}, values 0 to 1), summary (2 sentences), why (tie to two anchors), vibeLine, preachy (0 to 1).`,
        1100,
      );
      const parsed = extractJson(text) as { picks?: unknown[] };
      const taken = new Set(data.exclude.map((name) => name.toLowerCase()));
      const picks = (parsed.picks ?? []).map((pick) => toWork(pick, taken)).filter((pick): pick is Work => Boolean(pick)).slice(0, 3);
      if (!picks.length) return { ok: false as const, error: "Grok didn't name anything usable. Try once more." };
      return { ok: true as const, picks };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Grok didn't answer." };
    }
  });

export async function fetchWeeklyPicks(anchors: string[], exclude: string[], watching = ""): Promise<Work[]> {
  const text = await complete(
    SYSTEM,
    `Draw five real, already-released films or series that sit with this catalogue. Use the same families and tags, not a random genre mix.
Anchors, tagged: ${anchors.join("; ") || "Lamb (grief), The Americans (spy), Goodfellas (crime), Severance (uncanny)"}.
${watching ? `They are in the middle of ${watching}. Let one or two of the five sit near it. The rest stay with the catalogue.` : ""}
Do not suggest any of these: ${exclude.join("; ")}.
Return {"picks":[5 objects]} with keys name, year, kind (film|series), minutes, family (one of ${FAMILIES.join("|")}), vibes (subset of ${VIBES.join("|")}), seasons (subset of ${SEASONS.join("|")}), facets (object, keys ${FACETS.join("|")}, values 0 to 1), summary (2 sentences), why (tie to two anchors), vibeLine, preachy (0 to 1).`,
    1600,
  );
  const parsed = extractJson(text) as { picks?: unknown[] };
  const taken = new Set(exclude.map((name) => name.toLowerCase()));
  return (parsed.picks ?? []).map((pick) => toWork(pick, taken)).filter((pick): pick is Work => Boolean(pick)).slice(0, 5);
}

export const describeLiked = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { name?: unknown; note?: unknown; anchors?: unknown } | null;
    const name = String(data?.name ?? "").trim().slice(0, 120);
    if (name.length < 2) throw new Error("Name the film.");
    const anchors = Array.isArray(data?.anchors) ? data.anchors.map((item) => String(item)).filter(Boolean).slice(0, 24) : [];
    return { name, note: String(data?.note ?? "").trim().slice(0, 140), anchors };
  })
  .handler(async ({ data }) => {
    try {
      const text = await complete(
        SYSTEM,
        `The viewer watched "${data.name}" and liked it. Note: ${data.note || "none"}.
Their anchors: ${data.anchors.join(", ") || "Lamb, The Americans, Goodfellas, Severance"}.
Return one JSON object, not a list, for this real released title only. Keys: name, year, kind (film|series), minutes, family (one of ${FAMILIES.join("|")}), vibes (subset of ${VIBES.join("|")}), seasons (subset of ${SEASONS.join("|")}), facets (object, keys ${FACETS.join("|")}, values 0 to 1), summary (2 sentences, no spoilers), why (why it sits with their anchors), vibeLine, preachy (0 to 1).`,
        700,
      );
      const work = toWork(extractJson(text), new Set());
      if (!work) return { ok: false as const, error: "Grok didn't describe that title cleanly." };
      work.name = data.name;
      work.id = `liked-${slug(data.name)}`;
      return { ok: true as const, work };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Grok didn't answer." };
    }
  });

export const sharpenWhy = createServerFn({ method: "POST" })
  .validator(asWhy)
  .handler(async ({ data }) => {
    try {
      const text = await complete(
        "You write one short reason a specific viewer will like a film or series. No spoilers. Name two of their anchors. JSON only: {\"why\":\"...\"}",
        `Title: ${data.name}. Premise: ${data.summary}. Mood tonight: ${data.vibe}. Anchors: ${data.anchors}. Two or three sentences.`,
        280,
      );
      const parsed = extractJson(text) as { why?: string };
      const why = String(parsed.why ?? "").trim();
      if (why.length < 20) return { ok: false as const, error: "Grok didn't answer cleanly." };
      return { ok: true as const, why };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Grok didn't answer." };
    }
  });
