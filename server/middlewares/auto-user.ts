import { nanoid } from 'npm:nanoid';
import { setCookie } from '@std/http/cookie.ts';
import { defineMiddleware } from "@vanilla-jsx/middleware/mod.ts";

export default defineMiddleware(async (req, next) => {
  if (!req.cookies?.freeGo) {
    req.cookies = {
        ...req.cookies,
        freeGo: nanoid(10)
    }
  }
  const res = await next();
  setCookie(res.headers, {
    name: 'freeGo',
    value: req.cookies?.freeGo as string
  });
  return res;
});
