import { serve } from "@std/http/server.ts";
import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";
import {
  createMiddleware as h,
  Routes,
  Route,
  Static,
  Middleware,
} from "@vanilla-jsx/middleware/mod.ts";
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

const routed = (
  <Routes>
    <Route path="/ws-go" use={WsGo}></Route>
    <Routes use={[logger, autoUser]}>
      <Route
        path="/"
        use={async (req, next) => {
          req.path = "/index.html";
          return await next();
        }}
      ></Route>
      <Route path="/graphql" use={GraphQL}></Route>
      <Route
        path="/(.*).(ts|tsx)"
        use={typescript(resolve(myDirname, "../src"))}
      ></Route>
      <Static use={[typescript(resolve(myDirname, "../src"))]} dir={resolve(myDirname, "../src")}></Static>
      <Middleware
        use={async (req) => {
          return await new Response("404", {
            status: 404,
          });
        }}
      ></Middleware>
    </Routes>
  </Routes>
);

serve((req) => routed(req));
