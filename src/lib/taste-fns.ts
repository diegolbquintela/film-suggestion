import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { coerceTaste, type TasteSnapshot } from "@/lib/taste";

export const loadTaste = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ ok: true; found: boolean; payload: TasteSnapshot | null }> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`select payload from taste where user_id = ${context.userId}`;
    const raw = rows[0]?.payload;
    if (!raw) return { ok: true, found: false, payload: null };
    try {
      return { ok: true, found: true, payload: coerceTaste(JSON.parse(raw)) };
    } catch {
      return { ok: true, found: true, payload: coerceTaste(null) };
    }
  });

export const saveTaste = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => coerceTaste(input))
  .handler(async ({ context, data }) => {
    const payload = JSON.stringify(data);
    if (payload.length > 120_000) return { ok: false as const, error: "That shelf is too large to save." };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into taste (user_id, payload, updated_at)
      values (${context.userId}, ${payload}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
    return { ok: true as const };
  });
