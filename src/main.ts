import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import { DiskTokenStore } from "./providers/token/disk.ts";
import { DiskUserStore } from "./providers/user/disk.ts";

import { apiKeyCheckMiddleware } from "./middleware/api-key-check.ts";
import { createTokenHandler } from "./routes/token.ts";
import { createCodeHandler } from "./routes/code.ts";
import { createRegisterHandler } from "./routes/register.ts";

const tokenStore = new DiskTokenStore();
const userStore = new DiskUserStore();

const router = new Router();

router.post("/register", createRegisterHandler(userStore));
router.post("/code", createCodeHandler(tokenStore));
router.get("/token/:user_id", createTokenHandler(tokenStore));

const app = new Application();
app.use(oakCors({
    origin: "chrome-extension://hfeoapcldkocaoikhnhjfhffmlaeccoe",
    methods: ["GET", "POST", "OPTIONS"], // include OPTIONS!
    allowedHeaders: ["Content-Type"],
}));

app.use(apiKeyCheckMiddleware(userStore));

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running at http://localhost:3000");
await app.listen({ port: 3000 });