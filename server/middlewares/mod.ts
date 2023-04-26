import autoUser from "./auto-user.ts";
import initCookieCtx from "./init-cookie-ctx.ts";
import autoIndex from "./auto-index.ts";
import logger from "./logger.ts";
import typescript from "./typescript.ts";

export const myLogger = logger();
export const myInitCookieCtx = initCookieCtx();
export const myAutoUser = autoUser();
export const myAutoIndex = autoIndex();
export const myTypescript = typescript();
