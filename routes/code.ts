// This route will handle retrieving a token with a new oauth code

import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {StoredTokenSchema, TokenStore} from "../shared/interfaces.ts";
import { tokenFromCodeSchema } from "../shared/schemas.ts";
import { getTokenFromCode } from "../shared/goto.ts";

export function createCodeHandler(_store: TokenStore) {
    return async (ctx: Context) => {

        try {
            const { value } = ctx.request.body({ type: "json" });
            const { user_id, code, redirect_uri } = await value;

            const validationResult = tokenFromCodeSchema.safeParse({ user_id, code, redirect_uri });

            if (!validationResult.success) {
                console.error("Invalid request:", validationResult.error.flatten().fieldErrors);
                ctx.response.status = 400;
                ctx.response.body = { error: "Invalid request" };
                return;
            }

            const response = await getTokenFromCode(code);

            if ("access_token" in response) {
                const expires_at = Date.now() + response.expires_in * 1000;
                const store: StoredTokenSchema = {...response, expires_at: expires_at, user_id: user_id};
                await _store.upsert(store);
                console.log("New token from code successful: user_id:", user_id);
                ctx.response.status = 200;
                ctx.response.body = { message: "Token stored" };
            } else {
                console.error("Error getting token from code:", response.error_description);
                ctx.response.status = response.status;
                ctx.response.body = { error: response.error_description };
            }

        } catch (err) {
            console.error("Route /code error:", err);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }

    }
}