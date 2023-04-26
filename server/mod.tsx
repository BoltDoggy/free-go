import { serve } from "@std/http/server.ts";
import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";
import {
  createMiddleware as h,
  Route,
  createRoutes,
  Static,
} from "@vanilla-jsx/server-router/mod.ts";
import { setup as setupLog } from "@std/log/mod.ts";
import GraphQL from "./routes/GraphQL.ts";
import WsGo from "./routes/WsGo.ts";
import {
  myAutoIndex,
  myAutoUser,
  myInitCookieCtx,
  myLogger,
  myTypescript,
} from "./middlewares/mod.ts";

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
    <Route use={[myLogger, myInitCookieCtx, myAutoUser, myAutoIndex]}>
      <Route path="/graphql" use={GraphQL}></Route>
      <Static use={[myTypescript]} dir={resolve(myDirname, "../src")}></Static>
    </Route>
  </Route>
);

serve((req) => routed(req));
