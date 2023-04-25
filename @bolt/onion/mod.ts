export type BoltMiddlewareNext<R> = () => Promise<R | void>;
export type BoltMiddleware<T, R> = (
  ctx: T,
  next: BoltMiddlewareNext<R>
) => R | Promise<R | void>;

function compose<T, R>(middlewares: BoltMiddleware<T, R>[]) {
  if (!Array.isArray(middlewares))
    throw new TypeError("Middleware stack must be an array!");
  for (const fn of middlewares) {
    if (fn && typeof fn !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  return function (context: T, next?: BoltMiddleware<T, R>): Promise<R | void> {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i: number): Promise<R | void> {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn: BoltMiddleware<T, R> | undefined = middlewares[i];
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

export class BoltOnion<T, R> {
  middlewares: BoltMiddleware<T, R>[];

  constructor(middlewares: BoltMiddleware<T, R>[] = []) {
    this.middlewares = middlewares;
  }

  defineMiddleware = <S>(middleware: BoltMiddleware<T & S, R>) => {
    return middleware;
  };

  use = <S = T>(middleware: BoltMiddleware<T & S, R>) => {
    return new BoltOnion<T & S, R>([...this.middlewares, middleware]);
  };

  compose = () => {
    return compose(this.middlewares);
  };
}
