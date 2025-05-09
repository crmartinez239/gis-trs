import { z } from "https://deno.land/x/zod@v3.22.2/mod.ts";

export const storeSchema = z.object({
    user_id: z.string().min(1),
    access_token: z.string().min(1),
    refresh_token: z.string().min(1),
    expires_in: z.number().positive(),
});

export const tokenSchema = z.object({
    user_id: z.string().min(1),
    access_token: z.string().min(1),
    refresh_token: z.string().min(1),
    expires_at: z.number().positive(),
})