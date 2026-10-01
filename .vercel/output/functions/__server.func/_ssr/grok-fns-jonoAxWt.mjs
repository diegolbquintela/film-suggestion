import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as VIBES, i as SEASONS, n as FAMILIES, t as FACETS } from "./facets-DOkKFDrl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grok-fns-jonoAxWt.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var grok_fns_exports = /* @__PURE__ */ __exportAll({
	describeLiked: () => describeLiked,
	fetchWeeklyPicks: () => fetchWeeklyPicks,
	sharpenWhy: () => sharpenWhy,
	suggestMore: () => suggestMore
});
var DAILY_CAP = 12;
var bucket = {
	day: "",
	n: 0
};
function chargeServer() {
	const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	if (bucket.day !== day) bucket = {
		day,
		n: 0
	};
	if (bucket.n >= DAILY_CAP) return false;
	bucket.n += 1;
	return true;
}
function slug(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
function extractJson(text) {
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
async function complete(system, user, maxTokens) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("Grok isn't available in this sitting. The deck still ranks from your list.");
	if (!chargeServer()) throw new Error("That's enough Grok for today. The deck still works.");
	const response = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .5,
			max_tokens: maxTokens,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!response.ok) throw new Error("Grok is unavailable right now.");
	const text = (await response.json()).choices?.[0]?.message?.content ?? "";
	if (!text) throw new Error("Grok returned nothing.");
	return text;
}
var SYSTEM = `You program a private film and television deck for one viewer.
Suggest only real, already-released films and series. Never invent titles.
No spoilers past the premise. Avoid preachy prestige and empty franchise noise.
The viewer loves austere folk grief (Lamb, The Witch, You Won't Be Alone), domestic uncanny (Servant, Hereditary), institutional mystery (Severance, The Wire), moral spy marriage (The Americans), character crime (Goodfellas, The Sopranos), euro-summer desire (Vicky Cristina Barcelona, Ripley), court intrigue, and crafted war.
They do not want jump-scare slashers or films that lecture them.
Reply with JSON only.`;
function asSuggest(input) {
	const data = input;
	const vibe = String(data?.vibe ?? "");
	if (!VIBES.includes(vibe)) throw new Error("Unknown mood");
	const list = (value, max) => Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean).slice(0, max) : [];
	return {
		vibe,
		exclude: list(data?.exclude, 180),
		recentYes: list(data?.recentYes, 8),
		recentNo: list(data?.recentNo, 8),
		anchors: list(data?.anchors, 40)
	};
}
function asWhy(input) {
	const data = input;
	const name = String(data?.name ?? "").slice(0, 120);
	const summary = String(data?.summary ?? "").slice(0, 500);
	if (!name || !summary) throw new Error("Missing title");
	return {
		name,
		summary,
		anchors: String(data?.anchors ?? "").slice(0, 300),
		vibe: String(data?.vibe ?? "").slice(0, 40)
	};
}
function toWork(raw, taken) {
	if (!raw || typeof raw !== "object") return null;
	const row = raw;
	const name = String(row.name ?? "").trim();
	if (name.length < 2 || taken.has(name.toLowerCase())) return null;
	const kind = row.kind === "series" ? "series" : "film";
	const family = FAMILIES.includes(row.family) ? row.family : "grief";
	const vibes = Array.isArray(row.vibes) ? row.vibes.filter((item) => VIBES.includes(item)) : [];
	const seasons = Array.isArray(row.seasons) ? row.seasons.filter((item) => SEASONS.includes(item)) : ["any"];
	const facets = {};
	if (row.facets && typeof row.facets === "object") for (const key of FACETS) {
		const value = row.facets[key];
		if (typeof value === "number" && value > 0) facets[key] = Math.min(1, value);
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
		preachy: typeof row.preachy === "number" ? Math.min(1, Math.max(0, row.preachy)) : 0
	};
}
var suggestMore = createServerFn({ method: "POST" }).validator(asSuggest).handler(createSsrRpc("ef8a625d68c05b2f6e299b5a3caa7e9f67df5d2c63f956a7af8c6b72e7d07441"));
async function fetchWeeklyPicks(anchors, exclude) {
	const parsed = extractJson(await complete(SYSTEM, `Draw five real, already-released films or series that sit with this catalogue. Use the same families and tags, not a random genre mix.
Anchors, tagged: ${anchors.join("; ") || "Lamb (grief), The Americans (spy), Goodfellas (crime), Severance (uncanny)"}.
Do not suggest any of these: ${exclude.join("; ")}.
Return {"picks":[5 objects]} with keys name, year, kind (film|series), minutes, family (one of ${FAMILIES.join("|")}), vibes (subset of ${VIBES.join("|")}), seasons (subset of ${SEASONS.join("|")}), facets (object, keys ${FACETS.join("|")}, values 0 to 1), summary (2 sentences), why (tie to two anchors), vibeLine, preachy (0 to 1).`, 1600));
	const taken = new Set(exclude.map((name) => name.toLowerCase()));
	return (parsed.picks ?? []).map((pick) => toWork(pick, taken)).filter((pick) => Boolean(pick)).slice(0, 5);
}
var describeLiked = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const name = String(data?.name ?? "").trim().slice(0, 120);
	if (name.length < 2) throw new Error("Name the film.");
	const anchors = Array.isArray(data?.anchors) ? data.anchors.map((item) => String(item)).filter(Boolean).slice(0, 24) : [];
	return {
		name,
		note: String(data?.note ?? "").trim().slice(0, 140),
		anchors
	};
}).handler(createSsrRpc("33d43aafc33a2e01838923d81b94203e5d29d1d50d4802e6b46b8bcdc266830b"));
var sharpenWhy = createServerFn({ method: "POST" }).validator(asWhy).handler(createSsrRpc("d2b01130f193a8dbc658e918123dd34a41db355305022acf7664bfe02a669321"));
//#endregion
export { createSsrRpc as a, suggestMore as i, grok_fns_exports as n, sharpenWhy as r, describeLiked as t };
