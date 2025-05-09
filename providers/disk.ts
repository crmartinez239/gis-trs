import type { TokenStore, TokenSchema } from "../interfaces.ts";
import { tokenSchema } from "../schemas.ts";

export class DiskTokenStore implements TokenStore {

    async get(user_id: string): Promise<TokenSchema | null> {
        try {
            const raw = await Deno.readTextFile(`./test_db/${user_id}.json`);
            const json = JSON.parse(raw);
            return tokenSchema.parseAsync(json) ?? null;
        } catch (_err) {
            console.error("Error reading file:", _err);
            return null;
        }
    }

    async upsert(_doc: TokenSchema): Promise<void> {
        // await this.collection.updateOne(
        //     { user_id: doc.user_id },
        //     { $set: { access_token: doc.access_token, refresh_token: doc.refresh_token, expires_at: doc.expires_at } },
        //     { upsert: true }
        // );
    }


}