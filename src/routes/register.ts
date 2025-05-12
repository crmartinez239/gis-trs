import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { UserStore } from "../interfaces/user.ts";
import { generateApiKey, generateUserId } from "../shared/keygen.ts";

export function createRegisterHandler(store: UserStore) {
    return async (ctx: Context) => {
        try {
            const user_id = generateUserId();
            const api_key = generateApiKey();
            const created_at = Date.now();

            await store.upsert(user_id, { api_key, created_at });

            console.log("New user registered:", { user_id, api_key, created_at });

            ctx.response.status = 201;
            ctx.response.body = { user_id, api_key, created_at };
        } catch (err) {
            console.error("Route /register error:", err);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    }
}