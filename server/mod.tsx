import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";
import {
  createMiddleware as h,
  Route,
  createRoutes,
  Static,
} from "@vanilla-jsx/server-router/mod.ts";
import { setup as setupLog } from "@std/log/mod.ts";
import { GraphQL } from "./routes/GraphQL.ts";
import { WsGo } from "./routes/WsGo.ts";
import { loggerMiddleware } from "./middlewares/logger.ts";
import { initCookie } from "./middlewares/init-cookie-ctx.ts";
import { autoUser } from "./middlewares/auto-user.ts";
import { autoIndex } from "./middlewares/auto-index.ts";
import { typescript } from "./middlewares/typescript.ts";
import { initFileExt } from "./middlewares/init-file-ext.ts";
import { mdxMiddleware } from "./middlewares/mdx.ts";

setupLog({
  loggers: {
    fetch: {
      handlers: ["default"],
    },
  },
});

const kv = await Deno.openKv();
const userId = crypto.randomUUID();
await kv.set(["users", userId], {
  userId,
  name: "Alice",
});

const myDirname = dirname(fromFileUrl(import.meta.url));

const routed = createRoutes(
  <Route>
    <Route path="/ws-go" use={WsGo}></Route>
    <Route use={[loggerMiddleware, initCookie, autoUser, autoIndex]}>
      <Route path="/graphql" use={GraphQL}></Route>
      <Static
        use={[initFileExt, typescript, mdxMiddleware]}
        dir={resolve(myDirname, "../src")}
      ></Static>
    </Route>
  </Route>
);

Deno.serve((req) => routed(req));
