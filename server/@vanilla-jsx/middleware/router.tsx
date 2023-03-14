import { match } from "https://deno.land/x/path_to_regexp@v6.2.0/index.ts";
import { resolve, join } from "https://deno.land/std@0.128.0/path/mod.ts";
import { serveFile } from "https://deno.land/std@0.128.0/http/file_server.ts";

import { createMiddleware as h } from "./h.ts";
import { BoltServerRequest, MiddlewareUse } from "./types.ts";
import { Middleware, defineMiddlewareX } from "./middlewareX.ts";

export const Routes = defineMiddlewareX((props) => {
  const { use } = props;
  return (
    <Middleware
      {...props}
      use={[
        (req, next) => {
          const url = new URL(req.url);
          req._url = url;
          req.path = url.pathname;
          req.searchParams = url.searchParams;
          return next();
        },
        use,
      ]}
    />
  );
});

export const Route = defineMiddlewareX<{ path: string }>((props) => {
  const { path, use } = props;
  const m = match<Record<string, unknown>>(path);
  return (
    <Middleware
      {...props}
      use={async (req, next) => {
        const pathObj = m(req.path || "");
        if (pathObj) {
          if (typeof use === "function") {
            req.params = pathObj.params;
            return use(req, next);
          }
        }
        return await next();
      }}
    />
  );
});

export const Static = defineMiddlewareX<{
  dir: string;
}>(({ dir }) => {
  return async (req: BoltServerRequest, next) => {
    try {
      const filepath = join(resolve(Deno.cwd(), dir), req.path || "");
      return await serveFile(req, filepath);
    } catch (e) {
      console.error(e);
      return next();
    }
  };
});

export const defineRoute = (routeFn: MiddlewareUse) => routeFn;
