import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { c as authMiddleware } from "./facets-DseEWPMM.mjs";
import { t as coerceTaste } from "./taste-BiVivYv-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/taste-fns-Bcz6ygRv.js
var loadTaste_createServerFn_handler = createServerRpc({
	id: "c669be0620042e3a247f649f1ad9cb37296d8cc2cc7417fe4f783f1b155b14b6",
	name: "loadTaste",
	filename: "src/lib/taste-fns.ts"
}, (opts) => loadTaste.__executeServer(opts));
var loadTaste = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadTaste_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-CVbY3AQD.mjs").then((n) => n.t).then((n) => n.t);
	const raw = (await (await getSql())`select payload from taste where user_id = ${context.userId}`)[0]?.payload;
	if (!raw) return {
		ok: true,
		found: false,
		payload: null
	};
	try {
		return {
			ok: true,
			found: true,
			payload: coerceTaste(JSON.parse(raw))
		};
	} catch {
		return {
			ok: true,
			found: true,
			payload: coerceTaste(null)
		};
	}
});
var saveTaste_createServerFn_handler = createServerRpc({
	id: "38bb978228269d7125a651e5b859ba117cbe090d19366240ec460692f77f4c9d",
	name: "saveTaste",
	filename: "src/lib/taste-fns.ts"
}, (opts) => saveTaste.__executeServer(opts));
var saveTaste = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => coerceTaste(input)).handler(saveTaste_createServerFn_handler, async ({ context, data }) => {
	const payload = JSON.stringify(data);
	if (payload.length > 12e4) return {
		ok: false,
		error: "That shelf is too large to save."
	};
	const { getSql } = await import("./db-CVbY3AQD.mjs").then((n) => n.t).then((n) => n.t);
	await (await getSql())`
      insert into taste (user_id, payload, updated_at)
      values (${context.userId}, ${payload}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
	return { ok: true };
});
//#endregion
export { loadTaste_createServerFn_handler, saveTaste_createServerFn_handler };
