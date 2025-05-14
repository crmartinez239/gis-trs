import {TokenStore, StoredToken} from "../../interfaces/token.ts";
import { storedTokenSchema } from "../../shared/schemas.ts";

export class DiskTokenStore implements TokenStore {

    async get(user_id: string): Promise<StoredToken | null> {
        try {
            const raw = await Deno.readTextFile(`./test_db/token/${user_id}.json`);
            const json = JSON.parse(raw);
            return storedTokenSchema.parseAsync(json) ?? null;
        } catch (_err) {
            return null
        }
    }

    async upsert(user_id: string, doc: StoredToken): Promise<void> {
        await Deno.writeTextFile(`./test_db/token/${user_id}.json`, JSON.stringify(doc));
    }

}