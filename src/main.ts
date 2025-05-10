import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { DiskTokenStore } from "./providers/disk.ts";
import { apiKeyCheck } from "./middleware/key_check.ts";
import { createTokenHandler } from "./routes/token.ts";
import { createCodeHandler } from "./routes/code.ts";

const store = new DiskTokenStore();

const router = new Router();

router.post("/code", createCodeHandler(store));
router.get("/token/:user_id", createTokenHandler(store));

const app = new Application();
app.use(oakCors({
    origin: "chrome-extension://hfeoapcldkocaoikhnhjfhffmlaeccoe",
    methods: ["GET", "POST", "OPTIONS"], // include OPTIONS!
    allowedHeaders: ["Content-Type"],
}));

app.use(apiKeyCheck);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running at http://localhost:3000");
await app.listen({ port: 3000 });