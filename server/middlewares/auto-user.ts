import { nanoid } from "npm:nanoid";
import { setCookie } from "@std/http/cookie.ts";
import { onion } from "@vanilla-jsx/server-router/mod.ts";
import initCookieCtx from "./init-cookie-ctx.ts";

export default () =>
  onion.use(initCookieCtx()).defineMiddleware(async (req, next) => {
    if (!req.cookies?.freeGo) {
      req.cookies = {
        ...req.cookies,
        freeGo: nanoid(10),
      };
    }
    const res = await next();
    if (res) {
      setCookie(res.headers, {
        name: "freeGo",
        value: req.cookies?.freeGo as string,
      });
    }
    return res;
  });
