import { Context, helpers } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import type { TokenStore } from "../interfaces.ts";

//const { getQuery } = helpers;

export function createTokenHandler(_store: TokenStore) {
    return async (ctx: Context) => {

        ctx.response.status = 200;
        ctx.response.body = { message: "I found the gis-api-key" };

        // const { user_id } = getQuery(ctx, { mergeParams: true });
        //
        // const tokenDoc = await store.get(user_id);
        // if (!tokenDoc) {
        //     ctx.response.status = 404;
        //     ctx.response.body = { error: "User not found" }
        //     return;
        // }
        //
        // if (Date.now() < tokenDoc.expires_at) {
        //     ctx.response.status = 200;
        //     ctx.response.body = { access_token: tokenDoc.access_token }
        //     return;
        // }
        //
        // try {
        //
        //     const params = new URLSearchParams({
        //         grant_type: "refresh_token",
        //         refresh_token: tokenDoc.refresh_token,
        //         client_id: Deno.env.get("GOTO_CLIENT_ID")!,
        //         client_secret: Deno.env.get("GOTO_CLIENT_SECRET")!,
        //     });
        //
        //     const res = await fetch("https://api.goto.com/oauth/v2/token", { method: "POST", body: params });
        //     if (!res.ok) throw new Error("Refresh failed");
        //     const json = await res.json();
        //     const expires_at = Date.now() + json.expires_in * 1000;
        //     await store.upsert({ user_id, access_token: json.access_token, refresh_token: json.refresh_token || tokenDoc.refresh_token, expires_at });
        //     ctx.response.status = 200;
        //     ctx.response.body = { access_token: json.access_token };
        // } catch (err) {
        //     console.error("Refresh error:", err);
        //     ctx.response.status = 500;
        //     ctx.response.body = { error: "Failed to refresh token" };
        // }
    };
}