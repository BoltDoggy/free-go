import { BoltMiddleware, compose } from "@bolt/compose/mod.ts";

export type { BoltMiddleware };

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
