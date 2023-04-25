import { BoltOnion, BoltMiddleware } from "@bolt/onion/mod.ts";
import { match } from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";
import { join } from "@std/path/mod.ts";

type RouterCtx = {
  _url?: URL;
  _route?: {
    params?: Record<string, unknown>;
    prefix?: string;
    isFuzzyMatch?: boolean;
  };
};
type ServerMiddleware = BoltMiddleware<Request & RouterCtx, Response>;

export const onion = new BoltOnion<Request, Response>().use<RouterCtx>(
  (ctx, next) => {
    ctx._url = new URL(ctx.url);
    ctx._route = {};
    return next();
  }
);

export const createMiddleware = (
  tag: (props: Record<string, unknown>) => ServerMiddleware,
  props: Record<string, unknown>,
  ...children: ServerMiddleware[]
) => {
  if (typeof tag === "function") {
    return tag({
      children,
      ...props,
    });
  }
};

export const createRoutes = (use: ServerMiddleware) => {
  const exec = onion.use(use).compose();
  return async (req: Request) => {
    const res = await exec(req);
    if (!res) {
      return new Response("404", { status: 404 });
    }
    return res;
  };
};

export const Route = (props: {
  path?: string;
  use?: ServerMiddleware | ServerMiddleware[];
  children?: ServerMiddleware[];
}): ServerMiddleware => {
  const { children = [], use = [], path = "./" } = props;
  const exec = new BoltOnion([use, ...children].flat()).compose();
  return (ctx, next) => {
    const realPath = join(ctx._route?.prefix || "/", path);
    if (ctx._url && ctx._route) {
      const matchObj = match<Record<string, unknown>>(realPath)(
        ctx._url.pathname || ""
      );
      if (matchObj) {
        ctx._route.isFuzzyMatch = false;
        ctx._route.params = matchObj.params;
        return exec(ctx);
      }
      const fuzzyMatchObj = match<Record<string, unknown>>(
        join(realPath, "(.*)")
      )(ctx._url.pathname || "");
      if (fuzzyMatchObj) {
        ctx._route.isFuzzyMatch = true;
        ctx._route.prefix = realPath;
        ctx._route.params = fuzzyMatchObj.params;
        return exec(ctx, next);
      }
    }
    return next();
  };
};
