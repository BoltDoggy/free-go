import { BoltOnion } from "./mod.ts";

const a = new BoltOnion<Request, Response>([(_, next) => next()]);

a.compose();

const m = a.defineMiddleware<{
  a: string;
}>((_ctx, next) => {
  return next();
});

const n = a.defineMiddleware<{
  b: number;
}>((_ctx, next) => {
  return next();
});

const b = a.use(m).use<{
  b: number;
}>(n);

b.use<{ c: number }>((ctx, next) => {
  ctx.a;
  ctx.b;
  ctx.body;
  return next();
});

const c = new BoltOnion<Request, Response>().use(b.compose());
