import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { MongoTokenStore } from "./providers/mongo.ts";
import { createStoreHandler } from "./routes/store.ts";
import { createTokenHandler } from "./routes/token.ts";

const store = new MongoTokenStore();
const router = new Router();
router.post("/auth/store", createStoreHandler(store));
router.get("/auth/token/:user_id", createTokenHandler(store));

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running at http://localhost:3000");
await app.listen({ port: 3000 });
