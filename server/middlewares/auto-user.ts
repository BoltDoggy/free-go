import { nanoid } from "npm:nanoid";
import { setCookie } from "@std/http/cookie.ts";
import { defineMiddleware } from "../../@vanilla-jsx/server-router/mod.ts";
import { CookieContext } from "./init-cookie-ctx.ts";

export const [autoUser] = defineMiddleware(
  "autoUser",
  async (safe, _req, next) => {
    const { cookies } = safe.useContext(CookieContext);
    if (!cookies.freeGo) {
      cookies.freeGo = nanoid(10);
    }
    const res = await next();
    if (res) {
      setCookie(res.headers, {
        name: "freeGo",
        value: cookies.freeGo,
      });
    }
    return res;
  }
);
