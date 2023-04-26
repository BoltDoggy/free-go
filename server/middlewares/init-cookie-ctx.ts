import { onion } from "@vanilla-jsx/server-router/mod.ts";
import { getCookies } from "@std/http/cookie.ts";

export default () =>
  onion.defineMiddleware<{
    cookies?: Record<string, string>;
  }>((req, next) => {
    req.cookies = getCookies(req.headers);
    return next();
  });
