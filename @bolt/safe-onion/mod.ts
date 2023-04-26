import { BoltMiddleware, BoltMiddlewareNext } from "@bolt/compose/mod.ts";

type SafeContextType<T> = symbol & T;
const names = new Map();

export class SafeOnion<T, R> {
  middleware = (
    ctx: {
      _safeOnion: Map<unknown, unknown>;
    },
    next: BoltMiddlewareNext<R>
  ) => {
    ctx._safeOnion = new Map();
    return next();
  };

  defineMiddleware = <S>(
    name: string,
    middleware: BoltMiddleware<
      T & {
        createContext: () => S;
        useContext: <S>(middleware: SafeContextType<S>) => Readonly<S>;
      },
      R
    >
  ): [BoltMiddleware<T, R>, SafeContextType<S>] => {
    const MyContext = Symbol() as SafeContextType<S>;
    names.set(MyContext, name);
    return [
      (ctx, next) => {
        const _safeOnion = (ctx as any)._safeOnion as Map<unknown, unknown>;
        if (!_safeOnion)
          throw new Error("SafeOnion: 你需要添加 safeOnion middleware");
        return middleware(
          Object.assign({}, ctx, {
            createContext: () => {
              const self = {};
              _safeOnion.set(MyContext, self);
              return {} as S;
            },
            useContext: <S>(MyContext: SafeContextType<S>): S => {
              return _safeOnion?.get(MyContext) as S;
            },
          }),
          next
        );
      },
      MyContext,
    ];
  };
}
