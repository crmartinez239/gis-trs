import { z } from "https://deno.land/x/zod@v3.22.2/mod.ts";

// Used for validating incoming store request in the createStoreHandler
export const storeSchema = z.object({
    access_token: z.string().min(1),
    refresh_token: z.string().min(1),
    loa: z.number().positive(),
    token_type: z.string().min(1),
    expires_in: z.number().positive(),
    scope: z.string().array(),
    principal: z.string().min(1),
});

// only used for testing with the DiskTokenStore
export const storedTokenSchema = z.object({
    user_id: z.string().min(1),
    expires_at: z.number().positive(),

    access_token: z.string().min(1),
    refresh_token: z.string().min(1),
    loa: z.number().positive(),
    token_type: z.string().min(1),
    expires_in: z.number().positive(),
    scope: z.string().array(),
    principal: z.string().min(1),
});

// Used for validating incoming request for a new user in the createCodeHandler
export const tokenFromCodeSchema = z.object({
    user_id: z.string().uuid(),
    code: z.string().min(1),
    redirect_uri: z.string().url()
});