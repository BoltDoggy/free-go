import { serve } from "@std/http/server.ts";
import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";
import {
  createMiddleware as h,
  Route,
  createRoutes,
  Static,
} from "@vanilla-jsx/server-router/mod.ts";
import logger from "./middlewares/logger.ts";
import typescript from "./middlewares/typescript.ts";
import { setup as setupLog } from "@std/log/mod.ts";
import GraphQL from "./routes/GraphQL.ts";
import autoUser from "./middlewares/auto-user.ts";
import WsGo from "./routes/WsGo.ts";
import initCookieCtx from "./middlewares/init-cookie-ctx.ts";
import autoIndex from "./middlewares/auto-index.ts";

setupLog({
  loggers: {
    fetch: {
      handlers: ["default"],
    },
  },
});

const myDirname = dirname(fromFileUrl(import.meta.url));

const routed = createRoutes(
  <Route>
    <Route path="/ws-go" use={WsGo}></Route>
    <Route use={[logger, initCookieCtx, autoUser, autoIndex]}>
      <Route path="/graphql" use={GraphQL}></Route>
      <Static
        use={[typescript(resolve(myDirname, "../src"))]}
        dir={resolve(myDirname, "../src")}
      ></Static>
    </Route>
  </Route>
);

serve((req) => routed(req));
