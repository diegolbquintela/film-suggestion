import { a as VIBES, t as FACETS } from "./facets-DseEWPMM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/taste-BiVivYv-.js
function strings(value, max) {
	if (!Array.isArray(value)) return [];
	return value.map((item) => String(item)).filter(Boolean).slice(0, max);
}
function vec(value) {
	if (!Array.isArray(value) || value.length !== FACETS.length) return null;
	return value.map((item) => {
		return Math.min(1.35, Math.max(-.4, typeof item === "number" ? item : 0));
	});
}
function emptyTaste() {
	return {
		laterUntil: {},
		never: [],
		queue: [],
		wishlist: [],
		reviews: [],
		fatigue: [],
		adjust: FACETS.map(() => 0),
		current: null,
		currentAt: 0,
		demoted: [],
		extras: [],
		whys: {},
		vibe: null,
		grokDay: {
			day: "",
			n: 0
		},
		shelfAt: 0,
		watchingId: null
	};
}
function tasteHasChoices(taste) {
	return Boolean(taste.watchingId || taste.reviews.length || taste.wishlist.length || taste.never.length || taste.queue.length || taste.demoted.length || Object.keys(taste.laterUntil).length);
}
function coerceTaste(input) {
	const base = emptyTaste();
	if (!input || typeof input !== "object") return base;
	const row = input;
	const laterUntil = {};
	if (row.laterUntil && typeof row.laterUntil === "object") {
		for (const [key, value] of Object.entries(row.laterUntil).slice(0, 400)) if (typeof value === "number") laterUntil[key.slice(0, 80)] = value;
	}
	const queue = Array.isArray(row.queue) ? row.queue.map((item) => {
		const entry = item;
		const id = String(entry?.id ?? "").slice(0, 80);
		return id ? {
			id,
			at: typeof entry.at === "number" ? entry.at : 0
		} : null;
	}).filter((item) => Boolean(item)).slice(0, 40) : [];
	const reviews = Array.isArray(row.reviews) ? row.reviews.map((item) => {
		const entry = item;
		const id = String(entry?.id ?? "").slice(0, 80);
		if (!id) return null;
		return {
			id,
			note: String(entry.note ?? "").slice(0, 140),
			at: typeof entry.at === "number" ? entry.at : 0
		};
	}).filter((item) => Boolean(item)).slice(0, 80) : [];
	const fatigue = Array.isArray(row.fatigue) ? row.fatigue.map((item) => {
		const entry = item;
		const family = String(entry?.family ?? "").slice(0, 40);
		if (!family) return null;
		return {
			family,
			at: typeof entry.at === "number" ? entry.at : 0
		};
	}).filter((item) => Boolean(item)).slice(0, 80) : [];
	const extras = Array.isArray(row.extras) ? row.extras.filter((item) => item && typeof item === "object" && String(item.id ?? "") && String(item.name ?? "")).slice(0, 24) : [];
	const whys = {};
	if (row.whys && typeof row.whys === "object") for (const [key, value] of Object.entries(row.whys).slice(0, 80)) whys[key.slice(0, 80)] = String(value).slice(0, 600);
	const vibe = VIBES.includes(row.vibe) ? row.vibe : null;
	const grok = row.grokDay;
	return {
		laterUntil,
		never: strings(row.never, 400),
		queue,
		wishlist: strings(row.wishlist, 80),
		reviews,
		fatigue,
		adjust: vec(row.adjust) ?? base.adjust,
		current: vec(row.current),
		currentAt: typeof row.currentAt === "number" ? row.currentAt : 0,
		demoted: strings(row.demoted, 200),
		extras,
		whys,
		vibe,
		grokDay: {
			day: String(grok?.day ?? "").slice(0, 12),
			n: typeof grok?.n === "number" ? Math.min(20, Math.max(0, grok.n)) : 0
		},
		shelfAt: typeof row.shelfAt === "number" ? row.shelfAt : 0,
		watchingId: row.watchingId ? String(row.watchingId).slice(0, 80) : null
	};
}
//#endregion
export { emptyTaste as n, tasteHasChoices as r, coerceTaste as t };
