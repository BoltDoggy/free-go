import { BoltMiddleware, BoltMiddlewareNext } from "@bolt/compose/mod.ts";

export type SafeContextType<T> = symbol & T;
export type SafeMiddleware<T, R, C> = (
  safe: {
    createContext: () => C;
    useContext: <S>(DependenceContext: SafeContextType<S>) => Readonly<S>;
  },
  ctx: T,
  next: BoltMiddlewareNext<R>
) => R | Promise<R | void>;
const names = new Map();

export class SafeOnion<T, R> {
  static useContext = <S, C>(
    req: C & {
      _safeOnion?: Map<unknown, unknown>;
    },
    DependenceContext: SafeContextType<S>
  ): Readonly<S> => {
    const { _safeOnion } = req;
    if (!_safeOnion)
      throw new Error("SafeOnion: 你需要添加 safeOnion middleware");
    const value = _safeOnion.get(DependenceContext);
    if (!value)
      throw new Error(
        `SafeOnion: 你需要添加 ${names.get(DependenceContext)} middleware`
      );
    return _safeOnion.get(DependenceContext) as Readonly<S>;
  };

  middleware: BoltMiddleware<T, R> = (req, next) => {
    const _ctx = req as {
      _safeOnion?: Map<unknown, unknown>;
    };
    _ctx._safeOnion = new Map();
    return next();
  };

  defineMiddleware = <S>(
    name: string,
    middleware: SafeMiddleware<T, R, S>
  ): [BoltMiddleware<T, R>, SafeContextType<S>] => {
    const MyContext = Symbol() as SafeContextType<S>;
    names.set(MyContext, name);
    return [
      (req, next) => {
        const _ctx = req as {
          _safeOnion?: Map<unknown, unknown>;
        };
        const { _safeOnion } = _ctx;
        if (!_safeOnion)
          throw new Error("SafeOnion: 你需要添加 safeOnion middleware");
        if (_safeOnion.get(MyContext))
          throw new Error(`SafeOnion: ${name} middleware 重复添加`);
        return middleware(
          {
            createContext: () => {
              const self = {};
              _safeOnion.set(MyContext, self);
              return self as S;
            },
            useContext: <S>(
              DependenceContext: SafeContextType<S>
            ): Readonly<S> => SafeOnion.useContext(_ctx, DependenceContext),
          },
          req,
          next
        );
      },
      MyContext,
    ];
  };
}
