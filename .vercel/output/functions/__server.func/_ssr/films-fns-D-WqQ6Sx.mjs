import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as VIBES, i as SEASONS, n as FAMILIES, t as FACETS } from "./facets-DOkKFDrl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/films-fns-D-WqQ6Sx.js
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
function parsePayload(payload) {
	if (typeof payload !== "string") return null;
	try {
		return asWork(JSON.parse(payload), true);
	} catch {
		return null;
	}
}
async function readSplit() {
	const { getSql } = await import("./db-UKQ_4fXg.mjs");
	const rows = await (await getSql())`select payload, source from films order by created_at asc`;
	const films = [];
	const incoming = [];
	const seen = /* @__PURE__ */ new Set();
	for (const row of rows) {
		const work = parsePayload(row.payload);
		if (!work || seen.has(work.name.toLowerCase())) continue;
		seen.add(work.name.toLowerCase());
		if (row.source === "incoming") incoming.push(work);
		else films.push(work);
	}
	return {
		films,
		incoming
	};
}
async function ensureSeed() {
	const { getSql } = await import("./db-UKQ_4fXg.mjs");
	const { CATALOG } = await import("./catalog-B2tadS0a.mjs").then((n) => n.t);
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from films`)[0]?.n ?? 0) > 0) return;
	for (const work of CATALOG) await sql`insert into films (id, name, payload, source) values (${work.id}, ${work.name}, ${JSON.stringify(work)}, 'seed') on conflict (id) do nothing`;
}
var listFilms_createServerFn_handler = createServerRpc({
	id: "6de1c97ec6c07d1e326142eadaf64c3426322059b258ad4b0c4fefc0dde97cb6",
	name: "listFilms",
	filename: "src/lib/films-fns.ts"
}, (opts) => listFilms.__executeServer(opts));
var listFilms = createServerFn({ method: "GET" }).handler(listFilms_createServerFn_handler, async () => {
	try {
		await ensureSeed();
		return {
			ok: true,
			...await readSplit()
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "The shelf didn't load."
		};
	}
});
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
var addFilms_createServerFn_handler = createServerRpc({
	id: "5a366907efd84b4c47123901bcffdddf21c6d1ffbaa5b19b5f31787db60fe370",
	name: "addFilms",
	filename: "src/lib/films-fns.ts"
}, (opts) => addFilms.__executeServer(opts));
var addFilms = createServerFn({ method: "POST" }).validator(asAdd).handler(addFilms_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-UKQ_4fXg.mjs");
	const sql = await getSql();
	await ensureSeed();
	const existing = await sql`select name from films`;
	const have = new Set(existing.map((row) => row.name.toLowerCase()));
	for (const work of data.works) {
		const key = work.name.toLowerCase();
		if (have.has(key)) continue;
		await sql`insert into films (id, name, payload, source) values (${work.id}, ${work.name}, ${JSON.stringify(work)}, ${data.source}) on conflict (id) do nothing`;
		have.add(key);
	}
	return {
		ok: true,
		...await readSplit()
	};
});
var removeFilm_createServerFn_handler = createServerRpc({
	id: "3d82db6629a086bcd26f236048aab17c643bc9a5c192c89ca026e0793eb33714",
	name: "removeFilm",
	filename: "src/lib/films-fns.ts"
}, (opts) => removeFilm.__executeServer(opts));
var removeFilm = createServerFn({ method: "POST" }).validator((input) => {
	const id = String(input?.id ?? "").trim().slice(0, 80);
	if (!id) throw new Error("Missing title");
	return { id };
}).handler(removeFilm_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-UKQ_4fXg.mjs");
	await (await getSql())`delete from films where id = ${data.id}`;
	return {
		ok: true,
		...await readSplit()
	};
});
var promoteFilm_createServerFn_handler = createServerRpc({
	id: "82fa17bf44e0ec2de7dad75ad7edbf99e5c75f673aea3f52df84acf5a73a1a5f",
	name: "promoteFilm",
	filename: "src/lib/films-fns.ts"
}, (opts) => promoteFilm.__executeServer(opts));
var promoteFilm = createServerFn({ method: "POST" }).validator((input) => {
	const id = String(input?.id ?? "").trim().slice(0, 80);
	if (!id) throw new Error("Missing title");
	return { id };
}).handler(promoteFilm_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-UKQ_4fXg.mjs");
	await (await getSql())`update films set source = 'deck' where id = ${data.id} and source = 'incoming'`;
	return {
		ok: true,
		...await readSplit()
	};
});
var restoreFilm_createServerFn_handler = createServerRpc({
	id: "3da13f1c2786eddcde7e7740ee0d0b1246aadc4dc2fd86933d556415d2474906",
	name: "restoreFilm",
	filename: "src/lib/films-fns.ts"
}, (opts) => restoreFilm.__executeServer(opts));
var restoreFilm = createServerFn({ method: "POST" }).validator((input) => {
	const work = asWork(input?.work, true);
	if (!work) throw new Error("Missing title");
	return { work };
}).handler(restoreFilm_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-UKQ_4fXg.mjs");
	const sql = await getSql();
	const source = data.work.loved ? "seed" : "deck";
	await sql`insert into films (id, name, payload, source) values (${data.work.id}, ${data.work.name}, ${JSON.stringify(data.work)}, ${source}) on conflict (id) do nothing`;
	return {
		ok: true,
		...await readSplit()
	};
});
var pullWeekly_createServerFn_handler = createServerRpc({
	id: "849d378b16d7e80beed1754b1e6508b7461b9b33df8ed840b140fb78af921164",
	name: "pullWeekly",
	filename: "src/lib/films-fns.ts"
}, (opts) => pullWeekly.__executeServer(opts));
var pullWeekly = createServerFn({ method: "POST" }).handler(pullWeekly_createServerFn_handler, async () => {
	try {
		await ensureSeed();
		const { getSql } = await import("./db-UKQ_4fXg.mjs");
		const sql = await getSql();
		const last = (await sql`
      select id, added from suggest_log
      where ran_at > now() - interval '7 days'
      order by ran_at desc
      limit 1
    `)[0];
		if (last && last.added > 0) return {
			ok: true,
			added: 0,
			...await readSplit()
		};
		if (last) await sql`delete from suggest_log where id = ${last.id}`;
		const claim = `week-${Date.now()}`;
		await sql`insert into suggest_log (id, added) values (${claim}, 0)`;
		try {
			const rows = await sql`select payload, source from films where source <> 'incoming'`;
			const names = [];
			const anchors = [];
			for (const row of rows) {
				const work = parsePayload(row.payload);
				if (!work) continue;
				names.push(work.name);
				if (work.loved || row.source === "liked") anchors.push(`${work.name} (${work.family})`);
			}
			const { fetchWeeklyPicks } = await import("./grok-fns-jonoAxWt.mjs").then((n) => n.n);
			const picks = await fetchWeeklyPicks(anchors.slice(0, 36), names);
			if (!picks.length) throw new Error("Grok didn't name anything usable.");
			for (const work of picks) await sql`insert into films (id, name, payload, source) values (${work.id}, ${work.name}, ${JSON.stringify(work)}, 'incoming') on conflict (id) do nothing`;
			await sql`update suggest_log set added = ${picks.length} where id = ${claim}`;
			return {
				ok: true,
				added: picks.length,
				...await readSplit()
			};
		} catch (error) {
			await sql`delete from suggest_log where id = ${claim}`;
			throw error;
		}
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "This week's five didn't land."
		};
	}
});
//#endregion
export { addFilms_createServerFn_handler, listFilms_createServerFn_handler, promoteFilm_createServerFn_handler, pullWeekly_createServerFn_handler, removeFilm_createServerFn_handler, restoreFilm_createServerFn_handler };
