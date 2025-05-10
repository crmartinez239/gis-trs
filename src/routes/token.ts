import { Context, helpers } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {TokenStore, StoredTokenSchema} from "../shared/interfaces.ts";

const { getQuery } = helpers;

export function createTokenHandler(store: TokenStore) {
    return async (ctx: Context) => {
        const { user_id } = getQuery(ctx, { mergeParams: true });

        try {
            const tokenDoc = await store.get(user_id);

            // could not retrieve token for user,
            if (!tokenDoc) {
                ctx.response.status = 404;
                ctx.response.body = { error: "User not found" }
                return;
            }

            if (Date.now() < tokenDoc.expires_at) {
                console.log("Retrieved token for user: ", user_id);
                ctx.response.status = 200;
                ctx.response.body = { access_token: tokenDoc.access_token }
                return;
            }

            const auth_token = btoa(`${Deno.env.get("GOTO_CLIENT_ID")}:${Deno.env.get("GOTO_CLIENT_SECRET")}`);

            const params = new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: tokenDoc.refresh_token,
                client_id: Deno.env.get("GOTO_CLIENT_ID")!,
                client_secret: Deno.env.get("GOTO_CLIENT_SECRET")!,
            });

            console.log("Token expired for user: ", user_id);
            ctx.response.status = 400;
            ctx.response.body = { error: "Token expired" };
        } catch (_err) {
                console.error("Could not get get user info: ", user_id);
                ctx.response.status = 500;
                ctx.response.body = { error: "Internal server error" };
        }
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