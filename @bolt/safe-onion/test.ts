import { SafeOnion } from "./mod.ts";

const onion = new SafeOnion<Request, Response>();

const [testDefine, testDefineContext] = onion.defineMiddleware<{
  a: string;
}>("testDefine", (req, next) => {
  const a = req.createContext();
  a.a;
  return next();
});

onion.defineMiddleware("test-use", (req, next) => {
  const a = req.useContext(testDefineContext);
  a.a;
  return next();
});
