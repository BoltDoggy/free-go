import {
  RouterContext,
  defineMiddleware,
} from "../../@vanilla-jsx/server-router/mod.ts";

export const [autoIndex] = defineMiddleware("autoIndex", (safe, _req, next) => {
  const { route, url } = safe.useContext(RouterContext);
  if (!route.isFuzzyMatch) {
    url.pathname = "/index.html";
  }
  return next();
});
