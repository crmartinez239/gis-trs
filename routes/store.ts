import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import type { TokenStore } from "../interfaces.ts";
import { storeSchema } from "../schemas.ts";

export function createStoreHandler(store: TokenStore) {
    return async (ctx: Context) => {
        // API key auth
        const apiKey = ctx.request.headers.get("x-api-key");
        if (apiKey !== Deno.env.get("STORE_API_KEY")) {
            ctx.response.status = 401;
            await ctx.response.write(new TextEncoder().encode(JSON.stringify({ error: "Unauthorized" })));
            return;
        }

        try {
            const { value } = ctx.request.body({ type: "json" });
            const { user_id, access_token, refresh_token, expires_in } = await value;
            storeSchema.parse({ user_id, access_token, refresh_token, expires_in });
            const expires_at = Date.now() + expires_in * 1000;
            await store.upsert({ user_id, access_token, refresh_token, expires_at });
            ctx.response.status = 200;
            await ctx.response.write(new TextEncoder().encode(JSON.stringify({ status: "stored" })));
        } catch (err) {
            console.error("/auth/store error:", err);
            ctx.response.status = 400;
            await ctx.response.write(new TextEncoder().encode(JSON.stringify({ error: "Invalid request" })));
        }
    };
}
