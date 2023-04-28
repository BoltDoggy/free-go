import { RouterContext, defineMiddleware } from "@vanilla-jsx/server-router/mod.ts";
import { extname } from "@std/path/mod.ts";

export const [initFileExt, FileExtContext] = defineMiddleware<{
    ext: string;
}>("initCookie", (safe, _req, next) => {
  const ctx = safe.createContext();
  const { url } = safe.useContext(RouterContext);
  ctx.ext = extname(url.pathname);
  return next();
});
