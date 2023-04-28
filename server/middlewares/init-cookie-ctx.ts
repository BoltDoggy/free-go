import { defineMiddleware } from "@vanilla-jsx/server-router/mod.ts";
import { getCookies } from "@std/http/cookie.ts";

export const [initCookie, CookieContext] = defineMiddleware<{
  cookies: Record<string, string>;
}>("initCookie", (safe, req, next) => {
  const ctx = safe.createContext();
  ctx.cookies = getCookies(req.headers);
  return next();
});
