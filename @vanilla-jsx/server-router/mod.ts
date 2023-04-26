import { compose } from "@bolt/compose/mod.ts";
import { SafeOnion } from "@bolt/safe-onion/mod.ts";
import { match } from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";
import { join, resolve } from "@std/path/mod.ts";
import { serveFile } from "@std/http/file_server.ts";
import { createMiddleware, ServerMiddleware } from "./h.ts";

export { createMiddleware };

export type RouterCtx = {
  _url?: URL;
  _route?: {
    params?: Record<string, unknown>;
    prefix?: string;
    isFuzzyMatch?: boolean;
  };
};

export const { defineMiddleware, middleware: initSafeOnion } = new SafeOnion<
  Request,
  Response
>();

export const [initRouter, RouterContext] = defineMiddleware<{
  url: URL;
  route: {
    params?: Record<string, unknown>;
    prefix?: string;
    isFuzzyMatch?: boolean;
  };
}>("vanilla-jsx-server-router", (safe, req, next) => {
  const ctx = safe.createContext();
  ctx.url = new URL(req.url);
  ctx.route = {};
  return next();
});

export const createRoutes = (use: ServerMiddleware) => {
  const exec = compose([initSafeOnion, initRouter, use]);
  return async (req: Request) => {
    const res = await exec(req);
    if (!res) return new Response("404", { status: 404 });
    return res;
  };
};

export const Route = (props: {
  path?: string;
  use?: ServerMiddleware | ServerMiddleware[];
  children?: ServerMiddleware[];
}): ServerMiddleware => {
  const { children = [], use = [], path = "./" } = props;
  const exec = compose([use, ...children].flat());
  return (ctx, next) => {
    const routerCtx = SafeOnion.useContext(ctx, RouterContext);
    const { url, route } = routerCtx;
    const realPath = join(route.prefix || "/", path);

    const matchObj = match<Record<string, unknown>>(realPath)(
      routerCtx.url.pathname || ""
    );
    if (matchObj) {
      route.isFuzzyMatch = false;
      route.params = matchObj.params;
      return exec(ctx);
    }

    const fuzzyMatchObj = match<Record<string, unknown>>(
      join(realPath, "(.*)")
    )(url.pathname || "");
    if (fuzzyMatchObj) {
      const parentPrefix = route.prefix;
      route.prefix = realPath;
      route.isFuzzyMatch = true;
      route.params = fuzzyMatchObj.params;
      return exec(ctx, () => {
        route.prefix = parentPrefix;
        return next();
      });
    }
    return next();
  };
};

export const Static = (props: {
  dir: string;
  use?: ServerMiddleware | ServerMiddleware[];
  children?: ServerMiddleware[];
}): ServerMiddleware => {
  const { children = [], use = [], dir } = props;
  const exec = compose([use, ...children].flat());
  return (req, next) => {
    const routerCtx = SafeOnion.useContext(req, RouterContext);

    const filepath = join(
      resolve(Deno.cwd(), dir),
      routerCtx.url.pathname || ""
    );
    return exec(req, () => serveFile(req, filepath));
  };
};
