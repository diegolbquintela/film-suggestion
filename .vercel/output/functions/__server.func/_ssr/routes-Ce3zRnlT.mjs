import { o as __toESM } from "../_runtime.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as mergeWorks, r as useShelf } from "./catalog-B2tadS0a.mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as VIBES, c as authMiddleware, d as cosine, f as hash, h as zero, i as SEASONS, l as blend, m as vec, n as FAMILIES, o as VIBE_LABEL, p as scale, r as FAMILY_LABEL, s as add, t as FACETS, u as clampVec } from "./facets-DseEWPMM.mjs";
import { a as createSsrRpc, i as suggestMore, r as sharpenWhy, t as describeLiked } from "./grok-fns-DP4us_s1.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-BL0prBGb.mjs";
import { t as LoginPanel } from "./login-panel-BR_vSHhJ.mjs";
import { n as emptyTaste, r as tasteHasChoices, t as coerceTaste } from "./taste-BiVivYv-.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ce3zRnlT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DAY = 864e5;
var COOLDOWN_NO = 8 * DAY;
var COOLDOWN_WATCHED_LOVED = 21 * DAY;
var COOLDOWN_WATCHED_NEW = 45 * DAY;
function calendarSeason(now = /* @__PURE__ */ new Date()) {
	const month = now.getMonth();
	if (month >= 5 && month <= 7) return "summer";
	if (month >= 8 && month <= 10) return "autumn";
	if (month === 11 || month <= 1) return "winter";
	return "any";
}
function defaultVibe(now = /* @__PURE__ */ new Date()) {
	const month = now.getMonth();
	if (month >= 8 && month <= 10) return "dusk";
	if (month === 11 || month <= 1) return "folk";
	if (month >= 5 && month <= 7) return "summer";
	return "rewatch";
}
function dayKey(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}
function lifetimeVector(works, demoted, adjust, liked = {}) {
	let acc = zero();
	let weight = 0;
	for (const work of works) {
		if (demoted.includes(work.id) || work.hidden) continue;
		const pull = work.loved ? work.weight : liked[work.id] ?? 0;
		if (pull <= 0) continue;
		acc = add(acc, scale(vec(work.facets), pull));
		weight += pull;
	}
	const centroid = weight > 0 ? scale(acc, 1 / weight) : zero();
	return clampVec(add(centroid, adjust), -.15, 1.35);
}
function decayedCurrent(current, currentAt, life, now) {
	if (!current) return life;
	const days = Math.max(0, (now - currentAt) / DAY);
	const keep = Math.pow(.5, days / 10);
	return blend(life, current, keep);
}
function fatigueCounts(events, now) {
	const map = {};
	for (const event of events) {
		if (now - event.at > 6048e5) continue;
		map[event.family] = (map[event.family] ?? 0) + 1;
	}
	return map;
}
function toScore(value) {
	const scaled = (value - .05) / .85 * 100;
	return Math.round(Math.min(97, Math.max(12, scaled)));
}
function nearest(work, anchors) {
	const mine = vec(work.facets);
	return anchors.filter((anchor) => anchor.id !== work.id && !anchor.hidden).map((anchor) => ({
		name: anchor.name,
		score: cosine(mine, vec(anchor.facets))
	})).sort((a, b) => b.score - a.score).slice(0, 2);
}
function scoreWork(work, life, taste, vibe, season, fatigue, anchors, key, watching) {
	const features = vec(work.facets);
	const anchorScores = anchors.filter((anchor) => anchor.id !== work.id).map((anchor) => cosine(features, vec(anchor.facets))).sort((a, b) => b - a);
	const best = anchorScores[0] ?? 0;
	const second = anchorScores[1] ?? best;
	const anchorScore = best * .7 + second * .3;
	const centroid = cosine(taste, features);
	const all = anchorScore * .75 + cosine(life, features) * .25;
	const vibeMatch = work.vibes.includes(vibe);
	const exactSeason = work.seasons.includes(season);
	const anySeason = work.seasons.includes("any");
	let raw = anchorScore * .5 + centroid * .12;
	if (vibeMatch) raw += .24;
	if (exactSeason) raw += .08;
	else if (anySeason) raw += .03;
	raw -= work.preachy * .15;
	if (watching && watching.id !== work.id) raw += Math.max(0, cosine(features, vec(watching.facets))) * .1;
	const tired = fatigue[work.family] ?? 0;
	if (tired >= 3) raw *= .7;
	else if (tired >= 2) raw *= .88;
	raw += hash(`${work.id}:${key}`) % 100 / 100 * .03;
	return {
		work,
		allTime: toScore(all),
		tonight: toScore(raw),
		raw,
		vibeMatch,
		similar: nearest(work, anchors)
	};
}
function weave(pool, wish, limit) {
	const wished = pool.filter((item) => wish.has(item.work.id)).sort((a, b) => b.raw - a.raw);
	const rest = pool.filter((item) => !wish.has(item.work.id)).sort((a, b) => b.raw - a.raw);
	const out = [];
	let w = 0;
	let r = 0;
	while (out.length < limit && (w < wished.length || r < rest.length)) if (out.length % 3 === 1 && w < wished.length) out.push(wished[w++]);
	else if (r < rest.length) out.push(rest[r++]);
	else out.push(wished[w++]);
	return out;
}
function buildDeck(input) {
	const works = input.works;
	const liked = {};
	for (const id of input.likedIds) liked[id] = .75;
	const life = lifetimeVector(works, input.demoted, input.adjust, liked);
	const current = decayedCurrent(input.current, input.currentAt, life, input.now);
	const taste = blend(life, current, .32);
	const season = calendarSeason(new Date(input.now));
	const fatigue = fatigueCounts(input.fatigue, input.now);
	const likedSet = new Set(input.likedIds);
	const wish = new Set(input.wishlistIds);
	const anchors = works.filter((work) => !work.hidden && !input.demoted.includes(work.id) && (work.loved || likedSet.has(work.id)));
	const blocked = /* @__PURE__ */ new Set([...input.never, ...input.queueIds]);
	const scored = works.filter((work) => !work.hidden && !blocked.has(work.id)).filter((work) => (input.laterUntil[work.id] ?? 0) <= input.now).map((work) => {
		const item = scoreWork(work, life, taste, input.vibe, season, fatigue, anchors, input.key, input.watching);
		if (wish.has(work.id)) {
			item.raw += .12;
			item.tonight = toScore(item.raw);
		}
		return item;
	});
	const discoveries = scored.filter((item) => !item.work.loved).filter((item) => item.allTime >= 36 || wish.has(item.work.id) || likedSet.has(item.work.id)).sort((a, b) => b.raw - a.raw);
	const rewatches = scored.filter((item) => item.work.loved).sort((a, b) => b.raw - a.raw);
	const discoveryTarget = input.vibe === "rewatch" ? 4 : 10;
	const picked = [];
	const familyCount = {};
	for (const item of discoveries) {
		if (picked.length >= discoveryTarget) break;
		const count = familyCount[item.work.family] ?? 0;
		if (count >= 2) continue;
		picked.push(item);
		familyCount[item.work.family] = count + 1;
	}
	if (picked.length < discoveryTarget) for (const item of discoveries) {
		if (picked.length >= discoveryTarget) break;
		if (picked.some((have) => have.work.id === item.work.id)) continue;
		picked.push(item);
	}
	const rewatchTarget = input.vibe === "rewatch" ? 6 : 2;
	const rewatchPicked = rewatches.slice(0, rewatchTarget);
	const seen = new Set([...picked, ...rewatchPicked].map((item) => item.work.id));
	const wishExtras = scored.filter((item) => wish.has(item.work.id) && !seen.has(item.work.id)).slice(0, 4);
	let deck = weave([
		...picked,
		...rewatchPicked,
		...wishExtras
	], wish, 8);
	if (input.vibe !== "rewatch" && !deck.some((item) => item.work.loved) && rewatchPicked[0]) {
		const insert = rewatchPicked[0];
		if (!deck.some((item) => item.work.id === insert.work.id)) {
			deck.splice(Math.min(2, deck.length), 0, insert);
			deck = deck.slice(0, 8);
		}
	}
	return {
		deck,
		life
	};
}
function similarLine(similar) {
	if (similar.length === 0) return "Nothing on your list sits close.";
	return similar.map((item) => `${item.name} ${Math.round(item.score * 100)}`).join("  ·  ");
}
function WorkCard({ item, why, badge, style, extra }) {
	const { work } = item;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex h-full min-h-0 flex-col overflow-hidden rounded-card border border-line bg-surface",
		style,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-b border-line bg-surface-2 px-4 pt-4 pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 text-xs tracking-widest text-muted uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							work.loved ? "Rewatch" : item.vibeMatch ? "New" : "Stretch",
							" · ",
							work.kind === "series" ? "Series" : "Film"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: work.year
						})]
					}),
					badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs tracking-widest text-fg uppercase",
						children: badge
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-3xl leading-tight text-fg",
						children: work.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm leading-normal text-muted",
						children: [
							work.runtime,
							" · ",
							FAMILY_LABEL[work.family],
							work.fromChat ? " · earlier chat" : ""
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-normal text-fg",
						children: work.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "Why you'll like it"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-normal text-fg",
						children: why
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "Close to"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-normal text-fg",
						children: similarLine(item.similar)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "Vibe"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-normal text-fg",
						children: work.vibeLine
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted tabular-nums",
					children: [
						"All-time ",
						item.allTime,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 text-line",
							children: "·"
						}),
						"Tonight ",
						item.tonight
					]
				}), extra]
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function asWork(raw, keepLoved) {
	if (!raw || typeof raw !== "object") return null;
	const row = raw;
	const id = String(row.id ?? "").trim().slice(0, 80);
	const name = String(row.name ?? "").trim().slice(0, 120);
	if (!id || name.length < 2) return null;
	const kind = row.kind === "series" ? "series" : "film";
	const family = FAMILIES.includes(row.family) ? row.family : "grief";
	const vibes = Array.isArray(row.vibes) ? row.vibes.filter((item) => VIBES.includes(item)) : [];
	const seasons = Array.isArray(row.seasons) ? row.seasons.filter((item) => SEASONS.includes(item)) : [];
	const facets = {};
	if (row.facets && typeof row.facets === "object") for (const key of FACETS) {
		const value = row.facets[key];
		if (typeof value === "number" && value > 0) facets[key] = Math.min(1, value);
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
		preachy: typeof row.preachy === "number" ? Math.min(1, Math.max(0, row.preachy)) : 0
	};
}
var listFilms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6de1c97ec6c07d1e326142eadaf64c3426322059b258ad4b0c4fefc0dde97cb6"));
function asAdd(input) {
	const data = input;
	if (!Array.isArray(data?.works)) throw new Error("No films");
	const works = data.works.map((item) => asWork(item, false)).filter((item) => Boolean(item)).slice(0, 12);
	if (!works.length) throw new Error("No films");
	return {
		works,
		source: data?.source === "liked" || data?.source === "incoming" ? data.source : "grok"
	};
}
var addFilms = createServerFn({ method: "POST" }).validator(asAdd).middleware([authMiddleware]).handler(createSsrRpc("5a366907efd84b4c47123901bcffdddf21c6d1ffbaa5b19b5f31787db60fe370"));
var removeFilm = createServerFn({ method: "POST" }).validator((input) => {
	const id = String(input?.id ?? "").trim().slice(0, 80);
	if (!id) throw new Error("Missing title");
	return { id };
}).middleware([authMiddleware]).handler(createSsrRpc("3d82db6629a086bcd26f236048aab17c643bc9a5c192c89ca026e0793eb33714"));
var dropFilms = createServerFn({ method: "POST" }).validator((input) => {
	return { ids: Array.isArray(input?.ids) ? input.ids.map((id) => String(id).slice(0, 80)).filter(Boolean).slice(0, 200) : [] };
}).middleware([authMiddleware]).handler(createSsrRpc("41939bf958021b8b76a8b1ea231dcd0d35024fba6056295ed50a0f800e879971"));
var promoteFilm = createServerFn({ method: "POST" }).validator((input) => {
	const id = String(input?.id ?? "").trim().slice(0, 80);
	if (!id) throw new Error("Missing title");
	return { id };
}).middleware([authMiddleware]).handler(createSsrRpc("82fa17bf44e0ec2de7dad75ad7edbf99e5c75f673aea3f52df84acf5a73a1a5f"));
var restoreFilm = createServerFn({ method: "POST" }).validator((input) => {
	const work = asWork(input?.work, true);
	if (!work) throw new Error("Missing title");
	return { work };
}).middleware([authMiddleware]).handler(createSsrRpc("3da13f1c2786eddcde7e7740ee0d0b1246aadc4dc2fd86933d556415d2474906"));
var pullWeekly = createServerFn({ method: "POST" }).validator((input) => {
	return { watching: String(input?.watching ?? "").trim().slice(0, 120) };
}).middleware([authMiddleware]).handler(createSsrRpc("849d378b16d7e80beed1754b1e6508b7461b9b33df8ed840b140fb78af921164"));
function resolveSignInGateState(input) {
	if (input.isPending) return "pending";
	return input.hasUser ? "signed_in" : "signed_out";
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
function SignInGate({ children, fallback }) {
	const { user, isPending } = useCurrentUserState();
	const state = resolveSignInGateState({
		isPending,
		hasUser: user !== null
	});
	if (state === "pending") return null;
	if (state === "signed_in") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInButtons, {}) });
}
function SignInButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full max-w-sm flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => signIn(p.providerId, { callbackURL: "/" }),
			className: "w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
			children: ["Continue with ", p.label]
		}, p.providerId))
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function sliceOf(state) {
	return {
		laterUntil: state.laterUntil,
		never: state.never,
		queue: state.queue,
		wishlist: state.wishlist,
		reviews: state.reviews,
		fatigue: state.fatigue,
		adjust: state.adjust,
		current: state.current,
		currentAt: state.currentAt,
		demoted: state.demoted,
		extras: state.extras,
		whys: state.whys,
		vibe: state.vibe,
		grokDay: state.grokDay,
		shelfAt: state.shelfAt,
		watchingId: state.watchingId
	};
}
function likedWeights(reviews) {
	const weights = {};
	for (const review of reviews) weights[review.id] = .75;
	return weights;
}
function known(extras) {
	return mergeWorks(useShelf.getState().films, extras);
}
function findWork(id, extras) {
	return known(extras).find((work) => work.id === id) ?? useShelf.getState().incoming.find((work) => work.id === id);
}
function bumpCurrent(state, work, now) {
	const life = lifetimeVector(known(state.extras), state.demoted, state.adjust, likedWeights(state.reviews));
	const current = decayedCurrent(state.current, state.currentAt, life, now);
	return {
		current: blend(current, vec(work.facets), .16),
		currentAt: now
	};
}
function todayCount(grokDay) {
	const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return grokDay.day === day ? grokDay.n : 0;
}
var useTaste = create()(persist((set, get) => ({
	laterUntil: {},
	never: [],
	queue: [],
	wishlist: [],
	reviews: [],
	fatigue: [],
	adjust: zero(),
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
	watchingId: null,
	last: null,
	hydrated: false,
	accountReady: false,
	setHydrated: (hydrated) => set({ hydrated }),
	applyRemote: (raw) => set({
		...coerceTaste(raw),
		last: null,
		accountReady: true
	}),
	clearForNewAccount: () => set({
		...emptyTaste(),
		last: null,
		accountReady: true
	}),
	setVibe: (vibe) => set({ vibe }),
	undo: () => {
		const last = get().last;
		if (!last) return;
		set({
			...last.slice,
			last: null
		});
		if (!last.film) return;
		const film = last.film;
		restoreFilm({ data: { work: film } }).then((result) => {
			if (result.ok) useShelf.getState().setCatalog(result.films, result.incoming);
		});
	},
	notTonight: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work) return;
		const now = Date.now();
		set({
			last: {
				label: `Not tonight · ${work.name}`,
				slice: sliceOf(state)
			},
			laterUntil: {
				...state.laterUntil,
				[id]: now + COOLDOWN_NO
			},
			wishlist: state.wishlist.filter((item) => item !== id),
			fatigue: [...state.fatigue.filter((event) => now - event.at < 6912e5), {
				family: work.family,
				at: now
			}],
			queue: state.queue.filter((item) => item.id !== id)
		});
	},
	notMine: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work) return;
		const adjust = add(state.adjust, scale(vec(work.facets), -.08)).map((n) => Math.min(.4, Math.max(-.4, n)));
		const shelf = useShelf.getState();
		if (shelf.ready) shelf.setCatalog(shelf.films.filter((item) => item.id !== id), shelf.incoming.filter((item) => item.id !== id));
		set({
			last: {
				label: `Off the catalogue · ${work.name}`,
				slice: sliceOf(state),
				film: work
			},
			adjust,
			never: state.never.includes(id) ? state.never : [...state.never, id],
			queue: state.queue.filter((item) => item.id !== id),
			wishlist: state.wishlist.filter((item) => item !== id),
			extras: state.extras.filter((item) => item.id !== id),
			laterUntil: {
				...state.laterUntil,
				[id]: Number.MAX_SAFE_INTEGER
			}
		});
		removeFilm({ data: { id } }).then((result) => {
			if (result.ok) useShelf.getState().setCatalog(result.films, result.incoming);
		});
	},
	yes: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work) return;
		const now = Date.now();
		const laterUntil = { ...state.laterUntil };
		delete laterUntil[id];
		set({
			last: {
				label: `Yes · ${work.name}`,
				slice: sliceOf(state)
			},
			...bumpCurrent(state, work, now),
			laterUntil,
			wishlist: state.wishlist.filter((item) => item !== id),
			queue: [{
				id,
				at: now
			}, ...state.queue.filter((item) => item.id !== id)]
		});
	},
	watched: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work) return;
		const now = Date.now();
		const wait = work.loved ? COOLDOWN_WATCHED_LOVED : COOLDOWN_WATCHED_NEW;
		set({
			last: {
				label: `Watched · ${work.name}`,
				slice: sliceOf(state)
			},
			queue: state.queue.filter((item) => item.id !== id),
			laterUntil: {
				...state.laterUntil,
				[id]: now + wait
			}
		});
	},
	removeFromQueue: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		set({
			last: {
				label: work ? `Back on the deck · ${work.name}` : "Back on the deck",
				slice: sliceOf(state)
			},
			queue: state.queue.filter((item) => item.id !== id)
		});
	},
	restore: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		const laterUntil = { ...state.laterUntil };
		delete laterUntil[id];
		set({
			last: {
				label: work ? `Restored · ${work.name}` : "Restored",
				slice: sliceOf(state)
			},
			never: state.never.filter((item) => item !== id),
			laterUntil
		});
	},
	demote: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work) return;
		set({
			last: {
				label: `Dropped · ${work.name}`,
				slice: sliceOf(state)
			},
			demoted: state.demoted.includes(id) ? state.demoted : [...state.demoted, id]
		});
	},
	undemote: (id) => {
		const state = get();
		set({
			last: {
				label: "Back on the all-time list",
				slice: sliceOf(state)
			},
			demoted: state.demoted.filter((item) => item !== id)
		});
	},
	addExtras: (works) => {
		const state = get();
		const have = new Set(known(state.extras).map((work) => work.name.toLowerCase()));
		set({ extras: [...works.filter((work) => !have.has(work.name.toLowerCase())), ...state.extras].slice(0, 24) });
	},
	setWhy: (id, why) => set({ whys: {
		...get().whys,
		[id]: why
	} }),
	toggleWishlist: (id) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work || state.never.includes(id)) return;
		const on = state.wishlist.includes(id);
		set({
			last: {
				label: on ? `Off later · ${work.name}` : `Later · ${work.name}`,
				slice: sliceOf(state)
			},
			wishlist: on ? state.wishlist.filter((item) => item !== id) : [id, ...state.wishlist.filter((item) => item !== id)]
		});
	},
	like: (id, note) => {
		const state = get();
		const work = findWork(id, state.extras);
		if (!work) return;
		const now = Date.now();
		const wait = work.loved ? COOLDOWN_WATCHED_LOVED : COOLDOWN_WATCHED_NEW;
		const adjust = add(state.adjust, scale(vec(work.facets), .05)).map((n) => Math.min(.4, Math.max(-.4, n)));
		const reviews = [{
			id,
			note: note.trim().slice(0, 140),
			at: now
		}, ...state.reviews.filter((item) => item.id !== id)].slice(0, 80);
		set({
			last: {
				label: `Liked · ${work.name}`,
				slice: sliceOf(state)
			},
			reviews,
			adjust,
			...bumpCurrent({
				...state,
				reviews
			}, work, now),
			queue: state.queue.filter((item) => item.id !== id),
			wishlist: state.wishlist.filter((item) => item !== id),
			laterUntil: {
				...state.laterUntil,
				[id]: now + wait
			}
		});
	},
	setWatching: (id) => set({ watchingId: id }),
	markShelf: () => set({ shelfAt: Date.now() }),
	grokLeft: () => 6 - todayCount(get().grokDay),
	markGrok: () => {
		set({ grokDay: {
			day: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			n: todayCount(get().grokDay) + 1
		} });
	}
}), {
	name: "tonight-taste",
	partialize: (state) => sliceOf(state),
	onRehydrateStorage: () => (state) => {
		if (!state) return;
		if (!state.wishlist) state.wishlist = [];
		if (!state.reviews) state.reviews = [];
		if (!state.shelfAt) state.shelfAt = 0;
		if (!state.watchingId) state.watchingId = null;
		state.setHydrated(true);
	}
}));
var loadTaste = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c669be0620042e3a247f649f1ad9cb37296d8cc2cc7417fe4f783f1b155b14b6"));
var saveTaste = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => coerceTaste(input)).handler(createSsrRpc("38bb978228269d7125a651e5b859ba117cbe090d19366240ec460692f77f4c9d"));
var SEASON_LINE = {
	autumn: "Fall. Left means not tonight.",
	winter: "Winter. Folk leads unless you switch.",
	summer: "Summer. Heat and the euro films.",
	any: "No season pushing. Rewatch is the default."
};
var OWNER_KEY = "tonight-owner";
function TonightApp() {
	const [view, setView] = (0, import_react.useState)("feed");
	const [likeFor, setLikeFor] = (0, import_react.useState)(null);
	const [weekNote, setWeekNote] = (0, import_react.useState)("");
	const films = useShelf((state) => state.films);
	const incoming = useShelf((state) => state.incoming);
	const user = useCurrentUser();
	const hydrated = useTaste((state) => state.hydrated);
	const accountReady = useTaste((state) => state.accountReady);
	(0, import_react.useEffect)(() => {
		if (!user?.id || !hydrated) return;
		let cancel = false;
		(async () => {
			const taste = await loadTaste();
			if (cancel || !taste.ok) return;
			const local = sliceOf(useTaste.getState());
			const owner = localStorage.getItem(OWNER_KEY);
			if ((!taste.found || !taste.payload || !tasteHasChoices(taste.payload)) && tasteHasChoices(local) && (!owner || owner === user.id)) {
				useTaste.getState().applyRemote(local);
				await saveTaste({ data: sliceOf(useTaste.getState()) });
			} else if (taste.found && taste.payload) useTaste.getState().applyRemote(taste.payload);
			else if (owner && owner !== user.id) {
				useTaste.getState().clearForNewAccount();
				await saveTaste({ data: sliceOf(useTaste.getState()) });
			} else {
				useTaste.getState().applyRemote(local);
				await saveTaste({ data: sliceOf(useTaste.getState()) });
			}
			if (cancel) return;
			localStorage.setItem(OWNER_KEY, user.id);
			const result = await listFilms();
			if (cancel || !result.ok) return;
			const extras = useTaste.getState().extras;
			const names = new Set([...result.films, ...result.incoming].map((film) => film.name.toLowerCase()));
			const missing = extras.filter((work) => !names.has(work.name.toLowerCase()));
			let next = result.films;
			let holding = result.incoming;
			if (missing.length) {
				const added = await addFilms({ data: {
					works: missing.slice(0, 12),
					source: "grok"
				} });
				if (added.ok) {
					next = added.films;
					holding = added.incoming;
				}
			}
			const banned = new Set(useTaste.getState().never);
			const gone = [...next, ...holding].filter((work) => banned.has(work.id)).map((work) => work.id);
			if (gone.length) {
				const pruned = await dropFilms({ data: { ids: gone } });
				if (pruned.ok) {
					next = pruned.films;
					holding = pruned.incoming;
				}
			}
			if (!cancel) useShelf.getState().setCatalog(next, holding);
			const pulled = await pullWeekly({ data: { watching: findName(useTaste.getState().watchingId ?? "") } });
			if (cancel) return;
			if (!pulled.ok) setWeekNote(pulled.error);
			else {
				setWeekNote("");
				useShelf.getState().setCatalog(pulled.films, pulled.incoming);
			}
		})().catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [user?.id, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!user?.id || !accountReady) return;
		let last = JSON.stringify(sliceOf(useTaste.getState()));
		let timer = 0;
		const unsub = useTaste.subscribe((state) => {
			if (!state.accountReady) return;
			const next = JSON.stringify(sliceOf(state));
			if (next === last) return;
			last = next;
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				saveTaste({ data: JSON.parse(next) });
			}, 400);
		});
		return () => {
			unsub();
			window.clearTimeout(timer);
		};
	}, [user?.id, accountReady]);
	if (!accountReady) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid h-dvh place-items-center bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Opening your shelf."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-bg text-fg lg:flex-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "order-last grid shrink-0 grid-cols-4 border-t border-line lg:order-first lg:flex lg:w-36 lg:flex-col lg:gap-1 lg:border-t-0 lg:border-r lg:px-2 lg:pt-4",
				"aria-label": "Sections",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						current: view,
						id: "feed",
						onSelect: setView,
						label: "Feed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						current: view,
						id: "deck",
						onSelect: setView,
						label: "Deck"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						current: view,
						id: "liked",
						onSelect: setView,
						label: "Liked"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						current: view,
						id: "taste",
						onSelect: setView,
						label: "Taste"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { view }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 flex-1 flex-col lg:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: cn("min-h-0 flex-col px-4 pb-2", view === "deck" ? "hidden" : "flex flex-1", "lg:flex lg:w-96 lg:flex-none lg:border-r lg:border-line"),
							children: [
								view === "liked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Liked, {}) : null,
								view === "taste" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Taste, {}) : null,
								view === "feed" || view === "deck" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feed, {
									films,
									incoming,
									weekNote,
									onOpenDeck: () => setView("deck"),
									onLike: setLikeFor
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: cn("min-h-0 flex-col px-4 pb-2", view === "deck" ? "flex flex-1" : "hidden", "lg:flex lg:min-w-0 lg:flex-1"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deck, { onLike: setLikeFor })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UndoBar, {})
				]
			}),
			likeFor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikeSheet, {
				id: likeFor,
				onClose: () => setLikeFor(null)
			}) : null
		]
	});
}
function Header({ view }) {
	const queue = useTaste((state) => state.queue.length);
	const line = view === "feed" ? "The card opens the deck. The list under it is the shelf." : view === "deck" ? SEASON_LINE[calendarSeason()] : view === "liked" ? "Everything you marked liked. It stays here." : "All-time moves slowly. A like moves it. Drop a title if the read was wrong.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "shrink-0 px-4 pt-3 pb-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl leading-none",
					children: "Tonight"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted tabular-nums",
						children: [queue, " waiting"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-normal text-muted lg:hidden",
				children: line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 hidden text-sm leading-normal text-muted lg:block",
				children: "The list stays on the left. The card on the right is what to watch."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WatchingNow, {})
		]
	});
}
function MoodRow() {
	const vibe = useVibe();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0 pt-1 pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hidden text-sm text-muted lg:block",
			children: SEASON_LINE[calendarSeason()]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative -mx-4 mt-0 lg:mt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible",
				children: VIBES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibeChip, {
					id,
					active: vibe === id
				}, id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-bg to-transparent lg:hidden" })]
		})]
	});
}
function WatchingNow() {
	const watchingId = useTaste((state) => state.watchingId);
	const setWatching = useTaste((state) => state.setWatching);
	const films = useShelf((state) => state.films);
	const extras = useTaste((state) => state.extras);
	const works = (0, import_react.useMemo)(() => mergeWorks(films, extras), [films, extras]);
	const current = works.find((work) => work.id === watchingId);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const needle = query.trim().toLowerCase();
	const matches = needle ? works.filter((work) => work.name.toLowerCase().includes(needle)).slice(0, 6) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2",
		children: [current && !open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "min-w-0 truncate text-sm",
				children: ["Watching ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: current.name
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 shrink-0 text-sm text-muted",
				onClick: () => setWatching(null),
				children: "Clear"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-11 text-sm text-muted",
			onClick: () => setOpen((value) => !value),
			children: open ? "Close" : "Watching now"
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "What are you in the middle of?",
				"aria-label": "What you are watching",
				className: "min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
			}), matches.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: matches.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 w-full text-left text-sm",
				onClick: () => {
					setWatching(work.id);
					setQuery("");
					setOpen(false);
				},
				children: work.name
			}) }, work.id)) }) : needle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-2 text-sm text-muted",
				children: "Nothing on the shelf by that name."
			}) : null]
		}) : null]
	});
}
function VibeChip({ id, active }) {
	const setVibe = useTaste((state) => state.setVibe);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": active,
		onClick: () => setVibe(id),
		className: cn("min-h-11 shrink-0 rounded-full border px-4 text-sm transition-transform duration-150 ease-out active:scale-[0.96]", active ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-muted"),
		children: VIBE_LABEL[id]
	});
}
function useVibe() {
	return useTaste((state) => state.vibe) ?? defaultVibe();
}
function useDeck() {
	const extras = useTaste((state) => state.extras);
	const films = useShelf((state) => state.films);
	const demoted = useTaste((state) => state.demoted);
	const never = useTaste((state) => state.never);
	const laterUntil = useTaste((state) => state.laterUntil);
	const queue = useTaste((state) => state.queue);
	const wishlist = useTaste((state) => state.wishlist);
	const reviews = useTaste((state) => state.reviews);
	const adjust = useTaste((state) => state.adjust);
	const current = useTaste((state) => state.current);
	const currentAt = useTaste((state) => state.currentAt);
	const fatigue = useTaste((state) => state.fatigue);
	const watchingId = useTaste((state) => state.watchingId);
	const vibe = useVibe();
	const works = (0, import_react.useMemo)(() => mergeWorks(films, extras), [films, extras]);
	const watching = works.find((work) => work.id === watchingId) ?? null;
	return (0, import_react.useMemo)(() => buildDeck({
		works,
		demoted,
		never,
		laterUntil,
		queueIds: queue.map((item) => item.id),
		wishlistIds: wishlist,
		likedIds: reviews.map((review) => review.id),
		adjust,
		current,
		currentAt,
		fatigue,
		vibe,
		watching,
		now: Date.now(),
		key: dayKey()
	}).deck, [
		works,
		demoted,
		never,
		laterUntil,
		queue,
		wishlist,
		reviews,
		adjust,
		current,
		currentAt,
		fatigue,
		vibe,
		watching
	]);
}
function Deck({ onLike }) {
	const deck = useDeck();
	const top = deck[0];
	const whys = useTaste((state) => state.whys);
	const notTonight = useTaste((state) => state.notTonight);
	const notMine = useTaste((state) => state.notMine);
	const yes = useTaste((state) => state.yes);
	const toggleWishlist = useTaste((state) => state.toggleWishlist);
	const wishlist = useTaste((state) => state.wishlist);
	const already = useTaste((state) => top ? state.reviews.some((review) => review.id === top.work.id) : false);
	const wished = Boolean(top && wishlist.includes(top.work.id));
	const [x, setX] = (0, import_react.useState)(0);
	const [leaving, setLeaving] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [grokError, setGrokError] = (0, import_react.useState)("");
	const [asking, setAsking] = (0, import_react.useState)(null);
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	const drag = (0, import_react.useRef)({
		id: -1,
		startX: 0,
		startY: 0,
		lock: null,
		x: 0
	});
	(0, import_react.useEffect)(() => {
		setX(0);
		setLeaving(0);
		setBusy(false);
	}, [top?.work.id]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if (!top || busy) return;
			const tag = event.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (event.key === "ArrowLeft") act("no");
			if (event.key === "ArrowRight") act("yes");
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	function act(kind) {
		if (!top || busy) return;
		const id = top.work.id;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const dir = kind === "yes" ? 1 : -1;
		const run = () => {
			if (kind === "yes") yes(id);
			else if (kind === "never") notMine(id);
			else notTonight(id);
			setBusy(false);
			setLeaving(0);
			setX(0);
		};
		if (reduced || kind === "never") {
			run();
			return;
		}
		setBusy(true);
		setLeaving(dir);
		window.setTimeout(run, 170);
	}
	function onPointerDown(event) {
		if (busy) return;
		drag.current = {
			id: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			lock: null,
			x: 0
		};
	}
	function onPointerMove(event) {
		const pointer = drag.current;
		if (pointer.id !== event.pointerId || busy) return;
		const dx = event.clientX - pointer.startX;
		const dy = event.clientY - pointer.startY;
		if (!pointer.lock) {
			if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
			pointer.lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
			if (pointer.lock === "x") event.currentTarget.setPointerCapture(event.pointerId);
		}
		if (pointer.lock !== "x") return;
		pointer.x = dx;
		setX(dx);
	}
	function onPointerUp(event) {
		const pointer = drag.current;
		if (pointer.id !== event.pointerId) return;
		const dx = pointer.lock === "x" ? pointer.x : 0;
		drag.current.id = -1;
		if (dx > 88) act("yes");
		else if (dx < -88) act("no");
		else setX(0);
	}
	async function askMore() {
		if (asking) return;
		if (useTaste.getState().grokLeft() <= 0) {
			setGrokError("That's enough Grok for today. The deck still works.");
			return;
		}
		setAsking("more");
		setGrokError("");
		const state = useTaste.getState();
		const names = knownNow().map((work) => work.name);
		const anchors = knownNow().filter((work) => work.loved && !work.hidden && !state.demoted.includes(work.id)).slice(0, 36).map((work) => work.name);
		try {
			const result = await suggestMore({ data: {
				vibe: useVibeNow(),
				exclude: names,
				recentYes: state.queue.slice(0, 6).map((item) => findName(item.id)),
				recentNo: recentNoNames(),
				anchors,
				watching: findName(state.watchingId ?? "")
			} });
			if (!result.ok) setGrokError(result.error);
			else {
				state.addExtras(result.picks);
				const saved = await addFilms({ data: {
					works: result.picks,
					source: "grok"
				} });
				if (saved.ok) useShelf.getState().setFilms(saved.films);
				state.markShelf();
				state.markGrok();
			}
		} catch (error) {
			setGrokError(error instanceof Error ? error.message : "Grok didn't answer.");
		} finally {
			setAsking(null);
		}
	}
	async function askWhy() {
		if (!top || asking) return;
		if (whys[top.work.id]) return;
		if (useTaste.getState().grokLeft() <= 0) {
			setGrokError("That's enough Grok for today.");
			return;
		}
		setAsking("why");
		setGrokError("");
		try {
			const result = await sharpenWhy({ data: {
				name: top.work.name,
				summary: top.work.summary,
				vibe: useVibeNow(),
				anchors: top.similar.map((item) => item.name).join(", ")
			} });
			if (!result.ok) setGrokError(result.error);
			else {
				useTaste.getState().setWhy(top.work.id, result.why);
				useTaste.getState().markGrok();
			}
		} catch (error) {
			setGrokError(error instanceof Error ? error.message : "Grok didn't answer.");
		} finally {
			setAsking(null);
		}
	}
	const shift = leaving === 0 ? x : leaving * 420;
	const rotate = leaving === 0 ? x / 22 : leaving * 12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodRow, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1 overflow-hidden",
				children: [deck[1] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-3 top-2 h-2 rounded-full bg-line" }) : null, top ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 top-2 bottom-0 flex touch-pan-y overflow-hidden",
					onPointerDown,
					onPointerMove,
					onPointerUp,
					onPointerCancel: onPointerUp,
					style: {
						transform: `translateX(${shift}px) rotate(${rotate}deg)`,
						transition: leaving !== 0 || x === 0 ? "transform 170ms ease-out" : "none"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							show: x > 36 || leaving === 1,
							side: "left",
							label: "Yes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
							show: x < -36 || leaving === -1,
							side: "right",
							label: "Not tonight"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkCard, {
							item: top,
							why: whys[top.work.id] ?? top.work.why,
							badge: wished ? "Later" : void 0,
							extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "min-h-11 shrink-0 text-sm",
								onClick: () => setMoreOpen(true),
								children: "More"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-start justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-3xl leading-tight",
						children: "Nothing left in this mood."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-normal text-muted",
						children: "Left only cooled titles for about a week. Switch mood, or ask Grok for three that aren't on the shelf."
					})]
				})]
			}),
			grokError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pt-2 text-sm text-muted",
				children: grokError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid shrink-0 grid-cols-2 gap-2 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						disabled: !top || busy,
						onClick: () => act("no"),
						children: "Not tonight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !top || busy,
						onClick: () => act("yes"),
						className: "min-h-11 rounded-full bg-accent px-3 text-sm font-medium text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40",
						children: "Yes — tonight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						disabled: !top || busy,
						onClick: () => top && toggleWishlist(top.work.id),
						children: wished ? "On later" : "Later"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						disabled: !top || busy,
						onClick: () => top && onLike(top.work.id),
						children: already ? "Liked" : "Liked it"
					})
				]
			}),
			moreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 flex items-end justify-center bg-fg/40 lg:items-center lg:p-6",
				onClick: () => setMoreOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid w-full max-w-lg gap-2 border-t border-line bg-bg px-4 pt-4 pb-5 lg:rounded-card lg:border",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-full border border-line text-sm",
							disabled: !top || busy,
							onClick: () => {
								setMoreOpen(false);
								act("never");
							},
							children: "Not my thing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-full border border-line text-sm",
							disabled: asking !== null,
							onClick: () => {
								setMoreOpen(false);
								askMore();
							},
							children: asking === "more" ? "Asking Grok…" : "Three more"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-full border border-line text-sm",
							disabled: !top || asking !== null,
							onClick: () => {
								setMoreOpen(false);
								askWhy();
							},
							children: asking === "why" ? "Asking…" : "Sharpen the why"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 text-sm text-muted",
							onClick: () => setMoreOpen(false),
							children: "Close"
						})
					]
				})
			}) : null
		]
	});
}
function Stamp({ show, side, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pointer-events-none absolute top-6 z-10 rounded-full border px-3 py-1 text-xs tracking-widest uppercase", side === "left" ? "left-5 border-accent text-accent" : "right-5 border-muted text-muted", show ? "opacity-100" : "opacity-0"),
		children: label
	});
}
function Action({ children, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		onClick,
		className: "min-h-11 rounded-full border border-line bg-surface px-3 text-sm text-fg transition-transform duration-150 ease-out active:scale-[0.96] disabled:opacity-40",
		children
	});
}
function Feed({ films, incoming, weekNote, onOpenDeck, onLike }) {
	const deck = useDeck();
	const queue = useTaste((state) => state.queue);
	const wishlist = useTaste((state) => state.wishlist);
	const extras = useTaste((state) => state.extras);
	const shelfAt = useTaste((state) => state.shelfAt);
	const toggleWishlist = useTaste((state) => state.toggleWishlist);
	const remove = useTaste((state) => state.removeFromQueue);
	const notMine = useTaste((state) => state.notMine);
	const works = (0, import_react.useMemo)(() => mergeWorks(films, extras), [films, extras]);
	const byId = (0, import_react.useMemo)(() => new Map(works.map((work) => [work.id, work])), [works]);
	const waiting = queue.map((item) => byId.get(item.id)).filter((work) => Boolean(work));
	const later = wishlist.map((id) => byId.get(id)).filter((work) => Boolean(work));
	const rows = deck.filter((item) => !wishlist.includes(item.work.id));
	const stale = shelfAt === 0 || Date.now() - shelfAt > 6048e5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onOpenDeck,
				className: "mb-2 w-full rounded-card border-2 border-fg bg-fg px-5 py-5 text-left text-accent-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest uppercase opacity-70",
						children: "The deck"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-3xl leading-tight",
						children: deck[0]?.work.name ?? "Tonight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-normal opacity-75",
						children: deck[0] ? deck[0].work.vibeLine : "Open when you want a yes or a not-tonight."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm",
						children: "Open"
					})
				]
			}),
			weekNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm leading-normal text-muted",
				children: weekNote
			}) : null,
			incoming.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-line py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "This week"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-normal text-muted",
						children: "Five titles drawn from what you kept. They stay here until you move one onto the deck."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: incoming.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-b border-line py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-xl leading-tight",
								children: work.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									work.year,
									" · ",
									FAMILY_LABEL[work.family]
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-normal",
								children: work.why
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 text-sm",
									onClick: () => {
										promoteFilm({ data: { id: work.id } }).then((result) => {
											if (result.ok) useShelf.getState().setCatalog(result.films, result.incoming);
										});
									},
									children: "To the deck"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 text-sm text-muted",
									onClick: () => notMine(work.id),
									children: "Not my thing"
								})]
							})
						]
					}, work.id)) })
				]
			}) : null,
			waiting.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-line py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: "Waiting"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: waiting.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: work.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm text-muted",
						onClick: () => remove(work.id),
						children: "Back"
					})]
				}, work.id)) })]
			}) : null,
			later.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-line py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: "Later"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: later.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedRow, {
					work,
					onLike,
					onLater: () => toggleWishlist(work.id),
					later: true
				}, work.id)) })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: "On the shelf"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedRow, {
					work: item.work,
					line: item.work.why,
					onLike,
					onLater: () => toggleWishlist(item.work.id)
				}, item.work.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddLiked, { works }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pb-6 text-sm leading-normal text-muted",
				children: stale ? "Once a week, five new titles land above the shelf. They are not on the deck until you add them." : "Likes stay tagged. Not my thing leaves the catalogue. The weekly five is drawn from what remains."
			})
		]
	});
}
function FeedRow({ work, line, later, onLike, onLater }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-line py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-xl leading-tight",
				children: work.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					work.year,
					" · ",
					work.kind === "series" ? "Series" : "Film",
					later ? " · later" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-normal",
				children: line ?? work.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 text-sm text-muted",
					onClick: onLater,
					children: later ? "Remove" : "Later"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 text-sm",
					onClick: () => onLike(work.id),
					children: "Liked it"
				})]
			})
		]
	});
}
function AddLiked({ works }) {
	const [name, setName] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function submit() {
		const title = name.trim();
		if (title.length < 2 || busy) return;
		setBusy(true);
		setError("");
		const have = works.find((work) => work.name.toLowerCase() === title.toLowerCase());
		if (have) {
			useTaste.getState().like(have.id, note);
			setName("");
			setNote("");
			setBusy(false);
			return;
		}
		const anchors = works.filter((work) => work.loved && !work.hidden).slice(0, 20).map((work) => work.name);
		try {
			const described = await describeLiked({ data: {
				name: title,
				note,
				anchors
			} });
			if (!described.ok) {
				setError(described.error);
				return;
			}
			useTaste.getState().addExtras([described.work]);
			const saved = await addFilms({ data: {
				works: [described.work],
				source: "liked"
			} });
			if (saved.ok) useShelf.getState().setFilms(saved.films);
			useTaste.getState().like(described.work.id, note);
			useTaste.getState().markGrok();
			setName("");
			setNote("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "That title didn't save.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-line py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs tracking-widest text-muted uppercase",
				children: "I watched something"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-normal text-muted",
				children: "A like joins the shelf and pulls the next cards toward it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: name,
				onChange: (event) => setName(event.target.value),
				placeholder: "Title",
				"aria-label": "Title you liked",
				className: "mt-3 min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: note,
				onChange: (event) => setNote(event.target.value),
				placeholder: "One line, optional",
				"aria-label": "Why you liked it",
				className: "mt-2 min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy || name.trim().length < 2,
				onClick: submit,
				className: "mt-3 min-h-11 text-sm underline decoration-line underline-offset-4 disabled:opacity-40",
				children: busy ? "Saving…" : "I liked it"
			})
		]
	});
}
function LikeSheet({ id, onClose }) {
	const [note, setNote] = (0, import_react.useState)("");
	const name = findName(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-30 flex items-end justify-center bg-fg/40 lg:items-center lg:p-6",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg border-t border-line bg-bg px-4 pt-4 pb-5 lg:rounded-card lg:border",
			onClick: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-serif text-xl leading-tight",
					children: ["Liked ", name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: note,
					onChange: (event) => setNote(event.target.value),
					placeholder: "One line, optional",
					"aria-label": "Why you liked it",
					className: "mt-2 min-h-11 w-full border-b border-line bg-transparent text-sm outline-none placeholder:text-muted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 flex-1 rounded-full bg-accent text-sm text-accent-fg",
						onClick: () => {
							useTaste.getState().like(id, note);
							onClose();
						},
						children: "Save"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-line px-4 text-sm",
						onClick: onClose,
						children: "Cancel"
					})]
				})
			]
		})
	});
}
function Liked() {
	const reviews = useTaste((state) => state.reviews);
	const extras = useTaste((state) => state.extras);
	const films = useShelf((state) => state.films);
	const works = (0, import_react.useMemo)(() => mergeWorks(films, extras), [films, extras]);
	const byId = (0, import_react.useMemo)(() => new Map(works.map((work) => [work.id, work])), [works]);
	if (!reviews.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col justify-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-serif text-3xl leading-tight",
			children: "Nothing liked yet."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-normal text-muted",
			children: "On a card, Liked it keeps the title here so you can come back to it."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-0 flex-1 overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: reviews.map((review) => {
			const work = byId.get(review.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border-b border-line py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-xl leading-tight",
						children: work?.name ?? "A title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [work ? `${work.year} · ` : "", new Date(review.at).toLocaleDateString("en-CA", {
							month: "short",
							day: "numeric",
							year: "numeric"
						})]
					}),
					review.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-normal",
						children: review.note
					}) : null,
					work ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-normal text-muted",
						children: work.summary
					}) : null
				]
			}, review.id);
		}) })
	});
}
function Taste() {
	const extras = useTaste((state) => state.extras);
	const films = useShelf((state) => state.films);
	const demoted = useTaste((state) => state.demoted);
	const never = useTaste((state) => state.never);
	const demote = useTaste((state) => state.demote);
	const undemote = useTaste((state) => state.undemote);
	const restore = useTaste((state) => state.restore);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const works = mergeWorks(films, extras);
	const needle = query.trim().toLowerCase();
	const loved = works.filter((work) => work.loved && !work.hidden && !demoted.includes(work.id));
	const dropped = works.filter((work) => demoted.includes(work.id));
	const banned = works.filter((work) => never.includes(work.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-y-auto pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-normal text-muted",
				children: "Left is not tonight — it comes back in about a week. Not my thing leaves the catalogue. Likes stay, tagged, and the weekly five is drawn from those."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 grid gap-2 text-sm leading-normal text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bullitt, not Bullet. The Thomas Crown Affair, not Cromwell — Wolf Hall is the Cromwell, and it's on the shelf." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The Promised Land is the 2023 Mads Mikkelsen film. Drop it if you meant a Steve McQueen picture." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ripley is the 1999 film plus the 2024 series. Purple Noon is a suggestion." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Servant and Widow's Bay stayed in from the earlier chats. Widow's Bay still outranks From." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Find a title",
					"aria-label": "Find a title",
					className: "min-h-11 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-fg outline-none placeholder:text-muted"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 text-sm text-muted",
					onClick: () => setEditing((value) => !value),
					children: editing ? "Done" : "Edit"
				})]
			}),
			FAMILIES.map((family) => {
				const group = loved.filter((work) => work.family === family && (!needle || work.name.toLowerCase().includes(needle)));
				if (!group.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: FAMILY_LABEL[family]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-wrap gap-2",
						children: group.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !editing,
							onClick: () => demote(work.id),
							className: cn("min-h-11 rounded-full border border-line bg-surface px-3 text-sm text-fg", editing && "border-muted"),
							children: [
								work.name,
								work.fromChat ? " ·" : "",
								editing ? "  · drop" : ""
							]
						}) }, work.id))
					})]
				}, family);
			}),
			dropped.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: "Dropped from all-time"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: dropped.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-line px-3 text-sm text-muted",
						onClick: () => undemote(work.id),
						children: [work.name, " · restore"]
					}) }, work.id))
				})]
			}) : null,
			banned.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-widest text-muted uppercase",
					children: "Not my thing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: banned.map((work) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-line px-3 text-sm text-muted",
						onClick: () => restore(work.id),
						children: [work.name, " · restore"]
					}) }, work.id))
				})]
			}) : null
		]
	});
}
function UndoBar() {
	const last = useTaste((state) => state.last);
	const undo = useTaste((state) => state.undo);
	if (!last) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 border-t border-line px-4 py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-sm text-muted",
			children: last.label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-11 shrink-0 text-sm text-fg",
			onClick: undo,
			children: "Undo"
		})]
	});
}
function NavButton({ current, id, label, onSelect }) {
	const later = useTaste((state) => state.wishlist.length);
	const liked = useTaste((state) => state.reviews.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onSelect(id),
		className: cn("min-h-12 text-sm lg:px-3 lg:text-left", current === id ? "text-fg lg:border-l-2 lg:border-fg" : "text-muted lg:border-l-2 lg:border-transparent"),
		children: [
			label,
			id === "feed" && later ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums",
				children: [" ", later]
			}) : null,
			id === "liked" && liked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums",
				children: [" ", liked]
			}) : null
		]
	});
}
function useVibeNow() {
	return useTaste.getState().vibe ?? defaultVibe();
}
function knownNow() {
	return mergeWorks(useShelf.getState().films, useTaste.getState().extras);
}
function findName(id) {
	return knownNow().find((work) => work.id === id)?.name ?? id;
}
function recentNoNames() {
	const { laterUntil } = useTaste.getState();
	const now = Date.now();
	const works = knownNow();
	return Object.entries(laterUntil).filter(([, until]) => until > now && until < Number.MAX_SAFE_INTEGER / 2).slice(0, 8).map(([id]) => works.find((work) => work.id === id)?.name ?? "").filter(Boolean);
}
var SplitComponent = function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginPanel, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TonightApp, {})
	});
};
//#endregion
export { SplitComponent as component };
