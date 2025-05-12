// src/middleware/api_key_check.ts
import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { UserStore } from "../interfaces/user.ts";

/**
 * Factory to create API key authentication middleware for Oak.
 * @param userStore - Provides access to stored user records for validation
 * @returns Middleware function that enforces API key checks on incoming requests
 */
export function apiKeyCheckMiddleware(userStore: UserStore) {
    return async (ctx: Context, next: () => Promise<unknown>) => {
        // 1️⃣ Allow open access to the registration endpoint
        if (ctx.request.url.pathname === "/register") {
            // Skip auth for registration and proceed
            return await next();
        }

        // 2️⃣ Extract the API key and user ID from request headers
        const suppliedKey = ctx.request.headers.get("gis-api-key");
        const suppliedId = ctx.request.headers.get("gis-user-id");

        // 3️⃣ Reject requests missing either header
        if (!suppliedKey || !suppliedId) {
            console.error("Unauthorized request: missing headers");
            ctx.response.status = 401;
            ctx.response.body = { error: "Unauthorized" };
            return; // Do not proceed further
        }

        try {
            // 4️⃣ Lookup the user record by user ID
            const user = await userStore.get(suppliedId);

            // 5️⃣ Reject if user not found or API key mismatch
            if (!user || user.api_key !== suppliedKey) {
                console.error("Unauthorized request: invalid credentials", {
                    user_id: suppliedId,
                    api_key: suppliedKey,
                });
                ctx.response.status = 401;
                ctx.response.body = { error: "Unauthorized" };
                return; // Stop processing
            }
        } catch (err) {
            // 6️⃣ Handle unexpected errors from the store
            console.error("API key check error:", err);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
            return; // Stop processing
        }

        // 7️⃣ All checks passed: forward to the next middleware or route handler
        await next();
    };
}
