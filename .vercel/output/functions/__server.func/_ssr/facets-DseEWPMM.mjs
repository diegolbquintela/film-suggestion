import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facets-DseEWPMM.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-IWHfIGH2.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-C6WqgjLM.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
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
export { VIBES as a, authMiddleware as c, cosine as d, hash as f, zero as h, SEASONS as i, blend as l, vec as m, FAMILIES as n, VIBE_LABEL as o, scale as p, FAMILY_LABEL as r, add as s, FACETS as t, clampVec as u };
