import { onion } from "@vanilla-jsx/server-router/mod.ts";

export default () => onion.defineMiddleware((req, next) => {
  if (!req._route?.isFuzzyMatch && req._url) {
    req._url.pathname = "/index.html";
  }
  return next();
});
