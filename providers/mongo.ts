import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import type { TokenStore, TokenSchema } from "../interfaces.ts";

const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI") ?? "mongodb://localhost:27017");
const db = client.database("token_store");

export class MongoTokenStore implements TokenStore {
    private collection = db.collection<TokenSchema>("tokens");

    async get(user_id: string): Promise<TokenSchema | null> {
        return await this.collection.findOne({ user_id: user_id }) ?? null;
    }

    async upsert(doc: TokenSchema): Promise<void> {
        await this.collection.updateOne(
            { user_id: doc.user_id },
            { $set: { access_token: doc.access_token, refresh_token: doc.refresh_token, expires_at: doc.expires_at } },
            { upsert: true }
        );
    }
}
