import {TokenStore, StoredTokenSchema} from "../shared/interfaces.ts";
import { storedTokenSchema } from "../shared/schemas.ts";

export class DiskTokenStore implements TokenStore {

    async get(user_id: string): Promise<StoredTokenSchema | null> {
        try {
            const raw = await Deno.readTextFile(`./test_db/${user_id}.json`);
            const json = JSON.parse(raw);
            return storedTokenSchema.parseAsync(json) ?? null;
        } catch (_err) {
            throw new Error("There was an error reading the file");
        }
    }

    async upsert(doc: StoredTokenSchema): Promise<void> {
        await Deno.writeTextFile(`./test_db/${doc.user_id}.json`, JSON.stringify(doc));
    }

}