import { Context, helpers } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { TokenStore, StoredTokenSchema } from "../shared/interfaces.ts";
import {getTokenFromRefresh} from "../shared/goto.ts";

const { getQuery } = helpers;

export function createTokenHandler(_store: TokenStore) {
    return async (ctx: Context) => {
        const { user_id } = getQuery(ctx, { mergeParams: true });

        try {
            const tokenDoc = await _store.get(user_id);

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

            const response = await getTokenFromRefresh(tokenDoc.refresh_token);

            if ("access_token" in response) {
                const expires_at = Date.now() + response.expires_in * 1000;
                const newTokenDoc: StoredTokenSchema = {
                    ...response,
                    refresh_token: response.refresh_token || tokenDoc.refresh_token,
                    expires_at: expires_at,
                    user_id: user_id,
                }
                await _store.upsert(newTokenDoc);
                console.log("New token from refresh successful: user_id:", user_id);
                ctx.response.status = 200;
                ctx.response.body = { "access_token": newTokenDoc.access_token };
            } else {
                console.error("Error getting token from code:", response.error_description);
                ctx.response.status = response.status;
                ctx.response.body = { error: response.error_description };
            }

        } catch (_err) {
                console.error("Could not get get user info: ", user_id);
                console.error(_err);
                ctx.response.status = 500;
                ctx.response.body = { error: "Internal server error" };
        }
    };
}