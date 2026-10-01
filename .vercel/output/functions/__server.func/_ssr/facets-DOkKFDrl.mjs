//#region node_modules/.nitro/vite/services/ssr/assets/facets-DOkKFDrl.js
var FACETS = [
	"folk",
	"grief",
	"domestic",
	"institution",
	"moral",
	"crime",
	"spy",
	"weird",
	"war",
	"court",
	"obsession",
	"comfort",
	"satire",
	"euro",
	"cool",
	"faith",
	"talk"
];
var FAMILIES = [
	"folk",
	"grief",
	"domestic",
	"institution",
	"crime",
	"spy",
	"weird",
	"war",
	"court",
	"obsession",
	"comfort",
	"satire",
	"euro",
	"cool",
	"faith"
];
var VIBES = [
	"dusk",
	"rewatch",
	"folk",
	"heat",
	"summer",
	"court"
];
var SEASONS = [
	"autumn",
	"winter",
	"summer",
	"any"
];
var VIBE_LABEL = {
	dusk: "Dusk",
	rewatch: "Rewatch",
	folk: "Folk",
	heat: "Heat",
	summer: "Summer",
	court: "Court"
};
var FAMILY_LABEL = {
	folk: "Folk",
	grief: "Grief",
	domestic: "Domestic",
	institution: "Institution",
	crime: "Crime",
	spy: "Spy",
	weird: "Weird",
	war: "War",
	court: "Court",
	obsession: "Obsession",
	comfort: "Comfort",
	satire: "Satire",
	euro: "Euro summer",
	cool: "Cool",
	faith: "Faith"
};
function zero() {
	return FACETS.map(() => 0);
}
function vec(partial) {
	return FACETS.map((key) => partial[key] ?? 0);
}
function add(a, b) {
	return a.map((n, i) => n + (b[i] ?? 0));
}
function scale(a, s) {
	return a.map((n) => n * s);
}
function blend(a, b, t) {
	return a.map((n, i) => n * (1 - t) + (b[i] ?? 0) * t);
}
function clampVec(a, min, max) {
	return a.map((n) => Math.min(max, Math.max(min, n)));
}
function dot(a, b) {
	return a.reduce((sum, n, i) => sum + n * (b[i] ?? 0), 0);
}
function norm(a) {
	return Math.sqrt(dot(a, a));
}
function cosine(a, b) {
	const n = norm(a) * norm(b);
	if (n === 0) return 0;
	return dot(a, b) / n;
}
function hash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
//#endregion
export { VIBES as a, blend as c, hash as d, scale as f, SEASONS as i, clampVec as l, zero as m, FAMILIES as n, VIBE_LABEL as o, vec as p, FAMILY_LABEL as r, add as s, FACETS as t, cosine as u };
