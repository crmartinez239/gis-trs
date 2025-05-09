import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { apiKeyCheck } from "./middleware/key_check.ts";
//import { MongoTokenStore } from "./providers/mongo.ts";
import { DiskTokenStore } from "./providers/disk.ts";
//import { createStoreHandler } from "./routes/store.ts";
import { createTokenHandler } from "./routes/token.ts";


const store = new DiskTokenStore();
const router = new Router();
//router.post("/auth/store", createStoreHandler(store));
router.get("/auth/token/:user_id", createTokenHandler(store));

const app = new Application();
app.use(apiKeyCheck);
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log(Deno.env.get("DEV_API_KEY"));
console.log("Server running at http://localhost:3000");
await app.listen({ port: 3000 });