// import { MongoClient, Database } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
//
// const client = new MongoClient();
// await client.connect(Deno.env.get("MONGO_URI") || "mongodb://localhost:27017");
// export const db: Database = client.database("token_store");

export const db = await Deno.openKv();