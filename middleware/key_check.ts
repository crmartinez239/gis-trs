import { Middleware } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const GIS_API_KEY = Deno.env.get("DEV_API_KEY");

export const apiKeyCheck: Middleware = async (ctx, next) => {
    const suppliedKey = ctx.request.headers.get("gis-api-key");

    if (!suppliedKey || suppliedKey !== GIS_API_KEY) {
        console.error("Unauthorized request: invalid API key")
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized" };
        return;
    }

    await next();
};