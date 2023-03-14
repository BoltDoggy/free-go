import { compose } from "./compose.ts";
import type { MiddlewareUse } from "./types.ts";

export const defineMiddlewareX = <ExProps>(
  defineFn: (
    params: {
      children?: any[];
      use?: MiddlewareUse | MiddlewareUse[];
    } & ExProps
  ) => MiddlewareUse
) => defineFn;
export const defineMiddleware = (defineFn: MiddlewareUse) => defineFn;

export const Middleware = defineMiddlewareX(
  ({ children = [], use = (req, next) => next() }) => {
    const middlewareArr = [use, ...children];
    const m = compose(middlewareArr.flat(Infinity));
    return async (req, next) => await m(req, next);
  }
);
