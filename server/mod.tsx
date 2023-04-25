import { serve } from "@std/http/server.ts";
import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";
import { Static, Middleware } from "@vanilla-jsx/middleware/mod.ts";
import {
  createMiddleware as h,
  Route,
  createRoutes,
} from "@vanilla-jsx/server-router/mod.ts";
import logger from "./middlewares/logger.ts";
import typescript from "./middlewares/typescript.ts";
import { setup as setupLog } from "@std/log/mod.ts";
import GraphQL from "./routes/GraphQL.ts";
import autoUser from "./middlewares/auto-user.ts";
import WsGo from "./routes/WsGo.ts";

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
    <Route path="/ws-go" use={WsGo as any}></Route>
    <Route use={[logger as any, autoUser]}>
      <Route
        path="/"
        use={async (req, next) => {
          if (!req._route?.isFuzzyMatch && req._url) {
            req._url.pathname = "/index.html";
          }
          return await next();
        }}
      ></Route>
      <Route path="/b">
        <Route
          path="/a"
          use={(req) => {
            return new Response("111");
          }}
        ></Route>
      </Route>
      <Route path="/graphql" use={GraphQL as any}></Route>
      <Route
        path="/(.*).(ts|tsx)"
        use={typescript(resolve(myDirname, "../src")) as any}
      ></Route>
      <Static
        use={[typescript(resolve(myDirname, "../src"))]}
        dir={resolve(myDirname, "../src")}
      ></Static>
    </Route>
  </Route>
);

serve((req) => routed(req));
