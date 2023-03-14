import { serve } from "@std/http/server.ts";
import { dirname, fromFileUrl, resolve } from "@std/path/mod.ts";
import {
  createMiddleware as h,
  Routes,
  Route,
  Static,
  Middleware,
} from "@vanilla-jsx/middleware/mod.ts";
import { logger } from "./middlewares/logger.ts";
import typescript from "./middlewares/typescript.ts";

const myDirname = dirname(fromFileUrl(import.meta.url));

const routed = (
  <Routes use={[logger]}>
    <Route
      path="/"
      use={async (req, next) => {
        req.path = "/index.html";
        return await next();
      }}
    ></Route>
    {/* <Route path="/placeholder" use={Placeholder}></Route>
    <Route path="/graphql" use={GraphQL}></Route> */}
    <Route
      path="/(.*).ts"
      use={typescript(resolve(myDirname, "../src"))}
    ></Route>
    <Static dir={resolve(myDirname, "../src")}></Static>
    <Middleware
      use={async (req) => {
        return await new Response("404", {
          status: 404,
        });
      }}
    ></Middleware>
  </Routes>
);

serve((req) => routed(req));
