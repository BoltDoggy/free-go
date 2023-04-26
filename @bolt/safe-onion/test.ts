import { SafeOnion } from "./mod.ts";

const onion = new SafeOnion<Request, Response>();

const [testDefine, testDefineContext] = onion.defineMiddleware<{
  a: string;
}>("testDefine", (safe, _req, next) => {
  const a = safe.createContext();
  a.a;
  return next();
});

onion.defineMiddleware("test-use", (safe, req, next) => {
  const b = SafeOnion.useContext(req, testDefineContext);
  const a = safe.useContext(testDefineContext);
  a.a;
  return next();
});
