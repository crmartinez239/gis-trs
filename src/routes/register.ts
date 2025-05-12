import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export function createRegisterHandler(store: UserStore) {
    return async (ctx: Context) => {
        const user_id = crypto.randomUUID();
        const api_key = generateApiKey();
        const created_at = Date.now();

        await store.set(user_id, { api_key, created_at });

        ctx.response.status = 201;
        ctx.response.body = { user_id, api_key };
    }
}

function generateApiKey(): string {
    const rawKey = crypto.getRandomValues(new Uint8Array(32));
    return btoa(String.fromCharCode(...rawKey));
}